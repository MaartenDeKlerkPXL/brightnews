import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { prisma } from '@/lib/db'

const parser = new Parser()

// RSS feeds to monitor
const RSS_FEEDS = [
  'https://feeds.bbci.co.uk/news/rss.xml',
  'https://rss.cnn.com/rss/edition.rss',
  'https://www.theguardian.com/world/rss',
  'https://feeds.npr.org/1001/rss.xml',
  'https://www.nu.nl/rss',
  'https://www.volkskrant.nl/nieuws-achtergrond/rss.xml',
]

interface GrokResponse {
  shouldKeep: boolean
  category?: string
  region?: string
  rewrittenTitle?: string
  rewrittenContent?: string
  translations?: {
    [key: string]: {
      title: string
      content: string
    }
  }
}

async function processWithGrok(
  title: string,
  content: string
): Promise<GrokResponse> {
  const grokApiKey = process.env.GROK_API_KEY
  if (!grokApiKey) {
    throw new Error('GROK_API_KEY not configured')
  }

  const prompt = `Analyze this news article and determine:
1. Should it be kept? (Only keep if it's purely positive or constructive - NO politics, power struggles, war, or negative violence)
2. If kept, categorize it: TECHNOLOGY, GREEN_WORLD, HEALTH, EDUCATION, COMMUNITY, or SPORT
3. Identify the region: EUROPE, NORTH_AMERICA, SOUTH_AMERICA, ASIA, AFRICA, or OCEANIA
4. Rewrite the title and content to be positive and inspiring
5. Translate to EN, NL, FR, ES, DE

Article:
Title: ${title}
Content: ${content.substring(0, 2000)}

Respond in JSON format:
{
  "shouldKeep": boolean,
  "category": "CATEGORY" or null,
  "region": "REGION" or null,
  "rewrittenTitle": "string" or null,
  "rewrittenContent": "string" or null,
  "translations": {
    "EN": {"title": "...", "content": "..."},
    "NL": {"title": "...", "content": "..."},
    "FR": {"title": "...", "content": "..."},
    "ES": {"title": "...", "content": "..."},
    "DE": {"title": "...", "content": "..."}
  }
}`

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${grokApiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || '{}'
    
    // Extract JSON from response (in case it's wrapped in markdown)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : content
    
    return JSON.parse(jsonStr) as GrokResponse
  } catch (error) {
    console.error('Error calling Grok API:', error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  // Verify cron secret (for Vercel Cron or similar)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const processedArticles: string[] = []

    for (const feedUrl of RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedUrl)
        
        for (const item of feed.items.slice(0, 10)) {
          // Skip if already processed
          const existing = await prisma.article.findFirst({
            where: {
              originalUrl: item.link || '',
            },
          })

          if (existing) {
            continue
          }

          const title = item.title || ''
          const content = item.contentSnippet || item.content || item.description || ''

          // Process with Grok AI
          const grokResult = await processWithGrok(title, content)

          if (!grokResult.shouldKeep || !grokResult.category || !grokResult.region) {
            continue
          }

          // Create article
          const article = await prisma.article.create({
            data: {
              originalTitle: title,
              originalContent: content,
              originalSource: feed.title || feedUrl,
              originalUrl: item.link || '',
              category: grokResult.category,
              region: grokResult.region,
              publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
              translations: {
                create: Object.entries(grokResult.translations || {}).map(
                  ([lang, trans]) => ({
                    language: lang,
                    title: trans.title || grokResult.rewrittenTitle || title,
                    content: trans.content || grokResult.rewrittenContent || content,
                  })
                ),
              },
            },
          })

          processedArticles.push(article.id)
        }
      } catch (error) {
        console.error(`Error processing feed ${feedUrl}:`, error)
        continue
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedArticles.length,
      articleIds: processedArticles,
    })
  } catch (error) {
    console.error('Error processing RSS feeds:', error)
    return NextResponse.json(
      { error: 'Failed to process RSS feeds', details: String(error) },
      { status: 500 }
    )
  }
}

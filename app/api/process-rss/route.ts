import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { prisma } from '@/lib/db'

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
  customFields: {
    item: [['media:content', 'mediaContent', { keepArray: true }], ['enclosure', 'enclosure']],
  },
})

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const AI_MODEL = "llama-3.1-8b-instant";

const RSS_FEEDS = [
  'https://www.goodnewsnetwork.org/feed/', 'https://www.optimistdaily.com/feed/', 'https://www.positive.news/feed/',
  'https://feeds.bbci.co.uk/news/world/rss.xml', 'https://www.nu.nl/rss', 'https://www.bright.nl/rss',
  'https://www.theverge.com/rss/index.xml', 'https://techcrunch.com/feed/', 'https://www.sciencemag.org/rss/current.xml',
  'https://scitechdaily.com/feed/', 'https://www.sciencedaily.com/rss/', 'https://www.economist.com/latest/rss.xml',
  'https://www.forbes.com/business/feed/', 'https://runningonrealfood.com/feed/', 'https://www.wellnessimpact.org/feed/',
  'https://www.england.nhs.uk/feed/', 'https://feeds.bbci.co.uk/sport/rss.xml', 'https://variety.com/feed/', 'https://www.nu.nl/rss/Algemeen',
  'https://www.nu.nl/rss/Economie',
  'https://www.nu.nl/rss/Sport',
  'https://www.nu.nl/rss/entertainment',
  'https://www.nu.nl/rss/Opmerkelijk',
  'https://www.nu.nl/rss/slimmer-leven',
  'https://www.nu.nl/rss/tech-wetenschap',
  'https://www.nu.nl/rss/goed-nieuws',
  'https://www.positive.news/feed/',
  'https://www.optimistdaily.com/feed/',
  'https://www.goodgoodgood.co/articles/rss.xml',
  'https://www.goodnewsnetwork.org/category/news/inspiring/feed/',
  'https://www.goodnewsnetwork.org/category/news/science/feed/',
  'https://www.goodnewsnetwork.org/category/news/animals/feed/',
  'https://www.goodnewsnetwork.org/category/news/world/feed/',
  'https://www.goodnewsnetwork.org/category/news/health/feed/',
  'https://www.goodnewsnetwork.org/category/good-talks/feed/',
  'https://www.goodnewsnetwork.org/category/news/feed/',
  'https://goodnewsmag.org/feed/',
  'https://www.globalpositivenewsnetwork.com/feed/',
  'https://lifebeyondnumbers.com/feed/',
  'https://thegoodnewshub.com/feed/',
  'https://goodnews.eu/en/feed/',
  'https://www.upworthy.com/feeds/feed.rss',
  'https://www.thegoodnewsmovement.com/feed/',
  'https://www.goodnewsfl.org/feed/',
  'https://news.janegoodall.org/feed/',
  'https://goodblacknews.org/feed/',
  'https://www.yesmagazine.org/feed',
  'https://reasonstobecheerful.world/feed/'
]

async function processWithGroq(title: string, content: string, retryCount = 0): Promise<any> {
  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
  
  // NOG bredere prompt: we willen ELK positief of neutraal-interessant verhaal.
  const prompt = `You are a positive news editor. 
  ACCEPT (shouldKeep: true): Sports, Tech, Entertainment, Science, Health, and Business, Green World, Community, Travel, positive stories, inspiring.
  REJECT (shouldKeep: false): Death, war, crime, political, and accidents.
  
  TASK: Write a fun, engaging 300-word story. 
  CRITICAL - imageSearchTerm: Generate 2-3 keywords describing VISUAL objects, actions or scenes. NEVER use person names. Use generic visual descriptors instead: e.g. "tennis action" not "Rybakina", "soccer match" not "Messi", "scientist lab" not "Einstein", "running race", "technology office", "nature landscape".
  JSON ONLY: { "shouldKeep": true, "category": "SPORT"|"TECHNOLOGY"|"SCIENCE"|"HEALTH"|"ENTERTAINMENT"|"COMMUNITY"|"TRAVEL"|"GREEN_WORLD", "region": "EUROPE"|"ASIA"|"AFRICA"|"NORTH_AMERICA"|"SOUTH_AMERICA"|"OCEANIA", "imageSearchTerm": "2-3 visual keywords (objects/actions, NO person names)", "translations": { "NL": {"title": "str", "content": "str"}, "EN": {"title": "str", "content": "str"}, "FR": {"title": "str", "content": "str"}, "ES": {"title": "str", "content": "str"}, "DE": {"title": "str", "content": "str"} } }`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: 'user', content: `${prompt}\n\nArticle to rewrite: ${title} - ${content}` }],
        response_format: { type: "json_object" },
        temperature: 0.7
      }),
    });

    if (response.status === 429) {
      console.log("⏳ Rate limit! 15s rust...");
      await sleep(15000);
      return retryCount < 1 ? processWithGroq(title, content, retryCount + 1) : { shouldKeep: false, reason: "RATE_LIMIT" };
    }

    if (!response.ok) return { shouldKeep: false, reason: "API_ERROR" };

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    return { shouldKeep: false, reason: "PARSE_ERROR" };
  }
}

export async function GET() {
  console.log("🚀 START: De Pomp draait nu op 'Optimistisch' stand...");
  let added = 0;

  for (const url of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      console.log(`📡 Feed: ${feed.title || url}`);

      // We pakken de top 2 artikelen per feed
      for (const item of feed.items.slice(0, 2)) {
        const existing = await prisma.article.findFirst({ where: { originalUrl: item.link || '' } });
        if (existing) continue;

        // Korte pauze tussen AI-aanvragen om de emmer niet te laten overstromen
        await sleep(4000); 

        const aiResult = await processWithGroq(item.title || '', item.contentSnippet || '');
        
        if (!aiResult.shouldKeep || !aiResult.translations?.NL) {
          console.log(`⏩ Skip: ${item.title?.substring(0, 35)}... (Reden: ${aiResult.category || 'Niet passend'})`);
          continue;
        }

        let imageUrl = item.enclosure?.url || (item.mediaContent && item.mediaContent[0]?.$.url) || null;

        if (!imageUrl) {
          // 1. Maak de tags schoon (geen spaties, kleine letters)
          const categoryTag = aiResult.category.toLowerCase().replace('_', ''); // Bijv. 'greenworld'
          const aiTag = aiResult.imageSearchTerm 
            ? aiResult.imageSearchTerm.split(',')[0].trim().toLowerCase().replace(/[^a-z]/g, '') 
            : '';
        
          // 2. De Absolute Noodoplossing:
          // We sturen meerdere tags naar LoremFlickr. Als de eerste (specifieke) niet bestaat, 
          // pakt hij de tweede (de categorie).
          const finalTags = aiTag ? `${aiTag},${categoryTag}` : categoryTag;
        
          // 3. Vast 16:9 formaat (1200x675) voor strakke layout
          imageUrl = `https://loremflickr.com/1200/675/${finalTags}/all?lock=${Date.now()}`;        }

        await prisma.article.create({
          data: {
            originalTitle: item.title || '',
            originalContent: item.contentSnippet || '',
            originalSource: feed.title || 'Source',
            originalUrl: item.link || '',
            imageUrl: imageUrl,
            category: aiResult.category,
            region: aiResult.region,
            publishedAt: new Date(),
            translations: {
              create: Object.entries(aiResult.translations).map(([lang, trans]: any) => ({
                language: lang,
                title: trans.title,
                content: trans.content,
              }))
            }
          }
        });
        added++;
        console.log(`✅ Toegevoegd: ${aiResult.translations.NL.title.substring(0, 45)}...`);
      }
    } catch (e) {
      console.log(`❌ Feed overgeslagen: ${url}`);
    }
  }
  return NextResponse.json({ success: true, added });
}
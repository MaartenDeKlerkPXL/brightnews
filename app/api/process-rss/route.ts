import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Parser from 'rss-parser';
import OpenAI from 'openai';

const parser = new Parser();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  try {
    const feed = await parser.parseURL('https://feeds.feedburner.com/goodnewsnetwork');
    const item = feed.items[0]; // We doen er 1 per keer voor de snelheid op Netlify

    const existing = await db.article.findFirst({
      where: { originalUrl: item.link || '' }
    });

    if (existing) return NextResponse.json({ added: 0, message: "Geen nieuw nieuws" });

    // Snelle AI check & vertaling
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Vertaal dit kort naar NL, EN, FR, ES, DE. JSON formaat: { "translations": [{ "language": "NL", "title": "...", "content": "..." }] }. Tekst: ${item.title}` }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(aiResponse.choices[0].message.content || '{}');

    // Opslaan in de juiste tabellen
    await db.article.create({
      data: {
        originalTitle: item.title || '',
        originalContent: item.contentSnippet || '',
        originalUrl: item.link || '',
        originalSource: 'Good News Network',
        category: 'COMMUNITY',
        region: 'EUROPE',
        publishedAt: new Date(),
        translations: {
          create: result.translations // Dit vult automatisch de ArticleTranslation tabel
        }
      }
    });

    return NextResponse.json({ success: true, added: 1 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
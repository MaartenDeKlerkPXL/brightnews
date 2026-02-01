import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Parser from 'rss-parser';
import OpenAI from 'openai';

const parser = new Parser();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Pak maar 1 feed om tijd te besparen
const FEED_URL = 'https://feeds.feedburner.com/goodnewsnetwork';

export async function GET() {
  console.log("⏱ [NETLIFY-CRON] Start snelle verwerking...");
  
  try {
    const feed = await parser.parseURL(FEED_URL);
    // We pakken er maar 3 om te checken, en verwerken er maximaal 1
    const items = feed.items.slice(0, 3); 

    for (const item of items) {
      const existing = await db.article.findUnique({
        where: { originalUrl: item.link }
      });

      if (existing) continue;

      console.log(`🤖 Verwerken: ${item.title}`);

      // De allersnelste prompt
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini", // VEEL SNELLER
        messages: [{ role: "user", content: `Is dit positief nieuws? Zo ja, vertaal titel en 2 zinnen kort naar NL, EN, FR, ES, DE. JSON: {isPositive: boolean, translations: [{language: string, title: string, content: string}]}. Tekst: ${item.title}` }],
        response_format: { type: "json_object" },
        max_tokens: 500 // Beperk de lengte voor snelheid
      });

      const result = JSON.parse(aiResponse.choices[0].message.content || '{}');

      if (result.isPositive) {
        await db.article.create({
          data: {
            originalTitle: item.title || '',
            originalContent: item.contentSnippet || '',
            originalUrl: item.link || '',
            originalSource: 'Good News Network',
            category: 'COMMUNITY',
            region: 'EUROPE',
            publishedAt: new Date(),
            translations: { create: result.translations }
          }
        });
        
        console.log("✅ 1 artikel toegevoegd, we stoppen nu om timeout te voorkomen.");
        return NextResponse.json({ success: true, added: 1 });
      }
    }

    return NextResponse.json({ success: true, added: 0, message: "Geen nieuw positief nieuws gevonden." });

  } catch (error: any) {
    console.error("🚨 Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
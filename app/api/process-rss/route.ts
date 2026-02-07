import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import OpenAI from 'openai';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // We maken de client pas HIER aan, binnen de functie
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        return new Response('Skipping during build', { status: 200 });
      }
    }

    const openai = new OpenAI({ apiKey });

    const articleTitle = "Voorbeeld positief nieuwsartikel";
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Je bent een vertaler die gespecialiseerd is in positief nieuws. Vertaal titels en maak korte, vrolijke samenvattingen."
        },
        {
          role: "user",
          content: `Vertaal de volgende titel en maak een korte samenvatting (max 2 zinnen) in NL, EN, FR, ES, DE: "${articleTitle}". 
          Geef het resultaat terug in dit JSON formaat:
          { "translations": [ { "language": "NL", "title": "...", "content": "..." } ] }`
        }
      ],
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(completion.choices[0].message.content || '{}');

    const newArticle = await db.article.create({
      data: {
        originalTitle: articleTitle,
        originalContent: "",
        originalUrl: "",
        originalSource: "Bright",
        category: "TECH",
        region: "NL",
        publishedAt: new Date(),
        translations: {
          create: data.translations
        }
      }
    });

    return NextResponse.json({ added: 1, article: newArticle });
  } catch (error) {
    console.error("Fout in process-rss:", error);
    return NextResponse.json({ error: "Build failed" }, { status: 500 });
  }
}

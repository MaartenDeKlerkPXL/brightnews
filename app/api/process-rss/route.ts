import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Groq from "groq-sdk";

// Voorkom dat Netlify dit statisch probeert te bouwen
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY ontbreekt" }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    // Dummy data (vervang dit later door je echte RSS fetch logica)
    const articleTitle = "Wetenschappers ontdekken nieuwe manier om oceanen te reinigen";
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Je bent een vertaler. Vertaal de titel en maak een korte positieve samenvatting (2 zinnen) in NL, EN, FR, ES, DE. Antwoord ALTIJD in puur JSON formaat."
        },
        {
          role: "user",
          content: `Vertaal deze titel: "${articleTitle}". 
          Format: { "translations": [ { "language": "NL", "title": "...", "content": "..." } ] }`
        }
      ],
      model: "llama-3.3-70b-versatile", // Een van de snelste en beste modellen op Groq
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(chatCompletion.choices[0].message.content || '{}');

    // Opslaan in de database via Prisma
    const newArticle = await db.article.create({
      data: {
        originalTitle: articleTitle,
        originalContent: "",
        originalUrl: "https://voorbeeld.nl",
        originalSource: "Bright",
        category: "GREEN_WORLD",
        region: "EUROPE",
        publishedAt: new Date(),
        translations: {
          create: data.translations
        }
      }
    });

    return NextResponse.json({ success: true, added: 1, article: newArticle });
  } catch (error) {
    console.error("Groq Error:", error);
    return NextResponse.json({ error: "AI verwerking mislukt" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  console.log("🔍 [DEBUG] Start test...");
  
  try {
    // TEST 1: Is de API Key aanwezig?
    const hasKey = !!process.env.OPENAI_API_KEY;
    console.log("🔑 [DEBUG] OpenAI Key aanwezig op Netlify:", hasKey);

    // TEST 2: Database verbinding
    // We maken een unieke URL zodat de 'duplicaat-check' nooit in de weg zit
    const uniqueId = Date.now();
    
    console.log("📡 [DEBUG] Poging tot schrijven naar DB...");
    const testArticle = await db.article.create({
      data: {
        originalTitle: `Test Artikel ${uniqueId}`,
        originalContent: "Dit is een test om te kijken of Netlify de database kan bereiken.",
        originalUrl: `https://test-${uniqueId}.com`,
        originalSource: "Debug Test",
        category: "COMMUNITY",
        region: "EUROPE",
        publishedAt: new Date(),
        translations: {
          create: [
            { language: 'NL', title: 'Test NL', content: 'Inhoud NL' }
          ]
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Verbinding met Database werkt!", 
      openaiKeyFound: hasKey,
      addedArticle: testArticle.originalTitle 
    });

  } catch (error: any) {
    console.error("🚨 [DEBUG] FOUT GEVONDEN:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      hint: "Als je hier 'PrismaClientKnownRequestError' ziet, is er iets mis met je Database URL."
    }, { status: 500 });
  }
}
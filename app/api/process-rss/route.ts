import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const timestamp = new Date().toLocaleTimeString();
  
  try {
    console.log("⚡ [FORCE] Poging tot geforceerde toevoeging...");

    const testArticle = await db.article.create({
      data: {
        originalTitle: `Geforceerde Test ${timestamp}`,
        originalContent: "Als je dit ziet, werkt de verbinding tussen Netlify en Supabase 100%.",
        originalUrl: `https://force-test-${Date.now()}.com`,
        originalSource: "Systeem Test",
        category: "TECHNOLOGY",
        region: "EUROPE",
        publishedAt: new Date(),
        translations: {
          create: [
            { language: 'NL', title: `Test NL ${timestamp}`, content: 'Succesvolle verbinding!' }
          ]
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "HET WERKT!", 
      addedArticle: testArticle.originalTitle 
    });

  } catch (error: any) {
    console.error("🚨 [FORCE] Fout:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
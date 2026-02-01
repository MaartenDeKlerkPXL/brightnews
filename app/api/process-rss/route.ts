import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET() {
  const diagnosticLog: string[] = [];
  diagnosticLog.push("🚀 Start analyse...");

  try {
    // We testen met 1 specifieke feed
    const FEED_URL = 'https://feeds.feedburner.com/goodnewsnetwork';
    diagnosticLog.push(`📡 Feed ophalen: ${FEED_URL}`);
    
    const feed = await parser.parseURL(FEED_URL);
    const items = feed.items.slice(0, 3); // Pak de laatste 3
    
    diagnosticLog.push(`📰 ${items.length} artikelen gevonden in de feed.`);

    for (const item of items) {
      diagnosticLog.push(`🔍 Checken: "${item.title?.slice(0, 30)}..."`);

      // Controleer of de URL al bestaat
      const existing = await db.article.findUnique({
        where: { originalUrl: item.link }
      });

      if (existing) {
        diagnosticLog.push(`⏭️ OVERSLAGEN: Dit artikel staat al in je Supabase database.`);
        continue; 
      }

      // Als we hier komen, is het artikel écht nieuw.
      // We voegen hem nu toe ZONDER AI om te testen of het lukt.
      diagnosticLog.push(`✨ NIEUW! Bezig met toevoegen aan Supabase...`);

      await db.article.create({
        data: {
          originalTitle: item.title || 'Geen titel',
          originalContent: item.contentSnippet || 'Geen inhoud',
          originalUrl: item.link || '',
          originalSource: 'Good News Network',
          category: 'COMMUNITY',
          region: 'EUROPE',
          publishedAt: new Date(),
          translations: {
            create: [
              { language: 'NL', title: item.title || 'Titel', content: item.contentSnippet || 'Inhoud' }
            ]
          }
        }
      });

      return NextResponse.json({ 
        success: true, 
        added: 1, 
        log: diagnosticLog 
      });
    }

    return NextResponse.json({ 
      success: true, 
      added: 0, 
      message: "Alle artikelen uit deze feed staan al in je database.",
      log: diagnosticLog 
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message, 
      log: diagnosticLog 
    }, { status: 500 });
  }
}
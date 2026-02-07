import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // We verwijderen eerst de vertalingen, dan de artikelen (vanwege relaties)
    // Let op: 'articleTranslation' moet exact matchen met je Prisma model naam
    await db.articleTranslation.deleteMany({});
    await db.article.deleteMany({});

    return NextResponse.json({ 
      success: true, 
      message: "Database is nu helemaal leeg!" 
    });
  } catch (error) {
    console.error("Fout bij het legen van de database:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Kon de database niet legen. Check de server logs." 
    }, { status: 500 });
  }
}
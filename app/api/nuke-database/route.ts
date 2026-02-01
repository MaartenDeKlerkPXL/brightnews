import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Prisma maakt van 'ArticleTranslation' -> 'articleTranslation' (kleine letter a)
    await db.articleTranslation.deleteMany({});
    await db.savedArticle.deleteMany({});
    await db.article.deleteMany({});
    
    return NextResponse.json({ success: true, message: "Database is leeg!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
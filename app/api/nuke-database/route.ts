import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // We verwijderen nu alleen de artikelen
    await db.article.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: "Database is nu helemaal leeg!" 
    });
  } catch (error: any) {
    console.error("Fout bij nuken:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
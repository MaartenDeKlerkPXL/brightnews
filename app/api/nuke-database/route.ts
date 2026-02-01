import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  // Beveiliging: check of we in development zijn of gebruik een wachtwoord in de URL
  // Voor nu doen we het even simpel.
  
  try {
    // We verwijderen eerst de vertalingen (vanwege de relatie) en dan de artikelen
    await db.translation.deleteMany({});
    await db.article.deleteMany({});
    
    return NextResponse.json({ success: true, message: "Database is nu helemaal leeg!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
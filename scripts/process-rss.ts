/**
 * Manual script to process RSS feeds
 * Run with: npx tsx scripts/process-rss.ts
 */

import Parser from 'rss-parser'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const parser = new Parser()

const RSS_FEEDS = [
  'https://feeds.bbci.co.uk/news/rss.xml',
  'https://rss.cnn.com/rss/edition.rss',
  'https://www.theguardian.com/world/rss',
  'https://feeds.npr.org/1001/rss.xml',
  'https://www.nu.nl/rss',
  'https://www.volkskrant.nl/nieuws-achtergrond/rss.xml',
]

async function processRSS() {
  console.log('Starting RSS processing...')
  
  // This is a simplified version - in production, use the API route with Grok AI
  // For testing, you can manually add articles to the database
  
  console.log('RSS processing script ready.')
  console.log('To process RSS feeds with AI, use: POST /api/process-rss')
  
  await prisma.$disconnect()
}

processRSS().catch(console.error)

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    const updated = await prisma.article.update({
      where: { id: articleId },
      data: { isSaved: !article.isSaved },
    })

    return NextResponse.json({ success: true, isSaved: updated.isSaved })
  } catch (error) {
    console.error('Error toggling save:', error)
    return NextResponse.json(
      { error: 'Failed to save article' },
      { status: 500 }
    )
  }
}

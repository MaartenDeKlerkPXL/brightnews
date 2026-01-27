import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const language = searchParams.get('language') || 'NL'
    const category = searchParams.get('category')
    const region = searchParams.get('region')

    const where: any = {
      translations: {
        some: {
          language,
        },
      },
    }

    const savedOnly = searchParams.get('savedOnly') === 'true'
    if (savedOnly) {
      where.isSaved = true
    }

    if (category && category !== 'ALL') {
      where.category = category
    }

    if (region && region !== 'ALL') {
      where.region = region
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        translations: {
          where: {
            language,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 50,
    })

    // Include all translations for each article
    const articlesWithAllTranslations = await Promise.all(
      articles.map(async (article) => {
        const allTranslations = await prisma.articleTranslation.findMany({
          where: { articleId: article.id },
        })
        return {
          ...article,
          translations: allTranslations,
        }
      })
    )

    return NextResponse.json({ articles: articlesWithAllTranslations })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

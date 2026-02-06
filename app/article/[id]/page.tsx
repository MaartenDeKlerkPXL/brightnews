import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import ArticleContent from '@/components/article-content'

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { language?: string }
}) {
  // We halen de taal uit de URL, standaard naar NL
  const language = searchParams.language || 'NL'

  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      translations: true,
    },
  })

  if (!article) {
    notFound()
  }

  // We geven het artikel en de gekozen taal door aan de weergave-component
  return <ArticleContent article={article} language={language} />
}
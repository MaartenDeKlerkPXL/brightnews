'use client'

import { useEffect, useState } from 'react'
import { useApp } from './providers'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { format } from 'date-fns'
import { nl, enUS, fr, es, de } from 'date-fns/locale'
import { ExternalLink, Bookmark } from 'lucide-react'
import Link from 'next/link'

const gridTranslations: Record<string, any> = {
  NL: { source: "Bron" },
  EN: { source: "Source" },
  FR: { source: "Source" },
  ES: { source: "Fuente" },
  DE: { source: "Quelle" },
}

const dateLocales: Record<string, any> = { NL: nl, EN: enUS, FR: fr, ES: es, DE: de }

type ArticleGridProps = {
  savedOnly?: boolean
  emptyMessage?: string
}

export function ArticleGrid({ savedOnly, emptyMessage }: ArticleGridProps) {
  const { language, selectedCategory, selectedRegion } = useApp()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const t = gridTranslations[language] || gridTranslations.EN

  async function toggleSave(e: React.MouseEvent, articleId: string) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await fetch('/api/articles/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
      })
      const data = await res.json()
      if (data.success) {
        setArticles((prev) => {
          if (savedOnly && !data.isSaved) {
            return prev.filter((a) => a.id !== articleId)
          }
          return prev.map((a) =>
            a.id === articleId ? { ...a, isSaved: data.isSaved } : a
          )
        })
      }
    } catch (err) {
      console.error('Error toggling save:', err)
    }
  }

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          language,
          category: selectedCategory || 'ALL',
          region: selectedRegion || 'ALL',
        })
        if (savedOnly) params.set('savedOnly', 'true')
        const res = await fetch(`/api/articles?${params}`)
        const data = await res.json()
        setArticles(data.articles || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [language, selectedCategory, selectedRegion, savedOnly])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-80 bg-muted rounded-xl animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    const isSavedEmpty = savedOnly && emptyMessage
    return (
      <div className="text-center py-20 px-4">
        {isSavedEmpty && (
          <Bookmark className="mx-auto h-16 w-16 text-muted-foreground/40 mb-6" strokeWidth={1.5} />
        )}
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {emptyMessage ?? 'Geen artikelen gevonden.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => {
        const translation = article.translations.find((t: any) => t.language === language) || article.translations[0]
        
        return (
          <Link 
            key={article.id} 
            href={`/article/${article.id}?language=${language}`}
            className="group block no-underline"
          >
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300 border-none bg-card shadow-md">
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <button
                  type="button"
                  aria-label={article.isSaved ? 'Remove from saved' : 'Save article'}
                  onClick={(e) => toggleSave(e, article.id)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow hover:bg-white transition-colors"
                >
                  <Bookmark
                    className={`h-5 w-5 ${article.isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                  />
                </button>
                {article.imageUrl ? (
                  <img 
                    src={article.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs font-bold text-muted-foreground uppercase">
                    {article.category}
                  </div>
                )}
              </div>

              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {translation?.title || article.originalTitle}
                </CardTitle>
                <div className="text-[10px] text-muted-foreground flex justify-between mt-2">
                   <span>{article.region}</span>
                   <span>
                    {format(new Date(article.publishedAt), 'PPP', { 
                      locale: dateLocales[language] || nl 
                    })}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {translation?.content}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {t.source}: {article.originalSource}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useApp } from './providers'
import ArticleContent from './article-content'

interface Article {
  id: string
  imageUrl?: string
  translations: {
    title: string
    content: string
    language: string
  }[]
}



export default function ArticleGrid({ savedOnly = false }: { savedOnly?: boolean }) {
  // Gebruik de hook die we in providers hebben gemaakt
  const { language, selectedCategory, selectedRegion } = useApp()
  
  // Voeg deze states toe (die miste je in het screenshot)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/articles')
      const data = await res.json()
      setArticles(data)
    } catch (error) {
      console.error('Fout bij ophalen:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory, selectedRegion])

  if (loading) return <div className="text-center p-10">Laden...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {articles.map((article: Article) => (
        <ArticleContent key={article.id} article={article} />
      ))}
    </div>
  )
}
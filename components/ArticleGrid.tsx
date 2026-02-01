'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/context'
import { format } from 'date-fns'
import { nl, enUS, fr, es, de } from 'date-fns/locale'
import { ExternalLink, Bookmark } from 'lucide-react'
import Link from 'next/link'

const gridTranslations: Record<string, any> = {
  NL: { source: "Bron", loading: "Artikelen laden...", no_results: "Geen bewaarde artikelen gevonden." },
  EN: { source: "Source", loading: "Loading articles...", no_results: "No saved articles found." },
  FR: { source: "Source", loading: "Chargement...", no_results: "Aucun artikel enregistré." },
  ES: { source: "Fuente", loading: "Cargando...", no_results: "No se encontraron artículos guardados." },
  DE: { source: "Quelle", loading: "Laden...", no_results: "Keine gespeicherten Artikel gevonden." },
}

const dateLocales: Record<string, any> = { NL: nl, EN: enUS, FR: fr, ES: es, DE: de }

type ArticleGridProps = {
  savedOnly?: boolean
}

export default function ArticleGrid({ savedOnly = false }: ArticleGridProps) {
  const { language, selectedCategory, selectedRegion } = useApp()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const t = gridTranslations[language] || gridTranslations.EN

  // Helper om tekst mooi te maken (geen CAPS)
  const formatLabel = (text: string) => {
    const spaced = text.replace('_', ' ').toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  // Functie om op te slaan / verwijderen
  async function toggleSave(e: React.MouseEvent, articleId: string) {
    e.preventDefault(); // Zorg dat we niet naar de detailpagina gaan bij klikken op bookmark
    e.stopPropagation();
    
    try {
      const res = await fetch('/api/articles/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
      });
      const data = await res.json();
      
      if (data.success) {
        setArticles((prev) => {
          // Als we op de "Saved" pagina zijn, verwijder het artikel uit de lijst als het 'unsaved' is
          if (savedOnly && !data.isSaved) {
            return prev.filter((a) => a.id !== articleId);
          }
          // Anders update alleen de bookmark status
          return prev.map((a) =>
            a.id === articleId ? { ...a, isSaved: data.isSaved } : a
          );
        });
      }
    } catch (err) {
      console.error('Error toggling save:', err);
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
        
        // Vertel de API of we alleen saved articles willen
        if (savedOnly) {
          params.append('savedOnly', 'true')
        }

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
          <div key={i} className="aspect-video bg-gray-100 rounded-xl animate-pulse shadow-sm"></div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <Bookmark className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg font-medium">{t.no_results}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => {
        const translation = article.translations.find((tr: any) => tr.language === language) || article.translations[0]
        const detailUrl = `/article/${article.id}?language=${language}`;

        return (
          <div key={article.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col border border-gray-100">
            
            {/* Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              <Link href={detailUrl}>
                <img 
                  src={article.imageUrl || `https://loremflickr.com/1200/675/${article.category.toLowerCase()}?lock=${article.id}`} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
              </Link>
              
              {/* Bookmark Button */}
              <button
                onClick={(e) => toggleSave(e, article.id)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all transform active:scale-90"
              >
                <Bookmark
                  className={`h-5 w-5 transition-colors ${article.isSaved ? 'fill-green-500 text-green-500' : 'text-gray-400'}`}
                />
              </button>

              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white">
                {formatLabel(article.category)}
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <span>{article.region}</span>
                <span>
                  {format(new Date(article.publishedAt), 'PPP', { locale: dateLocales[language] || nl })}
                </span>
              </div>

              <Link href={detailUrl} className="block group-hover:text-green-600 transition-colors">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight">
                  {translation?.title || article.originalTitle}
                </h3>
              </Link>

              <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                {translation?.content}
              </p>

              <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-auto">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                  {t.source}: <span className="text-gray-900">{article.originalSource}</span>
                </span>
                <a 
                  href={article.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-500 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
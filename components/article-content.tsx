'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Globe, Calendar, Tag, Bookmark } from 'lucide-react'
import { format } from 'date-fns'
import { nl, enUS, fr, es, de } from 'date-fns/locale'
import React from 'react'
import { useApp } from './providers' // Belangrijk voor de taalinstelling

// --- CONSTANTEN ---
const ui = {
  NL: { back: "Terug naar overzicht", source: "Bekijk originele bron", published: "Gepubliceerd op", saveArticle: "Sla dit artikel op", unsaveArticle: "Verwijder uit opgeslagen" },
  EN: { back: "Back to overview", source: "View original source", published: "Published on", saveArticle: "Save this article", unsaveArticle: "Remove from saved" },
  FR: { back: "Retour à l'aperçu", source: "Voir la source originale", published: "Publié le", saveArticle: "Enregistrer cet article", unsaveArticle: "Retirer des enregistrés" },
  ES: { back: "Volver a la vista general", source: "Ver fuente original", published: "Publicado el", saveArticle: "Guardar este artículo", unsaveArticle: "Quitar de guardados" },
  DE: { back: "Zurück zur Übersicht", source: "Originalquelle ansehen", published: "Veröffentlicht am", saveArticle: "Diesen Artikel speichern", unsaveArticle: "Aus Gespeicherten entfernen" },
}

const dateLocales: Record<string, any> = { NL: nl, EN: enUS, FR: fr, ES: es, DE: de }

const CATEGORY_IMAGES: Record<string, string> = {
  TECHNOLOGY: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
  GREEN_WORLD: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
  HEALTH: "https://images.unsplash.com/photo-1505751172107-1698656113f9?w=1200",
  SPORT: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200",
  COMMUNITY: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200",
  SCIENCE: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200"
}

// --- DE COMPONENT ---
// We gebruiken 'export default' en halen 'language' uit de context als die niet wordt meegegeven
export default function ArticleContent({ article, language: propLanguage }: { article: any, language?: string }) {
  const { language: contextLanguage } = useApp()
  const language = (propLanguage || contextLanguage || 'NL') as keyof typeof ui
  
  const t = ui[language] || ui.EN
  const [isSaved, setIsSaved] = useState(Boolean(article.isSaved))

  async function handleToggleSave() {
    try {
      const res = await fetch('/api/articles/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id }),
      })
      const data = await res.json()
      if (data.success) setIsSaved(data.isSaved)
    } catch (err) {
      console.error('Error toggling save:', err)
    }
  }
  
  const translation = article.translations?.find((t: any) => t.language === language) || article.translations?.[0] || { title: 'Geen titel', content: 'Geen inhoud' }
  const displayImage = article.imageUrl || CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES.COMMUNITY

  return (
    <div className="min-h-screen bg-white pb-20">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 mb-8">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href={`/?language=${language}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {t.back}
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block shadow-sm">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
            {translation.title}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-gray-400 text-sm font-medium border-y border-gray-100 py-4">
             <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {article.publishedAt ? format(new Date(article.publishedAt), 'd MMMM yyyy', { locale: dateLocales[language] || nl }) : 'Datum onbekend'}
             </div>
             <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {article.region}
             </div>
             <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {article.originalSource}
             </div>
          </div>
        </div>

        <div className="relative h-[500px] w-full mb-12 rounded-[2rem] overflow-hidden shadow-2xl">
          <img src={displayImage} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg lg:prose-xl prose-blue">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-blue-600">
              {translation.content}
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-4 justify-center">
            <a 
              href={article.originalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
            >
              {t.source}
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all shadow-lg ${
                isSaved
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? t.unsaveArticle : t.saveArticle}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
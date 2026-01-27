'use client'

import { useApp } from '@/components/providers'
import { ArticleGrid } from '@/components/article-grid'
import { Filters } from '@/components/filters'
import { uiTranslations } from '@/lib/translations'

export default function SavedPage() {
  const { language, setLanguage } = useApp()
  const t = uiTranslations[language as keyof typeof uiTranslations] ?? uiTranslations.EN

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-primary">{t.savedTitle}</h1>
          <p className="text-muted-foreground text-lg">
            {t.savedSubtitle}
          </p>
        </div>

        <div className="flex gap-2">
          {(Object.keys(uiTranslations) as Array<keyof typeof uiTranslations>).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-md border ${
                language === lang ? 'bg-primary text-white' : 'bg-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <Filters />

      <ArticleGrid savedOnly emptyMessage={t.savedEmpty} />
    </div>
  )
}
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

// We maken een strikt type voor de talen
type LanguageCode = 'EN' | 'NL' | 'FR' | 'ES' | 'DE'

// ÉÉN duidelijke interface voor de hele app
export interface AppContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  selectedCategory: string | null
  setSelectedCategory: (cat: string | null) => void
  selectedRegion: string | null
  setSelectedRegion: (reg: string | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  // De states voor de filters
  const [language, setLanguage] = useState<LanguageCode>('NL')
  const [selectedCategory, setSelectedCategory] = useState<string | null>('ALL')
  const [selectedRegion, setSelectedRegion] = useState<string | null>('ALL')

  // Laden van taal uit de browser-opslag
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as LanguageCode
    if (savedLang && ['EN', 'NL', 'FR', 'ES', 'DE'].includes(savedLang)) {
      setLanguage(savedLang)
    }
  }, [])

  // Opslaan van taal bij wijziging
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        selectedCategory,
        setSelectedCategory,
        selectedRegion,
        setSelectedRegion,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// De 'hook' om de data makkelijk te gebruiken in je componenten
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within Providers')
  }
  return context
}
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type LanguageCode = 'EN' | 'NL' | 'FR' | 'ES' | 'DE'

interface AppContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  selectedRegion: string
  setSelectedRegion: (reg: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('NL')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedRegion, setSelectedRegion] = useState('ALL')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as LanguageCode
    if (savedLang && ['EN', 'NL', 'FR', 'ES', 'DE'].includes(savedLang)) {
      setLanguage(savedLang)
    }
  }, [])

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

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within Providers')
  }
  return context
}

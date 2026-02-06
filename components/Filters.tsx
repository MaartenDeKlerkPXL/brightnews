'use client'

import React from 'react'
import { useApp } from './providers'

const CATEGORIES = [
  { id: 'ALL', NL: 'Alles', EN: 'All', FR: 'Tout', ES: 'Todo', DE: 'Alle' },
  { id: 'TECHNOLOGY', NL: 'Tech', EN: 'Tech', FR: 'Tech', ES: 'Tecnología', DE: 'Tech' },
  { id: 'GREEN_WORLD', NL: 'Groen', EN: 'Green', FR: 'Vert', ES: 'Verde', DE: 'Grün' },
  { id: 'HEALTH', NL: 'Gezondheid', EN: 'Health', FR: 'Santé', ES: 'Salud', DE: 'Gesundheit' },
  { id: 'COMMUNITY', NL: 'Samenleving', EN: 'Community', FR: 'Communauté', ES: 'Comunidad', DE: 'Gemeinschaft' },
]

export default function Filters() {
  // We halen alles op via de useApp hook
  const { 
    language, 
    selectedCategory, 
    setSelectedCategory 
  } = useApp()

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.id === 'ALL' ? null : cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            (selectedCategory === cat.id || (cat.id === 'ALL' && !selectedCategory))
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat[language as keyof typeof cat]}
        </button>
      ))}
    </div>
  )
}
'use client'

import { useApp } from '@/lib/context'

const categories = ["ALL", "TECHNOLOGY", "GREEN_WORLD", "HEALTH", "SPORT", "COMMUNITY", "SCIENCE", "ENTERTAINMENT"]
const regions = ["ALL", "EUROPE", "ASIA", "NORTH_AMERICA", "AFRICA", "SOUTH_AMERICA", "OCEANIA"]

// Helper functie om tekst mooi te maken: TECHNOLOGY -> Technology
const formatLabel = (text: string) => {
  if (text === "ALL") return "Alles";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase().replace('_', ' ');
}

export default function Filters() {
  const { selectedCategory, setSelectedCategory, selectedRegion, setSelectedRegion } = useApp()

  return (
    <div className="flex flex-wrap gap-4 mb-10">
      <select 
        value={selectedCategory} 
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{formatLabel(cat)}</option>
        ))}
      </select>

      <select 
        value={selectedRegion} 
        onChange={(e) => setSelectedRegion(e.target.value)}
        className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none"
      >
        {regions.map((reg) => (
          <option key={reg} value={reg}>{formatLabel(reg)}</option>
        ))}
      </select>
    </div>
  )
}
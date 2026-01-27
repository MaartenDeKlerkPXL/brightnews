'use client'

import { useApp } from './providers'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { categories, regions } from '@/lib/utils'

export function Filters() {
  const { selectedCategory, setSelectedCategory, selectedRegion, setSelectedRegion } = useApp()

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Categorie</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Regio</label>
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map((reg) => (
              <SelectItem key={reg.value} value={reg.value}>
                {reg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

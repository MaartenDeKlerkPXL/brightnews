'use client'

import Link from 'next/link'
import { useApp } from './providers'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { languages } from '@/lib/utils'
import { Menu, User } from 'lucide-react'

export function Navigation() {
  const { language, setLanguage } = useApp()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">BrightNews</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/about">
              <Button variant="ghost">Over Ons</Button>
            </Link>
            <Link href="/subscriptions">
              <Button variant="ghost">Abonnementen</Button>
            </Link>
            <Link href="/saved">
              <Button variant="ghost">Opgeslagen</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </nav>
  )
}

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>{isLogin ? 'Inloggen' : 'Registreren'}</CardTitle>
          <CardDescription>
            {isLogin
              ? 'Log in op je BrightNews account'
              : 'Maak een nieuw BrightNews account aan'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="je@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Wachtwoord</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="••••••••"
              />
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium mb-2 block">Naam</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Je naam"
                />
              </div>
            )}
            <Button type="submit" className="w-full">
              {isLogin ? 'Inloggen' : 'Registreren'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? 'Nog geen account? Registreer'
                : 'Al een account? Log in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client";

import { useApp } from '@/lib/context';
import { User, Bookmark } from 'lucide-react';

export default function Navigation() {
  const { language } = useApp();
  
  const navTranslations = {
    NL: { about: "Over ons", profile: "Profiel", subscription: "Abonnement", saved: "Bewaard" },
    EN: { about: "About", profile: "Profile", subscription: "Subscription", saved: "Saved" },
    FR: { about: "À propos", profile: "Profil", subscription: "Abonnement", saved: "Enregistré" },
    ES: { about: "Sobre nosotros", profile: "Perfil", subscription: "Suscripción", saved: "Guardado" },
    DE: { about: "Über uns", profile: "Profil", subscription: "Abonnement", saved: "Gespeichert" }
  };

  const t = navTranslations[language as keyof typeof navTranslations] || navTranslations.NL;

  return (
    <nav className="py-6 border-b bg-white">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo = Home button */}
        <a href="/" className="text-2xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity">
          Bright<span className="text-green-500">News</span>
        </a>
        
        <div className="flex gap-6 items-center font-medium text-sm">
          <a href="/about" className="text-gray-500 hover:text-green-500 transition-colors">
            {t.about}
          </a>
          <a href="/subscriptions" className="text-gray-500 hover:text-green-500 transition-colors">
            {t.subscription}
          </a>
          
          {/* Saved Pagina met Icoon */}
          <a href="/saved" className="text-gray-500 hover:text-green-500 transition-colors flex items-center gap-1.5">
            <Bookmark className="h-4 w-4" />
            <span>{t.saved}</span>
          </a>
          
          {/* Profiel knop */}
          <a 
            href="/profile" 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-green-600 transition-all shadow-sm"
          >
            <User className="h-4 w-4" />
            <span>{t.profile}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
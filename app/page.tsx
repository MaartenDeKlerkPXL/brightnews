"use client";

import { useApp } from '@/lib/context';
import Filters from '@/components/Filters';
import ArticleGrid from '@/components/ArticleGrid';

const uiTranslations = {
  NL: {
    title: "BrightNews",
    subtitle: "Ontdek positief nieuws van over de hele wereld",
  },
  EN: {
    title: "BrightNews",
    subtitle: "Discover positive news from around the world",
  },
  FR: {
    title: "BrightNews",
    subtitle: "Découvrez des nouvelles positives du monde entier",
  },
  ES: {
    title: "BrightNews",
    subtitle: "Descubre noticias positivas de todo el mundo",
  },
  DE: {
    title: "BrightNews",
    subtitle: "Entdecke positive Nachrichten aus der ganzen Welt",
  }
};

export default function Home() {
  const { language, setLanguage } = useApp();
  const t = uiTranslations[language as keyof typeof uiTranslations] || uiTranslations.NL;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Titel en Taalkeuze Sectie */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight text-gray-900">
            {t.title}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Taalknoppen */}
        <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
          {(Object.keys(uiTranslations) as Array<keyof typeof uiTranslations>).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                language === lang 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <Filters />
      <ArticleGrid />
    </div>
  );
}
"use client";

import { useApp } from '@/lib/context'; // Zorg dat dit exact naar lib/context wijst
import ArticleGrid from '@/components/ArticleGrid';

export default function SavedPage() {
  const { language } = useApp();

  const translations = {
    NL: "Bewaarde Artikelen",
    EN: "Saved Articles",
    FR: "Articles Enregistrés",
    ES: "Artículos Guardados",
    DE: "Gespeicherte Artikel"
  };

  const title = translations[language as keyof typeof translations] || translations.NL;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight text-gray-900">
        {title}
      </h1>
      
      {/* We vertellen de grid dat hij alleen bewaarde items moet tonen */}
      <ArticleGrid savedOnly={true} />
    </div>
  );
}
"use client";

import { useApp } from '@/lib/context';

export default function Footer() {
  const { language } = useApp();

  const footerTranslations = {
    NL: "© 2026 Bright News — Jouw dagelijkse dosis positiviteit.",
    EN: "© 2026 Bright News — Your daily dose of positivity.",
    FR: "© 2026 Bright News — Votre dose quotidienne de positivité.",
    ES: "© 2026 Bright News — Tu dosis diaria de positividad.",
    DE: "© 2026 Bright News — Deine tägliche Dosis Positivität."
  };

  const text = footerTranslations[language as keyof typeof footerTranslations] || footerTranslations.NL;

  return (
    <footer className="mt-auto py-10 border-t text-center text-gray-400 text-sm font-medium container mx-auto px-4">
      <p>{text}</p>
    </footer>
  );
}
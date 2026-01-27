'use client'

import { useApp } from '@/components/providers'
import { ArticleGrid } from '@/components/article-grid'
import { Filters } from '@/components/filters'

// Woordenboek voor de website zelf
const uiTranslations = {
  NL: {
    title: "BrightNews",
    subtitle: "Ontdek positief nieuws van over de hele wereld",
    categories: "Categorieën",
    regions: "Regio's",
    cat_ALL: "Alles",
    cat_TECHNOLOGY: "Technologie",
    cat_GREEN_WORLD: "Duurzaamheid",
    cat_HEALTH: "Gezondheid",
    cat_SPORT: "Sport",
    cat_COMMUNITY: "Samenleving",
    cat_EDUCATION: "Onderwijs",
    reg_ALL: "Alle regio's",
    reg_EUROPE: "Europa",
    reg_ASIA: "Azië",
    reg_NORTH_AMERICA: "Noord-Amerika",
    reg_AFRICA: "Afrika",
    reg_SOUTH_AMERICA: "Zuid-Amerika",
    reg_OCEANIA: "Oceanië"
  },
  EN: {
    title: "BrightNews",
    subtitle: "Discover positive news from around the world",
    categories: "Categories",
    regions: "Regions",
    cat_ALL: "All",
    cat_TECHNOLOGY: "Technology",
    cat_GREEN_WORLD: "Sustainability",
    cat_HEALTH: "Health",
    cat_SPORT: "Sport",
    cat_COMMUNITY: "Community",
    cat_EDUCATION: "Education",
    reg_ALL: "All regions",
    reg_EUROPE: "Europe",
    reg_ASIA: "Asia",
    reg_NORTH_AMERICA: "North America",
    reg_AFRICA: "Africa",
    reg_SOUTH_AMERICA: "South America",
    reg_OCEANIA: "Oceania"
  },
  FR: {
    title: "BrightNews",
    subtitle: "Découvrez des nouvelles positives du monde entier",
    categories: "Catégories",
    regions: "Régions",
    cat_ALL: "Tout",
    cat_TECHNOLOGY: "Technologie",
    cat_GREEN_WORLD: "Durabilité",
    cat_HEALTH: "Santé",
    cat_SPORT: "Sport",
    cat_COMMUNITY: "Communauté",
    cat_EDUCATION: "Éducation",
    reg_ALL: "Toutes régions",
    reg_EUROPE: "Europe",
    reg_ASIA: "Asie",
    reg_NORTH_AMERICA: "Amérique du Nord",
    reg_AFRICA: "Afrique",
    reg_SOUTH_AMERICA: "Amérique du Sud",
    reg_OCEANIA: "Océanie"
  },
  ES: {
    title: "BrightNews",
    subtitle: "Descubre noticias positivas de todo el mundo",
    categories: "Categorías",
    regions: "Regiones",
    cat_ALL: "Todo",
    cat_TECHNOLOGY: "Tecnología",
    cat_GREEN_WORLD: "Sostenibilidad",
    cat_HEALTH: "Salud",
    cat_SPORT: "Deporte",
    cat_COMMUNITY: "Comunidad",
    cat_EDUCATION: "Educación",
    reg_ALL: "Todas las regiones",
    reg_EUROPE: "Europa",
    reg_ASIA: "Asia",
    reg_NORTH_AMERICA: "América del Norte",
    reg_AFRICA: "África",
    reg_SOUTH_AMERICA: "América del Sur",
    reg_OCEANIA: "Oceanía"
  },
  DE: {
    title: "BrightNews",
    subtitle: "Entdecke positive Nachrichten aus der ganzen Welt",
    categories: "Kategorien",
    regions: "Regionen",
    cat_ALL: "Alles",
    cat_TECHNOLOGY: "Technologie",
    cat_GREEN_WORLD: "Nachhaltigkeit",
    cat_HEALTH: "Gesundheit",
    cat_SPORT: "Sport",
    cat_COMMUNITY: "Gemeinschaft",
    cat_EDUCATION: "Bildung",
    reg_ALL: "Alle Regionen",
    reg_EUROPE: "Europa",
    reg_ASIA: "Asien",
    reg_NORTH_AMERICA: "Nordamerika",
    reg_AFRICA: "Afrika",
    reg_SOUTH_AMERICA: "Südamerika",
    reg_OCEANIA: "Ozeanien"
  }
};

export default function Home() {
  const { language, setLanguage } = useApp()
  const t = uiTranslations[language as keyof typeof uiTranslations]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header sectie met vertaling */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-primary">{t.title}</h1>
          <p className="text-muted-foreground text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="flex gap-2">
          {(Object.keys(uiTranslations) as Array<keyof typeof uiTranslations>).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-md border ${
                language === lang ? 'bg-primary text-white' : 'bg-white'
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
  )
}
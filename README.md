# BrightNews - Positief Nieuws Platform

Een AI-gestuurd platform voor positief en inspirerend nieuws, gebouwd met Next.js, TypeScript, Tailwind CSS en Prisma.

## Features

- 🌍 **Wereldwijd nieuws**: Aggregeert nieuws van diverse RSS-feeds
- 🤖 **AI-filtering**: Gebruikt Grok AI om negatief nieuws te filteren en artikelen te herschrijven
- 🌐 **Meertalig**: Artikelen beschikbaar in Engels, Nederlands, Frans, Spaans en Duits
- 🎯 **Filtering**: Filter op categorie en regio
- 💾 **Opslaan**: Sla je favoriete artikelen op
- 💳 **Abonnementen**: Gratis, maandelijks (€2,95) of jaarlijks (€19,95)

## Setup

### Vereisten

- Node.js 18+
- PostgreSQL database
- Grok API key (xAI)

### Installatie

1. Installeer dependencies:
```bash
npm install
```

2. Configureer environment variabelen:
```bash
cp .env.example .env
```

Vul de volgende variabelen in:
```
DATABASE_URL="postgresql://user:password@localhost:5432/brightnews"
GROK_API_KEY="your-grok-api-key"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
CRON_SECRET="your-secret-for-cron-jobs"
```

3. Setup database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Start development server:
```bash
npm run dev
```

## RSS Processing

Om nieuwsartikelen te verwerken, maak een POST request naar `/api/process-rss`. Dit kan worden geautomatiseerd met een cronjob of scheduled task.

Voor productie op Vercel, gebruik de cron endpoint `/api/cron/process-rss` met een CRON_SECRET in je environment variabelen. De `vercel.json` is al geconfigureerd om dit elk uur uit te voeren.

Voor lokale ontwikkeling of andere platforms:
- Gebruik een externe cron service (bijv. cron-job.org) die een GET request maakt naar `/api/cron/process-rss` met de Authorization header: `Bearer ${CRON_SECRET}`
- Of maak handmatig POST requests naar `/api/process-rss`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: PostgreSQL met Prisma ORM
- **Authentication**: Supabase (optioneel)
- **AI**: Grok API (xAI)

## Project Structuur

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── article/           # Article detail pages
│   └── ...
├── components/             # React components
│   ├── ui/                # Shadcn UI components
│   └── ...
├── lib/                    # Utility functions
├── prisma/                 # Database schema
└── ...
```

## Licentie

MIT

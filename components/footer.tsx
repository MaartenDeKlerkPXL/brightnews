import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">BrightNews</h3>
            <p className="text-sm text-muted-foreground">
              Een platform voor positief en inspirerend nieuws van over de hele wereld.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  Over Ons
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="text-muted-foreground hover:text-foreground">
                  Abonnementen
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Transparantie</h3>
            <p className="text-sm text-muted-foreground">
              Alle artikelen vermelden hun originele bron. We respecteren auteursrechten en geven credit waar credit toekomt.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BrightNews. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-primary">Over BrightNews</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Onze Missie</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p className="text-lg leading-relaxed">
            BrightNews is een AI-gestuurd platform dat wereldwijd nieuws filtert, 
            vertaalt en herschrijft naar een positieve, inspirerende toon. We geloven 
            dat er genoeg goed nieuws is in de wereld, maar dat het vaak overschaduwd 
            wordt door negatieve berichtgeving.
          </p>
          <p className="mt-4 leading-relaxed">
            Onze missie is om mensen te helpen een gebalanceerd beeld te krijgen van 
            wat er gebeurt in de wereld, met focus op constructieve ontwikkelingen, 
            innovatie, en positieve verhalen die hoop en inspiratie bieden.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Hoe het Werkt</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p className="leading-relaxed">
            We gebruiken geavanceerde AI-technologie (Grok) om nieuwsartikelen van 
            diverse RSS-feeds te analyseren. Ons systeem:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Filtert automatisch negatief nieuws over politiek, oorlog en geweld</li>
            <li>Herschrijft artikelen naar een positieve, inspirerende toon</li>
            <li>Categoriseert nieuws in Technology, Green World, Health, Education, Community en Sport</li>
            <li>Identificeert de regio van het nieuws</li>
            <li>Vertalt artikelen naar Engels, Nederlands, Frans, Spaans en Duits</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transparantie</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p className="leading-relaxed">
            We geloven in transparantie. Elk artikel op BrightNews vermeldt de 
            originele bron, zodat je altijd kunt teruggaan naar het oorspronkelijke 
            artikel. We respecteren auteursrechten en geven credit waar credit toekomt.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

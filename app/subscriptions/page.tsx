import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
export const dynamic = 'force-dynamic';

const plans = [
  {
    name: 'Gratis',
    price: '€0',
    period: '',
    features: [
      'Toegang tot alle artikelen',
      'Basis filtering',
      'Taalwisseling',
    ],
    buttonText: 'Huidig plan',
    disabled: false,
  },
  {
    name: 'Maandelijks',
    price: '€2,95',
    period: '/maand',
    features: [
      'Alles uit Gratis',
      'Onbeperkt artikelen opslaan',
      'Geen advertenties',
      'Prioriteit support',
    ],
    buttonText: 'Upgrade naar Maandelijks',
    disabled: false,
  },
  {
    name: 'Jaarlijks',
    price: '€19,95',
    period: '/jaar',
    features: [
      'Alles uit Maandelijks',
      'Bespaar €15,45 per jaar',
      'Exclusieve content',
      'Early access nieuwe features',
    ],
    buttonText: 'Upgrade naar Jaarlijks',
    disabled: false,
    popular: true,
  },
]

export default function SubscriptionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 text-primary">Abonnementen</h1>
        <p className="text-muted-foreground text-lg">
          Kies het abonnement dat bij jou past
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? 'border-primary border-2' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Populair
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                disabled={plan.disabled}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

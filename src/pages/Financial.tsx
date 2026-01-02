import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { useDataStore } from '../stores/dataStore'
import { formatCurrency } from '../lib/utils'
import { DollarSign, TrendingUp, PiggyBank, Target } from 'lucide-react'

export function FinancialPage() {
  const { t } = useTranslation()
  const { projects } = useDataStore()

  // Revenue projections from Chakana documents
  const revenueProjections = [
    { name: 'Retiro Nivel 1 (€497-800)', monthly: 20, price: 650, annual: 156000 },
    { name: 'Retiro Nivel 2 (€700-800)', monthly: 15, price: 750, annual: 135000 },
    { name: 'Retiro Nivel 3 (€900-1000)', monthly: 10, price: 950, annual: 114000 },
    { name: 'Retiro Ecuador (€7,000)', yearly: 50, price: 7000, annual: 350000 },
    { name: 'Mentorías VIP (€3,000)', monthly: 5, price: 3000, annual: 180000 },
  ]

  const totalAnnualRevenue = revenueProjections.reduce((sum, r) => sum + r.annual, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {t('financial.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('financial.subtitle')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chakana-earth/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-chakana-earth" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inversión Necesaria</p>
                <p className="text-2xl font-bold">{formatCurrency(100000)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chakana-gold/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-chakana-gold-dark" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Proyectados</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAnnualRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chakana-sage/20 flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-chakana-sage" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margen Beneficio</p>
                <p className="text-2xl font-bold">~50%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chakana-sky/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-chakana-sky" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Beneficio Neto Est.</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAnnualRevenue * 0.5)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t('financial.breakdown')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Producto</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Precio</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Volumen</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Anual</th>
                </tr>
              </thead>
              <tbody>
                {revenueProjections.map((item, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">
                      {item.monthly ? `${item.monthly}/mes` : `${item.yearly}/año`}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.annual)}</td>
                  </tr>
                ))}
                <tr className="bg-muted/50 font-bold">
                  <td className="py-3 px-4" colSpan={3}>Total Anual Proyectado</td>
                  <td className="py-3 px-4 text-right text-chakana-earth">{formatCurrency(totalAnnualRevenue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Budget by Project */}
      <Card>
        <CardHeader>
          <CardTitle>Presupuesto por Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="font-medium">{project.name}</span>
                  </div>
                  <span className="text-sm">
                    {formatCurrency(project.currentSpend || 0)} / {formatCurrency(project.budget || 0)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${((project.currentSpend || 0) / (project.budget || 1)) * 100}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

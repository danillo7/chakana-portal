import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useDataStore } from '../stores/dataStore'
import { formatDateShort } from '../lib/utils'
import { Calendar, Tag } from 'lucide-react'

const categoryIcons: Record<string, string> = {
  ata: '📋',
  business_plan: '📊',
  research: '🔬',
  legal: '⚖️',
  financial: '💰',
}

export function DocumentsPage() {
  const { t, i18n } = useTranslation()
  const { documents } = useDataStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {t('documents.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('documents.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:border-chakana-earth/50 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-chakana-earth/10 flex items-center justify-center text-2xl">
                  {categoryIcons[doc.category] || '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{doc.title}</CardTitle>
                  <Badge variant="earth" className="mt-1">
                    {t(`documents.categories.${doc.category === 'ata' ? 'atas' : doc.category === 'business_plan' ? 'businessPlans' : doc.category}`)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {doc.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateShort(doc.updatedAt, i18n.language)}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {doc.tags.length} tags
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

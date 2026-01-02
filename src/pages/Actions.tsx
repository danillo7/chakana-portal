import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useDataStore } from '../stores/dataStore'
import { formatDateShort } from '../lib/utils'
import { CheckSquare, Clock, User, AlertTriangle } from 'lucide-react'

const priorityVariants: Record<string, 'danger' | 'warning' | 'info'> = {
  high: 'danger',
  medium: 'warning',
  low: 'info',
}

const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
  completed: 'success',
  in_progress: 'warning',
  pending: 'info',
  overdue: 'danger',
}

export function ActionsPage() {
  const { t, i18n } = useTranslation()
  const { actions, stakeholders } = useDataStore()

  const getOwner = (ownerId: string) => stakeholders.find(s => s.id === ownerId)

  const sortedActions = [...actions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {t('actions.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('actions.subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{actions.filter(a => a.status === 'pending').length}</div>
            <div className="text-sm text-muted-foreground">{t('actions.status.pending')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-chakana-gold-dark">{actions.filter(a => a.status === 'in_progress').length}</div>
            <div className="text-sm text-muted-foreground">{t('actions.status.inProgress')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-chakana-sage">{actions.filter(a => a.status === 'completed').length}</div>
            <div className="text-sm text-muted-foreground">{t('actions.status.completed')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-chakana-terracotta">{actions.filter(a => a.priority === 'high').length}</div>
            <div className="text-sm text-muted-foreground">{t('actions.priority.high')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Todas las Acciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedActions.map((action) => {
              const owner = getOwner(action.owner)

              return (
                <div
                  key={action.id}
                  className="p-4 rounded-lg border border-border hover:border-chakana-earth/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {action.priority === 'high' && (
                          <AlertTriangle className="w-4 h-4 text-chakana-terracotta shrink-0" />
                        )}
                        <h3 className="font-medium truncate">{action.title}</h3>
                      </div>
                      {action.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {action.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {owner?.name || action.owner}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateShort(action.deadline, i18n.language)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge variant={priorityVariants[action.priority]}>
                        {t(`actions.priority.${action.priority}`)}
                      </Badge>
                      <Badge variant={statusVariants[action.status]}>
                        {t(`actions.status.${action.status === 'in_progress' ? 'inProgress' : action.status}`)}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

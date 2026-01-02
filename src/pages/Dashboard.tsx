import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useDataStore } from '../stores/dataStore'
import { formatCurrency, formatDateShort } from '../lib/utils'
import {
  DollarSign,
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react'

export function Dashboard() {
  const { t, i18n } = useTranslation()
  const { projects, actions, stakeholders, documents } = useDataStore()

  // Calculate metrics
  const totalInvestment = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  const pendingActions = actions.filter(a => a.status === 'pending' || a.status === 'in_progress').length
  const teamMembers = stakeholders.length

  // High priority actions
  const urgentActions = actions
    .filter(a => a.priority === 'high' && a.status !== 'completed')
    .slice(0, 5)

  // Recent documents
  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Investment */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.metrics.totalInvestment')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(totalInvestment)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-chakana-gold/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-chakana-gold-dark" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.metrics.activeProjects')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {activeProjects} / {projects.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-chakana-earth/20 flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-chakana-earth" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.metrics.pendingActions')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {pendingActions}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-chakana-terracotta/20 flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-chakana-terracotta" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.metrics.teamMembers')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {teamMembers}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-chakana-sky/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-chakana-sky" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-chakana-earth" />
              {t('dashboard.projectProgress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="font-medium">{project.name}</span>
                    </div>
                    <Badge variant={project.status === 'in_progress' ? 'success' : 'warning'}>
                      {t(`projects.status.${project.status === 'in_progress' ? 'inProgress' : project.status}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${project.progress}%`,
                          backgroundColor: project.color,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Urgent Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-chakana-terracotta" />
              {t('dashboard.upcomingActions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentActions.map((action) => (
                <div
                  key={action.id}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{action.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDateShort(action.deadline, i18n.language)}
                        </span>
                      </div>
                    </div>
                    <Badge variant="danger" className="shrink-0">
                      {t('actions.priority.high')}
                    </Badge>
                  </div>
                </div>
              ))}
              {urgentActions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay acciones urgentes
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          <CardDescription>
            {t('documents.filters.recent')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-lg border border-border hover:border-chakana-earth/50 hover:bg-muted/50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chakana-earth/10 flex items-center justify-center shrink-0">
                    <span className="text-lg">📄</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateShort(doc.updatedAt, i18n.language)}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

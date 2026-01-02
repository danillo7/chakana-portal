import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useDataStore } from '../stores/dataStore'
import { formatCurrency, formatDateShort } from '../lib/utils'
import { Mountain, Home, Heart, Users, Calendar, DollarSign } from 'lucide-react'

const projectIcons: Record<string, React.ElementType> = {
  'chakana-la-experiencia': Mountain,
  'casa-chakana': Home,
  'fundacion-cooper': Heart,
}

export function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const { projects, stakeholders } = useDataStore()

  const getOwner = (ownerId: string) => stakeholders.find(s => s.id === ownerId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {t('projects.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('projects.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => {
          const Icon = projectIcons[project.id] || Mountain
          const owner = getOwner(project.owner)

          return (
            <Card key={project.id} className="overflow-hidden">
              <div
                className="h-2"
                style={{ backgroundColor: project.color }}
              />
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: project.color }} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge
                      variant={project.status === 'in_progress' ? 'success' : 'warning'}
                      className="mt-1"
                    >
                      {t(`projects.status.${project.status === 'in_progress' ? 'inProgress' : project.status}`)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.color,
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>{formatCurrency(project.budget || 0)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDateShort(project.startDate, i18n.language)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{owner?.name || 'TBD'}</span>
                  </div>
                </div>

                {/* Milestones Preview */}
                {project.milestones.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Próximos Milestones
                    </p>
                    <div className="space-y-1">
                      {project.milestones.slice(0, 2).map((milestone) => (
                        <div key={milestone.id} className="flex items-center gap-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-chakana-sage' : 'bg-muted'}`} />
                          <span className="truncate flex-1">{milestone.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

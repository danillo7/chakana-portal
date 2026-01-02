import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useDataStore } from '../stores/dataStore'
import { formatDateShort } from '../lib/utils'
import { Calendar, CheckCircle2, Circle, Flag } from 'lucide-react'

export function TimelinePage() {
  const { t, i18n } = useTranslation()
  const { projects } = useDataStore()

  // Collect all milestones from all projects
  const allMilestones = projects.flatMap(project =>
    project.milestones.map(m => ({
      ...m,
      projectId: project.id,
      projectName: project.name,
      projectColor: project.color,
    }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {t('timeline.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('timeline.subtitle')}
        </p>
      </div>

      {/* Timeline View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Roadmap 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-6">
              {allMilestones.map((milestone) => (
                <div key={`${milestone.projectId}-${milestone.id}`} className="relative pl-10">
                  {/* Timeline dot */}
                  <div
                    className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${milestone.projectColor}20` }}
                  >
                    {milestone.completed ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: milestone.projectColor }} />
                    ) : (
                      <Circle className="w-5 h-5" style={{ color: milestone.projectColor }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 rounded-lg border border-border hover:border-chakana-earth/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Flag className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{milestone.title}</span>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {milestone.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: milestone.projectColor,
                              color: milestone.projectColor
                            }}
                          >
                            {milestone.projectName}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDateShort(milestone.date, i18n.language)}
                          </span>
                        </div>
                      </div>
                      <Badge variant={milestone.completed ? 'success' : 'warning'}>
                        {milestone.completed ? 'Completado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Phases */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((phase) => (
          <Card key={phase} className={phase === 1 ? 'ring-2 ring-chakana-gold' : ''}>
            <CardContent className="pt-4 text-center">
              <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center text-lg font-bold ${
                phase === 1 ? 'bg-chakana-gold text-chakana-earth-dark' : 'bg-muted text-muted-foreground'
              }`}>
                {phase}
              </div>
              <p className="text-sm font-medium mt-2">
                {t(`timeline.phases.phase${phase}`).split(':')[1]?.trim() || `Fase ${phase}`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

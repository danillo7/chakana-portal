import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useDataStore } from '../stores/dataStore'
import { useUIStore, type LocationOption } from '../stores/uiStore'
import { formatCurrency, formatDateShort } from '../lib/utils'
import { useGreeting } from '../hooks/useGreeting'
import { useTimezone } from '../hooks/useTimezone'
import {
  ContextualHeader,
  WelcomeModal,
  MicroPause,
  useWelcomeModalTriggers,
  useActivityTimer,
} from '../features/wisdom-engine'
import { MultiCityWidget } from '../components/MultiCityWidget'
import {
  DollarSign,
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
  AlertCircle,
  Play,
  ArrowRight,
  Mountain,
  Globe,
  Instagram,
  MessageCircle,
  ExternalLink,
  CalendarDays,
  FileText,
  Sparkles,
} from 'lucide-react'

// Quick links to social
const quickLinks = [
  {
    name: 'Web Oficial',
    url: 'https://chakanalaexperiencia.es/',
    icon: Globe,
    color: '#4A7C59',
  },
  {
    name: 'Instagram Chakana',
    url: 'https://www.instagram.com/chakana_le/',
    icon: Instagram,
    color: '#E1306C',
  },
  {
    name: 'Instagram Iván',
    url: 'https://www.instagram.com/ivansilvam_/',
    icon: Instagram,
    color: '#833AB4',
  },
  {
    name: 'WhatsApp',
    url: 'https://www.whatsapp.com/channel/0029Vb6z0Wc6RGJDZ8DjT52a',
    icon: MessageCircle,
    color: '#25D366',
  },
]

// Next retreat info
const nextRetreat = {
  name: 'Retiro Chakana Nivel 1',
  dates: '23-25 Enero 2026',
  location: 'Casas Bajas, Valencia',
  price: '€600',
  earlyBird: '€497',
  spotsLeft: 8,
}

export function Dashboard() {
  const { t, i18n } = useTranslation()
  const { projects, actions, stakeholders, documents } = useDataStore()

  // Use IP-detected timezone for accurate greeting based on user's real location
  const { timezoneInfo } = useTimezone()

  // Create effective location for greeting: prioritize IP-detected timezone
  const selectedLocation = useUIStore(state => state.getSelectedLocation())
  const effectiveLocation: LocationOption = timezoneInfo
    ? {
        id: 'detected',
        city: timezoneInfo.city,
        country: timezoneInfo.country,
        timezone: timezoneInfo.timezone,
        flag: timezoneInfo.flag,
        coords: `${timezoneInfo.city},${timezoneInfo.country}`
      }
    : selectedLocation

  // Use IP-detected timezone for greeting (accurate "Bom dia/Boa tarde/Boa noite")
  const { greeting, emoji, dateString, dayOfWeek } = useGreeting(i18n.language, effectiveLocation)

  // Wisdom Engine - Welcome Modal triggers (auto-detects when to show)
  useWelcomeModalTriggers()

  // Wisdom Engine - Activity timer for micro-pauses
  useActivityTimer()

  // Calculate metrics
  const totalInvestment = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  const pendingActions = actions.filter(a => a.status === 'pending' || a.status === 'in_progress').length
  const teamMembers = stakeholders.length

  // High priority actions
  const urgentActions = actions
    .filter(a => a.priority === 'high' && a.status !== 'completed')
    .slice(0, 4)

  // Recent documents
  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ═══════════════════════════════════════════════════════════════════════
          🌟 PREMIUM HERO SECTION - 100x BETTER DESIGN
          Bento Grid Layout with Glass-morphism Effects
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative">
        {/* Ambient background glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-chakana-sage/10 via-chakana-mint/15 to-chakana-sage/10 rounded-[2rem] blur-2xl opacity-60" />

        <div className="relative">
          {/* ─────────────────────────────────────────────────────────────────────
              MAIN HERO CARD - Greeting & Branding (full width)
          ───────────────────────────────────────────────────────────────────── */}
          <div className="relative overflow-hidden rounded-3xl bg-chakana-dark p-8 md:p-10">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-radial-sage opacity-30" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-chakana-sage/15 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-chakana-mint/15 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3" />
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-chakana-gold/10 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2" />

            {/* Subtle grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}
            />

            <div className="relative z-10 flex flex-col h-full">
              {/* Top Bar - Date & Day */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                    <CalendarDays className="w-4 h-4 text-chakana-mint" />
                    <span className="text-sm font-medium text-white/80 capitalize">{dayOfWeek}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-sm text-white/60">{dateString}</span>
                  </div>
                </div>

                {/* Quick Social Links */}
                <div className="hidden md:flex items-center gap-2">
                  {quickLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        title={link.name}
                      >
                        <Icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Main Content - Greeting */}
              <div className="flex-1 flex flex-col justify-center">
                {/* Logo & Premium Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-chakana-sage to-chakana-mint rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20">
                      <img
                        src={`${import.meta.env.BASE_URL}logo-chakana.jpg`}
                        alt="Chakana"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className="w-fit badge-sage shadow-lg">
                      <Sparkles className="w-3 h-3 mr-1.5" />
                      Portal Premium
                    </Badge>
                    <span className="text-xs text-white/40 font-medium tracking-wider uppercase">Strategic Intelligence Platform</span>
                  </div>
                </div>

                {/* Greeting Text */}
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                    {greeting}
                    <span className="inline-block ml-3 animate-pulse">{emoji}</span>
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-display font-bold">
                    <span className="text-gradient-sage">Portal Chakana</span>
                  </h2>
                  <p className="text-lg text-white/50 max-w-lg mt-2">
                    {t('dashboard.subtitle')}
                  </p>

                  {/* Wisdom Engine - Contextual Reflection Quotes */}
                  <div className="mt-6 max-w-2xl">
                    <ContextualHeader />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Stats Preview */}
              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/60">
                  <FolderKanban className="w-4 h-4 text-chakana-sage" />
                  <span className="text-sm">{projects.length} proyectos</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <CheckSquare className="w-4 h-4 text-chakana-gold" />
                  <span className="text-sm">{pendingActions} acciones</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="w-4 h-4 text-chakana-mint" />
                  <span className="text-sm">{teamMembers} miembros</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Investment */}
        <div className="metric-card group hover:border-chakana-gold/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-chakana-gold/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-7 h-7 text-chakana-gold" />
            </div>
            <Badge className="badge-gold">EUR</Badge>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {t('dashboard.metrics.totalInvestment')}
          </p>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(totalInvestment)}
          </p>
        </div>

        {/* Active Projects */}
        <div className="metric-card group hover:border-chakana-sage/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-chakana-sage/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FolderKanban className="w-7 h-7 text-chakana-sage" />
            </div>
            <Badge className="badge-sage">{activeProjects} {t('projects.status.inProgress').toLowerCase()}</Badge>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {t('dashboard.metrics.activeProjects')}
          </p>
          <p className="text-3xl font-bold text-foreground">
            {projects.length}
          </p>
        </div>

        {/* Pending Actions */}
        <div className="metric-card group hover:border-chakana-amber/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-chakana-amber/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CheckSquare className="w-7 h-7 text-chakana-amber" />
            </div>
            <Badge className="badge-warning">{t('actions.status.pending')}</Badge>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {t('dashboard.metrics.pendingActions')}
          </p>
          <p className="text-3xl font-bold text-foreground">
            {pendingActions}
          </p>
        </div>

        {/* Team Members */}
        <div className="metric-card group hover:border-chakana-azure/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-chakana-azure/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-chakana-azure" />
            </div>
            <Badge className="badge-info">{t('nav.stakeholders')}</Badge>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {t('dashboard.metrics.teamMembers')}
          </p>
          <p className="text-3xl font-bold text-foreground">
            {teamMembers}
          </p>
        </div>
      </div>

      {/* Multi-City World Clock Widget */}
      <MultiCityWidget />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress */}
        <Card className="lg:col-span-2 chakana-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-chakana-sage/15 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-chakana-sage" />
                </div>
                {t('dashboard.projectProgress')}
              </CardTitle>
              <Link
                to="/projects"
                className="text-sm text-chakana-sage hover:text-chakana-sage-dark flex items-center gap-1 transition-colors"
              >
                {t('common.view')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {projects.map((project) => (
                <div key={project.id} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="font-semibold text-foreground group-hover:text-chakana-sage transition-colors">
                        {project.name}
                      </span>
                    </div>
                    <Badge variant={project.status === 'in_progress' ? 'success' : 'warning'}>
                      {t(`projects.status.${project.status === 'in_progress' ? 'inProgress' : project.status}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${project.progress}%`,
                          background: `linear-gradient(90deg, ${project.color}aa, ${project.color})`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground w-14 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Retreat CTA */}
        <Card className="chakana-card-premium">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-chakana-sage/15 flex items-center justify-center">
                <Mountain className="w-5 h-5 text-chakana-sage" />
              </div>
              {t('dashboard.nextRetreat', { defaultValue: 'Próximo Retiro' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-foreground mb-1">{nextRetreat.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CalendarDays className="w-4 h-4" />
                {nextRetreat.dates}
              </div>
              <p className="text-sm text-muted-foreground">{nextRetreat.location}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-chakana-sage">{nextRetreat.earlyBird}</span>
              <span className="text-sm text-muted-foreground line-through">{nextRetreat.price}</span>
              <Badge className="badge-success ml-2">Early Bird</Badge>
            </div>

            <div className="p-3 rounded-xl bg-chakana-sage/10 border border-chakana-sage/20">
              <p className="text-sm text-center">
                <span className="font-bold text-chakana-sage">{nextRetreat.spotsLeft} {t('dashboard.spots', { defaultValue: 'plazas' })}</span>
                <span className="text-muted-foreground"> {t('dashboard.available', { defaultValue: 'disponibles' })}</span>
              </p>
            </div>

            <a
              href="https://chakanalaexperiencia.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('common.view')}
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Actions */}
        <Card className="chakana-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-chakana-rose/15 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-chakana-rose" />
                </div>
                {t('dashboard.upcomingActions')}
              </CardTitle>
              <Link
                to="/actions"
                className="text-sm text-chakana-sage hover:text-chakana-sage-dark flex items-center gap-1 transition-colors"
              >
                {t('common.view')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentActions.map((action) => (
                <div
                  key={action.id}
                  className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 border border-transparent hover:border-chakana-sage/20 group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground group-hover:text-chakana-sage transition-colors truncate">
                        {action.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
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
                <div className="text-center py-8">
                  <CheckSquare className="w-12 h-12 text-chakana-emerald/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">{t('dashboard.noUrgentActions', { defaultValue: 'No hay acciones urgentes' })}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials CTA */}
        <Card className="chakana-card overflow-hidden">
          <div className="relative h-full min-h-[300px] flex flex-col">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-chakana-dark via-chakana-dark-light to-chakana-dark" />
            <div className="absolute inset-0 bg-gradient-radial-sage opacity-30" />

            <CardContent className="relative z-10 flex-1 flex flex-col justify-center p-8">
              <Badge className="badge-sage w-fit mb-4">
                <Play className="w-3 h-3 mr-1" />
                {t('common.new')}
              </Badge>

              <h3 className="text-2xl font-bold text-white mb-3">
                {t('testimonials.title')}{' '}
                <span className="text-chakana-mint">{t('testimonials.subtitle')}</span>
              </h3>

              <p className="text-white/70 mb-6">
                {t('testimonials.cta.description')}
              </p>

              <Link to="/testimonials" className="btn-premium w-fit">
                <Play className="w-4 h-4 mr-2" />
                {t('common.view')} {t('nav.testimonials')}
              </Link>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card className="chakana-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-chakana-sage/15 flex items-center justify-center">
                <FileText className="w-5 h-5 text-chakana-sage" />
              </div>
              <div>
                <CardTitle className="text-xl">{t('dashboard.recentActivity')}</CardTitle>
                <CardDescription className="mt-1">
                  {t('documents.filters.recent')}
                </CardDescription>
              </div>
            </div>
            <Link
              to="/documents"
              className="text-sm text-chakana-sage hover:text-chakana-sage-dark flex items-center gap-1 transition-colors"
            >
              {t('common.view')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentDocs.map((doc) => (
              <Link
                key={doc.id}
                to={`/documents/${doc.slug}`}
                className="p-5 rounded-2xl border border-border/50 hover:border-chakana-sage/30 hover:shadow-sage-glow transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-chakana-sage/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground group-hover:text-chakana-sage transition-colors truncate">
                      {doc.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDateShort(doc.updatedAt, i18n.language)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {doc.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════════
          🧠 WISDOM ENGINE COMPONENTS
      ═══════════════════════════════════════════════════════════════════════ */}
      {/* Welcome Modal - Shows on first visit or after inactivity */}
      <WelcomeModal />

      {/* Micro-Pause - Appears after 20+ minutes of activity */}
      <MicroPause />
    </div>
  )
}

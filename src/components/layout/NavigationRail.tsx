import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  CheckSquare,
  Users,
  Calendar,
  DollarSign,
  Settings,
  Sparkles,
  Play,
} from 'lucide-react'

interface NavItem {
  icon: React.ElementType
  label: string
  path: string
  translationKey: string
  isNew?: boolean
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', translationKey: 'nav.dashboard' },
  { icon: Play, label: 'Testimonials', path: '/testimonials', translationKey: 'nav.testimonials', isNew: true },
  { icon: FileText, label: 'Documents', path: '/documents', translationKey: 'nav.documents' },
  { icon: FolderKanban, label: 'Projects', path: '/projects', translationKey: 'nav.projects' },
  { icon: CheckSquare, label: 'Actions', path: '/actions', translationKey: 'nav.actions' },
  { icon: Users, label: 'Team', path: '/team', translationKey: 'nav.stakeholders' },
  { icon: Calendar, label: 'Timeline', path: '/timeline', translationKey: 'nav.timeline' },
  { icon: DollarSign, label: 'Financial', path: '/financial', translationKey: 'nav.financial' },
]

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: 'Settings', path: '/settings', translationKey: 'nav.settings' },
]

export function NavigationRail() {
  const location = useLocation()
  const { t } = useTranslation()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="nav-rail">
      {/* Premium Logo */}
      <Link
        to="/"
        className="w-14 h-14 rounded-2xl bg-chakana-gold flex items-center justify-center mb-8 shadow-gold-glow hover:scale-105 transition-transform duration-300"
      >
        <Sparkles className="w-7 h-7 text-chakana-navy" />
      </Link>

      {/* Main Navigation */}
      <div className="flex-1 flex flex-col gap-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn('nav-rail-item group relative', active && 'active')}
              title={t(item.translationKey)}
            >
              <Icon className="w-5 h-5" />

              {/* New Badge */}
              {item.isNew && !active && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-chakana-gold animate-pulse-gold" />
              )}

              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-3 py-2 bg-chakana-navy text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-navy-glow pointer-events-none translate-x-2 group-hover:translate-x-0">
                {t(item.translationKey)}
                {item.isNew && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-chakana-gold text-chakana-navy rounded-md font-bold">
                    NUEVO
                  </span>
                )}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-white/10 my-4" />

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn('nav-rail-item group relative', active && 'active')}
              title={t(item.translationKey)}
            >
              <Icon className="w-5 h-5" />

              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-3 py-2 bg-chakana-navy text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-navy-glow pointer-events-none translate-x-2 group-hover:translate-x-0">
                {t(item.translationKey)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

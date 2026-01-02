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
  Mountain,
} from 'lucide-react'

interface NavItem {
  icon: React.ElementType
  label: string
  path: string
  translationKey: string
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', translationKey: 'nav.dashboard' },
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
      {/* Logo */}
      <Link
        to="/"
        className="w-12 h-12 rounded-xl bg-chakana-gold flex items-center justify-center mb-6"
      >
        <Mountain className="w-6 h-6 text-chakana-earth-dark" />
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

              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-chakana-earth-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {t(item.translationKey)}
              </span>
            </Link>
          )
        })}
      </div>

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
              <span className="absolute left-full ml-2 px-2 py-1 bg-chakana-earth-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {t(item.translationKey)}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

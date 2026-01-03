import { useState, useEffect } from 'react'
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
  Play,
  Target,
  TrendingUp,
  Search,
  Newspaper,
  ChevronDown,
  Briefcase,
  Menu,
  X,
} from 'lucide-react'

interface NavItem {
  icon: React.ElementType
  label: string
  path: string
  translationKey: string
  isNew?: boolean
}

interface NavGroup {
  id: string
  icon: React.ElementType
  label: string
  translationKey: string
  items: NavItem[]
  isNew?: boolean
}

// Grouped navigation structure
const navGroups: NavGroup[] = [
  {
    id: 'strategy',
    icon: Target,
    label: 'Strategy',
    translationKey: 'nav.strategy',
    isNew: true,
    items: [
      { icon: Briefcase, label: 'Business Plan', path: '/strategy/business-plan', translationKey: 'nav.businessPlan' },
      { icon: Target, label: 'SWOT Analysis', path: '/strategy/swot', translationKey: 'nav.swot' },
    ],
  },
  {
    id: 'intelligence',
    icon: Search,
    label: 'Intelligence',
    translationKey: 'nav.intelligence',
    isNew: true,
    items: [
      { icon: TrendingUp, label: 'Market', path: '/intelligence/market', translationKey: 'nav.market' },
      { icon: Newspaper, label: 'News', path: '/intelligence/news', translationKey: 'nav.news' },
    ],
  },
  {
    id: 'operations',
    icon: FolderKanban,
    label: 'Operations',
    translationKey: 'nav.operations',
    items: [
      { icon: FolderKanban, label: 'Projects', path: '/projects', translationKey: 'nav.projects' },
      { icon: CheckSquare, label: 'Actions', path: '/actions', translationKey: 'nav.actions' },
      { icon: Calendar, label: 'Timeline', path: '/timeline', translationKey: 'nav.timeline' },
      { icon: DollarSign, label: 'Financial', path: '/financial', translationKey: 'nav.financial' },
    ],
  },
  {
    id: 'people',
    icon: Users,
    label: 'People',
    translationKey: 'nav.people',
    items: [
      { icon: Users, label: 'Team', path: '/team', translationKey: 'nav.stakeholders' },
      { icon: Play, label: 'Testimonials', path: '/testimonials', translationKey: 'nav.testimonials', isNew: true },
    ],
  },
]

// Standalone items (not in groups)
const standaloneItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', translationKey: 'nav.dashboard' },
  { icon: FileText, label: 'Documents', path: '/documents', translationKey: 'nav.documents' },
]

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: 'Settings', path: '/settings', translationKey: 'nav.settings' },
]

export function NavigationRail() {
  const location = useLocation()
  const { t } = useTranslation()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['strategy', 'intelligence', 'operations', 'people'])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Auto-expand group containing active route
  useEffect(() => {
    navGroups.forEach(group => {
      const hasActiveItem = group.items.some(item => {
        if (item.path === '/') return location.pathname === '/'
        return location.pathname.startsWith(item.path)
      })
      if (hasActiveItem && !expandedGroups.includes(group.id)) {
        setExpandedGroups(prev => [...prev, group.id])
      }
    })
  }, [location.pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const isGroupActive = (group: NavGroup) => {
    return group.items.some(item => isActive(item.path))
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-3 px-4 py-3 mb-4"
      >
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sage-glow ring-2 ring-chakana-sage/20">
          <img
            src={`${import.meta.env.BASE_URL}logo-chakana.jpg`}
            alt="Chakana La Experiencia"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-display font-bold text-sm">Chakana</span>
          <span className="text-white/50 text-[10px]">Portal Estratégico</span>
        </div>
      </Link>

      {/* Standalone Items (Dashboard, Documents) */}
      <div className="px-2 mb-2">
        {standaloneItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200',
                active
                  ? 'bg-chakana-sage/20 text-chakana-sage'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{t(item.translationKey)}</span>
            </Link>
          )
        })}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/10 my-3" />

      {/* Grouped Navigation */}
      <div className="flex-1 px-2 overflow-y-auto">
        {navGroups.map((group) => {
          const GroupIcon = group.icon
          const isExpanded = expandedGroups.includes(group.id)
          const groupActive = isGroupActive(group)

          return (
            <div key={group.id} className="mb-2">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200',
                  groupActive
                    ? 'bg-chakana-sage/10 text-chakana-sage'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <GroupIcon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{t(group.translationKey)}</span>
                  {group.isNew && (
                    <span className="px-1.5 py-0.5 text-[9px] bg-chakana-sage text-white rounded-md font-bold uppercase">
                      NEW
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    isExpanded ? 'rotate-180' : ''
                  )}
                />
              </button>

              {/* Group Items */}
              <div className={cn(
                'overflow-hidden transition-all duration-300',
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}>
                <div className="pl-4 mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.path)

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                          active
                            ? 'bg-chakana-sage/20 text-chakana-sage'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{t(item.translationKey)}</span>
                        {item.isNew && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-chakana-sage text-white rounded-md font-bold uppercase ml-auto">
                            NEW
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/10 my-3" />

      {/* Bottom Navigation */}
      <div className="px-2 pb-4">
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                active
                  ? 'bg-chakana-sage/20 text-chakana-sage'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{t(item.translationKey)}</span>
            </Link>
          )
        })}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-chakana-dark/90 backdrop-blur-xl border border-white/10 text-white"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col w-64 h-screen bg-chakana-dark/95 backdrop-blur-xl border-r border-white/10 fixed left-0 top-0 z-40">
        <NavContent />
      </nav>

      {/* Mobile Sidebar */}
      <nav className={cn(
        'lg:hidden flex flex-col w-72 h-screen bg-chakana-dark/95 backdrop-blur-xl border-r border-white/10 fixed left-0 top-0 z-50 transition-transform duration-300',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <NavContent />
      </nav>

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  )
}

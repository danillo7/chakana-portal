import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { languages } from '../../lib/i18n'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/button'
import {
  Search,
  Sun,
  Moon,
  Globe,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const routeTitles: Record<string, string> = {
  '/': 'dashboard',
  '/documents': 'documents',
  '/projects': 'projects',
  '/actions': 'actions',
  '/team': 'stakeholders',
  '/timeline': 'timeline',
  '/financial': 'financial',
  '/settings': 'settings',
}

export function Header() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { theme, setTheme, searchOpen, setSearchOpen } = useUIStore()
  const { user, logout } = useAuthStore()

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

  const breadcrumb = routeTitles[location.pathname] || 'dashboard'

  const cycleLanguage = () => {
    const currentIndex = languages.findIndex(l => l.code === i18n.language)
    const nextIndex = (currentIndex + 1) % languages.length
    i18n.changeLanguage(languages[nextIndex].code)
  }

  const toggleTheme = () => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Chakana Portal</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground">
          {t(`nav.${breadcrumb}`)}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(!searchOpen)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={cycleLanguage}
          className="text-muted-foreground hover:text-foreground gap-1"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs">{currentLang.flag}</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* User Menu */}
        {user && (
          <div className="flex items-center gap-3 ml-2 pl-2 border-l border-border">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <div className={cn(
              "w-9 h-9 rounded-full bg-chakana-earth flex items-center justify-center text-white text-sm font-medium"
            )}>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

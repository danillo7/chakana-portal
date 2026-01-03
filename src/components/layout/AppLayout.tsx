import { Outlet } from 'react-router-dom'
import { NavigationRail } from './NavigationRail'
import { Header } from './Header'
import { AudioPlayer } from '../ui/AudioPlayer'
import { StatusPanel } from './StatusPanel'
import { useUIStore } from '../../stores/uiStore'
import { useEffect, useState } from 'react'
import { PanelRightOpen, PanelRightClose } from 'lucide-react'
import { Button } from '../ui/button'

export function AppLayout() {
  const { theme } = useUIStore()
  const [showStatusPanel, setShowStatusPanel] = useState(true)

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  // Keyboard shortcut: Cmd/Ctrl + ] to toggle status panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ']') {
        e.preventDefault()
        setShowStatusPanel(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-background flex">
      {/* Navigation Sidebar */}
      <NavigationRail />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Status Panel - Weather & Clocks (Right Sidebar) */}
      <div className="hidden xl:block relative">
        {showStatusPanel && <StatusPanel />}

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowStatusPanel(!showStatusPanel)}
          className="absolute top-4 -left-10 z-10 text-muted-foreground hover:text-chakana-sage"
          title={showStatusPanel ? 'Hide panel (⌘])' : 'Show panel (⌘])'}
        >
          {showStatusPanel ? (
            <PanelRightClose className="w-5 h-5" />
          ) : (
            <PanelRightOpen className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Premium Audio Player - Chakana Ambient Music */}
      <AudioPlayer />
    </div>
  )
}

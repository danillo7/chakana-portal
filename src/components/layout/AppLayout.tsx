import { Outlet } from 'react-router-dom'
import { NavigationRail } from './NavigationRail'
import { Header } from './Header'
import { useUIStore } from '../../stores/uiStore'
import { useEffect } from 'react'

export function AppLayout() {
  const { theme } = useUIStore()

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Rail */}
      <NavigationRail />

      {/* Main Content Area */}
      <div className="pl-[72px]">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

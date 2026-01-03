// 📊 StatusPanel - Chakana Portal Design System
// Right sidebar with weather, world clocks, and system info

import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Activity } from 'lucide-react'
import { WeatherWidget } from '../weather/WeatherWidget'
import { WorldClock } from '../weather/WorldClock'

export function StatusPanel() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Update date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Format date in Spanish (Chakana's primary language)
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentDate)

  // Get greeting based on time of day
  const hour = currentDate.getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="h-full w-80 bg-gradient-to-b from-chakana-mint-50 to-background dark:from-chakana-dark dark:to-background border-l border-border/40 overflow-y-auto custom-scrollbar">
      <div className="p-6 space-y-6">
        {/* Header: Date & Greeting */}
        <div className="space-y-3">
          {/* Chakana Symbol + Greeting */}
          <div className="relative overflow-hidden rounded-2xl p-6 glass-sage border border-chakana-sage/30 shadow-sage-glow">
            {/* Andean pattern overlay */}
            <div className="absolute inset-0 opacity-5 bg-mesh-chakana" />

            <div className="relative z-10">
              <div className="text-2xl font-bold text-chakana-dark dark:text-chakana-mint mb-1 animate-fade-in">
                {greeting}
              </div>
              <div className="text-sm text-muted-foreground capitalize animate-fade-in-up">
                {formattedDate}
              </div>
            </div>

            {/* Calendar icon */}
            <div className="absolute -bottom-4 -right-4 text-chakana-sage/10 animate-breathe">
              <Calendar className="w-32 h-32" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-sage" />

        {/* Weather Widget */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-chakana-dark dark:text-chakana-mint flex items-center gap-2">
            <Activity className="w-4 h-4 text-chakana-sage" />
            Weather Forecast
          </h3>
          <WeatherWidget />
        </div>

        {/* Divider */}
        <div className="divider-sage" />

        {/* World Clocks */}
        <div className="space-y-2">
          <WorldClock />
        </div>

        {/* Divider */}
        <div className="divider-sage" />

        {/* Quick Stats - Chakana Inspired */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-chakana-dark dark:text-chakana-mint flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-chakana-sage" />
            Portal Status
          </h3>

          <div className="stats-grid grid-cols-2">
            <div className="stat-item">
              <div className="stat-value">24</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">89</div>
              <div className="stat-label">Documents</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">12</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">5</div>
              <div className="stat-label">Team</div>
            </div>
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-20" />
      </div>
    </div>
  )
}

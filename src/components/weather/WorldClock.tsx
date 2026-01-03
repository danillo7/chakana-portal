// ⏰ WorldClock - Chakana Portal Design System
// Multi-timezone clock with Andean inspiration

import { useState, useEffect } from 'react'
import { Globe, Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'

interface TimeZoneLocation {
  id: string
  city: string
  country: string
  timezone: string
  flag: string
}

const DEFAULT_TIMEZONES: TimeZoneLocation[] = [
  { id: 'madrid', city: 'Madrid', country: 'España', timezone: 'Europe/Madrid', flag: '🇪🇸' }
]

const POPULAR_TIMEZONES: TimeZoneLocation[] = [
  { id: 'barcelona', city: 'Barcelona', country: 'España', timezone: 'Europe/Madrid', flag: '🇪🇸' },
  { id: 'bogota', city: 'Bogotá', country: 'Colombia', timezone: 'America/Bogota', flag: '🇨🇴' },
  { id: 'lima', city: 'Lima', country: 'Perú', timezone: 'America/Lima', flag: '🇵🇪' },
  { id: 'quito', city: 'Quito', country: 'Ecuador', timezone: 'America/Guayaquil', flag: '🇪🇨' },
  { id: 'santiago', city: 'Santiago', country: 'Chile', timezone: 'America/Santiago', flag: '🇨🇱' },
  { id: 'buenosaires', city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷' },
  { id: 'lapaz', city: 'La Paz', country: 'Bolivia', timezone: 'America/La_Paz', flag: '🇧🇴' },
  { id: 'nyc', city: 'New York', country: 'USA', timezone: 'America/New_York', flag: '🇺🇸' },
  { id: 'london', city: 'London', country: 'UK', timezone: 'Europe/London', flag: '🇬🇧' },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
]

// Format time for a specific timezone
function formatTime(timezone: string, format: 'short' | 'full' = 'short'): string {
  const now = new Date()

  if (format === 'short') {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    }).format(now)
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  }).format(now)
}

// Get time difference from local timezone
function getTimeDifference(timezone: string): string {
  const now = new Date()
  const localOffset = -now.getTimezoneOffset() / 60

  // Get offset for target timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short'
  })

  const parts = formatter.formatToParts(now)
  const tzPart = parts.find(part => part.type === 'timeZoneName')

  if (!tzPart) return ''

  // Parse offset from timezone name (e.g., "GMT+1")
  const match = tzPart.value.match(/GMT([+-]\d+)/)
  if (!match) return ''

  const targetOffset = parseInt(match[1])
  const diff = targetOffset - localOffset

  if (diff === 0) return 'Local time'
  if (diff > 0) return `+${diff}h`
  return `${diff}h`
}

// Get day difference (e.g., "Tomorrow", "Yesterday")
function getDayDifference(timezone: string): string | null {
  const now = new Date()
  const localDay = now.getDate()

  const targetFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    day: 'numeric'
  })

  const targetDay = parseInt(targetFormatter.format(now))

  if (targetDay === localDay + 1) return 'Tomorrow'
  if (targetDay === localDay - 1) return 'Yesterday'
  if (targetDay !== localDay) return 'Different day'

  return null
}

export function WorldClock() {
  const [timezones, setTimezones] = useState<TimeZoneLocation[]>(() => {
    const saved = localStorage.getItem('chakana-world-clocks')
    return saved ? JSON.parse(saved) : DEFAULT_TIMEZONES
  })

  const [, setCurrentTime] = useState(new Date())
  const [isAddingClock, setIsAddingClock] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Auto-detect local timezone
  const [localTimezone] = useState(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const city = tz.split('/').pop()?.replace(/_/g, ' ') || 'Local'

    return {
      id: 'local',
      city,
      country: 'Your Location',
      timezone: tz,
      flag: '📍'
    }
  })

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Save timezones to localStorage
  useEffect(() => {
    localStorage.setItem('chakana-world-clocks', JSON.stringify(timezones))
  }, [timezones])

  const addTimezone = (tz: TimeZoneLocation) => {
    if (timezones.length >= 3) return
    if (timezones.find(t => t.id === tz.id)) return

    setTimezones([...timezones, tz])
    setIsAddingClock(false)
  }

  const removeTimezone = (id: string) => {
    setTimezones(timezones.filter(t => t.id !== id))
  }

  // Show max 3 clocks when collapsed
  const displayTimezones = expanded ? [localTimezone, ...timezones] : [localTimezone, ...timezones.slice(0, 2)]

  return (
    <div className="space-y-3">
      {/* Clock Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-chakana-dark dark:text-chakana-mint">
          <Globe className="w-4 h-4 text-chakana-sage" />
          <span>World Clocks</span>
        </div>

        {timezones.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-chakana-sage transition-colors flex items-center gap-1"
          >
            {expanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>Show all ({timezones.length + 1})</span>
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Clock Cards */}
      <div className="space-y-2">
        {displayTimezones.map((tz) => {
          const time = formatTime(tz.timezone, 'short')
          const diff = tz.id === 'local' ? null : getTimeDifference(tz.timezone)
          const dayDiff = tz.id === 'local' ? null : getDayDifference(tz.timezone)

          return (
            <div
              key={tz.id}
              className={cn(
                "group relative p-3 rounded-xl",
                tz.id === 'local'
                  ? "glass-mint border border-chakana-mint-dark/30 shadow-mint-glow"
                  : "glass-sage border border-chakana-sage/20 hover:border-chakana-sage/40",
                "transition-all duration-300 animate-fade-in"
              )}
            >
              {/* Remove button (only for added clocks) */}
              {tz.id !== 'local' && (
                <button
                  onClick={() => removeTimezone(tz.id)}
                  className={cn(
                    "absolute top-2 right-2 opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-200",
                    "w-5 h-5 rounded-full bg-chakana-rose/20 hover:bg-chakana-rose/30",
                    "flex items-center justify-center text-chakana-rose"
                  )}
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              <div className="flex items-center justify-between">
                {/* Location Info */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tz.flag}</span>
                  <div>
                    <div className="text-sm font-medium text-chakana-dark dark:text-chakana-mint">
                      {tz.city}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      {tz.id === 'local' ? (
                        <span>Local time</span>
                      ) : (
                        <>
                          <span>{diff}</span>
                          {dayDiff && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-chakana-sage/40" />
                              <span className="text-chakana-sage">{dayDiff}</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Time Display */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-chakana-sage font-mono">
                    {time}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Clock Section */}
      {timezones.length < 3 && (
        <div>
          {!isAddingClock ? (
            <button
              onClick={() => setIsAddingClock(true)}
              className={cn(
                "w-full p-3 rounded-xl border-2 border-dashed border-chakana-sage/30",
                "hover:border-chakana-sage/50 hover:bg-chakana-mint/20",
                "transition-all duration-300 text-chakana-sage",
                "flex items-center justify-center gap-2 text-sm"
              )}
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Clock</span>
            </button>
          ) : (
            <div className="glass-mint rounded-xl p-3 border border-chakana-mint-dark/20 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-chakana-dark dark:text-chakana-mint text-sm">
                  Add Timezone
                </h4>
                <button
                  onClick={() => setIsAddingClock(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1">
                {POPULAR_TIMEZONES.filter(tz => !timezones.find(t => t.id === tz.id)).map(tz => (
                  <button
                    key={tz.id}
                    onClick={() => addTimezone(tz)}
                    className={cn(
                      "w-full p-2 rounded-lg text-left",
                      "hover:bg-chakana-sage/10 transition-colors",
                      "flex items-center justify-between"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{tz.flag}</span>
                      <div>
                        <div className="text-sm font-medium">{tz.city}</div>
                        <div className="text-xs text-muted-foreground">{tz.country}</div>
                      </div>
                    </div>
                    <div className="text-xs text-chakana-sage font-mono">
                      {formatTime(tz.timezone)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

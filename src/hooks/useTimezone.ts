import { useState, useEffect, useCallback } from 'react'
import { useUIStore, LOCATIONS, type LocationOption, type TimezoneInfo } from '../stores/uiStore'

interface LiveClock {
  time: string
  date: string
  dayOfWeek: string
  emoji: string
  periodKey: 'sunrise' | 'morning' | 'afternoon' | 'sunset' | 'night'
}

// Period emojis mapping
const periodEmojis: Record<string, string> = {
  sunrise: '🌅',   // 6-8
  morning: '☀️',   // 8-12
  afternoon: '🌤️', // 12-18
  sunset: '🌆',    // 18-20
  night: '🌙',     // 20-6
}

function getPeriodKey(hour: number): LiveClock['periodKey'] {
  if (hour >= 6 && hour < 8) return 'sunrise'
  if (hour >= 8 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 20) return 'sunset'
  return 'night'
}

// Detect timezone from IP with timeout
async function detectTimezoneFromIP(timeoutMs: number = 5000): Promise<TimezoneInfo | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    })

    clearTimeout(timeoutId)

    if (!response.ok) return null

    const data = await response.json()

    if (data.timezone) {
      return {
        timezone: data.timezone,
        city: data.city || 'Unknown',
        country: data.country_code || '',
        offset: data.utc_offset || '',
        abbreviation: data.timezone.split('/').pop() || '',
        flag: getCountryFlag(data.country_code),
        detectedFrom: 'ip'
      }
    }
    return null
  } catch {
    clearTimeout(timeoutId)
    return null
  }
}

// Fallback to browser timezone detection
function detectTimezoneFromBrowser(): TimezoneInfo {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const parts = timezone.split('/')
  const city = parts[parts.length - 1].replace(/_/g, ' ')

  // Try to match with known locations
  const knownLocation = LOCATIONS.find(l => l.timezone === timezone)

  return {
    timezone,
    city: knownLocation?.city || city,
    country: knownLocation?.country || '',
    offset: getTimezoneOffset(timezone),
    abbreviation: getTimezoneAbbreviation(timezone),
    flag: knownLocation?.flag || '🌍',
    detectedFrom: 'browser'
  }
}

// Get timezone offset string (e.g., "+01:00")
function getTimezoneOffset(timezone: string): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset'
  })
  const parts = formatter.formatToParts(now)
  const tzPart = parts.find(p => p.type === 'timeZoneName')
  return tzPart?.value || ''
}

// Get timezone abbreviation
function getTimezoneAbbreviation(timezone: string): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short'
  })
  const parts = formatter.formatToParts(now)
  const tzPart = parts.find(p => p.type === 'timeZoneName')
  return tzPart?.value || ''
}

// Get country flag emoji from country code
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍'

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))

  return String.fromCodePoint(...codePoints)
}

// Main hook for timezone management
export function useTimezone() {
  const {
    timezonePreferences,
    setTimezonePreferences,
    setSelectedLocation,
    getSelectedLocation
  } = useUIStore()

  const [isLoading, setIsLoading] = useState(false)
  const [timezoneInfo, setTimezoneInfo] = useState<TimezoneInfo | null>(null)

  // Initialize timezone on mount
  useEffect(() => {
    const initTimezone = async () => {
      // If user has manually selected a location, use that
      if (timezonePreferences?.isManuallySet) {
        const location = getSelectedLocation()
        setTimezoneInfo({
          timezone: location.timezone,
          city: location.city,
          country: location.country,
          offset: getTimezoneOffset(location.timezone),
          abbreviation: getTimezoneAbbreviation(location.timezone),
          flag: location.flag,
          detectedFrom: 'manual'
        })
        return
      }

      // If we already detected timezone this session, use cached
      if (timezonePreferences?.detectedTimezone) {
        setTimezoneInfo(timezonePreferences.detectedTimezone)
        return
      }

      // Auto-detect timezone
      setIsLoading(true)

      try {
        // Try IP detection first (5s timeout)
        const ipTimezone = await detectTimezoneFromIP(5000)

        if (ipTimezone) {
          setTimezoneInfo(ipTimezone)
          setTimezonePreferences({
            ...timezonePreferences,
            detectedTimezone: ipTimezone,
            lastDetection: new Date().toISOString()
          })

          // Try to match with a known location for better UX
          const matchingLocation = LOCATIONS.find(
            l => l.timezone === ipTimezone.timezone ||
            l.city.toLowerCase() === ipTimezone.city.toLowerCase()
          )
          if (matchingLocation) {
            setSelectedLocation(matchingLocation.id)
          }
        } else {
          // Fallback to browser detection
          const browserTimezone = detectTimezoneFromBrowser()
          setTimezoneInfo(browserTimezone)
          setTimezonePreferences({
            ...timezonePreferences,
            detectedTimezone: browserTimezone,
            lastDetection: new Date().toISOString()
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    initTimezone()
  }, [])

  // Set timezone manually
  const setManualTimezone = useCallback((location: LocationOption) => {
    const newInfo: TimezoneInfo = {
      timezone: location.timezone,
      city: location.city,
      country: location.country,
      offset: getTimezoneOffset(location.timezone),
      abbreviation: getTimezoneAbbreviation(location.timezone),
      flag: location.flag,
      detectedFrom: 'manual'
    }

    setTimezoneInfo(newInfo)
    setSelectedLocation(location.id)
    setTimezonePreferences({
      ...timezonePreferences,
      isManuallySet: true,
      detectedTimezone: newInfo,
      lastDetection: new Date().toISOString()
    })
  }, [timezonePreferences, setSelectedLocation, setTimezonePreferences])

  // Reset to auto-detection
  const resetToAutoDetect = useCallback(async () => {
    setIsLoading(true)
    setTimezonePreferences({
      ...timezonePreferences,
      isManuallySet: false,
      detectedTimezone: null
    })

    try {
      const ipTimezone = await detectTimezoneFromIP(5000)
      if (ipTimezone) {
        setTimezoneInfo(ipTimezone)
        setTimezonePreferences({
          isManuallySet: false,
          detectedTimezone: ipTimezone,
          lastDetection: new Date().toISOString()
        })
      } else {
        const browserTimezone = detectTimezoneFromBrowser()
        setTimezoneInfo(browserTimezone)
        setTimezonePreferences({
          isManuallySet: false,
          detectedTimezone: browserTimezone,
          lastDetection: new Date().toISOString()
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [timezonePreferences, setTimezonePreferences])

  return {
    timezoneInfo,
    isLoading,
    setManualTimezone,
    resetToAutoDetect,
    availableLocations: LOCATIONS
  }
}

// Hook for live clock with emoji
export function useLiveClock(timezone?: string): LiveClock {
  const { getSelectedLocation } = useUIStore()
  const tz = timezone || getSelectedLocation().timezone

  const [clock, setClock] = useState<LiveClock>(() => {
    const now = new Date()
    const hour = parseInt(now.toLocaleString('en-US', { timeZone: tz, hour: '2-digit', hour12: false }))
    const periodKey = getPeriodKey(hour)

    return {
      time: now.toLocaleString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }),
      date: now.toLocaleDateString('en-US', { timeZone: tz, day: 'numeric', month: 'short' }),
      dayOfWeek: now.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short' }),
      emoji: periodEmojis[periodKey],
      periodKey
    }
  })

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const hour = parseInt(now.toLocaleString('en-US', { timeZone: tz, hour: '2-digit', hour12: false }))
      const periodKey = getPeriodKey(hour)

      setClock({
        time: now.toLocaleString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }),
        date: now.toLocaleDateString('en-US', { timeZone: tz, day: 'numeric', month: 'short' }),
        dayOfWeek: now.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short' }),
        emoji: periodEmojis[periodKey],
        periodKey
      })
    }

    updateClock()

    // Update every second for smooth clock
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [tz])

  return clock
}

import { useState, useEffect, useCallback } from 'react'
import type { LocationOption } from '../stores/uiStore'

interface GreetingData {
  greeting: string
  greetingKey: 'morning' | 'afternoon' | 'evening' | 'night'
  timeString: string
  dateString: string
  emoji: string
  dayOfWeek: string
}

interface WeatherData {
  temp: number
  feelsLike: number
  description: string
  icon: string
  city: string
  humidity: number
  windSpeed: number
  condition: string
}

// Get current hour in specific timezone
function getHourInTimezone(timezone: string): number {
  const now = new Date()
  const tzTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
  return tzTime.getHours()
}

// Get greeting based on hour
function getGreetingKey(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 19) return 'afternoon'
  if (hour >= 19 && hour < 22) return 'evening'
  return 'night'
}

// Get emoji for greeting
function getGreetingEmoji(key: string): string {
  switch (key) {
    case 'morning': return '☀️'
    case 'afternoon': return '🌤️'
    case 'evening': return '🌅'
    case 'night': return '🌙'
    default: return '👋'
  }
}

// Get localized day of week
function getDayOfWeek(timezone: string, language: string): string {
  const now = new Date()
  return now.toLocaleDateString(language, {
    timeZone: timezone,
    weekday: 'long'
  })
}

export function useGreeting(language: string = 'es-ES', location?: LocationOption): GreetingData {
  const timezone = location?.timezone || 'Europe/Madrid'

  const [greeting, setGreeting] = useState<GreetingData>(() => {
    const hour = getHourInTimezone(timezone)
    const key = getGreetingKey(hour)
    return {
      greeting: '',
      greetingKey: key,
      timeString: '',
      dateString: '',
      emoji: getGreetingEmoji(key),
      dayOfWeek: ''
    }
  })

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date()
      const hour = getHourInTimezone(timezone)
      const key = getGreetingKey(hour)

      // Format time in timezone
      const timeString = now.toLocaleString(language, {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
      })

      // Format date
      const dateString = now.toLocaleDateString(language, {
        timeZone: timezone,
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      // Get day of week
      const dayOfWeek = getDayOfWeek(timezone, language)

      // Get localized greeting
      const greetings: Record<string, Record<string, string>> = {
        'es-ES': {
          morning: 'Buenos días',
          afternoon: 'Buenas tardes',
          evening: 'Buenas tardes',
          night: 'Buenas noches'
        },
        'pt-BR': {
          morning: 'Bom dia',
          afternoon: 'Boa tarde',
          evening: 'Boa tarde',
          night: 'Boa noite'
        },
        'en': {
          morning: 'Good morning',
          afternoon: 'Good afternoon',
          evening: 'Good evening',
          night: 'Good night'
        }
      }

      const localeGreetings = greetings[language] || greetings['es-ES']

      setGreeting({
        greeting: localeGreetings[key],
        greetingKey: key,
        timeString,
        dateString,
        emoji: getGreetingEmoji(key),
        dayOfWeek
      })
    }

    updateGreeting()

    // Update every minute
    const interval = setInterval(updateGreeting, 60000)
    return () => clearInterval(interval)
  }, [language, timezone])

  return greeting
}

// Enhanced weather hook with location support
export function useWeather(location?: LocationOption): WeatherData | null {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const coords = location?.coords || 'Valencia,Spain'

  const fetchWeather = useCallback(async () => {
    try {
      // Using wttr.in free API (no key needed)
      const response = await fetch(
        `https://wttr.in/${coords}?format=j1`,
        { headers: { 'Accept': 'application/json' } }
      )

      if (response.ok) {
        const data = await response.json()
        const current = data.current_condition[0]

        setWeather({
          temp: parseInt(current.temp_C),
          feelsLike: parseInt(current.FeelsLikeC),
          description: current.weatherDesc[0].value,
          icon: getWeatherIcon(current.weatherCode),
          city: location?.city || 'Valencia',
          humidity: parseInt(current.humidity),
          windSpeed: parseInt(current.windspeedKmph),
          condition: getWeatherCondition(current.weatherCode)
        })
      }
    } catch {
      // Silently fail - weather is optional
      console.log('Weather API unavailable')
    }
  }, [coords, location?.city])

  useEffect(() => {
    fetchWeather()

    // Update weather every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchWeather])

  return weather
}

// Map weather code to emoji
function getWeatherIcon(code: string): string {
  const codeNum = parseInt(code)

  if (codeNum === 113) return '☀️' // Clear
  if (codeNum === 116) return '⛅' // Partly cloudy
  if (codeNum >= 119 && codeNum <= 122) return '☁️' // Cloudy
  if (codeNum >= 176 && codeNum <= 200) return '🌧️' // Rain
  if (codeNum >= 200 && codeNum <= 232) return '⛈️' // Thunderstorm
  if (codeNum >= 260 && codeNum <= 284) return '🌫️' // Fog
  if (codeNum >= 311 && codeNum <= 395) return '🌧️' // Various rain

  return '🌤️' // Default
}

// Get weather condition category
function getWeatherCondition(code: string): string {
  const codeNum = parseInt(code)

  if (codeNum === 113) return 'clear'
  if (codeNum === 116) return 'partly-cloudy'
  if (codeNum >= 119 && codeNum <= 122) return 'cloudy'
  if (codeNum >= 176 && codeNum <= 232) return 'rainy'
  if (codeNum >= 260 && codeNum <= 284) return 'foggy'
  if (codeNum >= 311 && codeNum <= 395) return 'rainy'

  return 'default'
}

import { useState, useEffect } from 'react'

// Spain timezone (CET/CEST)
const SPAIN_TIMEZONE = 'Europe/Madrid'

interface GreetingData {
  greeting: string
  greetingKey: 'morning' | 'afternoon' | 'evening' | 'night'
  timeString: string
  emoji: string
}

interface WeatherData {
  temp: number
  description: string
  icon: string
  city: string
}

// Get current hour in Spain timezone
function getSpainHour(): number {
  const now = new Date()
  const spainTime = new Date(now.toLocaleString('en-US', { timeZone: SPAIN_TIMEZONE }))
  return spainTime.getHours()
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

export function useGreeting(language: string = 'es-ES'): GreetingData {
  const [greeting, setGreeting] = useState<GreetingData>(() => {
    const hour = getSpainHour()
    const key = getGreetingKey(hour)
    return {
      greeting: '',
      greetingKey: key,
      timeString: '',
      emoji: getGreetingEmoji(key)
    }
  })

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date()
      const hour = getSpainHour()
      const key = getGreetingKey(hour)

      // Format time in Spain timezone
      const timeString = now.toLocaleString(language, {
        timeZone: SPAIN_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
      })

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
        emoji: getGreetingEmoji(key)
      })
    }

    updateGreeting()

    // Update every minute
    const interval = setInterval(updateGreeting, 60000)
    return () => clearInterval(interval)
  }, [language])

  return greeting
}

// Simple weather hook using free API (Valencia, Spain)
export function useWeather(): WeatherData | null {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using wttr.in free API (no key needed)
        const response = await fetch(
          'https://wttr.in/Valencia,Spain?format=j1',
          { headers: { 'Accept': 'application/json' } }
        )

        if (response.ok) {
          const data = await response.json()
          const current = data.current_condition[0]

          setWeather({
            temp: parseInt(current.temp_C),
            description: current.weatherDesc[0].value,
            icon: getWeatherIcon(current.weatherCode),
            city: 'Valencia'
          })
        }
      } catch {
        // Silently fail - weather is optional
        console.log('Weather API unavailable')
      }
    }

    fetchWeather()

    // Update weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

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

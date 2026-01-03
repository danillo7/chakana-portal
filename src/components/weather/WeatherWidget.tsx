// 🌤️ WeatherWidget - Chakana Portal Design System
// Adapted from SPOT Council with Chakana brand identity (Sage Green + Mint)

import { useState, useEffect } from 'react'
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, Wind, Droplets, Thermometer, Plus, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface WeatherLocation {
  id: string
  city: string
  country: string
  lat: number
  lon: number
  flag: string
  timezone: string
  utcOffset: number
}

interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  weatherCode: number
  windSpeed: number
  lastUpdated: Date
}

// Chakana default locations: Madrid + Barcelona (Spanish focus)
const DEFAULT_LOCATIONS: WeatherLocation[] = [
  {
    id: 'madrid',
    city: 'Madrid',
    country: 'España',
    lat: 40.4168,
    lon: -3.7038,
    flag: '🇪🇸',
    timezone: 'Europe/Madrid',
    utcOffset: 1
  }
]

const POPULAR_LOCATIONS: WeatherLocation[] = [
  { id: 'barcelona', city: 'Barcelona', country: 'España', lat: 41.3851, lon: 2.1734, flag: '🇪🇸', timezone: 'Europe/Madrid', utcOffset: 1 },
  { id: 'bogota', city: 'Bogotá', country: 'Colombia', lat: 4.7110, lon: -74.0721, flag: '🇨🇴', timezone: 'America/Bogota', utcOffset: -5 },
  { id: 'lima', city: 'Lima', country: 'Perú', lat: -12.0464, lon: -77.0428, flag: '🇵🇪', timezone: 'America/Lima', utcOffset: -5 },
  { id: 'quito', city: 'Quito', country: 'Ecuador', lat: -0.1807, lon: -78.4678, flag: '🇪🇨', timezone: 'America/Guayaquil', utcOffset: -5 },
  { id: 'santiago', city: 'Santiago', country: 'Chile', lat: -33.4489, lon: -70.6693, flag: '🇨🇱', timezone: 'America/Santiago', utcOffset: -3 },
]

// Weather code mapping (Open-Meteo WMO codes)
function getWeatherIcon(code: number, size: number = 24) {
  const iconClass = `w-${Math.floor(size/4)} h-${Math.floor(size/4)}`

  if (code === 0) return <Sun className={iconClass} />
  if (code <= 3) return <Cloud className={iconClass} />
  if (code <= 67) return <CloudRain className={iconClass} />
  if (code <= 77) return <CloudSnow className={iconClass} />
  if (code <= 82) return <CloudDrizzle className={iconClass} />
  return <Cloud className={iconClass} />
}

function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 67) return 'Rainy'
  if (code <= 77) return 'Snowy'
  if (code <= 82) return 'Showers'
  return 'Cloudy'
}

export function WeatherWidget() {
  const [locations, setLocations] = useState<WeatherLocation[]>(() => {
    const saved = localStorage.getItem('chakana-weather-locations')
    return saved ? JSON.parse(saved) : DEFAULT_LOCATIONS
  })

  const [weatherData, setWeatherData] = useState<Map<string, WeatherData>>(new Map())
  const [loading, setLoading] = useState(true)
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [offline, setOffline] = useState(false)

  // Fetch weather for a location
  const fetchWeather = async (location: WeatherLocation): Promise<WeatherData | null> => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`

      const response = await fetch(url)
      if (!response.ok) throw new Error('Weather fetch failed')

      const data = await response.json()

      return {
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        windSpeed: Math.round(data.current.wind_speed_10m),
        lastUpdated: new Date()
      }
    } catch (error) {
      console.error('Weather fetch error:', error)
      return null
    }
  }

  // Load weather data for all locations
  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true)
      const newWeatherData = new Map<string, WeatherData>()

      for (const location of locations) {
        const weather = await fetchWeather(location)
        if (weather) {
          newWeatherData.set(location.id, weather)
        }
      }

      setWeatherData(newWeatherData)
      setLoading(false)
      setOffline(newWeatherData.size === 0)
    }

    loadWeather()

    // Refresh every 10 minutes
    const interval = setInterval(loadWeather, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [locations])

  // Save locations to localStorage
  useEffect(() => {
    localStorage.setItem('chakana-weather-locations', JSON.stringify(locations))
  }, [locations])

  const addLocation = (location: WeatherLocation) => {
    if (locations.length >= 4) return
    if (locations.find(l => l.id === location.id)) return

    setLocations([...locations, location])
    setIsAddingLocation(false)
  }

  const removeLocation = (id: string) => {
    if (locations.length <= 1) return // Keep at least one location
    setLocations(locations.filter(l => l.id !== id))
  }

  return (
    <div className="space-y-3">
      {/* Weather Cards - Chakana Glassmorphism */}
      {locations.map((location) => {
        const weather = weatherData.get(location.id)

        return (
          <div
            key={location.id}
            className={cn(
              "group relative overflow-hidden rounded-2xl p-4",
              "glass-sage border border-chakana-sage/20",
              "shadow-sage-glow hover:shadow-premium transition-all duration-300",
              "animate-fade-in-up"
            )}
          >
            {/* Remove button (hover) */}
            {locations.length > 1 && (
              <button
                onClick={() => removeLocation(location.id)}
                className={cn(
                  "absolute top-2 right-2 opacity-0 group-hover:opacity-100",
                  "transition-opacity duration-200",
                  "w-6 h-6 rounded-full bg-chakana-rose/20 hover:bg-chakana-rose/30",
                  "flex items-center justify-center text-chakana-rose"
                )}
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Location Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{location.flag}</span>
                <div>
                  <div className="font-semibold text-chakana-dark dark:text-chakana-mint flex items-center gap-1">
                    {location.city}
                  </div>
                  <div className="text-xs text-muted-foreground">{location.country}</div>
                </div>
              </div>
            </div>

            {/* Weather Data */}
            {loading ? (
              <div className="shimmer h-20 rounded-xl" />
            ) : weather ? (
              <div className="space-y-3">
                {/* Temperature + Icon */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-chakana-sage">
                      {weather.temperature}°
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Feels like {weather.feelsLike}°
                    </div>
                  </div>
                  <div className="text-chakana-sage">
                    {getWeatherIcon(weather.weatherCode, 48)}
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-chakana-sage/20">
                  <div className="flex items-center gap-1 text-xs">
                    <Wind className="w-3 h-3 text-chakana-sage/60" />
                    <span className="text-muted-foreground">{weather.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Droplets className="w-3 h-3 text-chakana-sage/60" />
                    <span className="text-muted-foreground">{weather.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Thermometer className="w-3 h-3 text-chakana-sage/60" />
                    <span className="text-muted-foreground">{getWeatherDescription(weather.weatherCode)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Weather unavailable</div>
            )}
          </div>
        )
      })}

      {/* Add Location Section */}
      {locations.length < 4 && (
        <div>
          {!isAddingLocation ? (
            <button
              onClick={() => setIsAddingLocation(true)}
              className={cn(
                "w-full p-4 rounded-2xl border-2 border-dashed border-chakana-sage/30",
                "hover:border-chakana-sage/50 hover:bg-chakana-mint/20",
                "transition-all duration-300 text-chakana-sage",
                "flex items-center justify-center gap-2"
              )}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Location</span>
            </button>
          ) : (
            <div className="glass-mint rounded-2xl p-4 border border-chakana-mint-dark/20 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-chakana-dark dark:text-chakana-mint text-sm">
                  Popular Locations
                </h4>
                <button
                  onClick={() => setIsAddingLocation(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {POPULAR_LOCATIONS.filter(loc => !locations.find(l => l.id === loc.id)).map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => addLocation(loc)}
                    className={cn(
                      "w-full p-2 rounded-xl text-left",
                      "hover:bg-chakana-sage/10 transition-colors",
                      "flex items-center gap-2"
                    )}
                  >
                    <span className="text-lg">{loc.flag}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{loc.city}</div>
                      <div className="text-xs text-muted-foreground">{loc.country}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Offline indicator */}
      {offline && (
        <div className="text-xs text-center text-chakana-amber">
          Offline - Weather data unavailable
        </div>
      )}
    </div>
  )
}

/**
 * Chakana Portal - Multi-City Widget
 * Version: 1.0.0
 *
 * Displays up to 3 cities with:
 * - Real-time local time (with timezone)
 * - Real-time weather data (wttr.in API)
 * - Search and selection interface
 */

import { useState, useEffect } from 'react'
import { useUIStore, LOCATIONS, type LocationOption } from '../stores/uiStore'
import { useWeather } from '../hooks/useGreeting'
import { Clock, Thermometer, Plus, X, Search, MapPin } from 'lucide-react'

interface CityCardProps {
  location: LocationOption
  onRemove: () => void
  isPrimary?: boolean // Primary city (IP-detected)
}

function CityCard({ location, onRemove, isPrimary = false }: CityCardProps) {
  const [time, setTime] = useState('')
  const weather = useWeather(location)

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('es-ES', {
        timeZone: location.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      setTime(timeStr)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [location.timezone])

  // Get timezone offset
  const getOffset = () => {
    const now = new Date()
    const tzString = now.toLocaleString('en-US', {
      timeZone: location.timezone,
      timeZoneName: 'short',
    })
    const match = tzString.match(/\b([A-Z]{2,5})\b$/)
    return match ? match[0] : ''
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-chakana-dark via-chakana-dark-light to-chakana-dark p-5 border transition-all group ${
      isPrimary
        ? 'border-chakana-sage/40 hover:border-chakana-sage/60 shadow-lg shadow-chakana-sage/10'
        : 'border-white/10 hover:border-white/20'
    }`}>
      {/* Glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl ${
        isPrimary ? 'bg-chakana-sage/25' : 'bg-chakana-sage/15'
      }`} />

      <div className="relative z-10">
        {/* Header - City Name */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{location.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{location.city}</h3>
                {isPrimary && (
                  <span className="px-2 py-0.5 rounded-full bg-chakana-sage/20 border border-chakana-sage/30 text-[10px] font-bold text-chakana-sage uppercase tracking-wider">
                    Tu zona
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40">{location.country}</p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 flex items-center justify-center"
            title="Remover cidade"
          >
            <X className="w-4 h-4 text-white/70 hover:text-red-400" />
          </button>
        </div>

        {/* Time Display */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-chakana-mint" />
            <span className="text-xs text-white/50 uppercase">{getOffset()}</span>
          </div>
          <p className="text-3xl font-display font-bold text-white tabular-nums">
            {time}
          </p>
        </div>

        {/* Weather Display */}
        {weather ? (
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{weather.icon}</span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{weather.temp}</span>
                  <span className="text-sm text-white/60">°C</span>
                </div>
                <p className="text-xs text-white/50">{weather.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <Thermometer className="w-4 h-4" />
              <span className="text-sm">{weather.feelsLike}°</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center pt-4 border-t border-white/10">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-chakana-sage animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}

export function MultiCityWidget() {
  const { selectedCities, addCity, removeCity, getSelectedCities, timezonePreferences } = useUIStore()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const cities = getSelectedCities()

  // Auto-add 3 default cities on first load
  useEffect(() => {
    const detectedTimezone = timezonePreferences.detectedTimezone

    // Only auto-add if no cities selected yet
    if (selectedCities.length === 0) {
      // Small delay to ensure store is ready
      setTimeout(() => {
        // 1. Add IP-detected city (if available)
        if (detectedTimezone) {
          const matchingCity = LOCATIONS.find(
            (loc) => loc.timezone === detectedTimezone.timezone
          )
          if (matchingCity) {
            addCity(matchingCity.id)
          }
        }

        // 2. Add Madrid (if not already added)
        const madrid = LOCATIONS.find((loc) => loc.id === 'madrid')
        if (madrid && !selectedCities.includes('madrid')) {
          // Only add if not same as detected city
          if (!detectedTimezone || detectedTimezone.timezone !== madrid.timezone) {
            addCity('madrid')
          }
        }

        // 3. Add New York (if not already added)
        const newYork = LOCATIONS.find((loc) => loc.id === 'new-york')
        if (newYork && !selectedCities.includes('new-york')) {
          // Only add if not same as detected city or Madrid
          if (!detectedTimezone || detectedTimezone.timezone !== newYork.timezone) {
            addCity('new-york')
          }
        }
      }, 100)
    }
  }, []) // Run only once on mount

  // Filter available cities (not already selected)
  const availableCities = LOCATIONS.filter(
    (loc) => !selectedCities.includes(loc.id)
  )

  // Normalize string for accent-insensitive search
  // Example: "São Paulo" = "Sao Paulo" = "sao paulo"
  const normalizeString = (str: string): string => {
    return str
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
  }

  // Filter by search query (accent-insensitive)
  const filteredCities = availableCities.filter((loc) => {
    const normalizedQuery = normalizeString(searchQuery)
    const normalizedCity = normalizeString(loc.city)
    const normalizedCountry = normalizeString(loc.country)

    return normalizedCity.includes(normalizedQuery) ||
           normalizedCountry.includes(normalizedQuery)
  })

  const handleAddCity = (cityId: string) => {
    addCity(cityId)
    setSearchQuery('')
    setIsSearchOpen(false)
  }

  const handleRemoveCity = (cityId: string) => {
    removeCity(cityId)
  }

  // If no cities, show empty state
  if (cities.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-chakana-dark via-chakana-dark-light to-chakana-dark p-8 border border-white/10">
        {/* Glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-chakana-sage/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-chakana-sage/15 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-chakana-sage/60" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Horario Mundial
          </h3>
          <p className="text-white/60 mb-6 max-w-sm mx-auto">
            Añade hasta 3 ciudades para ver su hora local y clima en tiempo real
          </p>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="btn-premium mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Ciudad
          </button>

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="mt-6 max-w-md mx-auto">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar ciudad..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-chakana-sage focus:outline-none text-white placeholder-white/40"
                  autoFocus
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 bg-chakana-dark/95 backdrop-blur-xl rounded-xl border border-white/10 p-2">
                {filteredCities.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleAddCity(loc.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    <span className="text-xl">{loc.flag}</span>
                    <span className="flex-1 font-medium">{loc.city}</span>
                    <span className="text-xs text-white/40">{loc.country}</span>
                  </button>
                ))}
                {filteredCities.length === 0 && (
                  <p className="text-center text-white/40 py-8">
                    No se encontraron ciudades
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show selected cities
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-chakana-sage/15 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-chakana-sage" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Horario Mundial</h3>
            <p className="text-sm text-white/40">
              {cities.length} de 3 ciudades
            </p>
          </div>
        </div>

        {cities.length < 3 && (
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-chakana-sage/30 transition-all flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Añadir
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isSearchOpen && cities.length < 3 && (
        <div className="animate-fade-in">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ciudad..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-chakana-sage focus:outline-none text-white placeholder-white/40"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2 bg-chakana-dark/95 backdrop-blur-xl rounded-xl border border-white/10 p-2">
            {filteredCities.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleAddCity(loc.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all hover:bg-white/10 text-white/80 hover:text-white"
              >
                <span className="text-xl">{loc.flag}</span>
                <span className="flex-1 font-medium">{loc.city}</span>
                <span className="text-xs text-white/40">{loc.country}</span>
              </button>
            ))}
            {filteredCities.length === 0 && (
              <p className="text-center text-white/40 py-6">
                No se encontraron ciudades
              </p>
            )}
          </div>
        </div>
      )}

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((city, index) => (
          <CityCard
            key={city.id}
            location={city}
            onRemove={() => handleRemoveCity(city.id)}
            isPrimary={index === 0} // First city is primary (IP-detected)
          />
        ))}
      </div>
    </div>
  )
}

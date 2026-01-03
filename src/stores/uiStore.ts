import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme } from '../types'

// Available locations for weather/time
export interface LocationOption {
  id: string
  city: string
  country: string
  timezone: string
  flag: string
  coords: string // for weather API
}

// Audio player preferences (persisted)
export interface AudioPreferences {
  isEnabled: boolean  // User has explicitly enabled/disabled audio
  volume: number      // 0-100
  isMuted: boolean    // Mute state
  hasInteracted: boolean // User has interacted with the player at least once
}

// Timezone info detected from IP/browser
export interface TimezoneInfo {
  timezone: string
  city: string
  country: string
  offset: string
  abbreviation: string
  flag: string
  detectedFrom: 'ip' | 'browser' | 'manual' | 'default'
}

// Timezone preferences (persisted)
export interface TimezonePreferences {
  isManuallySet: boolean
  detectedTimezone: TimezoneInfo | null
  lastDetection: string | null
}

/**
 * World Capitals Database - IANA Timezone Standard
 * Sorted alphabetically by city name for optimal UX
 */
export const LOCATIONS: LocationOption[] = [
  // Special locations (Chakana)
  { id: 'casas-bajas', city: 'Casas Bajas', country: 'España', timezone: 'Europe/Madrid', flag: '🏔️', coords: 'Casas+Bajas,Valencia,Spain' },
  { id: 'valencia', city: 'Valencia', country: 'España', timezone: 'Europe/Madrid', flag: '🇪🇸', coords: 'Valencia,Spain' },

  // World Capitals (A-Z)
  { id: 'abu-dhabi', city: 'Abu Dhabi', country: 'EAU', timezone: 'Asia/Dubai', flag: '🇦🇪', coords: 'Abu+Dhabi,UAE' },
  { id: 'amsterdam', city: 'Amsterdam', country: 'Holanda', timezone: 'Europe/Amsterdam', flag: '🇳🇱', coords: 'Amsterdam,Netherlands' },
  { id: 'ankara', city: 'Ankara', country: 'Turquía', timezone: 'Europe/Istanbul', flag: '🇹🇷', coords: 'Ankara,Turkey' },
  { id: 'athens', city: 'Atenas', country: 'Grecia', timezone: 'Europe/Athens', flag: '🇬🇷', coords: 'Athens,Greece' },
  { id: 'bangkok', city: 'Bangkok', country: 'Tailandia', timezone: 'Asia/Bangkok', flag: '🇹🇭', coords: 'Bangkok,Thailand' },
  { id: 'barcelona', city: 'Barcelona', country: 'España', timezone: 'Europe/Madrid', flag: '🇪🇸', coords: 'Barcelona,Spain' },
  { id: 'beijing', city: 'Pekín', country: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳', coords: 'Beijing,China' },
  { id: 'beirut', city: 'Beirut', country: 'Líbano', timezone: 'Asia/Beirut', flag: '🇱🇧', coords: 'Beirut,Lebanon' },
  { id: 'berlin', city: 'Berlín', country: 'Alemania', timezone: 'Europe/Berlin', flag: '🇩🇪', coords: 'Berlin,Germany' },
  { id: 'bogota', city: 'Bogotá', country: 'Colombia', timezone: 'America/Bogota', flag: '🇨🇴', coords: 'Bogota,Colombia' },
  { id: 'brasilia', city: 'Brasília', country: 'Brasil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', coords: 'Brasilia,Brazil' },
  { id: 'brussels', city: 'Bruselas', country: 'Bélgica', timezone: 'Europe/Brussels', flag: '🇧🇪', coords: 'Brussels,Belgium' },
  { id: 'bucharest', city: 'Bucarest', country: 'Rumania', timezone: 'Europe/Bucharest', flag: '🇷🇴', coords: 'Bucharest,Romania' },
  { id: 'budapest', city: 'Budapest', country: 'Hungría', timezone: 'Europe/Budapest', flag: '🇭🇺', coords: 'Budapest,Hungary' },
  { id: 'buenos-aires', city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', coords: 'Buenos+Aires,Argentina' },
  { id: 'cairo', city: 'El Cairo', country: 'Egipto', timezone: 'Africa/Cairo', flag: '🇪🇬', coords: 'Cairo,Egypt' },
  { id: 'cape-town', city: 'Ciudad del Cabo', country: 'Sudáfrica', timezone: 'Africa/Johannesburg', flag: '🇿🇦', coords: 'Cape+Town,South+Africa' },
  { id: 'caracas', city: 'Caracas', country: 'Venezuela', timezone: 'America/Caracas', flag: '🇻🇪', coords: 'Caracas,Venezuela' },
  { id: 'chicago', city: 'Chicago', country: 'EE.UU.', timezone: 'America/Chicago', flag: '🇺🇸', coords: 'Chicago,USA' },
  { id: 'copenhagen', city: 'Copenhague', country: 'Dinamarca', timezone: 'Europe/Copenhagen', flag: '🇩🇰', coords: 'Copenhagen,Denmark' },
  { id: 'delhi', city: 'Nueva Delhi', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', coords: 'New+Delhi,India' },
  { id: 'dublin', city: 'Dublín', country: 'Irlanda', timezone: 'Europe/Dublin', flag: '🇮🇪', coords: 'Dublin,Ireland' },
  { id: 'dubai', city: 'Dubái', country: 'EAU', timezone: 'Asia/Dubai', flag: '🇦🇪', coords: 'Dubai,UAE' },
  { id: 'geneva', city: 'Ginebra', country: 'Suiza', timezone: 'Europe/Zurich', flag: '🇨🇭', coords: 'Geneva,Switzerland' },
  { id: 'helsinki', city: 'Helsinki', country: 'Finlandia', timezone: 'Europe/Helsinki', flag: '🇫🇮', coords: 'Helsinki,Finland' },
  { id: 'hong-kong', city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', flag: '🇭🇰', coords: 'Hong+Kong' },
  { id: 'istanbul', city: 'Estambul', country: 'Turquía', timezone: 'Europe/Istanbul', flag: '🇹🇷', coords: 'Istanbul,Turkey' },
  { id: 'jakarta', city: 'Yakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', flag: '🇮🇩', coords: 'Jakarta,Indonesia' },
  { id: 'jerusalem', city: 'Jerusalén', country: 'Israel', timezone: 'Asia/Jerusalem', flag: '🇮🇱', coords: 'Jerusalem,Israel' },
  { id: 'lima', city: 'Lima', country: 'Perú', timezone: 'America/Lima', flag: '🇵🇪', coords: 'Lima,Peru' },
  { id: 'lisbon', city: 'Lisboa', country: 'Portugal', timezone: 'Europe/Lisbon', flag: '🇵🇹', coords: 'Lisbon,Portugal' },
  { id: 'london', city: 'Londres', country: 'Reino Unido', timezone: 'Europe/London', flag: '🇬🇧', coords: 'London,UK' },
  { id: 'los-angeles', city: 'Los Ángeles', country: 'EE.UU.', timezone: 'America/Los_Angeles', flag: '🇺🇸', coords: 'Los+Angeles,USA' },
  { id: 'madrid', city: 'Madrid', country: 'España', timezone: 'Europe/Madrid', flag: '🇪🇸', coords: 'Madrid,Spain' },
  { id: 'manila', city: 'Manila', country: 'Filipinas', timezone: 'Asia/Manila', flag: '🇵🇭', coords: 'Manila,Philippines' },
  { id: 'melbourne', city: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', flag: '🇦🇺', coords: 'Melbourne,Australia' },
  { id: 'mexico-city', city: 'Ciudad de México', country: 'México', timezone: 'America/Mexico_City', flag: '🇲🇽', coords: 'Mexico+City,Mexico' },
  { id: 'miami', city: 'Miami', country: 'EE.UU.', timezone: 'America/New_York', flag: '🇺🇸', coords: 'Miami,USA' },
  { id: 'milan', city: 'Milán', country: 'Italia', timezone: 'Europe/Rome', flag: '🇮🇹', coords: 'Milan,Italy' },
  { id: 'monaco', city: 'Mónaco', country: 'Mónaco', timezone: 'Europe/Monaco', flag: '🇲🇨', coords: 'Monaco' },
  { id: 'moscow', city: 'Moscú', country: 'Rusia', timezone: 'Europe/Moscow', flag: '🇷🇺', coords: 'Moscow,Russia' },
  { id: 'mumbai', city: 'Bombay', country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', coords: 'Mumbai,India' },
  { id: 'new-york', city: 'Nueva York', country: 'EE.UU.', timezone: 'America/New_York', flag: '🇺🇸', coords: 'New+York,USA' },
  { id: 'oslo', city: 'Oslo', country: 'Noruega', timezone: 'Europe/Oslo', flag: '🇳🇴', coords: 'Oslo,Norway' },
  { id: 'paris', city: 'París', country: 'Francia', timezone: 'Europe/Paris', flag: '🇫🇷', coords: 'Paris,France' },
  { id: 'prague', city: 'Praga', country: 'Rep. Checa', timezone: 'Europe/Prague', flag: '🇨🇿', coords: 'Prague,Czech+Republic' },
  { id: 'rio-de-janeiro', city: 'Río de Janeiro', country: 'Brasil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', coords: 'Rio+de+Janeiro,Brazil' },
  { id: 'riyadh', city: 'Riad', country: 'Arabia Saudí', timezone: 'Asia/Riyadh', flag: '🇸🇦', coords: 'Riyadh,Saudi+Arabia' },
  { id: 'rome', city: 'Roma', country: 'Italia', timezone: 'Europe/Rome', flag: '🇮🇹', coords: 'Rome,Italy' },
  { id: 'san-francisco', city: 'San Francisco', country: 'EE.UU.', timezone: 'America/Los_Angeles', flag: '🇺🇸', coords: 'San+Francisco,USA' },
  { id: 'santiago', city: 'Santiago', country: 'Chile', timezone: 'America/Santiago', flag: '🇨🇱', coords: 'Santiago,Chile' },
  { id: 'sao-paulo', city: 'São Paulo', country: 'Brasil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', coords: 'Sao+Paulo,Brazil' },
  { id: 'seoul', city: 'Seúl', country: 'Corea del Sur', timezone: 'Asia/Seoul', flag: '🇰🇷', coords: 'Seoul,South+Korea' },
  { id: 'shanghai', city: 'Shanghái', country: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳', coords: 'Shanghai,China' },
  { id: 'singapore', city: 'Singapur', country: 'Singapur', timezone: 'Asia/Singapore', flag: '🇸🇬', coords: 'Singapore' },
  { id: 'stockholm', city: 'Estocolmo', country: 'Suecia', timezone: 'Europe/Stockholm', flag: '🇸🇪', coords: 'Stockholm,Sweden' },
  { id: 'sydney', city: 'Sídney', country: 'Australia', timezone: 'Australia/Sydney', flag: '🇦🇺', coords: 'Sydney,Australia' },
  { id: 'taipei', city: 'Taipéi', country: 'Taiwán', timezone: 'Asia/Taipei', flag: '🇹🇼', coords: 'Taipei,Taiwan' },
  { id: 'tel-aviv', city: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem', flag: '🇮🇱', coords: 'Tel+Aviv,Israel' },
  { id: 'tokyo', city: 'Tokio', country: 'Japón', timezone: 'Asia/Tokyo', flag: '🇯🇵', coords: 'Tokyo,Japan' },
  { id: 'toronto', city: 'Toronto', country: 'Canadá', timezone: 'America/Toronto', flag: '🇨🇦', coords: 'Toronto,Canada' },
  { id: 'vancouver', city: 'Vancouver', country: 'Canadá', timezone: 'America/Vancouver', flag: '🇨🇦', coords: 'Vancouver,Canada' },
  { id: 'vienna', city: 'Viena', country: 'Austria', timezone: 'Europe/Vienna', flag: '🇦🇹', coords: 'Vienna,Austria' },
  { id: 'warsaw', city: 'Varsovia', country: 'Polonia', timezone: 'Europe/Warsaw', flag: '🇵🇱', coords: 'Warsaw,Poland' },
  { id: 'washington', city: 'Washington D.C.', country: 'EE.UU.', timezone: 'America/New_York', flag: '🇺🇸', coords: 'Washington,USA' },
  { id: 'zurich', city: 'Zúrich', country: 'Suiza', timezone: 'Europe/Zurich', flag: '🇨🇭', coords: 'Zurich,Switzerland' },
]

interface UIState {
  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void

  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // Mobile
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void

  // Search
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Location preference
  selectedLocationId: string
  setSelectedLocation: (locationId: string) => void
  getSelectedLocation: () => LocationOption

  // Multi-city widget (up to 3 cities) - NEW!
  selectedCities: string[] // Array of city IDs (max 3)
  addCity: (cityId: string) => void
  removeCity: (cityId: string) => void
  getSelectedCities: () => LocationOption[]

  // Audio player (persisted)
  audioPreferences: AudioPreferences
  setAudioEnabled: (enabled: boolean) => void
  setAudioVolume: (volume: number) => void
  setAudioMuted: (muted: boolean) => void
  setAudioInteracted: () => void

  // Timezone preferences (persisted)
  timezonePreferences: TimezonePreferences
  setTimezonePreferences: (prefs: Partial<TimezonePreferences>) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Mobile
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      // Search
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Location
      selectedLocationId: 'valencia', // Default to Valencia (Chakana HQ)
      setSelectedLocation: (locationId) => set({ selectedLocationId: locationId }),
      getSelectedLocation: () => {
        const state = get()
        return LOCATIONS.find(l => l.id === state.selectedLocationId) || LOCATIONS[0]
      },

      // Multi-city widget - NEW!
      selectedCities: [], // Starts with no cities
      addCity: (cityId) => set((state) => {
        // Only add if not already selected and limit to 3
        if (state.selectedCities.includes(cityId)) return state
        if (state.selectedCities.length >= 3) return state

        return { selectedCities: [...state.selectedCities, cityId] }
      }),
      removeCity: (cityId) => set((state) => ({
        selectedCities: state.selectedCities.filter(id => id !== cityId)
      })),
      getSelectedCities: () => {
        const state = get()
        return state.selectedCities
          .map(id => LOCATIONS.find(l => l.id === id))
          .filter((loc): loc is LocationOption => loc !== undefined)
      },

      // Audio player - Starts muted to allow autoplay (browser policy)
      audioPreferences: {
        isEnabled: true,      // Audio enabled by default
        volume: 50,           // 50% volume
        isMuted: true,        // Start muted (required for autoplay)
        hasInteracted: false, // Will be set to true after first user interaction
      },
      setAudioEnabled: (enabled) => set((state) => ({
        audioPreferences: { ...state.audioPreferences, isEnabled: enabled }
      })),
      setAudioVolume: (volume) => set((state) => ({
        audioPreferences: { ...state.audioPreferences, volume: Math.max(0, Math.min(100, volume)) }
      })),
      setAudioMuted: (muted) => set((state) => ({
        audioPreferences: { ...state.audioPreferences, isMuted: muted }
      })),
      setAudioInteracted: () => set((state) => ({
        audioPreferences: { ...state.audioPreferences, hasInteracted: true }
      })),

      // Timezone preferences
      timezonePreferences: {
        isManuallySet: false,
        detectedTimezone: null,
        lastDetection: null,
      },
      setTimezonePreferences: (prefs) => set((state) => ({
        timezonePreferences: { ...state.timezonePreferences, ...prefs }
      })),
    }),
    {
      name: 'chakana-ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        selectedLocationId: state.selectedLocationId,
        selectedCities: state.selectedCities, // NEW: Persist selected cities
        audioPreferences: state.audioPreferences,
        timezonePreferences: state.timezonePreferences,
      }),
    }
  )
)

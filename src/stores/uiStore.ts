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

export const LOCATIONS: LocationOption[] = [
  { id: 'valencia', city: 'Valencia', country: 'ES', timezone: 'Europe/Madrid', flag: '🇪🇸', coords: 'Valencia,Spain' },
  { id: 'madrid', city: 'Madrid', country: 'ES', timezone: 'Europe/Madrid', flag: '🇪🇸', coords: 'Madrid,Spain' },
  { id: 'barcelona', city: 'Barcelona', country: 'ES', timezone: 'Europe/Madrid', flag: '🇪🇸', coords: 'Barcelona,Spain' },
  { id: 'sao-paulo', city: 'São Paulo', country: 'BR', timezone: 'America/Sao_Paulo', flag: '🇧🇷', coords: 'Sao+Paulo,Brazil' },
  { id: 'london', city: 'London', country: 'UK', timezone: 'Europe/London', flag: '🇬🇧', coords: 'London,UK' },
  { id: 'new-york', city: 'New York', country: 'US', timezone: 'America/New_York', flag: '🇺🇸', coords: 'New+York,USA' },
  { id: 'casas-bajas', city: 'Casas Bajas', country: 'ES', timezone: 'Europe/Madrid', flag: '🏔️', coords: 'Casas+Bajas,Valencia,Spain' },
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
    }),
    {
      name: 'chakana-ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        selectedLocationId: state.selectedLocationId,
      }),
    }
  )
)

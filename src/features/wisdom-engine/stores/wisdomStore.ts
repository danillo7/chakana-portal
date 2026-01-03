/**
 * Chakana Wisdom Engine - Zustand State Management
 * Version: 1.0.0
 *
 * Global state store for the Wisdom Engine feature.
 * Persists user preferences, recent quotes, and session data to localStorage.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Quote,
  WisdomEnginePreferences,
  WelcomeModalState,
  SavedReflection,
} from '../types/wisdom-engine'
import { DEFAULT_WISDOM_PREFERENCES } from '../types/wisdom-engine'
import { supabaseSync } from '../services/SupabaseSync'
import type { SyncStatus, SyncResult } from '../services/SupabaseSync'

interface WisdomStore {
  // ============================================================================
  // STATE
  // ============================================================================

  /** Currently displayed quote */
  currentQuote: Quote | null

  /** Recently shown quote IDs (for anti-repetition) */
  recentQuotes: string[]

  /** User preferences */
  preferences: WisdomEnginePreferences

  /** Welcome modal state */
  welcomeModalState: WelcomeModalState

  /** Session active time in minutes */
  sessionActiveMinutes: number

  /** Session start timestamp */
  sessionStart: Date | null

  /** Saved reflections */
  savedReflections: SavedReflection[]

  /** Sync status */
  syncStatus: SyncStatus

  /** Last sync result */
  lastSyncResult: SyncResult | null

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /** Set the current quote being displayed */
  setCurrentQuote: (quote: Quote) => void

  /** Add a quote ID to recent history */
  addRecentQuote: (quoteId: string) => void

  /** Update user preferences (partial update) */
  updatePreferences: (prefs: Partial<WisdomEnginePreferences>) => void

  /** Update welcome modal state */
  setWelcomeModalState: (state: Partial<WelcomeModalState>) => void

  /** Increment active time by 1 minute */
  incrementActiveTime: () => void

  /** Reset session data (on logout or new day) */
  resetSession: () => void

  /** Clear recent quotes history */
  clearRecentQuotes: () => void

  /** Save a reflection */
  saveReflection: (reflection: Omit<SavedReflection, 'id' | 'savedAt'>) => void

  /** Delete a reflection */
  deleteReflection: (id: string) => void

  /** Update a reflection */
  updateReflection: (id: string, updates: Partial<SavedReflection>) => void

  /** Get reflection by ID */
  getReflection: (id: string) => SavedReflection | undefined

  /** Sync reflections with Supabase (manual sync) */
  syncReflections: () => Promise<void>

  /** Check if Supabase sync is available */
  isSyncAvailable: () => boolean
}

/**
 * Main Zustand store for Wisdom Engine
 *
 * Persists to localStorage under key 'chakana:wisdom-engine'
 * Only persists: recentQuotes, preferences, sessionActiveMinutes
 */
export const useWisdomStore = create<WisdomStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQuote: null,
      recentQuotes: [],
      preferences: DEFAULT_WISDOM_PREFERENCES,
      welcomeModalState: {
        isShown: false,
        dismissed: false,
      },
      sessionActiveMinutes: 0,
      sessionStart: null,
      savedReflections: [],
      syncStatus: 'idle',
      lastSyncResult: null,

      // Actions
      setCurrentQuote: (quote) =>
        set({ currentQuote: quote }),

      addRecentQuote: (quoteId) =>
        set((state) => ({
          recentQuotes: [quoteId, ...state.recentQuotes].slice(0, 20),
        })),

      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      setWelcomeModalState: (modalState) =>
        set((state) => ({
          welcomeModalState: { ...state.welcomeModalState, ...modalState },
        })),

      incrementActiveTime: () =>
        set((state) => ({
          sessionActiveMinutes: state.sessionActiveMinutes + 1,
        })),

      resetSession: () =>
        set({
          sessionActiveMinutes: 0,
          recentQuotes: [],
          sessionStart: new Date(),
        }),

      clearRecentQuotes: () =>
        set({ recentQuotes: [] }),

      saveReflection: (reflection) => {
        set((state) => ({
          savedReflections: [
            {
              ...reflection,
              id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              savedAt: new Date(),
            },
            ...state.savedReflections,
          ],
        }))

        // Auto-sync to Supabase (non-blocking)
        if (supabaseSync.isAvailable) {
          supabaseSync.push(get().savedReflections).catch(console.error)
        }
      },

      deleteReflection: async (id) => {
        set((state) => ({
          savedReflections: state.savedReflections.filter((r) => r.id !== id),
        }))

        // Delete from Supabase (non-blocking)
        if (supabaseSync.isAvailable) {
          supabaseSync.delete(id).catch(console.error)
        }
      },

      updateReflection: (id, updates) => {
        set((state) => ({
          savedReflections: state.savedReflections.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
          ),
        }))

        // Auto-sync to Supabase (non-blocking)
        if (supabaseSync.isAvailable) {
          supabaseSync.push(get().savedReflections).catch(console.error)
        }
      },

      getReflection: (id: string): SavedReflection | undefined => {
        return get().savedReflections.find((r: SavedReflection) => r.id === id)
      },

      syncReflections: async () => {
        if (!supabaseSync.isAvailable) {
          set({
            lastSyncResult: {
              success: false,
              pushed: 0,
              pulled: 0,
              errors: ['Supabase not configured'],
            },
          })
          return
        }

        set({ syncStatus: 'syncing' })

        const { reflections, result } = await supabaseSync.sync(get().savedReflections)

        set({
          savedReflections: reflections,
          syncStatus: result.success ? 'success' : 'error',
          lastSyncResult: result,
        })

        // Reset status to idle after 3 seconds
        setTimeout(() => {
          set({ syncStatus: 'idle' })
        }, 3000)
      },

      isSyncAvailable: () => supabaseSync.isAvailable,
    }),
    {
      name: 'chakana:wisdom-engine',

      // Only persist these fields to localStorage
      partialize: (state) => ({
        recentQuotes: state.recentQuotes,
        preferences: state.preferences,
        sessionActiveMinutes: state.sessionActiveMinutes,
        savedReflections: state.savedReflections,
      }),
    }
  )
)

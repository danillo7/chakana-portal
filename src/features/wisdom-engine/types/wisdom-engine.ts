/**
 * Chakana Wisdom Engine - TypeScript Type Definitions
 * Version: 1.0.0
 * Date: 2026-01-02
 *
 * Comprehensive type system for the Wisdom Engine
 * Follows strict TypeScript best practices
 */

// ============================================================================
// QUOTE SYSTEM TYPES
// ============================================================================

/**
 * Main categories for quotes
 */
export type QuoteCategory = 'transformacion' | 'chakana' | 'presencia' | 'cta'

/**
 * Subcategories for more granular classification
 */
export type QuoteSubcategory =
  | 'autoconocimiento'
  | 'proceso'
  | 'proposito'
  | 'filosofia'
  | 'sabiduria'
  | 'mindfulness'
  | 'consciencia'
  | 'invitacion'

/**
 * Weight determines frequency of quote appearance
 * 1 = Normal, 2 = 2x more frequent, 3 = 3x more frequent
 */
export type QuoteWeight = 1 | 2 | 3

/**
 * Supported languages
 */
export type QuoteLanguage = 'es' | 'pt' | 'en'

/**
 * Core Quote interface representing a single wisdom quote
 */
export interface Quote {
  /** Unique identifier (e.g., "tr-auto-001") */
  id: string

  /** The actual quote text */
  text: string

  /** Main category */
  category: QuoteCategory

  /** More specific subcategory */
  subcategory: QuoteSubcategory

  /** Frequency weight (1-3) */
  weight: QuoteWeight

  /** Searchable tags */
  tags: string[]

  /** Language of the quote */
  language: QuoteLanguage

  /** Optional author attribution */
  author?: string

  /** Optional source reference */
  source?: string
}

/**
 * Metadata about the quotes database
 */
export interface QuotesMetadata {
  version: string
  lastUpdated: string
  totalQuotes: number
  categories: Record<QuoteCategory, number>
}

/**
 * Complete quotes database structure
 */
export interface QuotesDatabase {
  version: string
  lastUpdated: string
  totalQuotes: number
  categories: Record<QuoteCategory, number>
  quotes: Quote[]
}

// ============================================================================
// USER CONTEXT TYPES
// ============================================================================

/**
 * Time of day for contextual quote selection
 */
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

/**
 * Days of the week
 */
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

/**
 * User activity state
 */
export type UserActivityState = 'active' | 'idle' | 'away'

/**
 * Pages in the portal
 */
export type PageType =
  | 'dashboard'
  | 'projects'
  | 'actions'
  | 'team'
  | 'financial'
  | 'documents'
  | 'settings'
  | 'testimonials'
  | 'timeline'
  | 'market'
  | 'news'

/**
 * Comprehensive user context for intelligent quote selection
 */
export interface UserContext {
  /** Current page user is on */
  currentPage: PageType

  /** Time of day */
  timeOfDay: TimeOfDay

  /** Day of the week */
  dayOfWeek: DayOfWeek

  /** User activity state */
  activityState: UserActivityState

  /** Minutes user has been active in current session */
  activeMinutes: number

  /** User just completed an urgent action */
  justCompletedUrgentAction?: boolean

  /** User has been inactive for extended period */
  isInactiveExtended?: boolean

  /** User visited retiros page multiple times recently */
  frequentRetirosVisits?: boolean

  /** User's birthday */
  isUserBirthday?: boolean

  /** Upcoming retreat (days until) */
  daysUntilRetreat?: number

  /** First visit of the day */
  isFirstVisitToday?: boolean

  /** First visit of the month */
  isFirstVisitOfMonth?: boolean

  /** User's preferred categories (if any) */
  preferredCategories?: QuoteCategory[]

  /** Recently viewed quote IDs (for anti-repetition) */
  recentQuoteIds?: string[]
}

// ============================================================================
// WISDOM ENGINE TRIGGERS
// ============================================================================

/**
 * Triggers for Welcome Modal
 */
export type WelcomeModalTrigger =
  | 'monday_morning'
  | 'first_of_month'
  | 'retreat_soon'
  | 'post_action_completion'
  | 'user_birthday'
  | 'manual'

/**
 * Triggers for Micro-Pause
 */
export type MicroPauseTrigger =
  | 'active_time_threshold'
  | 'inactivity_detected'
  | 'scheduled_interval'
  | 'manual'

// ============================================================================
// COMPONENT STATE TYPES
// ============================================================================

/**
 * Welcome Modal state
 */
export interface WelcomeModalState {
  /** Whether modal is currently shown */
  isShown: boolean

  /** Trigger that caused modal to show */
  trigger?: WelcomeModalTrigger

  /** Quote to display in modal */
  quote?: Quote

  /** Timestamp when modal was shown */
  shownAt?: Date

  /** Whether user has dismissed modal */
  dismissed: boolean

  /** Time spent viewing modal (in seconds) */
  timeSpent?: number
}

/**
 * Contextual Header state
 */
export interface ContextualHeaderState {
  /** Current quote being displayed */
  currentQuote: Quote | null

  /** Whether rotation is paused (e.g., user hovering) */
  isPaused: boolean

  /** Whether user is saving this quote */
  isSaving: boolean

  /** Whether quote was just copied */
  wasCopied: boolean

  /** Time until next rotation (in seconds) */
  timeUntilNextRotation: number
}

/**
 * Micro-Pause state
 */
export interface MicroPauseState {
  /** Whether micro-pause is currently shown */
  isShown: boolean

  /** Trigger that caused micro-pause */
  trigger?: MicroPauseTrigger

  /** Quote to display */
  quote?: Quote

  /** Minutes user has been active */
  activeMinutes: number

  /** Whether breathing exercise is active */
  isBreathingExerciseActive: boolean

  /** Current breathing phase */
  breathingPhase?: 'inhale' | 'hold' | 'exhale'

  /** Seconds remaining in breathing exercise */
  breathingSecondsRemaining?: number
}

/**
 * Transition Quote state
 */
export interface TransitionQuoteState {
  /** Whether transition quote is shown */
  isShown: boolean

  /** Quote to display during transition */
  quote?: Quote

  /** Source page */
  fromPage: PageType

  /** Destination page */
  toPage: PageType
}

// ============================================================================
// SAVED REFLECTIONS TYPES
// ============================================================================

/**
 * A reflection saved by the user
 */
export interface SavedReflection {
  /** Unique ID for this saved reflection */
  id: string

  /** The full quote object that was saved */
  quote: Quote

  /** When it was saved */
  savedAt: Date

  /** User's personal note about this reflection */
  userNote?: string

  /** Custom tags added by user (optional) */
  tags?: string[]

  /** Context in which it was saved (optional) */
  context?: string

  /** Last time this reflection was updated */
  updatedAt?: Date

  /** Whether this reflection has been shared */
  shared?: boolean

  /** Platform where it was shared (if any) */
  sharedPlatform?: 'whatsapp' | 'instagram' | 'email'
}

/**
 * User's reflection journal stats
 */
export interface ReflectionStats {
  /** Total number of reflections saved */
  totalReflections: number

  /** Reflections saved this month */
  thisMonth: number

  /** Reflections saved this week */
  thisWeek: number

  /** Current streak (consecutive days) */
  currentStreak: number

  /** Longest streak ever */
  longestStreak: number

  /** Most popular category */
  favoriteCategory?: QuoteCategory

  /** Most used tags */
  topTags: Array<{ tag: string; count: number }>
}

// ============================================================================
// USER PREFERENCES TYPES
// ============================================================================

/**
 * User preferences for Wisdom Engine features
 */
export interface WisdomEnginePreferences {
  /** Enable/disable welcome modal */
  enableWelcomeModal: boolean

  /** Enable/disable micro-pauses */
  enableMicroPauses: boolean

  /** Enable/disable transition quotes */
  enableTransitions: boolean

  /** Interval for micro-pauses (in minutes) */
  microPauseIntervalMinutes: number

  /** Preferred quote categories (empty = all) */
  preferredCategories: QuoteCategory[]

  /** Enable sound effects (e.g., breathing exercise bell) */
  enableSound: boolean

  /** Enable background music in welcome modal */
  enableBackgroundMusic: boolean

  /** Rotation interval for contextual header (in seconds) */
  headerRotationInterval: number
}

/**
 * Default preferences
 */
export const DEFAULT_WISDOM_PREFERENCES: WisdomEnginePreferences = {
  enableWelcomeModal: true,
  enableMicroPauses: true,
  enableTransitions: true,
  microPauseIntervalMinutes: 20,
  preferredCategories: [],
  enableSound: true,
  enableBackgroundMusic: false,
  headerRotationInterval: 12,
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Analytics event types
 */
export type WisdomEventType =
  | 'quote_viewed'
  | 'quote_hovered'
  | 'quote_copied'
  | 'quote_saved'
  | 'quote_shared'
  | 'modal_shown'
  | 'modal_dismissed'
  | 'micropause_shown'
  | 'micropause_dismissed'
  | 'micropause_completed'
  | 'breathing_exercise_started'
  | 'breathing_exercise_completed'
  | 'settings_changed'
  | 'reflection_added'
  | 'reflection_edited'
  | 'reflection_deleted'

/**
 * Analytics event
 */
export interface WisdomEvent {
  /** Type of event */
  type: WisdomEventType

  /** When the event occurred */
  timestamp: Date

  /** Quote ID (if applicable) */
  quoteId?: string

  /** Category (if applicable) */
  category?: QuoteCategory

  /** User context at time of event */
  context?: Partial<UserContext>

  /** Additional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Analytics summary
 */
export interface WisdomAnalyticsSummary {
  /** Total events tracked */
  totalEvents: number

  /** Events by type */
  eventsByType: Record<WisdomEventType, number>

  /** Most popular quotes (by views) */
  topQuotes: Array<{ quoteId: string; views: number }>

  /** Most saved quotes */
  mostSaved: Array<{ quoteId: string; saves: number }>

  /** Engagement rate (interactions / views) */
  engagementRate: number

  /** Average time spent on welcome modal */
  avgModalTime: number

  /** Micro-pause completion rate */
  microPauseCompletionRate: number
}

// ============================================================================
// WISDOM ENGINE CONFIGURATION
// ============================================================================

/**
 * Configuration for the Wisdom Engine
 */
export interface WisdomEngineConfig {
  /** Minimum quotes before repetition */
  minQuotesBeforeRepeat: number

  /** Category distribution weights */
  categoryWeights: Record<QuoteCategory, number>

  /** Default rotation interval (seconds) */
  defaultRotationInterval: number

  /** Modal auto-close timeout (0 = never) */
  modalAutoCloseTimeout: number

  /** Micro-pause minimum interval (minutes) */
  microPauseMinInterval: number

  /** Micro-pause active time threshold (minutes) */
  microPauseActiveThreshold: number

  /** Transition quote duration (seconds) */
  transitionQuoteDuration: number

  /** Enable debug logging */
  debugMode: boolean
}

/**
 * Default configuration
 */
export const DEFAULT_WISDOM_CONFIG: WisdomEngineConfig = {
  minQuotesBeforeRepeat: 20,
  categoryWeights: {
    transformacion: 50,
    chakana: 25,
    presencia: 15,
    cta: 10,
  },
  defaultRotationInterval: 12,
  modalAutoCloseTimeout: 0, // Never auto-close
  microPauseMinInterval: 120, // 2 hours
  microPauseActiveThreshold: 20, // 20 minutes
  transitionQuoteDuration: 2.5,
  debugMode: false,
}

// ============================================================================
// LOCAL STORAGE SCHEMA
// ============================================================================

/**
 * Structure of data stored in localStorage
 */
export interface WisdomLocalStorage {
  /** Schema version for migrations */
  version: string

  /** Last time welcome modal was shown */
  lastWelcomeModal?: {
    shownAt: string // ISO date
    trigger: WelcomeModalTrigger
  }

  /** Last time micro-pause was shown */
  lastMicroPause?: {
    shownAt: string // ISO date
    activeMinutesAtTime: number
  }

  /** Recently shown quote IDs (for anti-repetition) */
  recentQuotes: string[]

  /** User preferences */
  preferences: WisdomEnginePreferences

  /** Session start time */
  sessionStart?: string // ISO date

  /** Total active minutes in current session */
  sessionActiveMinutes: number
}

/**
 * Default localStorage structure
 */
export const DEFAULT_LOCAL_STORAGE: WisdomLocalStorage = {
  version: '1.0.0',
  recentQuotes: [],
  preferences: DEFAULT_WISDOM_PREFERENCES,
  sessionActiveMinutes: 0,
}

// ============================================================================
// SUPABASE DATABASE SCHEMAS
// ============================================================================

/**
 * Supabase saved_reflections table row
 */
export interface DbSavedReflection {
  id: string
  user_id: string
  quote_id: string
  quote_text: string
  user_note: string | null
  tags: string[]
  context: {
    page: string
    timeOfDay: string
    emotionalState?: string
  }
  saved_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}

/**
 * Supabase wisdom_analytics table row
 */
export interface DbWisdomAnalytics {
  id: string
  user_id: string
  event_type: WisdomEventType
  quote_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string // ISO timestamp
}

/**
 * Supabase wisdom_preferences table row
 */
export interface DbWisdomPreferences {
  user_id: string
  enable_welcome_modal: boolean
  enable_micro_pauses: boolean
  enable_transitions: boolean
  micro_pause_interval_minutes: number
  preferred_categories: string[]
  updated_at: string // ISO timestamp
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Result type for async operations
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

/**
 * Async result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>

/**
 * Quote selector options
 */
export interface QuoteSelectorOptions {
  /** User context for intelligent selection */
  context: UserContext

  /** Recently shown quote IDs to avoid */
  recentQuotes?: string[]

  /** Specific category to select from (optional) */
  category?: QuoteCategory

  /** Specific subcategory to select from (optional) */
  subcategory?: QuoteSubcategory

  /** Language filter */
  language?: QuoteLanguage
}

/**
 * Weighted random selection options
 */
export interface WeightedRandomOptions<T> {
  /** Items to select from */
  items: T[]

  /** Weight getter function */
  getWeight: (item: T) => number

  /** Items to exclude */
  exclude?: T[]
}

// ============================================================================
// BREATHING EXERCISE TYPES
// ============================================================================

/**
 * Breathing exercise phase
 */
export type BreathingPhase = 'inhale' | 'hold' | 'exhale'

/**
 * Breathing exercise configuration
 */
export interface BreathingExerciseConfig {
  /** Duration of inhale (seconds) */
  inhaleDuration: number

  /** Duration of hold (seconds) */
  holdDuration: number

  /** Duration of exhale (seconds) */
  exhaleDuration: number

  /** Number of cycles */
  cycles: number

  /** Play sound at end */
  playSound: boolean
}

/**
 * Default breathing exercise config (4-7-8 technique)
 */
export const DEFAULT_BREATHING_CONFIG: BreathingExerciseConfig = {
  inhaleDuration: 4,
  holdDuration: 7,
  exhaleDuration: 8,
  cycles: 1,
  playSound: true,
}

/**
 * Breathing exercise state
 */
export interface BreathingExerciseState {
  /** Whether exercise is active */
  isActive: boolean

  /** Current phase */
  currentPhase: BreathingPhase

  /** Current cycle (1-based) */
  currentCycle: number

  /** Seconds remaining in current phase */
  secondsRemaining: number

  /** Total seconds elapsed */
  totalSecondsElapsed: number

  /** Whether exercise is paused */
  isPaused: boolean
}

// ============================================================================
// EXPORTS
// ============================================================================

// All types are already exported inline above
// DEFAULT constants are exported as values below

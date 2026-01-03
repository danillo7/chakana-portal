/**
 * Chakana Wisdom Engine - Main Export File
 * Version: 1.0.0
 *
 * Centralized exports for easy importing throughout the app.
 *
 * @example
 * ```tsx
 * // Instead of:
 * import { ContextualHeader } from '@/features/wisdom-engine/components/ContextualHeader'
 * import { useWisdomStore } from '@/features/wisdom-engine/stores/wisdomStore'
 *
 * // Use:
 * import { ContextualHeader, useWisdomStore } from '@/features/wisdom-engine'
 * ```
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { ContextualHeader, ContextualHeaderWithControls } from './components/ContextualHeader'
export { WelcomeModal } from './components/WelcomeModal'
export { MicroPause } from './components/MicroPause'
export { BreathingExercise } from './components/BreathingExercise'
export { SavedReflections } from './components/SavedReflections'

// ============================================================================
// HOOKS
// ============================================================================

export { useQuoteRotation, useQuoteRotationControls } from './hooks/useQuoteRotation'
export { useWelcomeModalTriggers } from './hooks/useWelcomeModalTriggers'
export { useActivityTimer, useInactivityDetection } from './hooks/useActivityTimer'

// ============================================================================
// STORES
// ============================================================================

export { useWisdomStore } from './stores/wisdomStore'

// ============================================================================
// SERVICES
// ============================================================================

export { wisdomEngine } from './services/WisdomEngine'

// ============================================================================
// TYPES
// ============================================================================

export type {
  Quote,
  QuoteCategory,
  QuoteSubcategory,
  QuoteWeight,
  QuoteLanguage,
  QuotesDatabase,
  QuotesMetadata,
  UserContext,
  TimeOfDay,
  DayOfWeek,
  PageType,
  WisdomEnginePreferences,
  WelcomeModalState,
  ContextualHeaderState,
  MicroPauseState,
  SavedReflection,
  ReflectionStats,
  WisdomEvent,
  WisdomEventType,
  WisdomAnalyticsSummary,
  WisdomEngineConfig,
} from './types/wisdom-engine'

export { DEFAULT_WISDOM_PREFERENCES, DEFAULT_WISDOM_CONFIG } from './types/wisdom-engine'

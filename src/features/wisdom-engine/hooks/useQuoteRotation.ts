/**
 * Chakana Wisdom Engine - Quote Rotation Hook
 * Version: 1.0.0
 *
 * Custom React hook for automatic quote rotation in the ContextualHeader.
 * Handles interval timing, anti-repetition, and quote selection logic.
 */

import { useEffect, useRef } from 'react'
import { useWisdomStore } from '../stores/wisdomStore'
import { wisdomEngine } from '../services/WisdomEngine'

/**
 * Hook for automatic quote rotation
 *
 * Selects an initial quote on mount, then rotates quotes at specified interval.
 * Respects user preferences and anti-repetition logic.
 *
 * @param intervalSeconds - Rotation interval in seconds (default: 12)
 * @param enabled - Whether rotation is enabled (default: true)
 *
 * @example
 * ```tsx
 * function ContextualHeader() {
 *   const { currentQuote } = useWisdomStore()
 *   useQuoteRotation(12) // Rotate every 12 seconds
 *
 *   return <p>{currentQuote?.text}</p>
 * }
 * ```
 */
export function useQuoteRotation(
  intervalSeconds: number = 12,
  enabled: boolean = true
) {
  const { setCurrentQuote, addRecentQuote, recentQuotes, preferences } =
    useWisdomStore()

  // Use ref to track if initial quote has been set
  const hasSetInitialQuote = useRef(false)

  // Select and set a new quote
  const selectNewQuote = () => {
    const nextQuote = wisdomEngine.selectQuote(
      { preferredCategories: preferences.preferredCategories },
      recentQuotes
    )
    setCurrentQuote(nextQuote)
    addRecentQuote(nextQuote.id)
  }

  // Set initial quote on mount
  useEffect(() => {
    if (!hasSetInitialQuote.current && enabled) {
      selectNewQuote()
      hasSetInitialQuote.current = true
    }
  }, [enabled])

  // Set up rotation interval
  useEffect(() => {
    if (!enabled) return

    // Setup interval for rotation
    const interval = setInterval(() => {
      selectNewQuote()
    }, intervalSeconds * 1000)

    // Cleanup on unmount or interval change
    return () => clearInterval(interval)
  }, [intervalSeconds, enabled, preferences.preferredCategories])
}

/**
 * Hook variant with pause/resume capability
 *
 * Returns controls for pausing and resuming rotation.
 * Useful for user interactions (hover, focus, etc.)
 *
 * @param intervalSeconds - Rotation interval in seconds
 * @returns Controls object with pause/resume/skip methods
 *
 * @example
 * ```tsx
 * function ContextualHeader() {
 *   const { pause, resume, skip } = useQuoteRotationControls(12)
 *
 *   return (
 *     <div onMouseEnter={pause} onMouseLeave={resume}>
 *       <Quote />
 *       <button onClick={skip}>Next Quote</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useQuoteRotationControls(intervalSeconds: number = 12) {
  const { setCurrentQuote, addRecentQuote, recentQuotes, preferences } =
    useWisdomStore()

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPausedRef = useRef(false)
  const hasSetInitialQuote = useRef(false)

  // Select and set a new quote
  const selectNewQuote = () => {
    const nextQuote = wisdomEngine.selectQuote(
      { preferredCategories: preferences.preferredCategories },
      recentQuotes
    )
    setCurrentQuote(nextQuote)
    addRecentQuote(nextQuote.id)
  }

  // Start the rotation interval
  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        selectNewQuote()
      }
    }, intervalSeconds * 1000)
  }

  // Set initial quote and start rotation
  useEffect(() => {
    if (!hasSetInitialQuote.current) {
      selectNewQuote()
      hasSetInitialQuote.current = true
    }

    startInterval()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [intervalSeconds, preferences.preferredCategories])

  // Control methods
  const pause = () => {
    isPausedRef.current = true
  }

  const resume = () => {
    isPausedRef.current = false
  }

  const skip = () => {
    selectNewQuote()
  }

  return {
    pause,
    resume,
    skip,
  }
}

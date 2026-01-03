/**
 * Chakana Wisdom Engine - Contextual Header Component
 * Version: 1.0.0
 *
 * Displays rotating reflection quotes below the main dashboard greeting.
 * Features smooth animations, hover interactions, and copy/save functionality.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWisdomStore } from '../stores/wisdomStore'
import { useQuoteRotation } from '../hooks/useQuoteRotation'

/**
 * ContextualHeader Component
 *
 * Displays the current quote with smooth fade transitions.
 * Shows action buttons (Copy/Save) on hover.
 *
 * @example
 * ```tsx
 * <Dashboard>
 *   <h1>Buenas tardes 🌅</h1>
 *   <p>Portal Chakana</p>
 *   <ContextualHeader />
 * </Dashboard>
 * ```
 */
export function ContextualHeader() {
  const { currentQuote, preferences, saveReflection } = useWisdomStore()
  const [isPaused, setIsPaused] = useState(false)
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false)
  const [showSavedFeedback, setShowSavedFeedback] = useState(false)

  // Automatic rotation hook
  useQuoteRotation(preferences.headerRotationInterval)

  // If no quote yet, don't render anything
  if (!currentQuote) return null

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentQuote.text)
      setShowCopiedFeedback(true)
      setTimeout(() => setShowCopiedFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to copy quote:', err)
    }
  }

  // Handle save reflection
  const handleSave = () => {
    if (!currentQuote) return

    try {
      saveReflection({
        quote: currentQuote,
        userNote: '', // Empty note initially, can be added later in SavedReflections page
        context: 'dashboard_header',
      })

      setShowSavedFeedback(true)
      setTimeout(() => setShowSavedFeedback(false), 2000)
    } catch (err) {
      console.error('Failed to save reflection:', err)
    }
  }

  return (
    <div
      className="relative py-4 px-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Quote Display with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="flex items-start gap-3"
        >
          {/* Icon */}
          <span className="text-xl flex-shrink-0" aria-hidden="true">
            ✨
          </span>

          {/* Quote Text */}
          <p className="text-base text-gray-400 font-light italic leading-relaxed">
            "{currentQuote.text}"
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons (visible on hover) */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2"
          >
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-gray-200 font-medium"
              aria-label="Copiar reflexión"
            >
              {showCopiedFeedback ? '✓ Copiado' : 'Copiar'}
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="text-xs px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-gray-200 font-medium"
              aria-label="Guardar reflexión"
            >
              {showSavedFeedback ? '✓ Guardado' : 'Guardar'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Badge (optional, only on hover) */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-gray-500"
        >
          <span className="capitalize">{currentQuote.category}</span>
          {' · '}
          <span className="capitalize">{currentQuote.subcategory}</span>
        </motion.div>
      )}
    </div>
  )
}

/**
 * Variant with manual controls (for testing/debugging)
 */
export function ContextualHeaderWithControls() {
  const { currentQuote } = useWisdomStore()
  const [isPaused, setIsPaused] = useState(false)

  // Use hook with controls
  const { pause, resume, skip } = useQuoteRotationControls(12)

  if (!currentQuote) return null

  return (
    <div className="relative py-4 px-2 border border-dashed border-gray-700 rounded">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-start gap-3"
        >
          <span className="text-xl">✨</span>
          <p className="text-base text-gray-400 font-light italic">
            "{currentQuote.text}"
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Debug Controls */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            if (isPaused) {
              resume()
              setIsPaused(false)
            } else {
              pause()
              setIsPaused(true)
            }
          }}
          className="text-xs px-2 py-1 bg-blue-600 rounded"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={skip} className="text-xs px-2 py-1 bg-green-600 rounded">
          Next Quote
        </button>
        <span className="text-xs text-gray-500 self-center">
          ID: {currentQuote.id}
        </span>
      </div>
    </div>
  )
}

// Import statement for controls variant (needed for TypeScript)
import { useQuoteRotationControls } from '../hooks/useQuoteRotation'

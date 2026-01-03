/**
 * Chakana Wisdom Engine - Micro-Pause Component
 * Version: 1.0.0
 *
 * Gentle interruption after 20 minutes of activity
 * with breathing exercise and reflection quote
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pause, Play } from 'lucide-react'
import { useWisdomStore } from '../stores/wisdomStore'
import { wisdomEngine } from '../services/WisdomEngine'
import { useActivityTimer } from '../hooks/useActivityTimer'
import { BreathingExercise } from './BreathingExercise'
import type { Quote } from '../types/wisdom-engine'

/**
 * Micro-Pause Component
 *
 * Shows after configured interval (default: 20 minutes)
 * Includes breathing exercise and reflection quote
 */
export function MicroPause() {
  const { preferences, recentQuotes } = useWisdomStore()
  const [isShown, setIsShown] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [showBreathing, setShowBreathing] = useState(false)

  // Activity timer with callback
  const { activeMinutes, minutesUntilNext, reset } = useActivityTimer({
    intervalMinutes: preferences.microPauseIntervalMinutes,
    enabled: preferences.enableMicroPauses,
    onIntervalReached: () => {
      // Trigger micro-pause
      const selectedQuote = wisdomEngine.getRandomQuoteFromCategory(
        'presencia',
        recentQuotes
      )
      setQuote(selectedQuote)
      setIsShown(true)
    },
  })

  const handleClose = () => {
    setIsShown(false)
    setShowBreathing(false)
    reset()
  }

  const handleStartBreathing = () => {
    setShowBreathing(true)
  }

  const handleBreathingComplete = () => {
    // Auto-close after breathing completes
    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  if (!isShown || !quote) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      >
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-lg w-full bg-gradient-to-br from-chakana-dark via-chakana-dark-light to-chakana-dark rounded-3xl p-8 shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-radial-sage opacity-15 rounded-3xl" />
          <div className="absolute top-0 left-1/2 w-48 h-48 bg-chakana-mint/20 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group z-10"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </button>

          <div className="relative z-10">
            {!showBreathing ? (
              /* Initial Screen - Quote & Invitation */
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-chakana-mint/20 flex items-center justify-center mx-auto mb-6">
                  <Pause className="w-8 h-8 text-chakana-mint" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  Momento para pausar
                </h3>

                <p className="text-white/60 mb-6">
                  Llevas <span className="font-semibold text-chakana-mint">{activeMinutes} minutos</span> trabajando.
                  <br />
                  Es momento de una micro-pausa consciente.
                </p>

                {/* Quote */}
                <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
                  <p className="text-lg font-light text-white/90 italic leading-relaxed">
                    "{quote.text}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleStartBreathing}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-chakana-sage to-chakana-mint text-white font-semibold hover:shadow-sage-glow transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Comenzar ejercicio de respiración
                  </button>

                  <button
                    onClick={handleClose}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium transition-all"
                  >
                    Continuar trabajando
                  </button>
                </div>

                {/* Timer info */}
                <p className="text-xs text-white/40 mt-4">
                  Próxima pausa en {minutesUntilNext} minutos
                </p>
              </div>
            ) : (
              /* Breathing Exercise Screen */
              <div>
                <h3 className="text-xl font-display font-bold text-white text-center mb-2">
                  Ejercicio 4-7-8
                </h3>
                <p className="text-sm text-white/60 text-center mb-6">
                  Sigue el círculo y respira profundamente
                </p>

                <BreathingExercise onComplete={handleBreathingComplete} />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

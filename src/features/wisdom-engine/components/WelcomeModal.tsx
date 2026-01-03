/**
 * Chakana Wisdom Engine - Welcome Modal Component
 * Version: 1.0.0
 *
 * Ritual de entrada semanal/mensal com frase inspiradora.
 * Aparece em triggers específicos (segunda-feira, primeiro do mês, etc.)
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { useWisdomStore } from '../stores/wisdomStore'
import { wisdomEngine } from '../services/WisdomEngine'
import { useWelcomeModalTriggers } from '../hooks/useWelcomeModalTriggers'
import type { Quote } from '../types/wisdom-engine'

/**
 * Welcome Modal Component
 *
 * Shows a full-screen modal with inspirational quote on specific triggers
 */
export function WelcomeModal() {
  const { welcomeModalState, setWelcomeModalState, preferences, recentQuotes } =
    useWisdomStore()
  const triggerResult = useWelcomeModalTriggers()

  const [quote, setQuote] = useState<Quote | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)

  // Check if modal should be shown based on triggers
  useEffect(() => {
    if (triggerResult.shouldShow && preferences.enableWelcomeModal) {
      // Select a special quote (prefer transformación category)
      const selectedQuote = wisdomEngine.getRandomQuoteFromCategory(
        'transformacion',
        recentQuotes
      )
      setQuote(selectedQuote)

      setWelcomeModalState({
        isShown: true,
        trigger: triggerResult.trigger,
        quote: selectedQuote,
        shownAt: new Date(),
        dismissed: false,
      })
    }
  }, [triggerResult.shouldShow])

  // Track time spent viewing modal
  useEffect(() => {
    if (!welcomeModalState.isShown) return

    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [welcomeModalState.isShown])

  // Handle close
  const handleClose = () => {
    setWelcomeModalState({
      isShown: false,
      dismissed: true,
      timeSpent,
    })
  }

  if (!welcomeModalState.isShown || !quote) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative max-w-2xl w-full bg-gradient-to-br from-chakana-dark via-chakana-dark-light to-chakana-dark rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-radial-sage opacity-20 rounded-3xl" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-chakana-sage/20 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-chakana-mint/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group z-10"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          </button>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-chakana-sage/20 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-chakana-sage" />
            </div>

            {/* Trigger Message */}
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {getTriggerTitle(welcomeModalState.trigger)}
            </h2>

            <p className="text-lg text-white/60 mb-8 max-w-md">
              {triggerResult.message}
            </p>

            {/* Quote */}
            <div className="relative mb-8">
              <div className="absolute -left-4 -top-4 text-6xl text-chakana-sage/20 font-serif">
                "
              </div>
              <p className="text-2xl md:text-3xl font-light text-white leading-relaxed italic px-8">
                {quote.text}
              </p>
              <div className="absolute -right-4 -bottom-4 text-6xl text-chakana-sage/20 font-serif">
                "
              </div>
            </div>

            {/* Category Badge */}
            <div className="flex items-center gap-2 text-sm text-white/40 mb-8">
              <span className="capitalize">{quote.category}</span>
              <span>·</span>
              <span className="capitalize">{quote.subcategory}</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-chakana-sage to-chakana-mint text-white font-semibold hover:shadow-sage-glow transition-all duration-300 hover:scale-105"
            >
              Comenzar el día
            </button>

            {/* Optional: Background Music Toggle (Phase 6) */}
            {/* <div className="mt-6">
              <button className="text-xs text-white/40 hover:text-white/60">
                🎵 Música de fondo
              </button>
            </div> */}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Get title based on trigger type
 */
function getTriggerTitle(trigger?: string): string {
  switch (trigger) {
    case 'monday_morning':
      return '¡Feliz Lunes! 🌅'
    case 'first_of_month':
      return '¡Nuevo Mes, Nueva Energía! 🌙'
    case 'user_birthday':
      return '¡Feliz Cumpleaños! 🎉'
    case 'retreat_soon':
      return 'Tu Retiro se Acerca 🏔️'
    case 'post_action_completion':
      return '¡Bien Hecho! ✨'
    case 'manual':
      return 'Momento de Reflexión 🧘'
    default:
      return 'Bienvenido 💫'
  }
}

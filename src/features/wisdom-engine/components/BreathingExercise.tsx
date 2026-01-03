/**
 * Chakana Wisdom Engine - Breathing Exercise Component
 * Version: 1.0.0
 *
 * Interactive breathing exercise using 4-7-8 technique:
 * - Inhale for 4 seconds
 * - Hold for 7 seconds
 * - Exhale for 8 seconds
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { BreathingPhase } from '../types/wisdom-engine'

interface BreathingExerciseProps {
  /** Callback when exercise completes */
  onComplete?: () => void
  /** Whether to play sound (future implementation) */
  playSound?: boolean
}

/**
 * Breathing Exercise Component
 *
 * Visual guide for 4-7-8 breathing technique
 */
export function BreathingExercise({
  onComplete,
  playSound: _playSound = false, // Future implementation
}: BreathingExerciseProps) {
  const [phase, setPhase] = useState<BreathingPhase>('inhale')
  const [seconds, setSeconds] = useState(4)
  const [isActive, setIsActive] = useState(true)

  // Breathing cycle configuration (4-7-8 technique)
  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
  }

  const phaseMessages = {
    inhale: 'Inhala profundamente',
    hold: 'Mantén',
    exhale: 'Exhala lentamente',
  }

  // Timer logic
  useEffect(() => {
    if (!isActive) return

    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Move to next phase
      if (phase === 'inhale') {
        setPhase('hold')
        setSeconds(phaseDurations.hold)
      } else if (phase === 'hold') {
        setPhase('exhale')
        setSeconds(phaseDurations.exhale)
      } else if (phase === 'exhale') {
        // Exercise complete
        setIsActive(false)
        if (onComplete) {
          setTimeout(onComplete, 500)
        }
      }
    }
  }, [seconds, phase, isActive])

  // Circle scale animation based on phase
  const getCircleScale = () => {
    if (phase === 'inhale') {
      return 1 + (1 - seconds / phaseDurations.inhale) * 0.5 // Grow from 1 to 1.5
    } else if (phase === 'hold') {
      return 1.5 // Stay large
    } else {
      return 1.5 - ((phaseDurations.exhale - seconds) / phaseDurations.exhale) * 0.5 // Shrink to 1
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Breathing Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-chakana-sage/20 blur-2xl"
          animate={{
            scale: getCircleScale(),
            opacity: phase === 'hold' ? 0.4 : 0.2,
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
          }}
        />

        {/* Main breathing circle */}
        <motion.div
          className="relative w-48 h-48 rounded-full bg-gradient-to-br from-chakana-sage to-chakana-mint flex items-center justify-center shadow-2xl"
          animate={{
            scale: getCircleScale(),
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
          }}
        >
          {/* Counter */}
          <div className="text-center">
            <p className="text-6xl font-bold text-white">{seconds}</p>
            <p className="text-sm text-white/80 mt-2 capitalize">{phase}</p>
          </div>
        </motion.div>

        {/* Animated particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-chakana-mint/40"
            style={{
              top: '50%',
              left: '50%',
              marginLeft: '-4px',
              marginTop: '-4px',
            }}
            animate={{
              x: Math.cos((i / 12) * Math.PI * 2) * (60 * getCircleScale()),
              y: Math.sin((i / 12) * Math.PI * 2) * (60 * getCircleScale()),
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Instructions */}
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-light text-white mb-2"
      >
        {phaseMessages[phase]}
      </motion.p>

      {/* Phase indicator dots */}
      <div className="flex gap-2 mt-4">
        <div
          className={`w-2 h-2 rounded-full transition-colors ${
            phase === 'inhale' ? 'bg-chakana-sage' : 'bg-white/20'
          }`}
        />
        <div
          className={`w-2 h-2 rounded-full transition-colors ${
            phase === 'hold' ? 'bg-chakana-sage' : 'bg-white/20'
          }`}
        />
        <div
          className={`w-2 h-2 rounded-full transition-colors ${
            phase === 'exhale' ? 'bg-chakana-sage' : 'bg-white/20'
          }`}
        />
      </div>

      {/* Completion message */}
      {!isActive && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-chakana-mint mt-8"
        >
          ✨ Ejercicio completado
        </motion.p>
      )}
    </div>
  )
}

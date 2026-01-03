/**
 * Chakana Wisdom Engine - Welcome Modal Triggers Hook
 * Version: 1.0.0
 *
 * Detects triggers for showing the Welcome Modal:
 * - Monday morning (first visit of the week)
 * - First day of the month
 * - User birthday
 * - Upcoming retreat (within 7 days)
 * - Post action completion (after completing urgent action)
 */

import { useEffect, useState } from 'react'
import { useWisdomStore } from '../stores/wisdomStore'
import type { WelcomeModalTrigger } from '../types/wisdom-engine'

interface TriggerResult {
  shouldShow: boolean
  trigger?: WelcomeModalTrigger
  message?: string
}

/**
 * Hook to detect Welcome Modal triggers
 *
 * Checks various conditions and returns whether modal should be shown
 *
 * @returns Trigger result with shouldShow flag and trigger type
 */
export function useWelcomeModalTriggers(): TriggerResult {
  const { welcomeModalState } = useWisdomStore()
  const [result, setResult] = useState<TriggerResult>({ shouldShow: false })

  useEffect(() => {
    // Don't show if already dismissed today
    if (welcomeModalState.dismissed) {
      const dismissedAt = welcomeModalState.shownAt
      if (dismissedAt) {
        const today = new Date().toDateString()
        const dismissedDate = new Date(dismissedAt).toDateString()
        if (today === dismissedDate) {
          return
        }
      }
    }

    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const dayOfMonth = now.getDate()
    const hour = now.getHours()

    // Check triggers in priority order

    // 1. Monday Morning (6am - 12pm)
    if (dayOfWeek === 1 && hour >= 6 && hour < 12) {
      const lastShown = localStorage.getItem('wisdom:last-monday-modal')
      const lastShownDate = lastShown ? new Date(lastShown) : null
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay() + 1) // Monday of this week
      weekStart.setHours(0, 0, 0, 0)

      if (!lastShownDate || lastShownDate < weekStart) {
        setResult({
          shouldShow: true,
          trigger: 'monday_morning',
          message: 'Bienvenido a una nueva semana de transformación'
        })
        localStorage.setItem('wisdom:last-monday-modal', now.toISOString())
        return
      }
    }

    // 2. First of Month
    if (dayOfMonth === 1) {
      const lastShown = localStorage.getItem('wisdom:last-monthly-modal')
      const lastShownDate = lastShown ? new Date(lastShown) : null
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      if (!lastShownDate || lastShownDate < monthStart) {
        setResult({
          shouldShow: true,
          trigger: 'first_of_month',
          message: 'Un nuevo mes, nuevas oportunidades para crecer'
        })
        localStorage.setItem('wisdom:last-monthly-modal', now.toISOString())
        return
      }
    }

    // 3. User Birthday (would need user profile data)
    // TODO: Implement when user profile is available
    // const userBirthday = getUserBirthday()
    // if (isToday(userBirthday)) { ... }

    // 4. Retreat Soon (would need retreat data)
    // TODO: Implement when retreat API is available
    // const nextRetreat = getNextRetreat()
    // if (daysUntil(nextRetreat) <= 7) { ... }

    // No triggers matched
    setResult({ shouldShow: false })
  }, [])

  return result
}

/**
 * Manual trigger function
 *
 * Can be called to manually show the welcome modal
 *
 * @example
 * ```tsx
 * const { triggerManual } = useWelcomeModalManualTrigger()
 * <button onClick={triggerManual}>Show Welcome</button>
 * ```
 */
export function useWelcomeModalManualTrigger() {
  const { setWelcomeModalState } = useWisdomStore()

  const triggerManual = () => {
    setWelcomeModalState({
      isShown: true,
      trigger: 'manual',
      dismissed: false,
      shownAt: new Date(),
    })
  }

  return { triggerManual }
}

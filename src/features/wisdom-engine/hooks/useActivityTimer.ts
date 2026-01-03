/**
 * Chakana Wisdom Engine - Activity Timer Hook
 * Version: 1.0.0
 *
 * Tracks user active time and triggers micro-pauses
 * after specified intervals (default: 20 minutes)
 */

import { useEffect, useState, useRef } from 'react'
import { useWisdomStore } from '../stores/wisdomStore'

interface ActivityTimerOptions {
  /** Interval in minutes before triggering micro-pause */
  intervalMinutes?: number
  /** Whether timer is enabled */
  enabled?: boolean
  /** Callback when interval is reached */
  onIntervalReached?: () => void
}

/**
 * Hook to track user activity time
 *
 * Increments session time every minute and triggers
 * micro-pause when threshold is reached
 *
 * @param options - Configuration options
 * @returns Current active minutes and reset function
 */
export function useActivityTimer(options: ActivityTimerOptions = {}) {
  const {
    intervalMinutes = 20,
    enabled = true,
    onIntervalReached,
  } = options

  const { sessionActiveMinutes, incrementActiveTime, preferences } =
    useWisdomStore()

  const [lastTrigger, setLastTrigger] = useState<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!enabled || !preferences.enableMicroPauses) return

    // Increment every minute
    intervalRef.current = setInterval(() => {
      incrementActiveTime()
    }, 60 * 1000) // 1 minute

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, preferences.enableMicroPauses])

  // Check if interval threshold reached
  useEffect(() => {
    if (!enabled || !preferences.enableMicroPauses) return

    const minutesSinceLastTrigger = sessionActiveMinutes - lastTrigger

    if (minutesSinceLastTrigger >= intervalMinutes) {
      if (onIntervalReached) {
        onIntervalReached()
      }
      setLastTrigger(sessionActiveMinutes)
    }
  }, [sessionActiveMinutes, intervalMinutes, lastTrigger])

  const reset = () => {
    setLastTrigger(sessionActiveMinutes)
  }

  return {
    activeMinutes: sessionActiveMinutes,
    minutesUntilNext: intervalMinutes - (sessionActiveMinutes - lastTrigger),
    reset,
  }
}

/**
 * Hook to detect user inactivity
 *
 * Triggers callback after user has been inactive for specified time
 *
 * @param onInactive - Callback when user becomes inactive
 * @param inactivityMinutes - Minutes of inactivity before triggering (default: 5)
 */
export function useInactivityDetection(
  onInactive?: () => void,
  inactivityMinutes: number = 5
) {
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [isInactive, setIsInactive] = useState(false)

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now())
      setIsInactive(false)
    }

    // Listen for user activity events
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('scroll', handleActivity)

    // Check inactivity every minute
    const interval = setInterval(() => {
      const minutesInactive = (Date.now() - lastActivity) / (1000 * 60)

      if (minutesInactive >= inactivityMinutes && !isInactive) {
        setIsInactive(true)
        if (onInactive) {
          onInactive()
        }
      }
    }, 60 * 1000) // Check every minute

    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      clearInterval(interval)
    }
  }, [lastActivity, inactivityMinutes, isInactive])

  return { isInactive, lastActivity }
}

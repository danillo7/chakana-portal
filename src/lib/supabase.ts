/**
 * Chakana Portal - Supabase Client
 * Version: 1.0.0
 *
 * Centralized Supabase client for authentication and database access.
 *
 * Environment variables required:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anon/public key
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

/**
 * Supabase URL from environment
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

/**
 * Supabase anon key from environment
 */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/**
 * Supabase client instance
 *
 * Returns null if not configured (missing env vars)
 */
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null

/**
 * Get current user ID
 *
 * Returns anonymous ID if not authenticated
 */
export async function getUserId(): Promise<string> {
  if (!supabase) {
    // Return device-specific anonymous ID if Supabase not configured
    const anonymousId = localStorage.getItem('chakana_anonymous_id')
    if (anonymousId) return anonymousId

    // Generate new anonymous ID
    const newId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('chakana_anonymous_id', newId)
    return newId
  }

  const { data } = await supabase.auth.getUser()

  if (data.user) {
    return data.user.id
  }

  // Return anonymous ID for unauthenticated users
  const anonymousId = localStorage.getItem('chakana_anonymous_id')
  if (anonymousId) return anonymousId

  const newId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('chakana_anonymous_id', newId)
  return newId
}

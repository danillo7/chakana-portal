/**
 * Chakana Wisdom Engine - Supabase Sync Service
 * Version: 1.0.0
 *
 * Synchronizes saved reflections across devices using Supabase.
 *
 * Features:
 * - Push local reflections to cloud
 * - Pull remote reflections from cloud
 * - Conflict resolution (last-write-wins)
 * - Offline-first (works without Supabase configured)
 * - Auto-sync on changes
 */

import { supabase, getUserId, isSupabaseConfigured } from '@/lib/supabase'
import type { SavedReflection } from '../types/wisdom-engine'

/**
 * Sync status
 */
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

/**
 * Sync result
 */
export interface SyncResult {
  success: boolean
  pushed: number
  pulled: number
  errors: string[]
}

/**
 * SupabaseSync Service
 *
 * Handles bidirectional sync of reflections
 */
class SupabaseSyncService {
  private syncInProgress = false
  private lastSyncTime: Date | null = null

  /**
   * Check if sync is available
   */
  get isAvailable(): boolean {
    return isSupabaseConfigured
  }

  /**
   * Push local reflections to Supabase
   *
   * @param reflections - Local reflections to push
   * @returns Sync result
   */
  async push(reflections: SavedReflection[]): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      pushed: 0,
      pulled: 0,
      errors: [],
    }

    if (!this.isAvailable) {
      result.errors.push('Supabase not configured')
      return result
    }

    if (this.syncInProgress) {
      result.errors.push('Sync already in progress')
      return result
    }

    this.syncInProgress = true

    try {
      const userId = await getUserId()

      // Transform reflections to database format
      const dbReflections = reflections.map((r) => ({
        id: r.id,
        user_id: userId,
        quote_id: r.quote.id,
        quote_data: r.quote,
        user_note: r.userNote || null,
        tags: r.tags || null,
        saved_at: new Date(r.savedAt).toISOString(),
        updated_at: new Date(r.updatedAt || r.savedAt).toISOString(),
      }))

      // Upsert reflections (insert or update if exists)
      const { error } = await supabase!.from('reflections').upsert(dbReflections, {
        onConflict: 'id',
      })

      if (error) {
        result.errors.push(error.message)
      } else {
        result.success = true
        result.pushed = dbReflections.length
        this.lastSyncTime = new Date()
      }
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      this.syncInProgress = false
    }

    return result
  }

  /**
   * Pull remote reflections from Supabase
   *
   * Merges with local reflections using last-write-wins strategy
   *
   * @param localReflections - Current local reflections
   * @returns Merged reflections and sync result
   */
  async pull(
    localReflections: SavedReflection[]
  ): Promise<{ reflections: SavedReflection[]; result: SyncResult }> {
    const result: SyncResult = {
      success: false,
      pushed: 0,
      pulled: 0,
      errors: [],
    }

    if (!this.isAvailable) {
      result.errors.push('Supabase not configured')
      return { reflections: localReflections, result }
    }

    if (this.syncInProgress) {
      result.errors.push('Sync already in progress')
      return { reflections: localReflections, result }
    }

    this.syncInProgress = true

    try {
      const userId = await getUserId()

      // Fetch remote reflections
      const { data: remoteData, error } = await supabase!
        .from('reflections')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) {
        result.errors.push(error.message)
        this.syncInProgress = false
        return { reflections: localReflections, result }
      }

      // Transform remote data to SavedReflection format
      const remoteReflections: SavedReflection[] = (remoteData || []).map((r) => ({
        id: r.id,
        quote: r.quote_data,
        savedAt: new Date(r.saved_at),
        updatedAt: r.updated_at ? new Date(r.updated_at) : undefined,
        userNote: r.user_note || undefined,
        tags: r.tags || undefined,
      }))

      // Merge reflections (last-write-wins)
      const merged = this.mergeReflections(localReflections, remoteReflections)

      result.success = true
      result.pulled = remoteReflections.length
      this.lastSyncTime = new Date()

      return { reflections: merged, result }
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
      return { reflections: localReflections, result }
    } finally {
      this.syncInProgress = false
    }
  }

  /**
   * Full sync: pull then push
   *
   * 1. Pull remote reflections
   * 2. Merge with local
   * 3. Push merged result back
   *
   * @param localReflections - Current local reflections
   * @returns Merged reflections and sync result
   */
  async sync(
    localReflections: SavedReflection[]
  ): Promise<{ reflections: SavedReflection[]; result: SyncResult }> {
    if (!this.isAvailable) {
      return {
        reflections: localReflections,
        result: {
          success: false,
          pushed: 0,
          pulled: 0,
          errors: ['Supabase not configured'],
        },
      }
    }

    // Step 1: Pull remote data
    const pullResult = await this.pull(localReflections)

    if (!pullResult.result.success) {
      return pullResult
    }

    // Step 2: Push merged data
    const pushResult = await this.push(pullResult.reflections)

    // Combine results
    const combinedResult: SyncResult = {
      success: pullResult.result.success && pushResult.success,
      pushed: pushResult.pushed,
      pulled: pullResult.result.pulled,
      errors: [...pullResult.result.errors, ...pushResult.errors],
    }

    return {
      reflections: pullResult.reflections,
      result: combinedResult,
    }
  }

  /**
   * Delete reflection from Supabase
   *
   * @param reflectionId - ID of reflection to delete
   */
  async delete(reflectionId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isAvailable) {
      return { success: false, error: 'Supabase not configured' }
    }

    try {
      const { error } = await supabase!.from('reflections').delete().eq('id', reflectionId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Merge local and remote reflections
   *
   * Strategy: Last-write-wins based on updatedAt/savedAt
   *
   * @param local - Local reflections
   * @param remote - Remote reflections
   * @returns Merged reflections
   */
  private mergeReflections(
    local: SavedReflection[],
    remote: SavedReflection[]
  ): SavedReflection[] {
    const reflectionMap = new Map<string, SavedReflection>()

    // Add all local reflections
    local.forEach((r) => reflectionMap.set(r.id, r))

    // Merge remote reflections (overwrite if newer)
    remote.forEach((r) => {
      const existing = reflectionMap.get(r.id)

      if (!existing) {
        // New reflection from remote
        reflectionMap.set(r.id, r)
      } else {
        // Compare timestamps (use updatedAt if available, otherwise savedAt)
        const localTime = existing.updatedAt || existing.savedAt
        const remoteTime = r.updatedAt || r.savedAt

        if (remoteTime > localTime) {
          // Remote is newer, use it
          reflectionMap.set(r.id, r)
        }
        // Otherwise keep local (it's newer or same)
      }
    })

    return Array.from(reflectionMap.values()).sort(
      (a, b) => b.savedAt.getTime() - a.savedAt.getTime()
    )
  }

  /**
   * Get last sync time
   */
  getLastSyncTime(): Date | null {
    return this.lastSyncTime
  }

  /**
   * Check if sync is in progress
   */
  isSyncing(): boolean {
    return this.syncInProgress
  }
}

/**
 * Singleton instance
 */
export const supabaseSync = new SupabaseSyncService()

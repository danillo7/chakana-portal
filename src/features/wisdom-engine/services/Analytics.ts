/**
 * Chakana Wisdom Engine - Analytics Service
 * Version: 1.0.0
 *
 * Tracks and computes user engagement analytics:
 * - Reflection statistics
 * - Category preferences
 * - Activity streaks
 * - Engagement patterns
 */

import type {
  SavedReflection,
  QuoteCategory,
  ReflectionStats,
  WisdomAnalyticsSummary,
} from '../types/wisdom-engine'

/**
 * Category breakdown
 */
export interface CategoryStats {
  category: QuoteCategory
  count: number
  percentage: number
}

/**
 * Tag usage stats
 */
export interface TagStats {
  tag: string
  count: number
}

/**
 * Activity by date
 */
export interface DailyActivity {
  date: string // YYYY-MM-DD
  reflections: number
}

/**
 * Author stats
 */
export interface AuthorStats {
  author: string
  count: number
}

/**
 * Complete analytics summary
 */
export interface AnalyticsSummary {
  // Overview
  totalReflections: number
  uniqueCategories: number
  uniqueTags: number
  averageNoteLength: number

  // Time-based
  firstReflectionDate: Date | null
  lastReflectionDate: Date | null
  daysActive: number
  currentStreak: number
  longestStreak: number

  // Breakdown
  categoriesBreakdown: CategoryStats[]
  topTags: TagStats[]
  topAuthors: AuthorStats[]
  dailyActivity: DailyActivity[]

  // Favorites
  favoriteCategory: QuoteCategory | null
  favoriteAuthor: string | null
}

/**
 * Analytics Service
 *
 * Computes all analytics from saved reflections
 */
class AnalyticsService {
  /**
   * Compute full analytics summary
   *
   * @param reflections - All saved reflections
   * @returns Complete analytics summary
   */
  computeSummary(reflections: SavedReflection[]): AnalyticsSummary {
    if (reflections.length === 0) {
      return this.getEmptySummary()
    }

    // Sort by date (oldest first)
    const sorted = [...reflections].sort(
      (a, b) => a.savedAt.getTime() - b.savedAt.getTime()
    )

    // Overview stats
    const totalReflections = reflections.length
    const uniqueCategories = new Set(reflections.map((r) => r.quote.category)).size
    const uniqueTags = new Set(
      reflections.flatMap((r) => r.tags || [])
    ).size

    const notesWithLength = reflections.filter((r) => r.userNote && r.userNote.trim())
    const averageNoteLength = notesWithLength.length > 0
      ? Math.round(
          notesWithLength.reduce((sum, r) => sum + (r.userNote?.length || 0), 0) /
            notesWithLength.length
        )
      : 0

    // Time-based
    const firstReflectionDate = sorted[0].savedAt
    const lastReflectionDate = sorted[sorted.length - 1].savedAt

    const { daysActive, currentStreak, longestStreak } = this.computeStreaks(sorted)

    // Categories breakdown
    const categoriesBreakdown = this.computeCategoryBreakdown(reflections)

    // Top tags
    const topTags = this.computeTopTags(reflections, 10)

    // Top authors
    const topAuthors = this.computeTopAuthors(reflections, 5)

    // Daily activity (last 30 days)
    const dailyActivity = this.computeDailyActivity(reflections, 30)

    // Favorites
    const favoriteCategory = categoriesBreakdown[0]?.category || null
    const favoriteAuthor = topAuthors[0]?.author || null

    return {
      totalReflections,
      uniqueCategories,
      uniqueTags,
      averageNoteLength,
      firstReflectionDate,
      lastReflectionDate,
      daysActive,
      currentStreak,
      longestStreak,
      categoriesBreakdown,
      topTags,
      topAuthors,
      dailyActivity,
      favoriteCategory,
      favoriteAuthor,
    }
  }

  /**
   * Compute category breakdown
   */
  private computeCategoryBreakdown(reflections: SavedReflection[]): CategoryStats[] {
    const counts = new Map<QuoteCategory, number>()

    reflections.forEach((r) => {
      const category = r.quote.category
      counts.set(category, (counts.get(category) || 0) + 1)
    })

    const total = reflections.length
    const breakdown: CategoryStats[] = Array.from(counts.entries())
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)

    return breakdown
  }

  /**
   * Compute top tags
   */
  private computeTopTags(reflections: SavedReflection[], limit: number): TagStats[] {
    const counts = new Map<string, number>()

    reflections.forEach((r) => {
      r.tags?.forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1)
      })
    })

    const topTags: TagStats[] = Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)

    return topTags
  }

  /**
   * Compute top authors
   */
  private computeTopAuthors(
    reflections: SavedReflection[],
    limit: number
  ): AuthorStats[] {
    const counts = new Map<string, number>()

    reflections.forEach((r) => {
      const author = r.quote.author
      counts.set(author, (counts.get(author) || 0) + 1)
    })

    const topAuthors: AuthorStats[] = Array.from(counts.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)

    return topAuthors
  }

  /**
   * Compute daily activity (last N days)
   */
  private computeDailyActivity(
    reflections: SavedReflection[],
    days: number
  ): DailyActivity[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Generate last N days
    const dateMap = new Map<string, number>()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const key = date.toISOString().split('T')[0]
      dateMap.set(key, 0)
    }

    // Count reflections per day
    reflections.forEach((r) => {
      const date = new Date(r.savedAt)
      date.setHours(0, 0, 0, 0)
      const key = date.toISOString().split('T')[0]
      if (dateMap.has(key)) {
        dateMap.set(key, dateMap.get(key)! + 1)
      }
    })

    return Array.from(dateMap.entries())
      .map(([date, reflections]) => ({ date, reflections }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  /**
   * Compute activity streaks
   */
  private computeStreaks(sortedReflections: SavedReflection[]): {
    daysActive: number
    currentStreak: number
    longestStreak: number
  } {
    if (sortedReflections.length === 0) {
      return { daysActive: 0, currentStreak: 0, longestStreak: 0 }
    }

    // Get unique dates (YYYY-MM-DD)
    const uniqueDates = new Set<string>()
    sortedReflections.forEach((r) => {
      const date = new Date(r.savedAt)
      date.setHours(0, 0, 0, 0)
      uniqueDates.add(date.toISOString().split('T')[0])
    })

    const daysActive = uniqueDates.size

    // Convert to sorted array of Date objects
    const dates = Array.from(uniqueDates)
      .sort()
      .map((d) => new Date(d))

    // Compute current streak (from today backwards)
    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i >= -365; i--) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() + i)
      const key = checkDate.toISOString().split('T')[0]

      if (uniqueDates.has(key)) {
        currentStreak++
      } else if (i < 0) {
        // Found gap in past, stop counting
        break
      }
    }

    // Compute longest streak
    let longestStreak = 0
    let tempStreak = 1

    for (let i = 1; i < dates.length; i++) {
      const prevDate = dates[i - 1]
      const currDate = dates[i]
      const diffDays = Math.round(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak)

    return { daysActive, currentStreak, longestStreak }
  }

  /**
   * Get empty summary (no reflections)
   */
  private getEmptySummary(): AnalyticsSummary {
    return {
      totalReflections: 0,
      uniqueCategories: 0,
      uniqueTags: 0,
      averageNoteLength: 0,
      firstReflectionDate: null,
      lastReflectionDate: null,
      daysActive: 0,
      currentStreak: 0,
      longestStreak: 0,
      categoriesBreakdown: [],
      topTags: [],
      topAuthors: [],
      dailyActivity: [],
      favoriteCategory: null,
      favoriteAuthor: null,
    }
  }
}

/**
 * Singleton instance
 */
export const analytics = new AnalyticsService()

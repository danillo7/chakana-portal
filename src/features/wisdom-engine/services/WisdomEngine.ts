/**
 * Chakana Wisdom Engine - Core Service
 * Version: 1.0.0
 *
 * Main business logic for intelligent quote selection.
 * Handles weighted randomization, anti-repetition, and context-aware filtering.
 */

import quotesData from '../data/quotes.json'
import type {
  Quote,
  UserContext,
  QuoteCategory,
  QuoteSubcategory,
  QuoteLanguage,
} from '../types/wisdom-engine'

/**
 * Core Wisdom Engine class
 *
 * Singleton pattern - use the exported `wisdomEngine` instance
 */
class WisdomEngine {
  private quotes: Quote[]

  constructor() {
    this.quotes = quotesData.quotes as Quote[]
    console.log(`🧠 Wisdom Engine initialized with ${this.quotes.length} quotes`)
  }

  // ==========================================================================
  // MAIN SELECTION METHOD
  // ==========================================================================

  /**
   * Selects a quote based on context and anti-repetition logic
   *
   * MVP: Weighted random selection
   * Future: Context-aware intelligent selection based on UserContext
   *
   * @param context - User context for intelligent selection (optional)
   * @param recentQuoteIds - Recently shown quote IDs to avoid (anti-repetition)
   * @returns Selected Quote object
   */
  selectQuote(
    context?: Partial<UserContext>,
    recentQuoteIds: string[] = []
  ): Quote {
    // Filter out recently shown quotes
    const availableQuotes = this.quotes.filter(
      (q) => !recentQuoteIds.includes(q.id)
    )

    // If we've exhausted all quotes, reset and use all quotes again
    const quotesToUse =
      availableQuotes.length > 0 ? availableQuotes : this.quotes

    // Apply context filters if provided
    let filteredQuotes = quotesToUse

    // Filter by preferred categories if context specifies them
    if (context?.preferredCategories && context.preferredCategories.length > 0) {
      const categoryFiltered = filteredQuotes.filter((q) =>
        context.preferredCategories!.includes(q.category)
      )
      // Only apply filter if it doesn't eliminate all quotes
      if (categoryFiltered.length > 0) {
        filteredQuotes = categoryFiltered
      }
    }

    // Weighted random selection
    return this.weightedRandomSelection(filteredQuotes)
  }

  // ==========================================================================
  // WEIGHTED RANDOM SELECTION
  // ==========================================================================

  /**
   * Performs weighted random selection based on quote.weight
   *
   * Weight 1 = Normal frequency
   * Weight 2 = 2x more likely to appear
   * Weight 3 = 3x more likely to appear
   *
   * @param quotes - Array of quotes to select from
   * @returns Randomly selected quote (weighted)
   */
  private weightedRandomSelection(quotes: Quote[]): Quote {
    // Calculate total weight
    const totalWeight = quotes.reduce((sum, q) => sum + q.weight, 0)

    // Generate random number between 0 and totalWeight
    let random = Math.random() * totalWeight

    // Select quote based on weighted probability
    for (const quote of quotes) {
      random -= quote.weight
      if (random <= 0) {
        return quote
      }
    }

    // Fallback: return first quote (should never reach here)
    return quotes[0]
  }

  // ==========================================================================
  // QUERY METHODS
  // ==========================================================================

  /**
   * Get a specific quote by ID
   *
   * @param id - Quote ID (e.g., "tr-auto-001")
   * @returns Quote object or undefined if not found
   */
  getQuoteById(id: string): Quote | undefined {
    return this.quotes.find((q) => q.id === id)
  }

  /**
   * Get all quotes in a specific category
   *
   * @param category - Quote category
   * @returns Array of quotes in that category
   */
  getQuotesByCategory(category: QuoteCategory): Quote[] {
    return this.quotes.filter((q) => q.category === category)
  }

  /**
   * Get all quotes in a specific subcategory
   *
   * @param subcategory - Quote subcategory
   * @returns Array of quotes in that subcategory
   */
  getQuotesBySubcategory(subcategory: QuoteSubcategory): Quote[] {
    return this.quotes.filter((q) => q.subcategory === subcategory)
  }

  /**
   * Get quotes by language
   *
   * @param language - Quote language ('es', 'pt', 'en')
   * @returns Array of quotes in that language
   */
  getQuotesByLanguage(language: QuoteLanguage): Quote[] {
    return this.quotes.filter((q) => q.language === language)
  }

  /**
   * Search quotes by text or tag
   *
   * Case-insensitive search across quote text and tags
   *
   * @param query - Search query string
   * @returns Array of matching quotes
   */
  searchQuotes(query: string): Quote[] {
    const lowerQuery = query.toLowerCase()
    return this.quotes.filter(
      (q) =>
        q.text.toLowerCase().includes(lowerQuery) ||
        q.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        (q.author && q.author.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Get random quote from specific category
   *
   * Useful for Welcome Modal or CTA-specific contexts
   *
   * @param category - Quote category
   * @param recentQuoteIds - Recently shown quote IDs to avoid
   * @returns Random quote from category
   */
  getRandomQuoteFromCategory(
    category: QuoteCategory,
    recentQuoteIds: string[] = []
  ): Quote {
    const categoryQuotes = this.getQuotesByCategory(category)
    const availableQuotes = categoryQuotes.filter(
      (q) => !recentQuoteIds.includes(q.id)
    )

    const quotesToUse =
      availableQuotes.length > 0 ? availableQuotes : categoryQuotes

    return this.weightedRandomSelection(quotesToUse)
  }

  // ==========================================================================
  // STATISTICS & ANALYTICS
  // ==========================================================================

  /**
   * Get total number of quotes in database
   */
  getTotalQuotes(): number {
    return this.quotes.length
  }

  /**
   * Get category distribution
   *
   * @returns Object with category counts
   */
  getCategoryStats(): Record<QuoteCategory, number> {
    return this.quotes.reduce((acc, quote) => {
      acc[quote.category] = (acc[quote.category] || 0) + 1
      return acc
    }, {} as Record<QuoteCategory, number>)
  }

  /**
   * Get all unique tags
   *
   * @returns Array of unique tag strings
   */
  getAllTags(): string[] {
    const tagSet = new Set<string>()
    this.quotes.forEach((q) => {
      q.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }

  // ==========================================================================
  // FUTURE: CONTEXT-AWARE SELECTION
  // ==========================================================================

  /**
   * Context-aware quote selection (Future implementation)
   *
   * Will consider:
   * - Time of day (morning/afternoon/evening)
   * - Day of week (Monday motivation, Friday reflection)
   * - Current page (dashboard vs. retiros)
   * - User activity state (active vs. idle)
   * - Recent actions (completed urgent action = reward quote)
   *
   * @param context - Full user context
   * @param recentQuoteIds - Recently shown quote IDs
   * @returns Contextually relevant quote
   */
  selectContextualQuote(
    context: UserContext,
    recentQuoteIds: string[] = []
  ): Quote {
    // Phase 2-3 implementation
    // For now, delegate to basic weighted selection
    return this.selectQuote(context, recentQuoteIds)
  }
}

// ==========================================================================
// SINGLETON EXPORT
// ==========================================================================

/**
 * Singleton instance of WisdomEngine
 *
 * Import and use this instance throughout the app:
 * ```
 * import { wisdomEngine } from '@/features/wisdom-engine/services/WisdomEngine'
 *
 * const quote = wisdomEngine.selectQuote({}, recentQuotes)
 * ```
 */
export const wisdomEngine = new WisdomEngine()

/**
 * Export class for testing purposes
 */
export default WisdomEngine

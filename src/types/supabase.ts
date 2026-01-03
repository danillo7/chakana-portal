/**
 * Chakana Portal - Supabase Database Types
 * Version: 1.0.0
 *
 * TypeScript types for Supabase database schema.
 * Auto-generated types should replace this file in production.
 *
 * To generate types from your Supabase project:
 * ```bash
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
 * ```
 */

export interface Database {
  public: {
    Tables: {
      /**
       * Saved reflections table
       */
      reflections: {
        Row: {
          id: string
          user_id: string
          quote_id: string
          quote_data: {
            id: string
            text: { es: string; pt: string }
            author: string
            category: string
            subcategory: string
            weight: number
            tags: string[]
          }
          user_note: string | null
          tags: string[] | null
          saved_at: string
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quote_id: string
          quote_data: {
            id: string
            text: { es: string; pt: string }
            author: string
            category: string
            subcategory: string
            weight: number
            tags: string[]
          }
          user_note?: string | null
          tags?: string[] | null
          saved_at?: string
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quote_id?: string
          quote_data?: {
            id: string
            text: { es: string; pt: string }
            author: string
            category: string
            subcategory: string
            weight: number
            tags: string[]
          }
          user_note?: string | null
          tags?: string[] | null
          saved_at?: string
          updated_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

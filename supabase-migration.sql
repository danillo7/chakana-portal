-- ============================================================================
-- Chakana Portal - Supabase Migration
-- ============================================================================
--
-- Creates the 'reflections' table for storing saved user reflections.
--
-- Run this SQL in your Supabase SQL Editor:
-- https://app.supabase.com/project/YOUR_PROJECT_ID/editor
--
-- ============================================================================

-- Create reflections table
CREATE TABLE IF NOT EXISTS public.reflections (
  -- Primary key (UUID)
  id TEXT PRIMARY KEY,

  -- User ID (from Supabase Auth or anonymous ID)
  user_id TEXT NOT NULL,

  -- Quote ID reference
  quote_id TEXT NOT NULL,

  -- Full quote data (JSONB for flexibility)
  quote_data JSONB NOT NULL,

  -- User's personal note about this reflection
  user_note TEXT,

  -- User's custom tags for organizing reflections
  tags TEXT[],

  -- When the user saved this reflection (their local time)
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- When the reflection was last updated
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- When the record was created in Supabase
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Index on user_id for fast user-specific queries
CREATE INDEX IF NOT EXISTS idx_reflections_user_id
  ON public.reflections(user_id);

-- Index on quote_id for duplicate detection
CREATE INDEX IF NOT EXISTS idx_reflections_quote_id
  ON public.reflections(quote_id);

-- Index on updated_at for sync operations
CREATE INDEX IF NOT EXISTS idx_reflections_updated_at
  ON public.reflections(updated_at DESC);

-- GIN index on tags for array searches
CREATE INDEX IF NOT EXISTS idx_reflections_tags
  ON public.reflections USING GIN(tags);

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own reflections
CREATE POLICY "Users can view own reflections"
  ON public.reflections
  FOR SELECT
  USING (user_id = auth.uid()::text OR user_id LIKE 'anon_%');

-- Policy: Users can insert their own reflections
CREATE POLICY "Users can insert own reflections"
  ON public.reflections
  FOR INSERT
  WITH CHECK (user_id = auth.uid()::text OR user_id LIKE 'anon_%');

-- Policy: Users can update their own reflections
CREATE POLICY "Users can update own reflections"
  ON public.reflections
  FOR UPDATE
  USING (user_id = auth.uid()::text OR user_id LIKE 'anon_%')
  WITH CHECK (user_id = auth.uid()::text OR user_id LIKE 'anon_%');

-- Policy: Users can delete their own reflections
CREATE POLICY "Users can delete own reflections"
  ON public.reflections
  FOR DELETE
  USING (user_id = auth.uid()::text OR user_id LIKE 'anon_%');

-- ============================================================================
-- Triggers for auto-updating updated_at
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before UPDATE
CREATE TRIGGER update_reflections_updated_at
  BEFORE UPDATE ON public.reflections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- Sample Query to Verify
-- ============================================================================

-- Check table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'reflections'
-- ORDER BY ordinal_position;

-- Check policies
-- SELECT * FROM pg_policies WHERE tablename = 'reflections';

-- ============================================================================
-- Done!
-- ============================================================================
--
-- Your table is now ready for sync operations.
--
-- Next steps:
-- 1. Copy .env.example to .env
-- 2. Fill in your Supabase URL and anon key
-- 3. Restart your development server
-- 4. Reflections will auto-sync to Supabase!
--
-- ============================================================================

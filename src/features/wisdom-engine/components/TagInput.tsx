/**
 * Chakana Wisdom Engine - Tag Input Component
 * Version: 1.0.0
 *
 * Tag management for saved reflections:
 * - Add/remove tags
 * - Autocomplete from existing tags
 * - Tag chips with colors
 */

import { useState, useMemo, useRef, useEffect } from 'react'
import { X, Plus, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TagInputProps {
  /** Current tags */
  tags: string[]

  /** All existing tags across reflections (for autocomplete) */
  existingTags: string[]

  /** Callback when tags change */
  onChange: (tags: string[]) => void

  /** Placeholder text */
  placeholder?: string

  /** Max number of tags allowed */
  maxTags?: number
}

/**
 * Tag colors (cycle through these)
 */
const TAG_COLORS = [
  'bg-chakana-sage/20 text-chakana-sage border-chakana-sage/30',
  'bg-chakana-mint/20 text-chakana-mint border-chakana-mint/30',
  'bg-chakana-gold/20 text-chakana-gold border-chakana-gold/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-pink-500/20 text-pink-400 border-pink-500/30',
]

/**
 * Get color for tag based on index
 */
function getTagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length]
}

/**
 * TagInput Component
 */
export function TagInput({
  tags,
  existingTags,
  onChange,
  placeholder = 'Añadir etiqueta...',
  maxTags = 5,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return []

    const filtered = existingTags.filter(
      (tag) =>
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !tags.includes(tag)
    )

    return filtered.slice(0, 5) // Max 5 suggestions
  }, [inputValue, existingTags, tags])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Add tag
  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase()

    if (!trimmed) return
    if (tags.includes(trimmed)) return
    if (tags.length >= maxTags) return

    onChange([...tags, trimmed])
    setInputValue('')
    setShowSuggestions(false)
  }

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowSuggestions(true)
  }

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag(inputValue)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Existing Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${getTagColor(index)} transition-all`}
              >
                <Hash className="w-3 h-3" />
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-white/10 rounded p-0.5 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Input Field */}
      {tags.length < maxTags && (
        <div className="relative" ref={inputRef}>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus-within:border-chakana-sage transition-all">
            <Plus className="w-4 h-4 text-white/40" />
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-white text-sm placeholder-white/40 focus:outline-none"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-chakana-dark-light/95 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl overflow-hidden z-20"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleAddTag(suggestion)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Hash className="w-4 h-4 text-white/40" />
                  <span>{suggestion}</span>
                  <span className="ml-auto text-xs text-white/40">
                    ↵ Enter
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Tag Limit Info */}
      {tags.length >= maxTags && (
        <p className="text-xs text-white/40 italic">
          Máximo de {maxTags} etiquetas alcanzado
        </p>
      )}
    </div>
  )
}

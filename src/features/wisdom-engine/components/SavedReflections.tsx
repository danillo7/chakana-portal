/**
 * Chakana Wisdom Engine - Saved Reflections Page
 * Version: 1.0.0
 *
 * Page to view, manage, and add notes to saved reflection quotes
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Edit3, Save, X, BookmarkCheck, Filter, Download } from 'lucide-react'
import { useWisdomStore } from '../stores/wisdomStore'
import { exportReflectionsToPDF } from '../services/PDFExporter'
import type { SavedReflection } from '../types/wisdom-engine'

/**
 * SavedReflections Component
 *
 * Displays all saved reflections with:
 * - Quote text and category
 * - User notes (editable)
 * - Creation date
 * - Delete functionality
 * - Filter by category
 */
export function SavedReflections() {
  const { savedReflections, deleteReflection, updateReflection } =
    useWisdomStore()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Get unique categories from saved reflections
  const categories = useMemo((): string[] => {
    const uniqueCategories = new Set(
      savedReflections.map((r: SavedReflection) => r.quote.category)
    )
    return Array.from(uniqueCategories)
  }, [savedReflections])

  // Filter reflections by category
  const filteredReflections = useMemo(() => {
    if (filterCategory === 'all') return savedReflections
    return savedReflections.filter((r: SavedReflection) => r.quote.category === filterCategory)
  }, [savedReflections, filterCategory])

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta reflexión?')) {
      deleteReflection(id)
    }
  }

  // Handle edit start
  const handleEditStart = (reflection: SavedReflection) => {
    setEditingId(reflection.id)
    setEditNote(reflection.userNote || '')
  }

  // Handle edit save
  const handleEditSave = (id: string) => {
    updateReflection(id, { userNote: editNote })
    setEditingId(null)
    setEditNote('')
  }

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingId(null)
    setEditNote('')
  }

  // Handle PDF export
  const handleExportPDF = () => {
    exportReflectionsToPDF(savedReflections, 'es-ES')
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (savedReflections.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <BookmarkCheck className="w-8 h-8 text-chakana-sage" />
            Reflexiones Guardadas
          </h1>
          <p className="text-white/60">
            Tus momentos de inspiración y aprendizaje
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-gradient-to-br from-chakana-dark via-chakana-dark-light to-chakana-dark rounded-3xl p-12 text-center border border-white/10">
          <div className="w-20 h-20 rounded-2xl bg-chakana-sage/20 flex items-center justify-center mx-auto mb-6">
            <BookmarkCheck className="w-10 h-10 text-chakana-sage/60" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">
            Aún no tienes reflexiones guardadas
          </h3>
          <p className="text-white/60 max-w-md mx-auto">
            Cuando encuentres una frase inspiradora en el Dashboard, haz clic en
            "Guardar" para añadirla a tu colección personal.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
          <BookmarkCheck className="w-8 h-8 text-chakana-sage" />
          Reflexiones Guardadas
        </h1>
        <p className="text-white/60">
          {filteredReflections.length}{' '}
          {filteredReflections.length === 1 ? 'reflexión' : 'reflexiones'}
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-3">
        <Filter className="w-5 h-5 text-white/40" />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterCategory === 'all'
                ? 'bg-chakana-sage text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Todas ({savedReflections.length})
          </button>
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                filterCategory === category
                  ? 'bg-chakana-sage text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {category} (
              {savedReflections.filter((r: SavedReflection) => r.quote.category === category).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Reflections List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredReflections.map((reflection: SavedReflection) => (
            <motion.div
              key={reflection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-chakana-dark via-chakana-dark-light to-chakana-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
            >
              {/* Quote */}
              <div className="mb-4">
                <p className="text-lg text-white/90 font-light italic leading-relaxed">
                  "{reflection.quote.text}"
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
                <span className="capitalize bg-white/5 px-3 py-1 rounded-full">
                  {reflection.quote.category}
                </span>
                <span className="capitalize">{reflection.quote.subcategory}</span>
                <span>·</span>
                <span>{formatDate(reflection.savedAt)}</span>
                {reflection.context && (
                  <>
                    <span>·</span>
                    <span className="capitalize">{reflection.context}</span>
                  </>
                )}
              </div>

              {/* User Note Section */}
              <div className="mb-4">
                {editingId === reflection.id ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="Añade tus reflexiones personales..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/40 focus:outline-none focus:border-chakana-sage resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSave(reflection.id)}
                        className="px-4 py-2 rounded-lg bg-chakana-sage text-white text-sm font-medium hover:shadow-sage-glow transition-all flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Guardar
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium transition-all flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div>
                    {reflection.userNote ? (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-white/80 leading-relaxed">
                          {reflection.userNote}
                        </p>
                        {reflection.updatedAt && (
                          <p className="text-xs text-white/40 mt-2">
                            Última edición: {formatDate(reflection.updatedAt)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-white/40 italic">
                        Sin notas personales aún
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId !== reflection.id && (
                  <>
                    <button
                      onClick={() => handleEditStart(reflection)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-all flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      {reflection.userNote ? 'Editar nota' : 'Añadir nota'}
                    </button>
                    <button
                      onClick={() => handleDelete(reflection.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 text-xs font-medium transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Export Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleExportPDF}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-chakana-sage to-chakana-mint text-white font-semibold hover:shadow-sage-glow transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar a PDF ({filteredReflections.length}{' '}
          {filteredReflections.length === 1 ? 'reflexión' : 'reflexiones'})
        </button>
      </div>
    </div>
  )
}

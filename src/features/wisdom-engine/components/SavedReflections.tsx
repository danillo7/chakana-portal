/**
 * Chakana Wisdom Engine - Saved Reflections Page
 * Version: 1.0.0
 *
 * Page to view, manage, and add notes to saved reflection quotes
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2,
  Edit3,
  Save,
  X,
  BookmarkCheck,
  Filter,
  Download,
  Share2,
  Copy,
  Image,
} from 'lucide-react'
import { useWisdomStore } from '../stores/wisdomStore'
import { exportReflectionsToPDF } from '../services/PDFExporter'
import {
  shareToWhatsApp,
  shareNative,
  downloadInstagramCard,
  copyToClipboard,
} from '../services/SocialShare'
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
  const [sharingId, setSharingId] = useState<string | null>(null)

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

  // Handle share toggle
  const handleShareToggle = (id: string) => {
    setSharingId(sharingId === id ? null : id)
  }

  // Handle WhatsApp share
  const handleWhatsAppShare = (reflection: SavedReflection) => {
    shareToWhatsApp(reflection, 'es-ES')
    setSharingId(null)
  }

  // Handle native share
  const handleNativeShare = async (reflection: SavedReflection) => {
    const success = await shareNative(reflection, 'es-ES')
    if (success) {
      setSharingId(null)
    }
  }

  // Handle Instagram card download
  const handleInstagramDownload = async (reflection: SavedReflection) => {
    await downloadInstagramCard(reflection, 'es-ES')
    setSharingId(null)
  }

  // Handle copy to clipboard
  const handleCopyToClipboard = async (reflection: SavedReflection) => {
    const success = await copyToClipboard(reflection, 'es-ES')
    if (success) {
      setSharingId(null)
      // Could show a toast notification here
    }
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
              <div className="relative">
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
                        onClick={() => handleShareToggle(reflection.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-chakana-sage/20 text-white/70 hover:text-chakana-mint text-xs font-medium transition-all flex items-center gap-2"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Compartir
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

                {/* Share Dropdown */}
                {sharingId === reflection.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full left-0 mb-2 bg-chakana-dark-light/95 backdrop-blur-xl rounded-xl border border-white/20 p-2 shadow-2xl z-10 min-w-[220px]"
                  >
                    {/* WhatsApp */}
                    <button
                      onClick={() => handleWhatsAppShare(reflection)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all hover:bg-[#25D366]/20 text-white/80 hover:text-white group/item"
                    >
                      <svg
                        className="w-5 h-5 text-[#25D366]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span className="text-sm font-medium">WhatsApp</span>
                    </button>

                    {/* Instagram Card */}
                    <button
                      onClick={() => handleInstagramDownload(reflection)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all hover:bg-gradient-to-r hover:from-[#833AB4]/20 hover:via-[#FD1D1D]/20 hover:to-[#F77737]/20 text-white/80 hover:text-white group/item"
                    >
                      <Image className="w-5 h-5 text-[#E1306C]" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Instagram</div>
                        <div className="text-xs text-white/50">
                          Descargar imagen
                        </div>
                      </div>
                    </button>

                    {/* Native Share (mobile) */}
                    {navigator.share && (
                      <button
                        onClick={() => handleNativeShare(reflection)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all hover:bg-white/10 text-white/80 hover:text-white group/item"
                      >
                        <Share2 className="w-5 h-5 text-chakana-mint" />
                        <span className="text-sm font-medium">Compartir...</span>
                      </button>
                    )}

                    {/* Copy to Clipboard */}
                    <button
                      onClick={() => handleCopyToClipboard(reflection)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all hover:bg-white/10 text-white/80 hover:text-white group/item"
                    >
                      <Copy className="w-5 h-5 text-chakana-gold" />
                      <span className="text-sm font-medium">Copiar texto</span>
                    </button>
                  </motion.div>
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

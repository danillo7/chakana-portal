import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { useDataStore } from '../stores/dataStore'
import { formatDateShort } from '../lib/utils'
import {
  Calendar,
  Tag,
  FileText,
  ArrowRight,
  Search,
  Filter,
  Grid3X3,
  List,
  Sparkles
} from 'lucide-react'
import type { Document } from '../types'

const categoryIcons: Record<string, string> = {
  ata: '📋',
  business_plan: '📊',
  research: '🔬',
  legal: '⚖️',
  financial: '💰',
}

const categoryGradients: Record<string, string> = {
  ata: 'from-chakana-sage/20 to-chakana-mint/30',
  business_plan: 'from-chakana-gold/20 to-chakana-sage/20',
  research: 'from-blue-500/20 to-chakana-sage/20',
  legal: 'from-purple-500/20 to-chakana-sage/20',
  financial: 'from-chakana-gold/20 to-amber-500/20',
}

const categoryColors: Record<string, string> = {
  ata: 'bg-chakana-sage/10 text-chakana-sage border-chakana-sage/30',
  business_plan: 'bg-chakana-gold/10 text-chakana-gold border-chakana-gold/30',
  research: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  legal: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
  financial: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
}

type ViewMode = 'grid' | 'list'
type CategoryFilter = 'all' | Document['category']

export function DocumentsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { documents } = useDataStore()

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')

  // Filter and search documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Category filter
      if (categoryFilter !== 'all' && doc.category !== categoryFilter) {
        return false
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          doc.title.toLowerCase().includes(query) ||
          doc.excerpt?.toLowerCase().includes(query) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      }
      return true
    })
  }, [documents, categoryFilter, searchQuery])

  // Group documents by category for stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: documents.length }
    documents.forEach((doc) => {
      stats[doc.category] = (stats[doc.category] || 0) + 1
    })
    return stats
  }, [documents])

  const handleOpenDocument = (doc: Document) => {
    navigate(`/documents/${doc.slug}`)
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-chakana-sage/5 via-chakana-mint/10 to-chakana-sage/5 rounded-3xl blur-xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chakana-sage to-chakana-sage-dark flex items-center justify-center shadow-sage-glow">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-gradient-sage">
                    {t('documents.title')}
                  </h1>
                  <p className="text-muted-foreground">
                    {t('documents.subtitle')}
                  </p>
                </div>
              </div>
            </div>
            {/* Document Count Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-chakana-sage/10 border border-chakana-sage/20">
              <Sparkles className="w-4 h-4 text-chakana-gold" />
              <span className="text-sm font-medium text-chakana-sage">
                {documents.length} {t('documents.title').toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-chakana-sage text-white shadow-sage-glow'
                : 'bg-card border border-border text-muted-foreground hover:border-chakana-sage/50 hover:text-foreground'
            }`}
          >
            {t('documents.filters.all')} ({categoryStats.all})
          </button>
          {(['ata', 'business_plan', 'research', 'legal', 'financial'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                categoryFilter === cat
                  ? 'bg-chakana-sage text-white shadow-sage-glow'
                  : 'bg-card border border-border text-muted-foreground hover:border-chakana-sage/50 hover:text-foreground'
              }`}
            >
              <span>{categoryIcons[cat]}</span>
              {t(`documents.categories.${cat === 'ata' ? 'atas' : cat === 'business_plan' ? 'businessPlans' : cat}`)}
              {categoryStats[cat] && <span className="text-xs opacity-70">({categoryStats[cat]})</span>}
            </button>
          ))}
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-chakana-sage/30 focus:border-chakana-sage transition-all"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-chakana-sage text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-chakana-sage text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Info */}
      {(searchQuery || categoryFilter !== 'all') && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>
            {filteredDocuments.length} resultado{filteredDocuments.length !== 1 ? 's' : ''}
            {searchQuery && ` para "${searchQuery}"`}
          </span>
          {(searchQuery || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setCategoryFilter('all')
              }}
              className="text-chakana-sage hover:underline ml-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, index) => (
            <div
              key={doc.id}
              onClick={() => handleOpenDocument(doc)}
              className="group relative bg-card rounded-2xl border border-border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-chakana-sage/10 hover:border-chakana-sage/30 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient overlay based on category */}
              <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[doc.category] || 'from-chakana-sage/10 to-transparent'} opacity-30 group-hover:opacity-50 transition-opacity`} />

              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-chakana-sage to-chakana-sage-dark flex items-center justify-center text-2xl shadow-sage-glow group-hover:scale-110 transition-transform">
                    {categoryIcons[doc.category] || '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-chakana-sage transition-colors">
                      {doc.title}
                    </h3>
                    <Badge className={`mt-2 ${categoryColors[doc.category]}`}>
                      {t(`documents.categories.${doc.category === 'ata' ? 'atas' : doc.category === 'business_plan' ? 'businessPlans' : doc.category}`)}
                    </Badge>
                  </div>
                </div>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {doc.excerpt}
                </p>

                {/* Tags */}
                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {doc.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-chakana-sage/5 text-chakana-sage/70 border border-chakana-sage/10"
                      >
                        #{tag}
                      </span>
                    ))}
                    {doc.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                        +{doc.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-chakana-sage/70" />
                      {formatDateShort(doc.updatedAt, i18n.language)}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-chakana-sage opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredDocuments.map((doc, index) => (
            <div
              key={doc.id}
              onClick={() => handleOpenDocument(doc)}
              className="group flex items-center gap-4 p-4 bg-card rounded-xl border border-border cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-chakana-sage/5 hover:border-chakana-sage/30"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chakana-sage to-chakana-sage-dark flex items-center justify-center text-xl shadow-sage-glow flex-shrink-0 group-hover:scale-105 transition-transform">
                {categoryIcons[doc.category] || '📄'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-foreground truncate group-hover:text-chakana-sage transition-colors">
                    {doc.title}
                  </h3>
                  <Badge className={`flex-shrink-0 ${categoryColors[doc.category]}`}>
                    {t(`documents.categories.${doc.category === 'ata' ? 'atas' : doc.category === 'business_plan' ? 'businessPlans' : doc.category}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {doc.excerpt}
                </p>
              </div>

              {/* Meta */}
              <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDateShort(doc.updatedAt, i18n.language)}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {doc.tags.length}
                </span>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-5 h-5 text-chakana-sage opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-20 h-20 rounded-full bg-chakana-sage/10 flex items-center justify-center">
            <FileText className="w-10 h-10 text-chakana-sage/50" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No se encontraron documentos
            </h3>
            <p className="text-sm text-muted-foreground">
              Intenta ajustar los filtros o el término de búsqueda
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setCategoryFilter('all')
            }}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  )
}

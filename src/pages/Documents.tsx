import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { useDataStore } from '../stores/dataStore'
import { formatDateShort } from '../lib/utils'
import { Calendar, Tag, X, Download, ExternalLink, FileText } from 'lucide-react'
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

// Helper to build full URL with base path
const getDocumentUrl = (contentPath: string) => {
  const base = import.meta.env.BASE_URL || '/'
  // Remove leading slash from contentPath if base already has trailing slash
  const path = contentPath.startsWith('/') ? contentPath.slice(1) : contentPath
  return `${base}${path}`
}

export function DocumentsPage() {
  const { t, i18n } = useTranslation()
  const { documents } = useDataStore()
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  const handleOpenDocument = (doc: Document) => {
    setSelectedDoc(doc)
  }

  const handleCloseModal = () => {
    setSelectedDoc(null)
  }

  const handleDownload = (doc: Document) => {
    // If document has a content path, trigger download with correct base path
    if (doc.contentPath) {
      window.open(getDocumentUrl(doc.contentPath), '_blank')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="section-header">
        <h1 className="text-3xl font-display font-bold text-gradient-sage">
          {t('documents.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('documents.subtitle')}
        </p>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => handleOpenDocument(doc)}
            className="document-card group"
          >
            {/* Gradient overlay based on category */}
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[doc.category] || 'from-chakana-sage/10 to-transparent'} opacity-50 group-hover:opacity-70 transition-opacity rounded-2xl`} />

            <div className="relative">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-chakana-sage to-chakana-sage-dark flex items-center justify-center text-2xl shadow-sage-glow">
                  {categoryIcons[doc.category] || '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate group-hover:text-chakana-sage transition-colors">
                    {doc.title}
                  </h3>
                  <Badge className="mt-1 badge-sage">
                    {t(`documents.categories.${doc.category === 'ata' ? 'atas' : doc.category === 'business_plan' ? 'businessPlans' : doc.category}`)}
                  </Badge>
                </div>
              </div>

              {/* Excerpt */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {doc.excerpt}
              </p>

              {/* Meta info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-chakana-sage" />
                    {formatDateShort(doc.updatedAt, i18n.language)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-chakana-sage" />
                    {doc.tags.length} tags
                  </span>
                </div>
                <FileText className="w-4 h-4 text-chakana-sage/50 group-hover:text-chakana-sage transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Modal */}
      {selectedDoc && (
        <div
          className="modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="modal-content animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative p-6 border-b border-border bg-gradient-to-r from-chakana-sage/10 to-chakana-mint/20">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-chakana-sage to-chakana-sage-dark flex items-center justify-center text-3xl shadow-sage-glow">
                  {categoryIcons[selectedDoc.category] || '📄'}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedDoc.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className="badge-sage">
                      {t(`documents.categories.${selectedDoc.category === 'ata' ? 'atas' : selectedDoc.category === 'business_plan' ? 'businessPlans' : selectedDoc.category}`)}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDateShort(selectedDoc.updatedAt, i18n.language)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-full hover:bg-chakana-sage/10 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Tags */}
              {selectedDoc.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedDoc.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="prose-chakana">
                <p className="text-foreground leading-relaxed">
                  {selectedDoc.excerpt || t('documents.noContent')}
                </p>

                {/* Project reference */}
                {selectedDoc.project && (
                  <div className="mt-4 p-4 bg-chakana-mint/20 rounded-xl border border-chakana-sage/20">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-chakana-sage">{t('documents.project')}:</strong> {selectedDoc.project}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border bg-muted/30 flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                ID: {selectedDoc.id}
              </div>
              <div className="flex items-center gap-3">
                {selectedDoc.contentPath && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(selectedDoc)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {t('common.download')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getDocumentUrl(selectedDoc.contentPath), '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t('common.open')}
                    </Button>
                  </>
                )}
                <Button
                  onClick={handleCloseModal}
                  className="btn-premium gap-2"
                >
                  {t('common.close')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

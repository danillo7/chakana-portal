import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { useDataStore } from '../stores/dataStore'
import { formatDate } from '../lib/utils'
import {
  Calendar,
  ArrowLeft,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Share2,
  Printer,
  BookOpen,
  Hash
} from 'lucide-react'

// Category icons and gradients (consistent with Documents.tsx)
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
  const path = contentPath.startsWith('/') ? contentPath.slice(1) : contentPath
  return `${base}${path}`
}

// Interface for Table of Contents entries
interface TocEntry {
  id: string
  text: string
  level: number
}

// Extract headings from markdown for ToC
const extractHeadings = (markdown: string): TocEntry[] => {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const headings: TocEntry[] = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    headings.push({ id, text, level })
  }

  return headings
}

export function DocumentViewerPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { documents } = useDataStore()

  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeHeading, setActiveHeading] = useState<string>('')

  // Find document by slug
  const document = useMemo(() =>
    documents.find((doc) => doc.slug === slug),
    [documents, slug]
  )

  // Get previous and next documents for navigation
  const documentNav = useMemo(() => {
    if (!document) return { prev: null, next: null }
    const currentIndex = documents.findIndex((doc) => doc.id === document.id)
    return {
      prev: currentIndex > 0 ? documents[currentIndex - 1] : null,
      next: currentIndex < documents.length - 1 ? documents[currentIndex + 1] : null,
    }
  }, [documents, document])

  // Extract Table of Contents from markdown
  const tableOfContents = useMemo(() =>
    extractHeadings(markdownContent),
    [markdownContent]
  )

  // Fetch markdown content when document is found
  useEffect(() => {
    if (!document?.contentPath) {
      setIsLoading(false)
      setError('Document not found')
      return
    }

    const fetchMarkdown = async () => {
      setIsLoading(true)
      setError(null)
      setMarkdownContent('')

      try {
        const url = getDocumentUrl(document.contentPath)
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const text = await response.text()
        setMarkdownContent(text)
      } catch (err) {
        console.error('Error fetching document:', err)
        setError(err instanceof Error ? err.message : 'Failed to load document')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarkdown()
  }, [document])

  // Scroll spy for ToC active state
  useEffect(() => {
    if (!markdownContent || tableOfContents.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    // Small delay to let markdown render
    const timeout = setTimeout(() => {
      tableOfContents.forEach(({ id }) => {
        const element = window.document.getElementById(id)
        if (element) observer.observe(element)
      })
    }, 100)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [markdownContent, tableOfContents])

  const handleDownload = () => {
    if (document?.contentPath) {
      window.open(getDocumentUrl(document.contentPath), '_blank')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({
        title: document?.title,
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      // Could show a toast here
    }
  }

  const scrollToHeading = (id: string) => {
    const element = window.document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 404 - Document not found
  if (!document && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-24 h-24 rounded-full bg-chakana-sage/10 flex items-center justify-center">
          <FileText className="w-12 h-12 text-chakana-sage/50" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Documento no encontrado
          </h1>
          <p className="text-muted-foreground max-w-md">
            El documento que buscas no existe o ha sido movido.
          </p>
        </div>
        <Button onClick={() => navigate('/documents')} className="btn-premium gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver a Documentos
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-chakana-sage transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/documents" className="hover:text-chakana-sage transition-colors">
          {t('documents.title')}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {document?.title}
        </span>
      </nav>

      <div className="flex gap-8">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Document Header */}
          {document && (
            <header className={`relative p-6 rounded-2xl bg-gradient-to-br ${categoryGradients[document.category] || 'from-chakana-sage/10 to-transparent'} border border-chakana-sage/20 mb-8`}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-chakana-sage to-chakana-sage-dark flex items-center justify-center text-3xl shadow-sage-glow flex-shrink-0">
                  {categoryIcons[document.category] || '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-display font-bold text-foreground mb-2">
                    {document.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="badge-sage">
                      {t(`documents.categories.${document.category === 'ata' ? 'atas' : document.category === 'business_plan' ? 'businessPlans' : document.category}`)}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(document.updatedAt, i18n.language)}
                    </span>
                    {document.project && (
                      <span className="text-sm text-muted-foreground">
                        📁 {document.project}
                      </span>
                    )}
                  </div>
                  {/* Tags */}
                  {document.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {document.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs bg-chakana-sage/5 border-chakana-sage/30"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="text-muted-foreground hover:text-chakana-sage"
                    title="Compartir"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrint}
                    className="text-muted-foreground hover:text-chakana-sage print:hidden"
                    title="Imprimir"
                  >
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDownload}
                    className="text-muted-foreground hover:text-chakana-sage"
                    title="Descargar"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(getDocumentUrl(document.contentPath), '_blank')}
                    className="text-muted-foreground hover:text-chakana-sage"
                    title="Abrir en nueva pestaña"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </header>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-chakana-sage/10 animate-pulse" />
                <Loader2 className="w-8 h-8 text-chakana-sage absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">
                {t('documents.loading')}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-1">
                  {t('documents.errorLoading')}
                </p>
                <p className="text-xs text-muted-foreground max-w-md">
                  {error}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document && window.open(getDocumentUrl(document.contentPath), '_blank')}
                className="gap-2 mt-2"
              >
                <ExternalLink className="w-4 h-4" />
                {t('documents.openExternal')}
              </Button>
            </div>
          )}

          {/* Markdown Content */}
          {!isLoading && !error && markdownContent && (
            <article className="prose-chakana bg-card rounded-2xl border border-border p-8 shadow-card">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Add IDs to headings for scroll navigation
                  h1: ({ children, ...props }) => {
                    const text = String(children)
                    const id = text
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '')
                    return <h1 id={id} {...props}>{children}</h1>
                  },
                  h2: ({ children, ...props }) => {
                    const text = String(children)
                    const id = text
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '')
                    return <h2 id={id} {...props}>{children}</h2>
                  },
                  h3: ({ children, ...props }) => {
                    const text = String(children)
                    const id = text
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '')
                    return <h3 id={id} {...props}>{children}</h3>
                  },
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </article>
          )}

          {/* Document Navigation - Previous/Next */}
          {!isLoading && !error && (documentNav.prev || documentNav.next) && (
            <nav className="flex items-center justify-between mt-8 pt-8 border-t border-border">
              {documentNav.prev ? (
                <Link
                  to={`/documents/${documentNav.prev.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-xl hover:bg-chakana-sage/5 transition-colors max-w-[45%]"
                >
                  <ChevronLeft className="w-5 h-5 text-chakana-sage group-hover:-translate-x-1 transition-transform" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{t('common.previous')}</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {documentNav.prev.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {documentNav.next && (
                <Link
                  to={`/documents/${documentNav.next.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-xl hover:bg-chakana-sage/5 transition-colors text-right max-w-[45%]"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{t('common.next')}</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {documentNav.next.title}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-chakana-sage group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Table of Contents Sidebar */}
        {!isLoading && !error && tableOfContents.length > 0 && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="p-4 rounded-xl bg-card border border-border">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                  <BookOpen className="w-4 h-4 text-chakana-sage" />
                  Contenido
                </h3>
                <nav className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {tableOfContents.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => scrollToHeading(entry.id)}
                      className={`
                        w-full text-left text-sm py-1.5 px-2 rounded transition-colors
                        ${entry.level === 1 ? 'font-medium' : ''}
                        ${entry.level === 2 ? 'pl-4' : ''}
                        ${entry.level === 3 ? 'pl-6 text-xs' : ''}
                        ${activeHeading === entry.id
                          ? 'text-chakana-sage bg-chakana-sage/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }
                      `}
                    >
                      <span className="flex items-start gap-2">
                        <Hash className={`w-3 h-3 mt-1 flex-shrink-0 ${activeHeading === entry.id ? 'text-chakana-sage' : 'text-muted-foreground/50'}`} />
                        <span className="line-clamp-2">{entry.text}</span>
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Back to Documents Button */}
              <Button
                variant="outline"
                onClick={() => navigate('/documents')}
                className="w-full mt-4 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('documents.title')}
              </Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

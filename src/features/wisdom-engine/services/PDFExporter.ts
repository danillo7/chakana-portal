/**
 * Chakana Wisdom Engine - PDF Exporter Service
 * Version: 1.0.0
 *
 * Exports saved reflections to a beautifully branded PDF
 * with Chakana colors, typography, and layout.
 */

import { jsPDF } from 'jspdf'
import type { SavedReflection } from '../types/wisdom-engine'

/**
 * Chakana Brand Colors (RGB)
 */
const COLORS = {
  sage: [74, 124, 89],      // #4A7C59
  mint: [143, 188, 143],    // #8FBC8F
  gold: [212, 175, 55],     // #D4AF37
  dark: [26, 26, 26],       // #1A1A1A
  darkLight: [40, 40, 40],  // #282828
  white: [255, 255, 255],   // #FFFFFF
  gray: [128, 128, 128],    // #808080
}

/**
 * Category translations (ES)
 */
const CATEGORY_NAMES: Record<string, string> = {
  transformation: 'Transformación Personal',
  chakana: 'Filosofía Chakana',
  connection: 'Conexión Humana',
  nature: 'Sabiduría Natural',
}

/**
 * Export saved reflections to PDF
 *
 * @param reflections - Array of saved reflections
 * @param language - Language code (es-ES or pt-BR)
 * @returns void (triggers download)
 */
export function exportReflectionsToPDF(
  reflections: SavedReflection[],
  language: string = 'es-ES'
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let currentY = margin

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Add new page if needed
   */
  const checkPageBreak = (spaceNeeded: number) => {
    if (currentY + spaceNeeded > pageHeight - margin) {
      doc.addPage()
      currentY = margin
      addPageFooter()
      return true
    }
    return false
  }

  /**
   * Add page footer with branding
   */
  const addPageFooter = () => {
    const footerY = pageHeight - 15
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.gray)
    doc.text(
      '🏔️ Chakana La Experiencia - Transformación Consciente',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    )
    doc.setTextColor(...COLORS.dark)
  }

  /**
   * Format date to readable string
   */
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // ============================================================================
  // PDF HEADER
  // ============================================================================

  // Title
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.sage)
  doc.text('🏔️ Mis Reflexiones Chakana', margin, currentY)
  currentY += 12

  // Subtitle - Date & Count
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.gray)
  const today = formatDate(new Date())
  doc.text(`Exportado el ${today}`, margin, currentY)
  currentY += 6
  doc.text(`${reflections.length} reflexiones guardadas`, margin, currentY)
  currentY += 15

  // Horizontal line
  doc.setDrawColor(...COLORS.sage)
  doc.setLineWidth(0.5)
  doc.line(margin, currentY, pageWidth - margin, currentY)
  currentY += 10

  // ============================================================================
  // REFLECTIONS CONTENT
  // ============================================================================

  reflections.forEach((reflection, index) => {
    const quote = reflection.quote
    const quoteText = language === 'pt-BR' ? quote.text.pt : quote.text.es

    // Check space for this reflection (estimate ~50mm)
    checkPageBreak(50)

    // Reflection number
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.gold)
    doc.text(`Reflexión ${index + 1}`, margin, currentY)
    currentY += 8

    // Quote text (main content)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...COLORS.dark)
    const quotLines = doc.splitTextToSize(`"${quoteText}"`, contentWidth - 10)
    doc.text(quotLines, margin + 5, currentY)
    currentY += quotLines.length * 6 + 8

    // Category badge
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLORS.white)
    doc.setFillColor(...COLORS.sage)
    const categoryName = CATEGORY_NAMES[quote.category] || quote.category
    const badgeWidth = doc.getTextWidth(categoryName) + 6
    doc.roundedRect(margin + 5, currentY - 4, badgeWidth, 6, 2, 2, 'F')
    doc.text(categoryName, margin + 8, currentY)
    currentY += 8

    // Saved date
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLORS.gray)
    doc.text(
      `Guardada el ${formatDate(reflection.savedAt)}`,
      margin + 5,
      currentY
    )
    currentY += 6

    // User note (if exists)
    if (reflection.userNote && reflection.userNote.trim()) {
      currentY += 4
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...COLORS.darkLight)
      doc.text('📝 Mis Notas:', margin + 5, currentY)
      currentY += 6

      const noteLines = doc.splitTextToSize(
        reflection.userNote,
        contentWidth - 10
      )
      doc.setTextColor(...COLORS.dark)
      doc.text(noteLines, margin + 5, currentY)
      currentY += noteLines.length * 5 + 4
    }

    // Separator line (light gray)
    currentY += 6
    doc.setDrawColor(...COLORS.gray)
    doc.setLineWidth(0.2)
    doc.line(margin + 5, currentY, pageWidth - margin - 5, currentY)
    currentY += 10
  })

  // ============================================================================
  // PDF FOOTER (last page)
  // ============================================================================

  checkPageBreak(40)
  currentY += 10

  // Thank you message
  doc.setFontSize(12)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...COLORS.sage)
  const thankYouText = doc.splitTextToSize(
    'Gracias por ser parte de esta experiencia de transformación consciente. ' +
      'Cada reflexión es un paso hacia tu mejor versión.',
    contentWidth
  )
  doc.text(thankYouText, margin, currentY)
  currentY += thankYouText.length * 6 + 10

  // Chakana signature
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...COLORS.dark)
  doc.text('🏔️ Chakana La Experiencia', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 6
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...COLORS.gray)
  doc.text('chakanalaexperiencia.es', pageWidth / 2, currentY, {
    align: 'center',
  })

  // Add footer to all pages
  const totalPages = doc.internal.pages.length - 1 // -1 because pages array includes a null first element
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    addPageFooter()
  }

  // ============================================================================
  // SAVE PDF
  // ============================================================================

  const filename = `chakana-reflexiones-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}

/**
 * Export a single reflection to PDF (for sharing)
 *
 * @param reflection - Single reflection to export
 * @param language - Language code
 */
export function exportSingleReflectionToPDF(
  reflection: SavedReflection,
  language: string = 'es-ES'
): void {
  exportReflectionsToPDF([reflection], language)
}

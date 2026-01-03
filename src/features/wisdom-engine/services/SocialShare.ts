/**
 * Chakana Wisdom Engine - Social Share Service
 * Version: 1.0.0
 *
 * Share saved reflections to social media platforms
 * - WhatsApp (mobile + web)
 * - Native Share API (mobile)
 * - Instagram (visual card generation)
 */

import type { SavedReflection } from '../types/wisdom-engine'

/**
 * Category emoji mapping
 */
const CATEGORY_EMOJIS: Record<string, string> = {
  transformation: '🦋',
  chakana: '🏔️',
  connection: '🤝',
  nature: '🌿',
}

/**
 * Share reflection to WhatsApp
 *
 * @param reflection - Reflection to share
 * @param language - Language code (es-ES or pt-BR)
 */
export function shareToWhatsApp(
  reflection: SavedReflection,
  language: string = 'es-ES'
): void {
  const quote = reflection.quote
  const quoteText = language === 'pt-BR' ? quote.text.pt : quote.text.es

  const emoji = CATEGORY_EMOJIS[quote.category] || '✨'
  const categoryName = quote.category.charAt(0).toUpperCase() + quote.category.slice(1)

  // Build message
  const message = `${emoji} *${categoryName}*\n\n"${quoteText}"\n\n🏔️ Chakana La Experiencia\n_Transformación Consciente_\n\n👉 chakanalaexperiencia.es`

  // Encode for URL
  const encodedMessage = encodeURIComponent(message)

  // Detect mobile vs desktop
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  // Build WhatsApp URL
  const whatsappUrl = isMobile
    ? `whatsapp://send?text=${encodedMessage}`
    : `https://web.whatsapp.com/send?text=${encodedMessage}`

  // Open in new window/tab
  window.open(whatsappUrl, '_blank')
}

/**
 * Share reflection using Web Share API (native mobile share)
 *
 * @param reflection - Reflection to share
 * @param language - Language code
 * @returns Promise<boolean> - True if shared successfully
 */
export async function shareNative(
  reflection: SavedReflection,
  language: string = 'es-ES'
): Promise<boolean> {
  // Check if Web Share API is available
  if (!navigator.share) {
    return false
  }

  const quote = reflection.quote
  const quoteText = language === 'pt-BR' ? quote.text.pt : quote.text.es
  const emoji = CATEGORY_EMOJIS[quote.category] || '✨'

  try {
    await navigator.share({
      title: `${emoji} Reflexión Chakana`,
      text: `"${quoteText}"\n\n🏔️ Chakana La Experiencia - Transformación Consciente`,
      url: 'https://chakanalaexperiencia.es',
    })
    return true
  } catch (error) {
    // User cancelled or error occurred
    console.log('Share cancelled or failed:', error)
    return false
  }
}

/**
 * Generate Instagram story card (visual image)
 *
 * Creates a beautiful branded card for Instagram sharing
 * Uses Canvas API to generate the image
 *
 * @param reflection - Reflection to share
 * @param language - Language code
 * @returns Promise<Blob> - Image blob for download
 */
export async function generateInstagramCard(
  reflection: SavedReflection,
  language: string = 'es-ES'
): Promise<Blob> {
  const quote = reflection.quote
  const quoteText = language === 'pt-BR' ? quote.text.pt : quote.text.es

  // Create canvas (1080x1920 - Instagram Story size)
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')!

  // Chakana brand colors
  const colors = {
    sage: '#4A7C59',
    mint: '#8FBC8F',
    gold: '#D4AF37',
    dark: '#1A1A1A',
  }

  // Background gradient (dark to sage)
  const gradient = ctx.createLinearGradient(0, 0, 0, 1920)
  gradient.addColorStop(0, colors.dark)
  gradient.addColorStop(1, colors.sage)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1080, 1920)

  // Add decorative elements
  ctx.fillStyle = 'rgba(143, 188, 143, 0.1)' // mint with opacity
  ctx.beginPath()
  ctx.arc(900, 200, 300, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(212, 175, 55, 0.05)' // gold with opacity
  ctx.beginPath()
  ctx.arc(200, 1700, 400, 0, Math.PI * 2)
  ctx.fill()

  // Draw logo/emoji at top
  ctx.font = 'bold 120px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('🏔️', 540, 250)

  // Draw brand name
  ctx.font = 'bold 48px sans-serif'
  ctx.fillStyle = colors.mint
  ctx.fillText('CHAKANA', 540, 350)

  ctx.font = '32px sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.fillText('La Experiencia', 540, 400)

  // Draw quote text (multi-line)
  ctx.font = 'italic 56px serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'

  // Wrap text to fit width (max 900px)
  const maxWidth = 900
  const lineHeight = 80
  const words = quoteText.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    const testLine = currentLine + word + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine)
      currentLine = word + ' '
    } else {
      currentLine = testLine
    }
  })
  lines.push(currentLine)

  // Draw quote lines (centered vertically)
  const startY = 960 - (lines.length * lineHeight) / 2
  lines.forEach((line, index) => {
    ctx.fillText(`"${line.trim()}"`, 540, startY + index * lineHeight)
  })

  // Draw category badge
  ctx.font = 'bold 36px sans-serif'
  ctx.fillStyle = colors.gold
  ctx.textAlign = 'center'
  const categoryEmoji = CATEGORY_EMOJIS[quote.category] || '✨'
  const categoryText = quote.category.charAt(0).toUpperCase() + quote.category.slice(1)
  ctx.fillText(`${categoryEmoji} ${categoryText}`, 540, 1500)

  // Draw footer
  ctx.font = '28px sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.fillText('Transformación Consciente', 540, 1750)

  ctx.font = 'bold 32px sans-serif'
  ctx.fillStyle = colors.mint
  ctx.fillText('chakanalaexperiencia.es', 540, 1820)

  // Convert canvas to Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!)
    }, 'image/png')
  })
}

/**
 * Download Instagram card as image
 *
 * @param reflection - Reflection to share
 * @param language - Language code
 */
export async function downloadInstagramCard(
  reflection: SavedReflection,
  language: string = 'es-ES'
): Promise<void> {
  const blob = await generateInstagramCard(reflection, language)

  // Create download link
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chakana-reflexion-${new Date().toISOString().split('T')[0]}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Copy reflection text to clipboard
 *
 * @param reflection - Reflection to copy
 * @param language - Language code
 * @returns Promise<boolean> - True if copied successfully
 */
export async function copyToClipboard(
  reflection: SavedReflection,
  language: string = 'es-ES'
): Promise<boolean> {
  const quote = reflection.quote
  const quoteText = language === 'pt-BR' ? quote.text.pt : quote.text.es
  const emoji = CATEGORY_EMOJIS[quote.category] || '✨'

  const text = `${emoji} "${quoteText}"\n\n🏔️ Chakana La Experiencia\nchakanalaexperiencia.es`

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

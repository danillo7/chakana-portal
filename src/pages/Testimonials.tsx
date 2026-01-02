import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
  Play,
  Star,
  Quote,
  Heart,
  ExternalLink,
  Instagram,
  Globe,
  MessageCircle,
} from 'lucide-react'

// Testimonial video data from official Chakana website
const testimonialVideos = [
  {
    id: 1,
    vimeoId: '1110319871',
    title: 'Transformación Personal',
    description: 'Una experiencia que cambió mi perspectiva de vida completamente.',
    author: 'Participante Retiro 2024',
    rating: 5,
  },
  {
    id: 2,
    vimeoId: '1110497101',
    title: 'Conexión Profunda',
    description: 'El retiro me permitió reconectar conmigo mismo de una manera única.',
    author: 'Participante Retiro 2024',
    rating: 5,
  },
  {
    id: 3,
    vimeoId: '1110587646',
    title: 'Sanación Interior',
    description: 'Iván y su equipo crean un espacio seguro para la transformación.',
    author: 'Participante Retiro 2024',
    rating: 5,
  },
]

// Official social links
const socialLinks = [
  {
    name: 'Web Oficial',
    description: 'chakanalaexperiencia.es',
    url: 'https://chakanalaexperiencia.es/',
    icon: Globe,
    color: '#C5A54A',
  },
  {
    name: 'Instagram Chakana',
    description: '@chakana_le',
    url: 'https://www.instagram.com/chakana_le/',
    icon: Instagram,
    color: '#E1306C',
  },
  {
    name: 'Instagram Iván',
    description: '@ivansilvam_',
    url: 'https://www.instagram.com/ivansilvam_/',
    icon: Instagram,
    color: '#833AB4',
  },
  {
    name: 'Canal WhatsApp',
    description: 'Únete a nuestra comunidad',
    url: 'https://www.whatsapp.com/channel/0029Vb6z0Wc6RGJDZ8DjT52a',
    icon: MessageCircle,
    color: '#25D366',
  },
]

// Stats from the official website
const stats = [
  { value: '93K+', label: 'Seguidores' },
  { value: '500+', label: 'Transformaciones' },
  { value: '15+', label: 'Años Experiencia' },
  { value: '100%', label: 'Dedicación' },
]

export function TestimonialsPage() {
  // Translations available via t() for future i18n enhancements
  useTranslation()

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-chakana-navy p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-chakana-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          <Badge className="badge-gold mb-4">
            <Star className="w-3 h-3 mr-1" />
            Testimonios Verificados
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Voces de{' '}
            <span className="text-gradient-gold">Transformación</span>
          </h1>

          <p className="text-white/70 text-lg max-w-2xl">
            Descubre las experiencias de quienes han vivido la transformación Chakana.
            Cada testimonio es una historia de conexión profunda con la cosmovisión andina.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold text-chakana-gold">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Testimonials Section */}
      <section>
        <div className="section-header">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Play className="w-8 h-8 text-chakana-gold" />
            Testimonios en Video
          </h2>
          <p className="text-muted-foreground mt-2">
            Experiencias reales de participantes de nuestros retiros
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonialVideos.map((video) => (
            <Card key={video.id} className="testimonial-card group">
              {/* Video Embed */}
              <div className="video-container">
                <iframe
                  src={`https://player.vimeo.com/video/${video.vimeoId}?h=0&badge=0&autopause=0&player_id=0&app_id=58479`}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                  title={video.title}
                />
              </div>

              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(video.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-chakana-gold text-chakana-gold" />
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-chakana-gold transition-colors">
                  {video.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-4">
                  "{video.description}"
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Quote className="w-4 h-4 text-chakana-gold" />
                  {video.author}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Social Links Section */}
      <section>
        <div className="section-header">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Heart className="w-8 h-8 text-chakana-gold" />
            Conecta con Chakana
          </h2>
          <p className="text-muted-foreground mt-2">
            Sigue nuestro viaje y únete a la comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link-card group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${link.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: link.color }} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    {link.name}
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-sm text-muted-foreground">{link.description}</div>
                </div>
              </a>
            )
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-chakana-gold/10 to-chakana-navy/10 p-8 md:p-12 border border-chakana-gold/20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-chakana-gold/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tu Transformación te Espera
          </h2>
          <p className="text-muted-foreground mb-8">
            Únete a cientos de personas que han descubierto una nueva forma de vivir.
            El próximo retiro podría cambiar tu vida.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://chakanalaexperiencia.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium w-full sm:w-auto"
            >
              <Globe className="w-5 h-5 mr-2" />
              Visitar Web Oficial
            </a>
            <a
              href="https://www.whatsapp.com/channel/0029Vb6z0Wc6RGJDZ8DjT52a"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium-outline w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Únete al Canal
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

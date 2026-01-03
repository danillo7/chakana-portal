import { useState } from 'react'
import {
  Shield,
  AlertTriangle,
  Target,
  TrendingUp,
  Plus,
  X,
  Save,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { Badge } from '../../components/ui/badge'

interface SwotItem {
  id: string
  text: string
  priority: 'high' | 'medium' | 'low'
  action?: string
}

interface SwotData {
  strengths: SwotItem[]
  weaknesses: SwotItem[]
  opportunities: SwotItem[]
  threats: SwotItem[]
}

// Initial SWOT data for Chakana
const initialSwotData: SwotData = {
  strengths: [
    { id: 's1', text: 'Iván Silva - 15+ años experiencia como chamán', priority: 'high' },
    { id: 's2', text: 'Ubicación privilegiada en montaña (Casas Bajas)', priority: 'high' },
    { id: 's3', text: 'Precio competitivo vs. competencia internacional', priority: 'medium' },
    { id: 's4', text: 'Equipo multidisciplinar (legal, marketing, terapia)', priority: 'medium' },
    { id: 's5', text: 'Enfoque en integración y seguimiento post-retiro', priority: 'high' },
    { id: 's6', text: 'Flexibilidad legal en España vs. otros países', priority: 'medium' },
  ],
  weaknesses: [
    { id: 'w1', text: 'Marca nueva sin track record público', priority: 'high', action: 'Recopilar testimonios desde retiro 1' },
    { id: 'w2', text: 'Dependencia de un solo facilitador principal', priority: 'high', action: 'Formar facilitadores adicionales' },
    { id: 'w3', text: 'Capacidad limitada (8-10 personas/retiro)', priority: 'medium', action: 'Escalar a 2 espacios en Year 2' },
    { id: 'w4', text: 'Sin presencia en directorios internacionales', priority: 'medium', action: 'Registrar en Retreat Guru, AyaAdvisors' },
    { id: 'w5', text: 'Falta de certificaciones formales', priority: 'low' },
  ],
  opportunities: [
    { id: 'o1', text: 'Mercado de wellness en crecimiento exponencial', priority: 'high' },
    { id: 'o2', text: 'Turismo de salud mental post-COVID', priority: 'high' },
    { id: 'o3', text: 'Demanda de Brasil/Latinoamérica por Europa', priority: 'medium' },
    { id: 'o4', text: 'Posibles cambios legislativos favorables', priority: 'medium' },
    { id: 'o5', text: 'Alianzas con clínicas de salud mental', priority: 'high' },
    { id: 'o6', text: 'Retiros corporativos para ejecutivos', priority: 'medium' },
  ],
  threats: [
    { id: 't1', text: 'Cambios regulatorios adversos', priority: 'high', action: 'Monitorear legislación, diversificar servicios' },
    { id: 't2', text: 'Incidentes en otros centros que afecten reputación del sector', priority: 'high', action: 'Protocolo de seguridad médica estricto' },
    { id: 't3', text: 'Competencia establecida (Rythmia, Soltara)', priority: 'medium', action: 'Diferenciación por precio y seguimiento' },
    { id: 't4', text: 'Crisis económica que afecte turismo premium', priority: 'medium' },
    { id: 't5', text: 'Dependencia de proveedores de medicina', priority: 'medium', action: 'Diversificar proveedores' },
  ],
}

const quadrantConfig = {
  strengths: {
    title: 'Fortalezas',
    subtitle: 'Interno Positivo',
    icon: Shield,
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    iconColor: 'text-emerald-600',
    bgHover: 'hover:bg-emerald-500/5'
  },
  weaknesses: {
    title: 'Debilidades',
    subtitle: 'Interno Negativo',
    icon: AlertTriangle,
    color: 'amber',
    gradient: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    iconColor: 'text-amber-600',
    bgHover: 'hover:bg-amber-500/5'
  },
  opportunities: {
    title: 'Oportunidades',
    subtitle: 'Externo Positivo',
    icon: TrendingUp,
    color: 'blue',
    gradient: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    iconColor: 'text-blue-600',
    bgHover: 'hover:bg-blue-500/5'
  },
  threats: {
    title: 'Amenazas',
    subtitle: 'Externo Negativo',
    icon: Target,
    color: 'red',
    gradient: 'from-red-500/20 to-red-500/5',
    border: 'border-red-500/30',
    badge: 'bg-red-500/10 text-red-600 border-red-500/30',
    iconColor: 'text-red-600',
    bgHover: 'hover:bg-red-500/5'
  },
}

export function SwotAnalysisPage() {
  const [swotData, setSwotData] = useState<SwotData>(initialSwotData)
  const [newItemText, setNewItemText] = useState('')
  const [addingTo, setAddingTo] = useState<keyof SwotData | null>(null)

  const handleAddItem = (quadrant: keyof SwotData) => {
    if (!newItemText.trim()) return

    const newItem: SwotItem = {
      id: `${quadrant[0]}${Date.now()}`,
      text: newItemText,
      priority: 'medium'
    }

    setSwotData(prev => ({
      ...prev,
      [quadrant]: [...prev[quadrant], newItem]
    }))

    setNewItemText('')
    setAddingTo(null)
  }

  const handleDeleteItem = (quadrant: keyof SwotData, itemId: string) => {
    setSwotData(prev => ({
      ...prev,
      [quadrant]: prev[quadrant].filter(item => item.id !== itemId)
    }))
  }

  const handleUpdatePriority = (quadrant: keyof SwotData, itemId: string, priority: SwotItem['priority']) => {
    setSwotData(prev => ({
      ...prev,
      [quadrant]: prev[quadrant].map(item =>
        item.id === itemId ? { ...item, priority } : item
      )
    }))
  }

  const getPriorityColor = (priority: SwotItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-amber-500'
      case 'low': return 'bg-green-500'
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-chakana-sage/10 via-chakana-mint/10 to-chakana-sage/10 rounded-3xl blur-xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-chakana-sage to-chakana-sage-dark flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-display font-bold text-gradient-sage">
                    Análisis SWOT
                  </h1>
                  <Badge className="bg-chakana-sage/10 text-chakana-sage border-chakana-sage/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Interactivo
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Fortalezas, Debilidades, Oportunidades y Amenazas de Chakana
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">Prioridad:</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>Alta</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Media</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Baja</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SWOT Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(quadrantConfig) as Array<keyof SwotData>).map((quadrant) => {
          const config = quadrantConfig[quadrant]
          const Icon = config.icon
          const items = swotData[quadrant]

          return (
            <div
              key={quadrant}
              className={`relative overflow-hidden rounded-2xl border ${config.border} bg-gradient-to-br ${config.gradient}`}
            >
              {/* Header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${config.badge} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{config.title}</h3>
                      <p className="text-xs text-muted-foreground">{config.subtitle}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {items.length} items
                  </Badge>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-2 min-h-[200px]">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`group flex items-start gap-3 p-3 rounded-xl bg-card/50 border border-border/50 ${config.bgHover} transition-all`}
                  >
                    {/* Priority indicator */}
                    <button
                      onClick={() => {
                        const priorities: SwotItem['priority'][] = ['low', 'medium', 'high']
                        const currentIndex = priorities.indexOf(item.priority)
                        const nextPriority = priorities[(currentIndex + 1) % 3]
                        handleUpdatePriority(quadrant, item.id, nextPriority)
                      }}
                      className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)} mt-2 flex-shrink-0 cursor-pointer hover:scale-150 transition-transform`}
                      title="Click para cambiar prioridad"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{item.text}</p>
                      {item.action && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-chakana-sage">
                          <ArrowRight className="w-3 h-3" />
                          {item.action}
                        </div>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteItem(quadrant, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-red-500 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add new item */}
                {addingTo === quadrant ? (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border">
                    <input
                      type="text"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      placeholder="Nuevo item..."
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddItem(quadrant)
                        if (e.key === 'Escape') setAddingTo(null)
                      }}
                    />
                    <button
                      onClick={() => handleAddItem(quadrant)}
                      className="p-1 rounded hover:bg-chakana-sage/10 text-chakana-sage"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setAddingTo(null)}
                      className="p-1 rounded hover:bg-red-500/10 text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTo(quadrant)}
                    className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl border border-dashed ${config.border} text-muted-foreground hover:text-foreground hover:border-solid transition-all`}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Agregar</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Strategic Actions Summary */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-chakana-gold" />
          Acciones Estratégicas Derivadas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SO Strategies */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="font-medium text-emerald-600 mb-2">SO: Usar Fortalezas para Aprovechar Oportunidades</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Posicionar experiencia de Iván para captar mercado wellness</li>
              <li>• Usar precio competitivo para atraer mercado BR/LATAM</li>
              <li>• Aprovechar ubicación para retiros corporativos premium</li>
            </ul>
          </div>

          {/* WO Strategies */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <h4 className="font-medium text-blue-600 mb-2">WO: Superar Debilidades con Oportunidades</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Usar testimonios del mercado BR para construir credibilidad</li>
              <li>• Alianzas con clínicas para ganar certificaciones</li>
              <li>• Formar facilitadores aprovechando demanda de formación</li>
            </ul>
          </div>

          {/* ST Strategies */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <h4 className="font-medium text-amber-600 mb-2">ST: Usar Fortalezas para Mitigar Amenazas</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Protocolos de seguridad estrictos para diferenciarse</li>
              <li>• Equipo legal para monitorear cambios regulatorios</li>
              <li>• Enfoque en integración para diferenciarse de competencia</li>
            </ul>
          </div>

          {/* WT Strategies */}
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <h4 className="font-medium text-red-600 mb-2">WT: Minimizar Debilidades y Evitar Amenazas</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Diversificar servicios (yoga, meditación) si regulación cambia</li>
              <li>• Construir track record antes de escalar</li>
              <li>• Múltiples proveedores para reducir dependencias</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import {
  FileText,
  Users,
  Lightbulb,
  Heart,
  HandshakeIcon,
  Truck,
  DollarSign,
  Package,
  Target,
  Building2,
  TrendingUp,
  Download,
  Edit3,
  Save,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'

// Business Model Canvas sections
interface CanvasSection {
  id: string
  title: string
  icon: React.ElementType
  color: string
  bgColor: string
  items: string[]
  description: string
}

// Chakana Business Model Canvas Data
const initialCanvasData: CanvasSection[] = [
  {
    id: 'key-partners',
    title: 'Socios Clave',
    icon: HandshakeIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10 border-purple-500/30',
    description: 'Alianzas estratégicas para operar',
    items: [
      'Iván Silva - Chamán, facilitador principal',
      'Dr. Danillo Costa - Dirección estratégica & legal',
      'Propietarios Casas Bajas - Inmuebles',
      'Red de terapeutas y músicos',
      'Proveedores de medicina ancestral',
      'Nutricionistas y chefs vegetarianos'
    ]
  },
  {
    id: 'key-activities',
    title: 'Actividades Clave',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
    description: 'Lo que hacemos cada día',
    items: [
      'Facilitación de ceremonias de ayahuasca',
      'Preparación y cuidado del set & setting',
      'Integración post-ceremonia',
      'Atención personalizada 24/7',
      'Marketing y captación de clientes',
      'Gestión de comunidad y seguimiento'
    ]
  },
  {
    id: 'key-resources',
    title: 'Recursos Clave',
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10 border-green-500/30',
    description: 'Lo que necesitamos para operar',
    items: [
      'Espacio ceremonial (Casas Bajas)',
      'Conocimiento ancestral de Iván',
      'Medicina de calidad (ayahuasca)',
      'Equipo de facilitadores formados',
      'Plataforma digital (web, CRM)',
      'Capital inicial (€45,000-55,000)'
    ]
  },
  {
    id: 'value-proposition',
    title: 'Propuesta de Valor',
    icon: Lightbulb,
    color: 'text-chakana-gold',
    bgColor: 'bg-chakana-gold/10 border-chakana-gold/30',
    description: 'Por qué nos eligen',
    items: [
      'Transformación personal profunda',
      'Seguridad médica y emocional',
      'Entorno natural privilegiado (montaña)',
      'Integración + seguimiento post-retiro',
      'Comunidad de apoyo continuo',
      'Precio accesible vs. competencia internacional'
    ]
  },
  {
    id: 'customer-relationships',
    title: 'Relaciones con Clientes',
    icon: Heart,
    color: 'text-rose-600',
    bgColor: 'bg-rose-500/10 border-rose-500/30',
    description: 'Cómo nos relacionamos',
    items: [
      'Atención personalizada pre-retiro',
      'Acompañamiento 24/7 durante retiro',
      'Integración grupal e individual',
      'Comunidad WhatsApp de alumni',
      'Seguimiento a 30/60/90 días',
      'Programa de referidos'
    ]
  },
  {
    id: 'channels',
    title: 'Canales',
    icon: Truck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
    description: 'Cómo llegamos al cliente',
    items: [
      'Web oficial (chakanalaexperiencia.es)',
      'Instagram @chakana_le',
      'YouTube (testimonios)',
      'Boca a boca / referidos',
      'Colaboraciones con terapeutas',
      'Eventos presenciales de introducción'
    ]
  },
  {
    id: 'customer-segments',
    title: 'Segmentos de Clientes',
    icon: Users,
    color: 'text-teal-600',
    bgColor: 'bg-teal-500/10 border-teal-500/30',
    description: 'A quién servimos',
    items: [
      'Buscadores espirituales (35-55 años)',
      'Profesionales con burnout/crisis',
      'Personas en duelo o transición vital',
      'Terapeutas que buscan herramientas',
      'Empresarios buscando claridad',
      'Personas con adicciones (supervisadas)'
    ]
  },
  {
    id: 'cost-structure',
    title: 'Estructura de Costes',
    icon: Building2,
    color: 'text-red-600',
    bgColor: 'bg-red-500/10 border-red-500/30',
    description: 'En qué gastamos',
    items: [
      'Alquiler espacio ceremonial',
      'Medicina y materiales',
      'Equipo (facilitadores, músicos, chef)',
      'Marketing digital',
      'Seguros y permisos',
      'Plataforma tecnológica'
    ]
  },
  {
    id: 'revenue-streams',
    title: 'Fuentes de Ingreso',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
    description: 'Cómo ganamos dinero',
    items: [
      'Retiros Nivel 1 (€497-600)',
      'Retiros Nivel 2 (€800-1,200)',
      'Retiros VIP/Privados (€2,000+)',
      'Sesiones de integración (€80-150)',
      'Formaciones para facilitadores',
      'Productos (libros, cursos online)'
    ]
  }
]

// Financial projections
const financialProjections = {
  year1: {
    retiros: 12,
    asistentes: 96,
    ingresoRetiros: 48000,
    otrosIngresos: 5000,
    costes: 35000,
    beneficio: 18000
  },
  year2: {
    retiros: 24,
    asistentes: 216,
    ingresoRetiros: 108000,
    otrosIngresos: 15000,
    costes: 65000,
    beneficio: 58000
  },
  year3: {
    retiros: 36,
    asistentes: 360,
    ingresoRetiros: 180000,
    otrosIngresos: 40000,
    costes: 100000,
    beneficio: 120000
  }
}

export function BusinessPlanPage() {
  const [canvasData, setCanvasData] = useState(initialCanvasData)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editItems, setEditItems] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'canvas' | 'financials' | 'roadmap'>('canvas')

  const handleEditSection = (sectionId: string) => {
    const section = canvasData.find(s => s.id === sectionId)
    if (section) {
      setEditItems([...section.items])
      setEditingSection(sectionId)
    }
  }

  const handleSaveSection = () => {
    if (!editingSection) return
    setCanvasData(prev => prev.map(section =>
      section.id === editingSection
        ? { ...section, items: editItems.filter(item => item.trim()) }
        : section
    ))
    setEditingSection(null)
    setEditItems([])
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    setEditItems([])
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-chakana-gold/10 via-chakana-sage/10 to-chakana-gold/10 rounded-3xl blur-xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-chakana-gold to-chakana-gold/70 flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-display font-bold text-gradient-sage">
                    Plan de Negocio
                  </h1>
                  <Badge className="bg-chakana-gold/10 text-chakana-gold border-chakana-gold/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Chakana La Experiencia
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Business Model Canvas interactivo y proyecciones financieras
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar PDF
              </Button>
              <Button
                className="gap-2 bg-chakana-sage hover:bg-chakana-sage-dark"
                onClick={() => window.open('https://chakanalaexperiencia.es', '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Ver Web
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-card rounded-xl border border-border w-fit">
        {[
          { id: 'canvas', label: 'Business Canvas', icon: Target },
          { id: 'financials', label: 'Proyecciones', icon: TrendingUp },
          { id: 'roadmap', label: 'Roadmap', icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-chakana-sage text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Model Canvas */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Row 1: Key Partners, Key Activities, Value Proposition, Customer Relationships, Customer Segments */}
          <div className="lg:col-span-1 lg:row-span-2">
            <CanvasCard
              section={canvasData[0]}
              isEditing={editingSection === canvasData[0].id}
              editItems={editItems}
              onEdit={() => handleEditSection(canvasData[0].id)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              setEditItems={setEditItems}
            />
          </div>

          <div className="lg:col-span-1">
            <CanvasCard
              section={canvasData[1]}
              isEditing={editingSection === canvasData[1].id}
              editItems={editItems}
              onEdit={() => handleEditSection(canvasData[1].id)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              setEditItems={setEditItems}
            />
          </div>

          <div className="lg:col-span-1 lg:row-span-2">
            <CanvasCard
              section={canvasData[3]}
              isEditing={editingSection === canvasData[3].id}
              editItems={editItems}
              onEdit={() => handleEditSection(canvasData[3].id)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              setEditItems={setEditItems}
              highlight
            />
          </div>

          <div className="lg:col-span-1">
            <CanvasCard
              section={canvasData[4]}
              isEditing={editingSection === canvasData[4].id}
              editItems={editItems}
              onEdit={() => handleEditSection(canvasData[4].id)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              setEditItems={setEditItems}
            />
          </div>

          <div className="lg:col-span-1 lg:row-span-2">
            <CanvasCard
              section={canvasData[6]}
              isEditing={editingSection === canvasData[6].id}
              editItems={editItems}
              onEdit={() => handleEditSection(canvasData[6].id)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              setEditItems={setEditItems}
            />
          </div>

          {/* Row 2: Key Resources, Channels */}
          <div className="lg:col-span-1">
            <CanvasCard
              section={canvasData[2]}
              isEditing={editingSection === canvasData[2].id}
              editItems={editItems}
              onEdit={() => handleEditSection(canvasData[2].id)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              setEditItems={setEditItems}
            />
          </div>

          <div className="lg:col-span-1">
            <CanvasCard
              section={canvasData[5]}
              isEditing={editingSection === canvasData[5].id}
              editItems={editItems}
              onEdit={() => handleEditSection(canvasData[5].id)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              setEditItems={setEditItems}
            />
          </div>

          {/* Row 3: Cost Structure, Revenue Streams */}
          <div className="lg:col-span-2">
            <CanvasCard
              section={canvasData[7]}
              isEditing={editingSection === canvasData[7].id}
              editItems={editItems}
              onEdit={() => handleEditSection(canvasData[7].id)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              setEditItems={setEditItems}
            />
          </div>

          <div className="lg:col-span-3">
            <CanvasCard
              section={canvasData[8]}
              isEditing={editingSection === canvasData[8].id}
              editItems={editItems}
              onEdit={() => handleEditSection(canvasData[8].id)}
              onSave={handleSaveSection}
              onCancel={handleCancelEdit}
              setEditItems={setEditItems}
            />
          </div>
        </div>
      )}

      {/* Financial Projections */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(financialProjections).map(([year, data], index) => (
              <div key={year} className="relative overflow-hidden rounded-2xl bg-card border border-border p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-chakana-sage/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-chakana-sage/10 text-chakana-sage border-chakana-sage/30">
                      Año {index + 1}
                    </Badge>
                    <span className="text-2xl font-bold text-chakana-gold">
                      €{data.beneficio.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Retiros</span>
                      <span className="font-medium">{data.retiros}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Asistentes</span>
                      <span className="font-medium">{data.asistentes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ingresos Retiros</span>
                      <span className="font-medium text-emerald-600">€{data.ingresoRetiros.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Otros Ingresos</span>
                      <span className="font-medium text-emerald-600">€{data.otrosIngresos.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                      <span className="text-muted-foreground">Costes</span>
                      <span className="font-medium text-red-500">-€{data.costes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Investment Required */}
          <div className="rounded-2xl bg-gradient-to-br from-chakana-dark to-chakana-dark/90 p-6 text-white">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-chakana-gold" />
              Inversión Inicial Requerida
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 text-sm">Mínimo</p>
                <p className="text-2xl font-bold text-chakana-mint">€45,000</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 text-sm">Óptimo</p>
                <p className="text-2xl font-bold text-chakana-gold">€55,000</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 text-sm">ROI Año 1</p>
                <p className="text-2xl font-bold text-emerald-400">40%</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 text-sm">Break-even</p>
                <p className="text-2xl font-bold text-white">8 meses</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-chakana-sage via-chakana-gold to-chakana-sage/30" />

            {[
              { phase: 'Q1 2026', title: 'Lanzamiento', items: ['Web oficial', 'Primer retiro (Enero)', '4 retiros nivel 1', 'Construir comunidad inicial'] },
              { phase: 'Q2 2026', title: 'Consolidación', items: ['Retiros mensuales', 'Lanzar nivel 2', 'Programa de referidos', 'Testimonios en video'] },
              { phase: 'Q3 2026', title: 'Expansión', items: ['Retiros quincenales', 'Formar facilitadores', 'Partnerships terapeutas', 'Internacionalización (PT/BR)'] },
              { phase: 'Q4 2026', title: 'Escala', items: ['Casa Chakana (2do espacio)', 'Retiros corporativos', 'Formaciones', 'Fundación Cooper'] },
            ].map((phase) => (
              <div key={phase.phase} className="relative pl-20 pb-8">
                <div className="absolute left-6 w-5 h-5 rounded-full bg-chakana-sage border-4 border-background" />
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-chakana-sage/10 text-chakana-sage border-chakana-sage/30">
                      {phase.phase}
                    </Badge>
                    <h3 className="font-semibold text-lg">{phase.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-chakana-sage/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Canvas Card Component
interface CanvasCardProps {
  section: CanvasSection
  isEditing: boolean
  editItems: string[]
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  setEditItems: (items: string[]) => void
  highlight?: boolean
}

function CanvasCard({ section, isEditing, editItems, onEdit, onSave, onCancel, setEditItems, highlight }: CanvasCardProps) {
  const Icon = section.icon

  return (
    <div className={`h-full rounded-xl border ${section.bgColor} ${highlight ? 'ring-2 ring-chakana-gold/50' : ''} overflow-hidden transition-all hover:shadow-lg`}>
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${section.color}`} />
            <h3 className="font-semibold text-sm">{section.title}</h3>
          </div>
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          ) : (
            <div className="flex gap-1">
              <button onClick={onSave} className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-600">
                <Save className="w-3.5 h-3.5" />
              </button>
              <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-3">{section.description}</p>

        {/* Items */}
        {isEditing ? (
          <div className="flex-1 space-y-2">
            {editItems.map((item, index) => (
              <input
                key={index}
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...editItems]
                  newItems[index] = e.target.value
                  setEditItems(newItems)
                }}
                className="w-full px-2 py-1 text-xs rounded bg-white/50 dark:bg-black/20 border border-border focus:outline-none focus:ring-1 focus:ring-chakana-sage"
              />
            ))}
            <button
              onClick={() => setEditItems([...editItems, ''])}
              className="w-full py-1 text-xs text-chakana-sage hover:bg-chakana-sage/10 rounded transition-colors"
            >
              + Agregar item
            </button>
          </div>
        ) : (
          <ul className="flex-1 space-y-1.5">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-xs">
                <div className={`w-1 h-1 rounded-full ${section.color.replace('text-', 'bg-')} mt-1.5 flex-shrink-0`} />
                <span className="text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import {
  Search,
  TrendingUp,
  MapPin,
  DollarSign,
  Users,
  Star,
  ExternalLink,
  Filter,
  Globe,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// Competitor data structure
interface Competitor {
  id: string
  name: string
  location: string
  country: string
  website: string
  priceRange: { min: number; max: number; currency: string }
  rating: number
  reviewCount: number
  established: number
  focus: string[]
  strengths: string[]
  weaknesses: string[]
  marketPosition: 'leader' | 'challenger' | 'niche' | 'emerging'
  threatLevel: 'high' | 'medium' | 'low'
  image?: string
}

// Real competitor data for ayahuasca/wellness retreat market
const competitors: Competitor[] = [
  {
    id: 'rythmia',
    name: 'Rythmia Life Advancement Center',
    location: 'Guanacaste',
    country: 'Costa Rica',
    website: 'https://rythmia.com',
    priceRange: { min: 4999, max: 7999, currency: 'USD' },
    rating: 4.8,
    reviewCount: 1250,
    established: 2016,
    focus: ['Ayahuasca', 'Wellness Resort', 'Luxury Experience'],
    strengths: ['Brand recognition', 'Luxury facilities', 'Medical staff on-site', 'All-inclusive'],
    weaknesses: ['Very high price point', 'Corporate feel', 'Less personal'],
    marketPosition: 'leader',
    threatLevel: 'medium',
  },
  {
    id: 'soltara',
    name: 'Soltara Healing Center',
    location: 'Gulf of Nicoya',
    country: 'Costa Rica',
    website: 'https://soltara.co',
    priceRange: { min: 2800, max: 5500, currency: 'USD' },
    rating: 4.9,
    reviewCount: 890,
    established: 2018,
    focus: ['Shipibo Tradition', 'Healing Focus', 'Oceanfront'],
    strengths: ['Authentic Shipibo lineage', 'Beautiful location', 'Strong community'],
    weaknesses: ['Limited availability', 'Remote location'],
    marketPosition: 'challenger',
    threatLevel: 'low',
  },
  {
    id: 'temple',
    name: 'Temple of the Way of Light',
    location: 'Iquitos',
    country: 'Peru',
    website: 'https://templeofthewayoflight.org',
    priceRange: { min: 2200, max: 4500, currency: 'USD' },
    rating: 4.7,
    reviewCount: 2100,
    established: 2007,
    focus: ['Shipibo Curanderos', 'Deep Healing', 'Traditional'],
    strengths: ['Long track record', 'Deep tradition', 'Experienced facilitators'],
    weaknesses: ['Basic accommodations', 'Challenging environment'],
    marketPosition: 'leader',
    threatLevel: 'low',
  },
  {
    id: 'arkana',
    name: 'Arkana Spiritual Center',
    location: 'Sacred Valley / Amazon',
    country: 'Peru',
    website: 'https://arkanaspiritual.com',
    priceRange: { min: 1800, max: 3500, currency: 'USD' },
    rating: 4.6,
    reviewCount: 650,
    established: 2012,
    focus: ['Dual Locations', 'Andes & Amazon', 'Variety'],
    strengths: ['Two distinct experiences', 'Good value', 'Flexible programs'],
    weaknesses: ['Split focus', 'Variable quality'],
    marketPosition: 'challenger',
    threatLevel: 'low',
  },
  {
    id: 'inner-mastery',
    name: 'Inner Mastery International',
    location: 'Valencia Region',
    country: 'Spain',
    website: 'https://innermastery.es',
    priceRange: { min: 1500, max: 3000, currency: 'EUR' },
    rating: 4.5,
    reviewCount: 320,
    established: 2015,
    focus: ['European Market', 'Integration Focus', 'Legal Framework'],
    strengths: ['European accessibility', 'Legal clarity', 'Integration support'],
    weaknesses: ['Less exotic setting', 'Smaller ceremonies'],
    marketPosition: 'niche',
    threatLevel: 'high',
  },
  {
    id: 'synthesis',
    name: 'Synthesis Retreat',
    location: 'Amsterdam Area',
    country: 'Netherlands',
    website: 'https://synthesisretreat.com',
    priceRange: { min: 3500, max: 6500, currency: 'EUR' },
    rating: 4.8,
    reviewCount: 480,
    established: 2018,
    focus: ['Psilocybin', 'Legal', 'Premium'],
    strengths: ['100% legal', 'Premium experience', 'Strong brand'],
    weaknesses: ['Not ayahuasca', 'Very expensive', 'Limited availability'],
    marketPosition: 'niche',
    threatLevel: 'medium',
  },
  {
    id: 'soul-quest',
    name: 'Soul Quest Ayahuasca Church',
    location: 'Orlando',
    country: 'USA',
    website: 'https://soulquestorlandoretreats.org',
    priceRange: { min: 1495, max: 2495, currency: 'USD' },
    rating: 4.4,
    reviewCount: 720,
    established: 2017,
    focus: ['Religious Exemption', 'US Market', 'Weekend Retreats'],
    strengths: ['US accessibility', 'Religious legal protection', 'Growing community'],
    weaknesses: ['Legal grey area', 'Urban setting', 'Less traditional'],
    marketPosition: 'niche',
    threatLevel: 'low',
  },
  {
    id: 'behold',
    name: 'Behold Retreats',
    location: 'Multiple Locations',
    country: 'Costa Rica / Netherlands',
    website: 'https://beholdretreats.com',
    priceRange: { min: 4200, max: 8500, currency: 'USD' },
    rating: 4.7,
    reviewCount: 340,
    established: 2019,
    focus: ['Psilocybin & Ayahuasca', 'Preparation & Integration', 'Science-Based'],
    strengths: ['Multiple substances', 'Strong preparation program', 'Modern approach'],
    weaknesses: ['Premium pricing', 'Less traditional'],
    marketPosition: 'challenger',
    threatLevel: 'medium',
  },
  {
    id: 'mycomeditations',
    name: 'MycoMeditations',
    location: 'Treasure Beach',
    country: 'Jamaica',
    website: 'https://mycomeditations.com',
    priceRange: { min: 3500, max: 5500, currency: 'USD' },
    rating: 4.9,
    reviewCount: 560,
    established: 2015,
    focus: ['Psilocybin', 'Legal Jamaica', 'Beach Setting'],
    strengths: ['100% legal', 'Beautiful location', 'Experienced team'],
    weaknesses: ['Not ayahuasca', 'Long travel for Europeans'],
    marketPosition: 'niche',
    threatLevel: 'low',
  },
  {
    id: 'spirit-vine',
    name: 'Spirit Vine Ayahuasca Retreat',
    location: 'Bahia',
    country: 'Brazil',
    website: 'https://spiritvineretreats.com',
    priceRange: { min: 2200, max: 4200, currency: 'USD' },
    rating: 4.6,
    reviewCount: 890,
    established: 2008,
    focus: ['Brazilian Tradition', 'Beach & Nature', 'Long Retreats'],
    strengths: ['Beautiful location', 'Legal in Brazil', 'Long track record'],
    weaknesses: ['Long travel', 'Language barrier potential'],
    marketPosition: 'challenger',
    threatLevel: 'low',
  },
  {
    id: 'nihue-rao',
    name: 'Nihue Rao Centro Espiritual',
    location: 'Iquitos',
    country: 'Peru',
    website: 'https://nihuerao.com',
    priceRange: { min: 1600, max: 2800, currency: 'USD' },
    rating: 4.8,
    reviewCount: 410,
    established: 2010,
    focus: ['Shipibo Tradition', 'Deep Dieta', 'Affordable'],
    strengths: ['Authentic tradition', 'Excellent value', 'Strong dieta program'],
    weaknesses: ['Basic facilities', 'Remote location', 'Challenging environment'],
    marketPosition: 'niche',
    threatLevel: 'low',
  },
  {
    id: 'atman',
    name: 'Atman Retreat',
    location: 'Otavalo',
    country: 'Ecuador',
    website: 'https://atmanretreat.com',
    priceRange: { min: 1900, max: 3200, currency: 'USD' },
    rating: 4.5,
    reviewCount: 280,
    established: 2016,
    focus: ['Andean Setting', 'San Pedro & Ayahuasca', 'Holistic'],
    strengths: ['Beautiful Andes location', 'Multiple medicines', 'Good value'],
    weaknesses: ['Less known', 'Variable quality reports'],
    marketPosition: 'emerging',
    threatLevel: 'low',
  },
  {
    id: 'gaia-sagrada',
    name: 'Gaia Sagrada',
    location: 'Cuenca',
    country: 'Ecuador',
    website: 'https://gaiasagrada.com',
    priceRange: { min: 995, max: 1995, currency: 'USD' },
    rating: 4.3,
    reviewCount: 520,
    established: 2009,
    focus: ['Budget-Friendly', 'Multiple Ceremonies', 'Community'],
    strengths: ['Very affordable', 'Multiple options', 'Long history'],
    weaknesses: ['Budget feel', 'High volume', 'Variable quality'],
    marketPosition: 'niche',
    threatLevel: 'low',
  },
  {
    id: 'aya-healing',
    name: 'Aya Healing Retreats',
    location: 'Catalonia',
    country: 'Spain',
    website: 'https://ayahealing.com',
    priceRange: { min: 800, max: 1800, currency: 'EUR' },
    rating: 4.2,
    reviewCount: 180,
    established: 2019,
    focus: ['Spanish Market', 'Weekend Retreats', 'Accessible'],
    strengths: ['European location', 'Good prices', 'Growing reputation'],
    weaknesses: ['New entrant', 'Limited track record'],
    marketPosition: 'emerging',
    threatLevel: 'high',
  },
  {
    id: 'blue-morpho',
    name: 'Blue Morpho Tours',
    location: 'Iquitos',
    country: 'Peru',
    website: 'https://bluemorphotours.com',
    priceRange: { min: 2500, max: 4500, currency: 'USD' },
    rating: 4.7,
    reviewCount: 1850,
    established: 2004,
    focus: ['Amazon Jungle', 'Traditional Shipibo', 'Veteran Team'],
    strengths: ['20+ years experience', 'Strong reputation', 'Authentic experience'],
    weaknesses: ['Remote location', 'Challenging conditions'],
    marketPosition: 'leader',
    threatLevel: 'low',
  },
]

// Market data
const marketStats = {
  globalMarketSize: { value: 12.8, unit: 'B', currency: 'USD', year: 2024 },
  growthRate: 11.2,
  europeanMarket: { value: 2.1, unit: 'B', currency: 'EUR' },
  spanishMarket: { value: 180, unit: 'M', currency: 'EUR' },
  averageSpend: 3500,
  repeatRate: 42,
}

const marketTrends = [
  { trend: 'Post-pandemic wellness demand', direction: 'up' as const, impact: 'high' },
  { trend: 'Mental health awareness', direction: 'up' as const, impact: 'high' },
  { trend: 'Regulatory acceptance (psilocybin)', direction: 'up' as const, impact: 'medium' },
  { trend: 'Corporate retreats segment', direction: 'up' as const, impact: 'medium' },
  { trend: 'Traditional ayahuasca stigma', direction: 'down' as const, impact: 'medium' },
  { trend: 'DIY/underground ceremonies', direction: 'stable' as const, impact: 'low' },
]

// Chakana positioning
const chakanaPositioning = {
  pricePoint: { min: 500, max: 800, currency: 'EUR' },
  uniqueValue: [
    'Intimate groups (max 8)',
    'Spanish-European accessibility',
    'Authentic Shipibo lineage + modern integration',
    'Legal framework (truffle-based)',
    'Cost-effective entry point',
  ],
  targetSegments: [
    'European professionals seeking transformation',
    'Spanish-speaking community in Europe',
    'First-time ceremony seekers',
    'Those priced out of luxury retreats',
  ],
}

export function MarketIntelligencePage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)
  const [filterPosition, setFilterPosition] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredCompetitors = competitors.filter(c =>
    filterPosition === 'all' || c.marketPosition === filterPosition
  )

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/30'
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/30'
      case 'low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getPositionBadge = (position: string) => {
    switch (position) {
      case 'leader': return 'bg-purple-500/10 text-purple-500 border-purple-500/30'
      case 'challenger': return 'bg-blue-500/10 text-blue-500 border-blue-500/30'
      case 'niche': return 'bg-chakana-sage/10 text-chakana-sage border-chakana-sage/30'
      case 'emerging': return 'bg-amber-500/10 text-amber-500 border-amber-500/30'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30'
    }
  }

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-emerald-500" />
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-500" />
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Search className="w-8 h-8 text-chakana-sage" />
            Market Intelligence
          </h1>
          <p className="text-muted-foreground mt-2">
            Competitive landscape & market analysis for spiritual wellness retreats
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-accent transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 rounded-2xl bg-card border border-border">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2">Market Position:</span>
            {['all', 'leader', 'challenger', 'niche', 'emerging'].map(pos => (
              <button
                key={pos}
                onClick={() => setFilterPosition(pos)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterPosition === pos
                    ? 'bg-chakana-sage text-white'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {pos === 'all' ? 'All' : pos.charAt(0).toUpperCase() + pos.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Market Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">Global Market</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            ${marketStats.globalMarketSize.value}{marketStats.globalMarketSize.unit}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Wellness tourism {marketStats.globalMarketSize.year}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Growth Rate</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            +{marketStats.growthRate}%
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Annual compound growth
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Avg. Spend</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            €{marketStats.averageSpend.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Per retreat experience
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Repeat Rate</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {marketStats.repeatRate}%
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Return for second retreat
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competitors List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-chakana-sage" />
            Competitive Landscape
          </h2>

          <div className="space-y-3">
            {filteredCompetitors.map(competitor => (
              <div
                key={competitor.id}
                onClick={() => setSelectedCompetitor(selectedCompetitor?.id === competitor.id ? null : competitor)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedCompetitor?.id === competitor.id
                    ? 'bg-chakana-sage/5 border-chakana-sage/30 shadow-lg'
                    : 'bg-card border-border hover:bg-accent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{competitor.name}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getPositionBadge(competitor.marketPosition)}`}>
                        {competitor.marketPosition}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getThreatColor(competitor.threatLevel)}`}>
                        {competitor.threatLevel} threat
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {competitor.location}, {competitor.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        {competitor.rating} ({competitor.reviewCount} reviews)
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {competitor.priceRange.currency} {competitor.priceRange.min.toLocaleString()}-{competitor.priceRange.max.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <a
                    href={competitor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                </div>

                {/* Expanded Details */}
                {selectedCompetitor?.id === competitor.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {competitor.focus.map(f => (
                        <span key={f} className="px-2 py-1 rounded-lg bg-muted text-xs font-medium">
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-emerald-500 mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {competitor.strengths.map(s => (
                            <li key={s} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">+</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-amber-500 mb-2">Weaknesses</h4>
                        <ul className="space-y-1">
                          {competitor.weaknesses.map(w => (
                            <li key={w} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-amber-500 mt-1">−</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Market Trends */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-chakana-sage" />
              Market Trends
            </h3>
            <div className="space-y-3">
              {marketTrends.map((trend, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{trend.trend}</span>
                  {getTrendIcon(trend.direction)}
                </div>
              ))}
            </div>
          </div>

          {/* Chakana Positioning */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-chakana-sage/10 to-chakana-sage/5 border border-chakana-sage/30">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-chakana-sage" />
              Chakana Positioning
            </h3>

            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-1">Price Point</div>
              <div className="text-2xl font-bold text-chakana-sage">
                €{chakanaPositioning.pricePoint.min}-{chakanaPositioning.pricePoint.max}
              </div>
              <div className="text-xs text-muted-foreground">
                ~70% below market average
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-foreground mb-2">Unique Value</div>
              <ul className="space-y-1">
                {chakanaPositioning.uniqueValue.map((v, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-chakana-sage">✓</span>
                    {v}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-sm font-medium text-foreground mb-2">Target Segments</div>
              <div className="flex flex-wrap gap-2">
                {chakanaPositioning.targetSegments.map((s, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-lg bg-chakana-sage/10 text-chakana-sage text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price Comparison Chart */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold text-foreground mb-4">Price Comparison</h3>
            <div className="space-y-3">
              {/* Chakana first */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-chakana-sage">Chakana</span>
                  <span className="text-muted-foreground">€500-800</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-chakana-sage rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
              {/* Others */}
              {competitors.slice(0, 4).map(c => (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{c.name.split(' ')[0]}</span>
                    <span className="text-muted-foreground">
                      {c.priceRange.currency === 'EUR' ? '€' : '$'}{c.priceRange.min}-{c.priceRange.max}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-muted-foreground/30 rounded-full"
                      style={{ width: `${(c.priceRange.max / 8000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import {
  Newspaper,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Filter,
  TrendingUp,
  AlertTriangle,
  Leaf,
  Scale,
  Heart,
  Calendar,
  Globe,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
} from 'lucide-react'

// News categories
const categories = [
  { id: 'all', label: 'All News', icon: Newspaper },
  { id: 'ayahuasca', label: 'Ayahuasca', icon: Leaf },
  { id: 'wellness', label: 'Wellness', icon: Heart },
  { id: 'legislation', label: 'Legislation', icon: Scale },
  { id: 'market', label: 'Market', icon: TrendingUp },
]

// News interface
interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  sourceUrl: string
  category: 'ayahuasca' | 'wellness' | 'legislation' | 'market'
  date: string
  relevance: 'high' | 'medium' | 'low'
  sentiment: 'positive' | 'neutral' | 'negative'
  imageUrl?: string
}

// Sample news data (in production, this would come from an API/RSS aggregator)
const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Oregon Opens First Legal Psilocybin Service Centers',
    summary: 'After years of preparation, Oregon becomes the first US state to offer regulated psilocybin therapy services, marking a historic moment for psychedelic medicine.',
    source: 'The Guardian',
    sourceUrl: 'https://theguardian.com',
    category: 'legislation',
    date: '2025-12-28',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '2',
    title: 'European Wellness Tourism Expected to Reach €400B by 2027',
    summary: 'New research shows the European wellness tourism market is experiencing unprecedented growth, driven by post-pandemic demand for transformative experiences.',
    source: 'Financial Times',
    sourceUrl: 'https://ft.com',
    category: 'market',
    date: '2025-12-26',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '3',
    title: 'Spain Considers Framework for Traditional Plant Medicine Ceremonies',
    summary: 'Spanish legislators are exploring regulatory frameworks for traditional plant medicine practices, following Portugal\'s decriminalization model.',
    source: 'El País',
    sourceUrl: 'https://elpais.com',
    category: 'legislation',
    date: '2025-12-24',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '4',
    title: 'Study: Ayahuasca Shows Promise for Treatment-Resistant Depression',
    summary: 'A new peer-reviewed study published in Nature Medicine demonstrates significant improvements in patients with treatment-resistant depression after ayahuasca-assisted therapy.',
    source: 'Nature Medicine',
    sourceUrl: 'https://nature.com',
    category: 'ayahuasca',
    date: '2025-12-22',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '5',
    title: 'Costa Rica Tightens Regulations on Unregistered Retreat Centers',
    summary: 'Costa Rican authorities announce new requirements for wellness retreat operators, including mandatory safety protocols and medical personnel.',
    source: 'Tico Times',
    sourceUrl: 'https://ticotimes.net',
    category: 'legislation',
    date: '2025-12-20',
    relevance: 'medium',
    sentiment: 'neutral',
  },
  {
    id: '6',
    title: 'Global Wellness Industry Valued at $5.6 Trillion',
    summary: 'The Global Wellness Institute releases its annual report, showing the industry has fully recovered from pandemic disruptions and is now larger than ever.',
    source: 'Global Wellness Institute',
    sourceUrl: 'https://globalwellnessinstitute.org',
    category: 'market',
    date: '2025-12-18',
    relevance: 'medium',
    sentiment: 'positive',
  },
  {
    id: '7',
    title: 'Traditional Shipibo Healers Call for Cultural Protections',
    summary: 'Indigenous Shipibo communities are advocating for stronger protections of their traditional ayahuasca practices amid growing commercialization concerns.',
    source: 'Reuters',
    sourceUrl: 'https://reuters.com',
    category: 'ayahuasca',
    date: '2025-12-16',
    relevance: 'medium',
    sentiment: 'neutral',
  },
  {
    id: '8',
    title: 'Mindfulness and Meditation Apps See 40% Growth',
    summary: 'Digital wellness solutions continue to surge in popularity, with leading apps reporting record subscriber numbers and engagement.',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com',
    category: 'wellness',
    date: '2025-12-14',
    relevance: 'low',
    sentiment: 'positive',
  },
  {
    id: '9',
    title: 'Warning: Unqualified Facilitators Pose Risks in Growing Ayahuasca Tourism',
    summary: 'Health authorities in Peru and Brazil warn about the rise of inexperienced facilitators offering ayahuasca ceremonies without proper training.',
    source: 'BBC News',
    sourceUrl: 'https://bbc.com',
    category: 'ayahuasca',
    date: '2025-12-12',
    relevance: 'high',
    sentiment: 'negative',
  },
  {
    id: '10',
    title: 'Corporate Retreats Embrace Psychedelic Integration Workshops',
    summary: 'Major corporations are increasingly offering wellness retreats that include integration practices, though stopping short of substance use.',
    source: 'Harvard Business Review',
    sourceUrl: 'https://hbr.org',
    category: 'wellness',
    date: '2025-12-10',
    relevance: 'medium',
    sentiment: 'positive',
  },
  {
    id: '11',
    title: 'Australia Approves MDMA and Psilocybin for Mental Health Treatment',
    summary: 'Australia becomes the first country to recognize psychedelics as medicines, allowing psychiatrists to prescribe MDMA and psilocybin for PTSD and depression.',
    source: 'The Lancet',
    sourceUrl: 'https://thelancet.com',
    category: 'legislation',
    date: '2025-12-08',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '12',
    title: 'Retreat Booking Platform Raises $50M Series B',
    summary: 'A leading wellness retreat booking platform announces significant funding to expand globally, signaling strong investor confidence in the sector.',
    source: 'Forbes',
    sourceUrl: 'https://forbes.com',
    category: 'market',
    date: '2025-12-06',
    relevance: 'medium',
    sentiment: 'positive',
  },
  {
    id: '13',
    title: 'Indigenous-Led Ayahuasca Tourism Growing in Ecuador',
    summary: 'Ecuador emerges as a destination for authentic ayahuasca experiences, with indigenous communities leading sustainable tourism initiatives.',
    source: 'National Geographic',
    sourceUrl: 'https://nationalgeographic.com',
    category: 'ayahuasca',
    date: '2025-12-04',
    relevance: 'medium',
    sentiment: 'positive',
  },
  {
    id: '14',
    title: 'Johns Hopkins Opens Center for Psychedelic Research',
    summary: 'The prestigious university expands its psychedelic research program with a new $17 million center dedicated to studying psilocybin therapy.',
    source: 'Science',
    sourceUrl: 'https://science.org',
    category: 'ayahuasca',
    date: '2025-12-02',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '15',
    title: 'European Mental Health Crisis Drives Interest in Alternative Treatments',
    summary: 'Rising rates of anxiety and depression across Europe are pushing patients toward alternative treatments including plant medicine retreats.',
    source: 'The Economist',
    sourceUrl: 'https://economist.com',
    category: 'wellness',
    date: '2025-11-30',
    relevance: 'high',
    sentiment: 'neutral',
  },
  {
    id: '16',
    title: 'Peru Launches Quality Certification for Ayahuasca Centers',
    summary: 'The Peruvian government introduces a voluntary certification program for ayahuasca retreat centers, emphasizing safety and traditional practices.',
    source: 'Peru Reports',
    sourceUrl: 'https://perureports.com',
    category: 'legislation',
    date: '2025-11-28',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '17',
    title: 'Silicon Valley Executives Flock to Psychedelic Retreats',
    summary: 'Tech industry leaders increasingly seek out psychedelic experiences for creativity and leadership development, normalizing the practice in business circles.',
    source: 'Wired',
    sourceUrl: 'https://wired.com',
    category: 'market',
    date: '2025-11-26',
    relevance: 'medium',
    sentiment: 'positive',
  },
  {
    id: '18',
    title: 'Research: Integration Therapy Key to Lasting Benefits',
    summary: 'New study emphasizes that post-ceremony integration is crucial for maintaining the therapeutic benefits of ayahuasca experiences.',
    source: 'Journal of Psychopharmacology',
    sourceUrl: 'https://journals.sagepub.com',
    category: 'ayahuasca',
    date: '2025-11-24',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '19',
    title: 'Insurance Companies Begin Covering Psychedelic Therapy',
    summary: 'Select health insurance providers in the US and Europe start offering coverage for psychedelic-assisted therapy, signaling mainstream acceptance.',
    source: 'Bloomberg',
    sourceUrl: 'https://bloomberg.com',
    category: 'market',
    date: '2025-11-22',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '20',
    title: 'Valencia Region Sees 300% Increase in Wellness Tourism',
    summary: 'Spain\'s Valencia region reports significant growth in wellness tourism, with visitors seeking yoga, meditation, and transformative retreat experiences.',
    source: 'El Mundo',
    sourceUrl: 'https://elmundo.es',
    category: 'market',
    date: '2025-11-20',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '21',
    title: 'FDA Grants Breakthrough Therapy Status to Ayahuasca Compound',
    summary: 'The US FDA designates an ayahuasca-derived compound as a breakthrough therapy for major depressive disorder, accelerating its path to approval.',
    source: 'STAT News',
    sourceUrl: 'https://statnews.com',
    category: 'legislation',
    date: '2025-11-18',
    relevance: 'high',
    sentiment: 'positive',
  },
  {
    id: '22',
    title: 'Iboga Retreats Gain Popularity as Ayahuasca Alternative',
    summary: 'African plant medicine iboga emerges as an alternative to ayahuasca, with new retreat centers opening in Gabon and legal jurisdictions.',
    source: 'Vice',
    sourceUrl: 'https://vice.com',
    category: 'wellness',
    date: '2025-11-16',
    relevance: 'low',
    sentiment: 'neutral',
  },
  {
    id: '23',
    title: 'Climate Change Threatens Amazon Ayahuasca Vine Supply',
    summary: 'Environmental researchers warn that climate change and deforestation are impacting the availability of wild ayahuasca vines in the Amazon.',
    source: 'Environmental Health News',
    sourceUrl: 'https://ehn.org',
    category: 'ayahuasca',
    date: '2025-11-14',
    relevance: 'medium',
    sentiment: 'negative',
  },
  {
    id: '24',
    title: 'Celebrities Share Ayahuasca Experiences on Podcast',
    summary: 'High-profile figures continue to discuss their transformative ayahuasca journeys on popular podcasts, bringing mainstream attention to the practice.',
    source: 'Rolling Stone',
    sourceUrl: 'https://rollingstone.com',
    category: 'wellness',
    date: '2025-11-12',
    relevance: 'low',
    sentiment: 'positive',
  },
  {
    id: '25',
    title: 'Netherlands Considers Expanding Psilocybin Truffle Framework',
    summary: 'Dutch legislators discuss expanding the legal framework for psilocybin truffles to include supervised therapeutic settings.',
    source: 'Dutch News',
    sourceUrl: 'https://dutchnews.nl',
    category: 'legislation',
    date: '2025-11-10',
    relevance: 'medium',
    sentiment: 'positive',
  },
]

export function NewsFeedPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [savedArticles, setSavedArticles] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [relevanceFilter, setRelevanceFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredNews = newsItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesRelevance = relevanceFilter === 'all' || item.relevance === relevanceFilter
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesRelevance && matchesSearch
  })

  const toggleSave = (id: string) => {
    setSavedArticles(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.icon : Newspaper
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ayahuasca': return 'text-purple-500 bg-purple-500/10 border-purple-500/30'
      case 'wellness': return 'text-rose-500 bg-rose-500/10 border-rose-500/30'
      case 'legislation': return 'text-blue-500 bg-blue-500/10 border-blue-500/30'
      case 'market': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getSentimentIndicator = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-500'
      case 'negative': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getRelevanceBadge = (relevance: string) => {
    switch (relevance) {
      case 'high': return 'bg-amber-500/10 text-amber-500 border-amber-500/30'
      case 'medium': return 'bg-blue-500/10 text-blue-500 border-blue-500/30'
      case 'low': return 'bg-gray-500/10 text-gray-500 border-gray-500/30'
      default: return ''
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-chakana-sage" />
            Sector News
          </h1>
          <p className="text-muted-foreground mt-2">
            Curated news from the wellness & psychedelic retreat industry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-chakana-sage/10 text-chakana-sage hover:bg-chakana-sage/20 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:bg-accent transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search news..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border focus:border-chakana-sage focus:ring-1 focus:ring-chakana-sage outline-none transition-all"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-chakana-sage text-white'
                  : 'bg-card border border-border hover:bg-accent text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
              {cat.id !== 'all' && (
                <span className={`px-1.5 py-0.5 rounded-md text-xs ${isActive ? 'bg-white/20' : 'bg-muted'}`}>
                  {newsItems.filter(n => n.category === cat.id).length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-sm text-muted-foreground mb-2 block">Relevance:</span>
              <div className="flex gap-2">
                {['all', 'high', 'medium', 'low'].map(rel => (
                  <button
                    key={rel}
                    onClick={() => setRelevanceFilter(rel)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      relevanceFilter === rel
                        ? 'bg-chakana-sage text-white'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {rel === 'all' ? 'All' : rel.charAt(0).toUpperCase() + rel.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {savedArticles.length > 0 && (
            <div className="pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                <BookmarkCheck className="w-4 h-4 inline mr-1" />
                {savedArticles.length} saved article{savedArticles.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredNews.map(item => {
          const CategoryIcon = getCategoryIcon(item.category)
          const isSaved = savedArticles.includes(item.id)

          return (
            <article
              key={item.id}
              className="p-5 rounded-2xl bg-card border border-border hover:border-chakana-sage/30 hover:shadow-lg transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg border ${getCategoryColor(item.category)}`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getRelevanceBadge(item.relevance)}`}>
                    {item.relevance}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${getSentimentIndicator(item.sentiment)}`} />
                </div>

                <button
                  onClick={() => toggleSave(item.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved
                      ? 'text-chakana-sage bg-chakana-sage/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-chakana-sage transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {item.summary}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    {item.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(item.date)}
                  </span>
                </div>

                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-chakana-sage hover:underline"
                >
                  Read more
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No news found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {/* Industry Alerts Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Industry Alerts
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-background/50">
            <span className="p-1 rounded-full bg-amber-500/10">
              <Scale className="w-4 h-4 text-amber-500" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">EU Psychedelic Framework Under Discussion</p>
              <p className="text-xs text-muted-foreground">European Parliament committees reviewing proposals for regulated psychedelic therapy.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-background/50">
            <span className="p-1 rounded-full bg-emerald-500/10">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Q1 2026 Retreat Booking Surge Expected</p>
              <p className="text-xs text-muted-foreground">Industry analysts predict 25% increase in bookings for transformational retreats.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

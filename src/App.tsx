import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { DocumentsPage } from './pages/Documents'
import { DocumentViewerPage } from './pages/DocumentViewer'
import { ProjectsPage } from './pages/Projects'
import { ActionsPage } from './pages/Actions'
import { TeamPage } from './pages/Team'
import { TimelinePage } from './pages/Timeline'
import { FinancialPage } from './pages/Financial'
import { SettingsPage } from './pages/Settings'
import { TestimonialsPage } from './pages/Testimonials'
// Strategy Pages
import { BusinessPlanPage } from './pages/strategy/BusinessPlan'
import { SwotAnalysisPage } from './pages/strategy/SwotAnalysis'
// Intelligence Pages
import { MarketIntelligencePage } from './pages/intelligence/Market'
import { NewsFeedPage } from './pages/intelligence/News'
// Wisdom Engine
import { WelcomeModal } from './features/wisdom-engine/components/WelcomeModal'
import { MicroPause } from './features/wisdom-engine/components/MicroPause'
import { SavedReflections } from './features/wisdom-engine/components/SavedReflections'

function App() {
  return (
    <HashRouter>
      {/* Global Wisdom Engine Components */}
      <WelcomeModal />
      <MicroPause />

      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="documents/:slug" element={<DocumentViewerPage />} />
          {/* Strategy Routes */}
          <Route path="strategy/business-plan" element={<BusinessPlanPage />} />
          <Route path="strategy/swot" element={<SwotAnalysisPage />} />
          {/* Intelligence Routes */}
          <Route path="intelligence/market" element={<MarketIntelligencePage />} />
          <Route path="intelligence/news" element={<NewsFeedPage />} />
          {/* Wisdom Engine Routes */}
          <Route path="wisdom/saved" element={<SavedReflections />} />
          {/* Operations Routes */}
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="actions" element={<ActionsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="financial" element={<FinancialPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App

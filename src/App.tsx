import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { DocumentsPage } from './pages/Documents'
import { ProjectsPage } from './pages/Projects'
import { ActionsPage } from './pages/Actions'
import { TeamPage } from './pages/Team'
import { TimelinePage } from './pages/Timeline'
import { FinancialPage } from './pages/Financial'
import { SettingsPage } from './pages/Settings'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="documents" element={<DocumentsPage />} />
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

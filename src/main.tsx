import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/i18n' // Initialize i18n
import App from './App.tsx'

// Mock user for demo (remove when Supabase is configured)
import { useAuthStore } from './stores/authStore'
useAuthStore.getState().setUser({
  id: 'demo-user',
  email: 'danillo@costalaw.com.br',
  name: 'Dr. Danillo Costa',
  role: 'admin'
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

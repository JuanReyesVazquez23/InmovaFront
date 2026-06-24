import { useState, useEffect } from 'react'
import LandingPage  from './pages/LandingPage.jsx'
import AdminPanel   from './pages/AdminPanel.jsx'
import AdminLogin   from './pages/AdminLogin.jsx'

/*
 * CRITICAL: VITE_API_URL must be set in Railway frontend env variables.
 * Without it, all API calls go to the frontend server (returns HTML, not JSON).
 *
 * Railway setup:
 *   Service: frontend
 *   Variables: VITE_API_URL = https://your-backend.up.railway.app
 *
 * The || '' fallback only works in LOCAL dev (Vite proxy handles /api).
 * In production, VITE_API_URL must be explicitly set.
 */
const API = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

// Warn in dev if API URL is missing in production context
if (!API && typeof window !== 'undefined') {
  const isLocalhost = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1'
  if (!isLocalhost) {
    console.warn(
      '[Inmova] VITE_API_URL is not set. ' +
      'Set it in Railway frontend environment variables. ' +
      'API calls will fail in production.'
    )
  }
}

export default function App() {
  const [view, setView]           = useState('landing')
  const [adminAuth, setAdminAuth] = useState(false)

  // Check if admin session is still alive on page load
  useEffect(() => {
    fetch(`${API}/api/admin/check`, { credentials: 'include' })
      .then(r => {
        if (!r.ok) return null
        return r.json()
      })
      .then(d => {
        if (d?.authenticated) {
          setAdminAuth(true)
          setView('admin')
        }
      })
      .catch(() => {})
  }, [])

  const handleLoginSuccess = () => {
    setAdminAuth(true)
    setView('admin')
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (_) { /* ignore */ }
    setAdminAuth(false)
    setView('landing')
  }

  if (view === 'admin' && adminAuth) {
    return <AdminPanel onLogout={handleLogout} apiBase={API} />
  }

  if (view === 'login') {
    return (
      <AdminLogin
        onSuccess={handleLoginSuccess}
        onCancel={() => setView('landing')}
        apiBase={API}
      />
    )
  }

  return <LandingPage onSecretFooterTap={() => setView('login')} />
}

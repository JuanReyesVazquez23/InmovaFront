import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import AdminLogin from './pages/AdminLogin.jsx'

/* Backend URL from env — set VITE_API_URL in Railway frontend variables */
const API = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [view, setView]       = useState('landing')
  const [adminAuth, setAdminAuth] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/admin/check`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.authenticated) { setAdminAuth(true); setView('admin') } })
      .catch(() => {})
  }, [])

  const handleLoginSuccess = () => {
    setAdminAuth(true)
    setView('admin')
  }

  const handleLogout = async () => {
    await fetch(`${API}/api/admin/logout`, { method: 'POST', credentials: 'include' })
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

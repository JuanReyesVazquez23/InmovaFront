import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import AdminLogin from './pages/AdminLogin.jsx'

/**
 * App – Root router.
 * Admin panel is reached ONLY by tapping the footer 5× then logging in.
 * The /admin route is not exposed in navigation or any link.
 */
export default function App() {
  const [view, setView] = useState('landing') // 'landing' | 'login' | 'admin'
  const [adminAuth, setAdminAuth] = useState(false)

  // Check if already authenticated (session cookie)
  useEffect(() => {
    fetch('/api/admin/check', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.authenticated) setAdminAuth(true) })
      .catch(() => {})
  }, [])

  const handleFooterSecret = () => {
    setView('login')
  }

  const handleLoginSuccess = () => {
    setAdminAuth(true)
    setView('admin')
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    setAdminAuth(false)
    setView('landing')
  }

  if (view === 'admin' && adminAuth) {
    return <AdminPanel onLogout={handleLogout} />
  }

  if (view === 'login') {
    return (
      <AdminLogin
        onSuccess={handleLoginSuccess}
        onCancel={() => setView('landing')}
      />
    )
  }

  return <LandingPage onSecretFooterTap={handleFooterSecret} />
}

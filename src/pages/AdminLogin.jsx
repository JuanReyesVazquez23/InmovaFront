import { useState } from 'react'
import './AdminLogin.css'

export default function AdminLogin({ onSuccess, onCancel, apiBase = '' }) {
  const [form, setForm]         = useState({ username: '', password: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  // Persist attempt count in sessionStorage so page reload doesn't reset it
  const [attempts, setAttempts] = useState(() => {
    try { return parseInt(sessionStorage.getItem('_ia') || '0', 10) } catch { return 0 }
  })

  const bumpAttempts = (n) => {
    setAttempts(n)
    try { sessionStorage.setItem('_ia', String(n)) } catch {}
  }

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      setError('Completa todos los campos.')
      return
    }
    if (attempts >= 5) {
      setError('Demasiados intentos. Espera unos minutos.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${apiBase}/api/admin/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        onSuccess()
      } else {
        bumpAttempts(attempts + 1)
        setError(data.error || 'Credenciales incorrectas.')
        setForm(f => ({ ...f, password: '' }))
      }
    } catch {
      setError('Error de conexión. Verifica que el backend esté activo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login" role="main">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <div className="admin-login__logo">
            <span className="logo-mark">INMOVA</span>
            <span className="logo-sub">Panel de Administración</span>
          </div>
          <div className="admin-login__lock" aria-hidden="true">🔒</div>
        </div>

        <h1 className="admin-login__title">Acceso restringido</h1>
        <p className="admin-login__subtitle">
          Esta área es exclusiva para administradores autorizados.
        </p>

        {attempts >= 3 && attempts < 5 && (
          <div className="admin-login__warning" role="alert">
            ⚠️ {5 - attempts} intento(s) restante(s) antes del bloqueo temporal.
          </div>
        )}

        {error && (
          <div className="admin-login__error" role="alert">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="Formulario de acceso">
          <div className="admin-login__group">
            <label htmlFor="al-username" className="admin-login__label">Usuario</label>
            <input
              id="al-username"
              name="username"
              type="text"
              className="admin-login__input"
              placeholder="Nombre de usuario"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
              required
              disabled={attempts >= 5}
            />
          </div>

          <div className="admin-login__group">
            <label htmlFor="al-password" className="admin-login__label">Contraseña</label>
            <input
              id="al-password"
              name="password"
              type="password"
              className="admin-login__input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              disabled={attempts >= 5}
            />
          </div>

          <button
            type="submit"
            className="admin-login__btn"
            disabled={loading || attempts >= 5}
            aria-busy={loading}
          >
            {loading
              ? <><span className="spinner" aria-hidden="true" /> Verificando…</>
              : 'Ingresar'}
          </button>
        </form>

        <button className="admin-login__cancel" onClick={onCancel}>
          ← Volver al sitio
        </button>
      </div>
    </div>
  )
}

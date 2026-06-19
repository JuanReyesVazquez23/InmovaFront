import { useState, useEffect } from 'react'
import './ContactForm.css'

export default function ContactForm() {
  const [form, setForm]       = useState({ name: '', phone: '', email: '', message: '' })
  const [errors, setErrors]   = useState({})
  const [status, setStatus]   = useState(null) // null | 'sending' | 'success' | 'error'
  const [csrfToken, setCsrf]  = useState('')

  // Fetch CSRF token on mount
  useEffect(() => {
    fetch('/api/csrf-token', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setCsrf(d.csrf_token))
      .catch(() => {})
  }, [])

  // ─── Frontend Validation ──────────────────────────────────────────────────
  function validate() {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'Ingresa tu nombre completo.'
    if (!form.phone.trim() || !/^\+?[\d\s\-()]{7,20}$/.test(form.phone))
      e.phone = 'Teléfono inválido (mín. 7 dígitos).'
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = 'Correo electrónico inválido.'
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = 'Escribe un mensaje de al menos 10 caracteres.'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, csrf_token: csrfToken }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', phone: '', email: '', message: '' })
        // Re-fetch CSRF for next submission
        fetch('/api/csrf-token', { credentials: 'include' })
          .then(r => r.json()).then(d => setCsrf(d.csrf_token)).catch(() => {})
      } else {
        setStatus('error')
        setErrors({ server: data.error || 'Error al enviar. Intenta de nuevo.' })
      }
    } catch {
      setStatus('error')
      setErrors({ server: 'Error de conexión. Verifica tu internet.' })
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-success" role="alert">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h3>¡Mensaje enviado!</h3>
        <p>Nos comunicaremos contigo muy pronto. También puedes escribirnos directamente por WhatsApp.</p>
        <div className="success-actions">
          <button className="btn btn-primary" onClick={() => setStatus(null)}>
            Enviar otro mensaje
          </button>
          <a
            href="https://wa.me/18090000000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            Ir a WhatsApp
          </a>
        </div>
      </div>
    )
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulario de contacto"
    >
      {errors.server && (
        <div className="form-error-banner" role="alert">{errors.server}</div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="contact-name">
            Nombre <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            className={`form-input${errors.name ? ' invalid' : ''}`}
            placeholder="Tu nombre completo"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
            aria-required="true"
            aria-describedby={errors.name ? 'err-name' : undefined}
            aria-invalid={!!errors.name}
          />
          {errors.name && <span id="err-name" className="form-field-error" role="alert">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contact-phone">
            Teléfono <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            className={`form-input${errors.phone ? ' invalid' : ''}`}
            placeholder="809-000-0000"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            required
            aria-required="true"
            aria-describedby={errors.phone ? 'err-phone' : undefined}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <span id="err-phone" className="form-field-error" role="alert">{errors.phone}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-email">Correo electrónico</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          className={`form-input${errors.email ? ' invalid' : ''}`}
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          aria-describedby={errors.email ? 'err-email' : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span id="err-email" className="form-field-error" role="alert">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-message">
          Mensaje <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          className={`form-input form-textarea${errors.message ? ' invalid' : ''}`}
          placeholder="¿En qué podemos ayudarte? Cuéntanos qué tipo de propiedad buscas…"
          rows={4}
          value={form.message}
          onChange={handleChange}
          required
          aria-required="true"
          aria-describedby={errors.message ? 'err-message' : undefined}
          aria-invalid={!!errors.message}
        />
        {errors.message && <span id="err-message" className="form-field-error" role="alert">{errors.message}</span>}
      </div>

      <button
        type="submit"
        className="btn btn-primary contact-submit"
        disabled={status === 'sending'}
        aria-busy={status === 'sending'}
      >
        {status === 'sending' ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Enviando…
          </>
        ) : 'Enviar mensaje'}
      </button>

      <p className="form-privacy">
        Tus datos son confidenciales y solo serán usados para atender tu solicitud.
      </p>
    </form>
  )
}

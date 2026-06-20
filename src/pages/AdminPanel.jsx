import { useState, useEffect, useCallback } from 'react'
import './AdminPanel.css'

/* ─── Modal ───────────────────────────────────────────────────────────────── */
function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

/* ─── Property Form ───────────────────────────────────────────────────────── */
function PropertyForm({ initial, onSave, onCancel, loading }) {
  const empty = {
    title: '', description: '', price: '', currency: 'USD',
    location: '', bedrooms: '', bathrooms: '', area_sqm: '',
    type: 'apartamento', status: 'venta', featured: false,
    image_url: '', whatsapp: '', active: true,
  }
  const [form, setForm]   = useState(initial || empty)
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.title.trim())    e.title    = 'Requerido'
    if (!form.location.trim()) e.location = 'Requerido'
    if (!form.price)           e.price    = 'Ingresa un precio'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  const F = ({ id, label, children, err }) => (
    <div className="admin-form-group">
      <label className="admin-form-label" htmlFor={id}>{label}</label>
      {children}
      {err && <span className="admin-form-err">{err}</span>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="admin-form" noValidate>
      <div className="admin-form-grid2">
        <F id="pf-title" label="Título *" err={errors.title}>
          <input id="pf-title" className={`admin-input${errors.title ? ' err' : ''}`}
            value={form.title} onChange={e => set('title', e.target.value)} />
        </F>
        <F id="pf-location" label="Ubicación *" err={errors.location}>
          <input id="pf-location" className={`admin-input${errors.location ? ' err' : ''}`}
            value={form.location} onChange={e => set('location', e.target.value)}
            placeholder="Piantini, Santo Domingo" />
        </F>
      </div>

      <F id="pf-desc" label="Descripción">
        <textarea id="pf-desc" className="admin-input admin-textarea"
          value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
      </F>

      <div className="admin-form-grid3">
        <F id="pf-price" label="Precio *" err={errors.price}>
          <input id="pf-price" type="number" className={`admin-input${errors.price ? ' err' : ''}`}
            value={form.price} onChange={e => set('price', e.target.value)} min="0" />
        </F>
        <F id="pf-currency" label="Moneda">
          <select id="pf-currency" className="admin-input admin-select"
            value={form.currency} onChange={e => set('currency', e.target.value)}>
            <option value="USD">USD</option>
            <option value="DOP">DOP</option>
          </select>
        </F>
        <F id="pf-status" label="Estado">
          <select id="pf-status" className="admin-input admin-select"
            value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="venta">En Venta</option>
            <option value="alquiler">En Alquiler</option>
          </select>
        </F>
      </div>

      <div className="admin-form-grid3">
        <F id="pf-type" label="Tipo">
          <select id="pf-type" className="admin-input admin-select"
            value={form.type} onChange={e => set('type', e.target.value)}>
            {['apartamento','casa','villa','local','terreno','oficina'].map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
            ))}
          </select>
        </F>
        <F id="pf-bed" label="Habitaciones">
          <input id="pf-bed" type="number" className="admin-input"
            value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} min="0" />
        </F>
        <F id="pf-bath" label="Baños">
          <input id="pf-bath" type="number" className="admin-input"
            value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} min="0" />
        </F>
      </div>

      <div className="admin-form-grid2">
        <F id="pf-area" label="Área (m²)">
          <input id="pf-area" type="number" className="admin-input"
            value={form.area_sqm} onChange={e => set('area_sqm', e.target.value)} min="0" />
        </F>
        <F id="pf-wa" label="WhatsApp (solo números)">
          <input id="pf-wa" className="admin-input" placeholder="18091234567"
            value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
        </F>
      </div>

      <F id="pf-img" label="URL de imagen principal">
        <input id="pf-img" type="url" className="admin-input"
          placeholder="https://…" value={form.image_url}
          onChange={e => set('image_url', e.target.value)} />
      </F>
      {form.image_url && (
        <img src={form.image_url} alt="Vista previa"
          className="admin-img-preview" loading="lazy" />
      )}

      <div className="admin-form-checks">
        <label className="admin-check-label">
          <input type="checkbox" checked={form.featured}
            onChange={e => set('featured', e.target.checked)} />
          Propiedad destacada
        </label>
        <label className="admin-check-label">
          <input type="checkbox" checked={form.active}
            onChange={e => set('active', e.target.checked)} />
          Visible en el sitio
        </label>
      </div>

      <div className="admin-form-actions">
        <button type="button" className="btn btn-outline-dark" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><span className="spinner" /> Guardando…</> : 'Guardar propiedad'}
        </button>
      </div>
    </form>
  )
}

/* ─── Agent Form ──────────────────────────────────────────────────────────── */
function AgentForm({ initial, onSave, onCancel, loading }) {
  const empty = { name: '', role: '', bio: '', phone: '', email: '', whatsapp: '', image_url: '', active: true }
  const [form, setForm]   = useState(initial || empty)
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Requerido'
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  const F = ({ id, label, children, err }) => (
    <div className="admin-form-group">
      <label className="admin-form-label" htmlFor={id}>{label}</label>
      {children}
      {err && <span className="admin-form-err">{err}</span>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="admin-form" noValidate>
      <div className="admin-form-grid2">
        <F id="af-name" label="Nombre completo *" err={errors.name}>
          <input id="af-name" className={`admin-input${errors.name ? ' err' : ''}`}
            value={form.name} onChange={e => set('name', e.target.value)} />
        </F>
        <F id="af-role" label="Cargo">
          <input id="af-role" className="admin-input" placeholder="Asesor Senior"
            value={form.role} onChange={e => set('role', e.target.value)} />
        </F>
      </div>
      <F id="af-bio" label="Biografía breve">
        <textarea id="af-bio" className="admin-input admin-textarea"
          value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} />
      </F>
      <div className="admin-form-grid2">
        <F id="af-phone" label="Teléfono">
          <input id="af-phone" className="admin-input"
            value={form.phone} onChange={e => set('phone', e.target.value)} />
        </F>
        <F id="af-wa" label="WhatsApp">
          <input id="af-wa" className="admin-input" placeholder="18091234567"
            value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
        </F>
      </div>
      <F id="af-email" label="Correo electrónico">
        <input id="af-email" type="email" className="admin-input"
          value={form.email} onChange={e => set('email', e.target.value)} />
      </F>
      <F id="af-img" label="URL de foto">
        <input id="af-img" type="url" className="admin-input" placeholder="https://…"
          value={form.image_url} onChange={e => set('image_url', e.target.value)} />
      </F>
      {form.image_url && (
        <img src={form.image_url} alt="Vista previa"
          className="admin-img-preview admin-img-round" loading="lazy" />
      )}
      <label className="admin-check-label">
        <input type="checkbox" checked={form.active}
          onChange={e => set('active', e.target.checked)} />
        Asesor activo (visible en el sitio)
      </label>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-outline-dark" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><span className="spinner" /> Guardando…</> : 'Guardar asesor'}
        </button>
      </div>
    </form>
  )
}

/* ─── Main Panel ──────────────────────────────────────────────────────────── */
export default function AdminPanel({ onLogout, apiBase = '' }) {
  const [tab, setTab]               = useState('properties')
  const [properties, setProperties] = useState([])
  const [agents, setAgents]         = useState([])
  const [leads, setLeads]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [modal, setModal]           = useState(null)
  const [confirm, setConfirm]       = useState(null)
  const [toast, setToast]           = useState(null)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, aRes, lRes] = await Promise.all([
        fetch(`${apiBase}/api/admin/properties`, { credentials: 'include' }),
        fetch(`${apiBase}/api/admin/agents`,     { credentials: 'include' }),
        fetch(`${apiBase}/api/admin/leads`,      { credentials: 'include' }),
      ])
      if (pRes.status === 401) { onLogout(); return }
      setProperties(await pRes.json())
      setAgents(await aRes.json())
      setLeads(await lRes.json())
    } catch {
      showToast('Error al cargar datos.', false)
    } finally {
      setLoading(false)
    }
  }, [apiBase, onLogout])

  useEffect(() => { loadAll() }, [loadAll])

  /* ── Properties CRUD ────────────────────────────────────────────────────── */
  const saveProperty = async (form) => {
    setSaving(true)
    try {
      const isEdit = modal?.data?.id
      const url    = isEdit ? `${apiBase}/api/admin/properties/${modal.data.id}` : `${apiBase}/api/admin/properties`
      const res    = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      showToast(isEdit ? 'Propiedad actualizada.' : 'Propiedad creada.')
      setModal(null)
      loadAll()
    } catch (e) {
      showToast(e.message || 'Error al guardar.', false)
    } finally {
      setSaving(false)
    }
  }

  const deleteProperty = (id) => {
    setConfirm({
      msg: '¿Eliminar esta propiedad? Se ocultará del sitio.',
      onOk: async () => {
        await fetch(`${apiBase}/api/admin/properties/${id}`, { method: 'DELETE', credentials: 'include' })
        showToast('Propiedad eliminada.')
        loadAll()
      },
    })
  }

  /* ── Agents CRUD ────────────────────────────────────────────────────────── */
  const saveAgent = async (form) => {
    setSaving(true)
    try {
      const isEdit = modal?.data?.id
      const url    = isEdit ? `${apiBase}/api/admin/agents/${modal.data.id}` : `${apiBase}/api/admin/agents`
      const res    = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      showToast(isEdit ? 'Asesor actualizado.' : 'Asesor creado.')
      setModal(null)
      loadAll()
    } catch (e) {
      showToast(e.message || 'Error al guardar.', false)
    } finally {
      setSaving(false)
    }
  }

  const deleteAgent = (id) => {
    setConfirm({
      msg: '¿Desactivar este asesor?',
      onOk: async () => {
        await fetch(`${apiBase}/api/admin/agents/${id}`, { method: 'DELETE', credentials: 'include' })
        showToast('Asesor desactivado.')
        loadAll()
      },
    })
  }

  /* ── Leads ──────────────────────────────────────────────────────────────── */
  const markRead = async (id) => {
    await fetch(`${apiBase}/api/admin/leads/${id}/read`, { method: 'PUT', credentials: 'include' })
    setLeads(ls => ls.map(l => l.id === id ? { ...l, read: true } : l))
  }

  const unreadCount = leads.filter(l => !l.read).length

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="logo-mark">INMOVA</span>
          <span className="logo-sub" style={{ color: 'var(--c-cyan)' }}>Admin</span>
        </div>

        <nav className="admin-nav" aria-label="Panel de administración">
          {[
            { key: 'properties', icon: '🏠', label: 'Propiedades' },
            { key: 'agents',     icon: '👤', label: 'Asesores' },
            { key: 'leads',      icon: '✉️', label: 'Mensajes', badge: unreadCount },
          ].map(item => (
            <button
              key={item.key}
              className={`admin-nav__item${tab === item.key ? ' active' : ''}`}
              onClick={() => setTab(item.key)}
              aria-current={tab === item.key ? 'page' : undefined}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
              {item.badge > 0 && (
                <span className="admin-nav__badge" aria-label={`${item.badge} sin leer`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button className="admin-sidebar__logout" onClick={onLogout}>
          🚪 Cerrar sesión
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">

        {/* ── Properties ───────────────────────────────────────────────── */}
        {tab === 'properties' && (
          <section>
            <div className="admin-section-header">
              <div>
                <h1 className="admin-section-title">Propiedades</h1>
                <p className="admin-section-sub">{properties.length} en total</p>
              </div>
              <button className="btn btn-primary" onClick={() => setModal({ type: 'new-property' })}>
                + Nueva propiedad
              </button>
            </div>

            {loading ? <div className="admin-loading">Cargando…</div> : (
              <div className="admin-table-wrap">
                <table className="admin-table" aria-label="Lista de propiedades">
                  <thead>
                    <tr>
                      <th>Imagen</th><th>Título</th><th>Precio</th>
                      <th>Estado</th><th>Tipo</th><th>Visible</th><th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(p => (
                      <tr key={p.id} className={p.active ? '' : 'admin-table__row--inactive'}>
                        <td>
                          <img
                            src={p.image_url || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=80'}
                            alt={p.title} className="admin-table__thumb" loading="lazy"
                          />
                        </td>
                        <td>
                          <strong className="admin-table__name">{p.title}</strong><br />
                          <span className="admin-table__sub">{p.location}</span>
                        </td>
                        <td>
                          {p.price
                            ? new Intl.NumberFormat('es-DO',{style:'currency',currency:p.currency||'USD',minimumFractionDigits:0}).format(p.price)
                            : '—'}
                        </td>
                        <td>
                          <span className={`admin-badge admin-badge--${p.status}`}>
                            {p.status === 'venta' ? 'Venta' : 'Alquiler'}
                          </span>
                        </td>
                        <td className="admin-table__capitalize">{p.type}</td>
                        <td>
                          <span className={`admin-badge ${p.active ? 'admin-badge--active' : 'admin-badge--inactive'}`}>
                            {p.active ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table__actions">
                            <button className="admin-btn-icon" title="Editar"
                              onClick={() => setModal({ type: 'edit-property', data: p })}>✏️</button>
                            <button className="admin-btn-icon admin-btn-icon--del" title="Eliminar"
                              onClick={() => deleteProperty(p.id)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {properties.length === 0 && <p className="admin-empty">No hay propiedades aún.</p>}
              </div>
            )}
          </section>
        )}

        {/* ── Agents ───────────────────────────────────────────────────── */}
        {tab === 'agents' && (
          <section>
            <div className="admin-section-header">
              <div>
                <h1 className="admin-section-title">Asesores</h1>
                <p className="admin-section-sub">{agents.length} registrados</p>
              </div>
              <button className="btn btn-primary" onClick={() => setModal({ type: 'new-agent' })}>
                + Nuevo asesor
              </button>
            </div>

            <div className="admin-agents-cards">
              {agents.map(a => (
                <div key={a.id} className={`admin-agent-card${a.active ? '' : ' inactive'}`}>
                  <img
                    src={a.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=1A6FCC&color=fff&size=80`}
                    alt={a.name} className="admin-agent-avatar" loading="lazy"
                  />
                  <div className="admin-agent-info">
                    <strong>{a.name}</strong>
                    <span>{a.role}</span>
                    <span className="admin-agent-contact">{a.phone || a.email}</span>
                  </div>
                  <div className="admin-agent-actions">
                    <button className="admin-btn-icon"
                      onClick={() => setModal({ type: 'edit-agent', data: a })}>✏️</button>
                    <button className="admin-btn-icon admin-btn-icon--del"
                      onClick={() => deleteAgent(a.id)}>🗑️</button>
                  </div>
                </div>
              ))}
              {agents.length === 0 && <p className="admin-empty">No hay asesores aún.</p>}
            </div>
          </section>
        )}

        {/* ── Leads ────────────────────────────────────────────────────── */}
        {tab === 'leads' && (
          <section>
            <div className="admin-section-header">
              <div>
                <h1 className="admin-section-title">Mensajes</h1>
                <p className="admin-section-sub">
                  {unreadCount > 0
                    ? `${unreadCount} sin leer de ${leads.length} total`
                    : `${leads.length} mensajes`}
                </p>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table" aria-label="Lista de mensajes">
                <thead>
                  <tr>
                    <th>Nombre</th><th>Teléfono</th><th>Correo</th>
                    <th>Mensaje</th><th>Fecha</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(l => (
                    <tr key={l.id} className={l.read ? '' : 'admin-table__row--unread'}>
                      <td><strong>{l.name}</strong></td>
                      <td><a href={`tel:${l.phone}`} className="admin-link">{l.phone}</a></td>
                      <td>
                        {l.email
                          ? <a href={`mailto:${l.email}`} className="admin-link">{l.email}</a>
                          : '—'}
                      </td>
                      <td className="admin-table__message">{l.message}</td>
                      <td className="admin-table__date">
                        {new Date(l.created_at).toLocaleDateString('es-DO', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td>
                        {l.read
                          ? <span className="admin-badge admin-badge--active">Leído</span>
                          : <button className="admin-badge admin-badge--unread"
                              onClick={() => markRead(l.id)}>Marcar leído</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leads.length === 0 && <p className="admin-empty">No hay mensajes aún.</p>}
            </div>
          </section>
        )}
      </main>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {modal?.type === 'new-property' && (
        <Modal title="Nueva propiedad" onClose={() => setModal(null)}>
          <PropertyForm onSave={saveProperty} onCancel={() => setModal(null)} loading={saving} />
        </Modal>
      )}
      {modal?.type === 'edit-property' && (
        <Modal title="Editar propiedad" onClose={() => setModal(null)}>
          <PropertyForm initial={modal.data} onSave={saveProperty} onCancel={() => setModal(null)} loading={saving} />
        </Modal>
      )}
      {modal?.type === 'new-agent' && (
        <Modal title="Nuevo asesor" onClose={() => setModal(null)}>
          <AgentForm onSave={saveAgent} onCancel={() => setModal(null)} loading={saving} />
        </Modal>
      )}
      {modal?.type === 'edit-agent' && (
        <Modal title="Editar asesor" onClose={() => setModal(null)}>
          <AgentForm initial={modal.data} onSave={saveAgent} onCancel={() => setModal(null)} loading={saving} />
        </Modal>
      )}

      {/* ── Confirm ──────────────────────────────────────────────────────── */}
      {confirm && (
        <div className="modal-overlay" role="alertdialog" aria-modal="true">
          <div className="modal-box modal-box--sm">
            <p className="confirm-msg">{confirm.msg}</p>
            <div className="confirm-actions">
              <button className="btn btn-outline-dark" onClick={() => setConfirm(null)}>Cancelar</button>
              <button className="btn btn-danger"
                onClick={() => { confirm.onOk(); setConfirm(null) }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`admin-toast${toast.ok ? ' ok' : ' err'}`} role="status" aria-live="polite">
          {toast.ok ? '✓' : '✗'} {toast.msg}
        </div>
      )}
    </div>
  )
}

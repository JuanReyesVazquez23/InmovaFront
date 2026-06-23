import { useState, useEffect, useCallback } from 'react'
import ImagePicker from '../components/ImagePicker.jsx'
import './AdminPanel.css'

/* ─────────────────────────────────────────────────────────
   ADMIN PANEL v4
   Tabs: Propiedades | Asesores | Mensajes | Imágenes de página
   Todas las imágenes se seleccionan desde la galería del dispositivo.
───────────────────────────────────────────────────────── */

/* ── Modal ──────────────────────────────────────────────── */
function Modal({ title, onClose, children, sm }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-bg" role="dialog" aria-modal="true" aria-label={title}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`modal${sm ? ' modal--sm' : ''}`}>
        {!sm && (
          <div className="modal__head">
            <h2 className="modal__title">{title}</h2>
            <button className="modal__close" onClick={onClose} aria-label="Cerrar">&#x2715;</button>
          </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

/* ── Field wrapper ──────────────────────────────────────── */
function F({ id, label, err, children }) {
  return (
    <div className="af__group">
      <label className="af__label" htmlFor={id}>{label}</label>
      {children}
      {err && <span className="af__err" role="alert">{err}</span>}
    </div>
  )
}

/* ── Property Form ──────────────────────────────────────── */
function PropertyForm({ initial, onSave, onCancel, saving, apiBase }) {
  const blank = {
    title: '', description: '', price: '', currency: 'USD',
    location: '', bedrooms: '', bathrooms: '', area_sqm: '',
    type: 'apartamento', status: 'venta', featured: false,
    image_url: '', whatsapp: '', active: true,
  }
  const [f, setF]     = useState(initial || blank)
  const [errs, setErrs] = useState({})
  const set = (k, v)  => setF(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!f.title.trim())    e.title    = 'El título es requerido'
    if (!f.location.trim()) e.location = 'La ubicación es requerida'
    if (!f.price)           e.price    = 'El precio es requerido'
    return e
  }

  const submit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrs(e2); return }
    onSave(f)
  }

  return (
    <form onSubmit={submit} className="af" noValidate>
      <div className="af__grid2">
        <F id="p-title" label="Título *" err={errs.title}>
          <input id="p-title"
            className={`af__input${errs.title ? ' af__input--err' : ''}`}
            value={f.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Ej: Apartamento en Piantini"
          />
        </F>
        <F id="p-loc" label="Ubicación *" err={errs.location}>
          <input id="p-loc"
            className={`af__input${errs.location ? ' af__input--err' : ''}`}
            value={f.location}
            onChange={e => set('location', e.target.value)}
            placeholder="Piantini, Santo Domingo"
          />
        </F>
      </div>

      <F id="p-desc" label="Descripción">
        <textarea id="p-desc" className="af__input af__textarea"
          value={f.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
          placeholder="Describe las características principales de la propiedad"
        />
      </F>

      <div className="af__grid3">
        <F id="p-price" label="Precio *" err={errs.price}>
          <input id="p-price" type="number" min="0"
            className={`af__input${errs.price ? ' af__input--err' : ''}`}
            value={f.price}
            onChange={e => set('price', e.target.value)}
            placeholder="0"
          />
        </F>
        <F id="p-cur" label="Moneda">
          <select id="p-cur" className="af__input af__select"
            value={f.currency} onChange={e => set('currency', e.target.value)}>
            <option value="USD">USD</option>
            <option value="DOP">DOP</option>
          </select>
        </F>
        <F id="p-stat" label="Operación">
          <select id="p-stat" className="af__input af__select"
            value={f.status} onChange={e => set('status', e.target.value)}>
            <option value="venta">En Venta</option>
            <option value="alquiler">En Alquiler</option>
          </select>
        </F>
      </div>

      <div className="af__grid3">
        <F id="p-type" label="Tipo de propiedad">
          <select id="p-type" className="af__input af__select"
            value={f.type} onChange={e => set('type', e.target.value)}>
            {['apartamento', 'casa', 'villa', 'local', 'terreno', 'oficina'].map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </F>
        <F id="p-bed" label="Habitaciones">
          <input id="p-bed" type="number" min="0" className="af__input"
            value={f.bedrooms} onChange={e => set('bedrooms', e.target.value)} />
        </F>
        <F id="p-bath" label="Baños">
          <input id="p-bath" type="number" min="0" className="af__input"
            value={f.bathrooms} onChange={e => set('bathrooms', e.target.value)} />
        </F>
      </div>

      <div className="af__grid2">
        <F id="p-area" label="Área (m²)">
          <input id="p-area" type="number" min="0" className="af__input"
            value={f.area_sqm} onChange={e => set('area_sqm', e.target.value)} />
        </F>
        <F id="p-wa" label="WhatsApp (solo números)">
          <input id="p-wa" className="af__input"
            value={f.whatsapp} onChange={e => set('whatsapp', e.target.value)}
            placeholder="18091234567" />
        </F>
      </div>

      {/* Image from gallery */}
      <F id="p-img" label="Imagen principal — seleccionar desde galería">
        <ImagePicker
          value={f.image_url}
          onChange={url => set('image_url', url)}
          apiBase={apiBase}
          label="Seleccionar foto de la propiedad"
        />
      </F>

      <div className="af__checks">
        <label className="af__check">
          <input type="checkbox" checked={f.featured}
            onChange={e => set('featured', e.target.checked)} />
          Marcar como destacada
        </label>
        <label className="af__check">
          <input type="checkbox" checked={f.active}
            onChange={e => set('active', e.target.checked)} />
          Visible en el sitio
        </label>
      </div>

      <div className="af__actions">
        <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-blue" disabled={saving}>
          {saving ? <><span className="spin" /> Guardando…</> : 'Guardar propiedad'}
        </button>
      </div>
    </form>
  )
}

/* ── Agent Form ─────────────────────────────────────────── */
function AgentForm({ initial, onSave, onCancel, saving, apiBase }) {
  const blank = {
    name: '', role: '', bio: '', phone: '',
    email: '', whatsapp: '', image_url: '', active: true,
  }
  const [f, setF]     = useState(initial || blank)
  const [errs, setErrs] = useState({})
  const set = (k, v)  => setF(p => ({ ...p, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    const e2 = {}
    if (!f.name.trim()) e2.name = 'El nombre es requerido'
    if (Object.keys(e2).length) { setErrs(e2); return }
    onSave(f)
  }

  return (
    <form onSubmit={submit} className="af" noValidate>
      <div className="af__grid2">
        <F id="a-name" label="Nombre completo *" err={errs.name}>
          <input id="a-name"
            className={`af__input${errs.name ? ' af__input--err' : ''}`}
            value={f.name} onChange={e => set('name', e.target.value)} />
        </F>
        <F id="a-role" label="Cargo">
          <input id="a-role" className="af__input"
            value={f.role} onChange={e => set('role', e.target.value)}
            placeholder="Ej: Asesor Senior" />
        </F>
      </div>

      <F id="a-bio" label="Biografía breve">
        <textarea id="a-bio" className="af__input af__textarea"
          value={f.bio} onChange={e => set('bio', e.target.value)}
          rows={3} placeholder="Experiencia y especialidades del asesor" />
      </F>

      <div className="af__grid2">
        <F id="a-phone" label="Teléfono">
          <input id="a-phone" className="af__input"
            value={f.phone} onChange={e => set('phone', e.target.value)}
            placeholder="809-000-0000" />
        </F>
        <F id="a-wa" label="WhatsApp">
          <input id="a-wa" className="af__input"
            value={f.whatsapp} onChange={e => set('whatsapp', e.target.value)}
            placeholder="18091234567" />
        </F>
      </div>

      <F id="a-email" label="Correo electrónico">
        <input id="a-email" type="email" className="af__input"
          value={f.email} onChange={e => set('email', e.target.value)}
          placeholder="asesor@inmova.do" />
      </F>

      {/* Avatar from gallery */}
      <F id="a-img" label="Foto del asesor — seleccionar desde galería">
        <ImagePicker
          value={f.image_url}
          onChange={url => set('image_url', url)}
          apiBase={apiBase}
          label="Seleccionar foto del asesor"
          round
        />
      </F>

      <label className="af__check">
        <input type="checkbox" checked={f.active}
          onChange={e => set('active', e.target.checked)} />
        Asesor activo (visible en el sitio)
      </label>

      <div className="af__actions">
        <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-blue" disabled={saving}>
          {saving ? <><span className="spin" /> Guardando…</> : 'Guardar asesor'}
        </button>
      </div>
    </form>
  )
}

/* ── Site Images Form ───────────────────────────────────── */
function SiteImagesTab({ apiBase, showToast }) {
  const [images, setImages]   = useState({})
  const [saving, setSaving]   = useState(null) // key being saved
  const [loading, setLoading] = useState(true)

  const SLOTS = [
    { key: 'hero1',    label: 'Hero — Imagen 1 (fondo principal)' },
    { key: 'hero2',    label: 'Hero — Imagen 2' },
    { key: 'hero3',    label: 'Hero — Imagen 3' },
    { key: 'about',    label: 'Sección Nosotros (foto interior)' },
    { key: 'showcase', label: 'Sección Exclusividad (foto comedor)' },
  ]

  useEffect(() => {
    fetch(`${apiBase}/api/admin/site-images`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => setImages(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [apiBase])

  const handleSave = async (key, url) => {
    setSaving(key)
    try {
      const res = await fetch(`${apiBase}/api/admin/site-images/${key}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar')
      setImages(prev => ({ ...prev, [key]: data }))
      showToast('Imagen actualizada. Se verá en el sitio de inmediato.')
    } catch (e) {
      showToast(e.message, false)
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <p className="ap__loading">Cargando imágenes…</p>

  return (
    <section>
      <div className="ap__head">
        <div>
          <h1 className="ap__title">Imágenes del sitio</h1>
          <p className="ap__sub">
            Cambia las fotos que aparecen en el hero, la sección Nosotros y la sección Exclusividad.
            Cada cambio se refleja inmediatamente en la página pública.
          </p>
        </div>
      </div>

      <div className="siteimg-grid">
        {SLOTS.map(slot => {
          const current = images[slot.key]?.image_url || ''
          return (
            <div key={slot.key} className="siteimg-card">
              <p className="siteimg-label">{slot.label}</p>

              {/* Current image preview */}
              {current && (
                <div className="siteimg-preview">
                  <img
                    src={current}
                    alt={slot.label}
                    className="siteimg-img"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Picker — shows "Seleccionar" if no image, "Cambiar" overlay if has image */}
              <ImagePicker
                value={''}  /* always show the upload button, not the current preview again */
                onChange={url => url && handleSave(slot.key, url)}
                apiBase={apiBase}
                label={current ? `Cambiar imagen` : `Subir imagen`}
              />

              {saving === slot.key && (
                <p className="siteimg-saving">
                  <span className="spin" /> Guardando…
                </p>
              )}

              {current && (
                <button
                  className="siteimg-remove"
                  onClick={() => handleSave(slot.key, '')}
                  disabled={saving === slot.key}
                >
                  Restaurar imagen por defecto
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ── Main Panel ─────────────────────────────────────────── */
export default function AdminPanel({ onLogout, apiBase = '' }) {
  const [tab, setTab]     = useState('properties')
  const [props, setProps] = useState([])
  const [agents, setAgents] = useState([])
  const [leads, setLeads]   = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [modal, setModal]     = useState(null) // {type, data?}
  const [confirm, setConfirm] = useState(null) // {msg, onOk}
  const [toast, setToast]     = useState(null) // {msg, ok}

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  /* Load main data */
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [pR, aR, lR] = await Promise.all([
        fetch(`${apiBase}/api/admin/properties`, { credentials: 'include' }),
        fetch(`${apiBase}/api/admin/agents`,     { credentials: 'include' }),
        fetch(`${apiBase}/api/admin/leads`,      { credentials: 'include' }),
      ])
      if (pR.status === 401) { onLogout(); return }
      setProps(await pR.json())
      setAgents(await aR.json())
      setLeads(await lR.json())
    } catch {
      showToast('Error al cargar los datos.', false)
    } finally {
      setLoading(false)
    }
  }, [apiBase, onLogout])

  useEffect(() => { load() }, [load])

  /* Generic save helper */
  const saveEntity = async (endpoint, id, data) => {
    setSaving(true)
    try {
      const url    = id ? `${apiBase}${endpoint}/${id}` : `${apiBase}${endpoint}`
      const method = id ? 'PUT' : 'POST'
      const res    = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Error al guardar')
      showToast(id ? 'Actualizado correctamente.' : 'Creado correctamente.')
      setModal(null)
      load()
    } catch (e) {
      showToast(e.message, false)
    } finally {
      setSaving(false)
    }
  }

  const deleteEntity = async (endpoint, id) => {
    try {
      await fetch(`${apiBase}${endpoint}/${id}`, { method: 'DELETE', credentials: 'include' })
      showToast('Eliminado correctamente.')
      load()
    } catch {
      showToast('Error al eliminar.', false)
    }
  }

  const markRead = async (id) => {
    await fetch(`${apiBase}/api/admin/leads/${id}/read`, { method: 'PUT', credentials: 'include' })
    setLeads(ls => ls.map(l => l.id === id ? { ...l, read: true } : l))
  }

  const unread = leads.filter(l => !l.read).length

  const fmtPrice = (price, cur) =>
    price
      ? new Intl.NumberFormat('es-DO', {
          style: 'currency', currency: cur || 'USD', minimumFractionDigits: 0,
        }).format(price)
      : '—'

  /* ── Tabs config ────────────────────────────────────────── */
  const TABS = [
    { key: 'properties', icon: '▦',  label: 'Propiedades' },
    { key: 'agents',     icon: '◉',  label: 'Asesores' },
    { key: 'leads',      icon: '✉',  label: 'Mensajes', badge: unread },
    { key: 'images',     icon: '◻',  label: 'Imágenes' },
  ]

  return (
    <div className="ap">
      {/* Sidebar — becomes bottom tab bar on mobile */}
      <aside className="ap__sidebar">
        <div className="ap__brand">
          <span className="ap__brand-mark">INMOVA</span>
          <span className="ap__brand-sub">Admin</span>
        </div>

        <nav className="ap__nav" aria-label="Panel de administración">
          {TABS.map(item => (
            <button key={item.key}
              className={`ap__nav-btn${tab === item.key ? ' ap__nav-btn--active' : ''}`}
              onClick={() => setTab(item.key)}
              aria-current={tab === item.key ? 'page' : undefined}>
              <span className="ap__nav-icon" aria-hidden="true">{item.icon}</span>
              <span className="ap__nav-label">{item.label}</span>
              {item.badge > 0 && (
                <span className="ap__badge" aria-label={`${item.badge} sin leer`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button className="ap__logout" onClick={onLogout}>
          Cerrar sesión
        </button>
      </aside>

      {/* Main content area */}
      <main className="ap__main">

        {/* ── Properties ──────────────────────────────────── */}
        {tab === 'properties' && (
          <section aria-labelledby="props-tab-h">
            <div className="ap__head">
              <div>
                <h1 className="ap__title" id="props-tab-h">Propiedades</h1>
                <p className="ap__sub">{props.length} en total</p>
              </div>
              <button className="btn btn-blue btn-sm"
                onClick={() => setModal({ type: 'new-prop' })}>
                + Nueva propiedad
              </button>
            </div>

            {loading ? <p className="ap__loading">Cargando…</p> : (
              <div className="ap__table-wrap">
                <table className="ap__table" aria-label="Lista de propiedades">
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>Título</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Tipo</th>
                      <th>Visible</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.map(p => (
                      <tr key={p.id} className={p.active ? '' : 'ap__table-row--inactive'}>
                        <td>
                          <img
                            src={p.image_url || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=80'}
                            alt={p.title}
                            className="ap__thumb"
                            loading="lazy"
                          />
                        </td>
                        <td>
                          <p className="ap__cell-name">{p.title}</p>
                          <p className="ap__cell-sub">{p.location}</p>
                        </td>
                        <td>{fmtPrice(p.price, p.currency)}</td>
                        <td>
                          <span className={`badge badge--${p.status}`}>
                            {p.status === 'venta' ? 'Venta' : 'Alquiler'}
                          </span>
                        </td>
                        <td className="ap__cell-cap">{p.type}</td>
                        <td>
                          <span className={`badge ${p.active ? 'badge--active' : 'badge--inactive'}`}>
                            {p.active ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td>
                          <div className="ap__row-actions">
                            <button className="ap__icon-btn" title="Editar"
                              aria-label={`Editar ${p.title}`}
                              onClick={() => setModal({ type: 'edit-prop', data: p })}>
                              ✏
                            </button>
                            <button className="ap__icon-btn ap__icon-btn--del" title="Eliminar"
                              aria-label={`Eliminar ${p.title}`}
                              onClick={() => setConfirm({
                                msg: `¿Eliminar "${p.title}"? Se ocultará del sitio.`,
                                onOk: () => deleteEntity('/api/admin/properties', p.id),
                              })}>
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {props.length === 0 && (
                  <p className="ap__empty">No hay propiedades aún. Agrega la primera.</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* ── Agents ──────────────────────────────────────── */}
        {tab === 'agents' && (
          <section aria-labelledby="agents-tab-h">
            <div className="ap__head">
              <div>
                <h1 className="ap__title" id="agents-tab-h">Asesores</h1>
                <p className="ap__sub">{agents.length} registrados</p>
              </div>
              <button className="btn btn-blue btn-sm"
                onClick={() => setModal({ type: 'new-agent' })}>
                + Nuevo asesor
              </button>
            </div>

            {loading ? <p className="ap__loading">Cargando…</p> : (
              <div className="ap__agents">
                {agents.map(a => (
                  <div key={a.id} className={`ap__agent${a.active ? '' : ' inactive'}`}>
                    <img
                      src={a.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=1457B8&color=fff&size=80`}
                      alt={a.name}
                      className="ap__agent-avatar"
                      loading="lazy"
                    />
                    <div className="ap__agent-info">
                      <strong>{a.name}</strong>
                      <span>{a.role}</span>
                      <span className="ap__agent-contact">{a.phone || a.email}</span>
                    </div>
                    <div className="ap__agent-actions">
                      <button className="ap__icon-btn" title="Editar"
                        aria-label={`Editar ${a.name}`}
                        onClick={() => setModal({ type: 'edit-agent', data: a })}>
                        ✏
                      </button>
                      <button className="ap__icon-btn ap__icon-btn--del" title="Desactivar"
                        aria-label={`Desactivar ${a.name}`}
                        onClick={() => setConfirm({
                          msg: `¿Desactivar a ${a.name}? Dejará de aparecer en el sitio.`,
                          onOk: () => deleteEntity('/api/admin/agents', a.id),
                        })}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                {agents.length === 0 && (
                  <p className="ap__empty">No hay asesores aún. Agrega el primero.</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* ── Leads ───────────────────────────────────────── */}
        {tab === 'leads' && (
          <section aria-labelledby="leads-tab-h">
            <div className="ap__head">
              <div>
                <h1 className="ap__title" id="leads-tab-h">Mensajes de contacto</h1>
                <p className="ap__sub">
                  {unread > 0
                    ? `${unread} sin leer · ${leads.length} total`
                    : `${leads.length} mensajes`}
                </p>
              </div>
            </div>

            {loading ? <p className="ap__loading">Cargando…</p> : (
              <div className="ap__table-wrap">
                <table className="ap__table" aria-label="Mensajes recibidos">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Mensaje</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id}
                        className={l.read ? '' : 'ap__table-row--unread'}>
                        <td><strong>{l.name}</strong></td>
                        <td>
                          <a href={`tel:${l.phone}`} className="ap__link">{l.phone}</a>
                        </td>
                        <td>
                          {l.email
                            ? <a href={`mailto:${l.email}`} className="ap__link">{l.email}</a>
                            : '—'}
                        </td>
                        <td className="ap__cell-msg">{l.message}</td>
                        <td className="ap__cell-date">
                          {new Date(l.created_at).toLocaleDateString('es-DO', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td>
                          {l.read
                            ? <span className="badge badge--active">Leído</span>
                            : (
                              <button className="badge badge--unread"
                                onClick={() => markRead(l.id)}>
                                Marcar leído
                              </button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leads.length === 0 && (
                  <p className="ap__empty">No se han recibido mensajes aún.</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* ── Site Images ─────────────────────────────────── */}
        {tab === 'images' && (
          <SiteImagesTab apiBase={apiBase} showToast={showToast} />
        )}

      </main>

      {/* ── Property modals ─────────────────────────────────── */}
      {modal?.type === 'new-prop' && (
        <Modal title="Nueva propiedad" onClose={() => setModal(null)}>
          <PropertyForm
            onSave={d => saveEntity('/api/admin/properties', null, d)}
            onCancel={() => setModal(null)}
            saving={saving}
            apiBase={apiBase}
          />
        </Modal>
      )}
      {modal?.type === 'edit-prop' && (
        <Modal title="Editar propiedad" onClose={() => setModal(null)}>
          <PropertyForm
            initial={modal.data}
            onSave={d => saveEntity('/api/admin/properties', modal.data.id, d)}
            onCancel={() => setModal(null)}
            saving={saving}
            apiBase={apiBase}
          />
        </Modal>
      )}

      {/* ── Agent modals ──────────────────────────────────────── */}
      {modal?.type === 'new-agent' && (
        <Modal title="Nuevo asesor" onClose={() => setModal(null)}>
          <AgentForm
            onSave={d => saveEntity('/api/admin/agents', null, d)}
            onCancel={() => setModal(null)}
            saving={saving}
            apiBase={apiBase}
          />
        </Modal>
      )}
      {modal?.type === 'edit-agent' && (
        <Modal title="Editar asesor" onClose={() => setModal(null)}>
          <AgentForm
            initial={modal.data}
            onSave={d => saveEntity('/api/admin/agents', modal.data.id, d)}
            onCancel={() => setModal(null)}
            saving={saving}
            apiBase={apiBase}
          />
        </Modal>
      )}

      {/* ── Confirm dialog ────────────────────────────────────── */}
      {confirm && (
        <Modal sm onClose={() => setConfirm(null)}>
          <p className="confirm__msg">{confirm.msg}</p>
          <div className="confirm__actions">
            <button className="btn-outline" onClick={() => setConfirm(null)}>
              Cancelar
            </button>
            <button className="btn-danger"
              onClick={() => { confirm.onOk(); setConfirm(null) }}>
              Confirmar
            </button>
          </div>
        </Modal>
      )}

      {/* ── Toast notification ────────────────────────────────── */}
      {toast && (
        <div className={`toast toast--${toast.ok ? 'ok' : 'err'}`}
          role="status" aria-live="polite">
          {toast.ok ? '✓' : '✗'} {toast.msg}
        </div>
      )}
    </div>
  )
}

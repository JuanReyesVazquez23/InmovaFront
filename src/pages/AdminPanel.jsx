import { useState, useEffect, useCallback } from 'react'
import './AdminPanel.css'

/* ── Modal ──────────────────────────────────────────────── */
function Modal({ title, onClose, children, sm }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="modal-bg" role="dialog" aria-modal="true" aria-label={title}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`modal${sm ? ' modal--sm' : ''}`}>
        {!sm && (
          <div className="modal__head">
            <h2 className="modal__title">{title}</h2>
            <button className="modal__close" onClick={onClose} aria-label="Cerrar">✕</button>
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
      {err && <span className="af__err">{err}</span>}
    </div>
  )
}

/* ── Property Form ──────────────────────────────────────── */
function PropertyForm({ initial, onSave, onCancel, saving }) {
  const blank = {
    title:'', description:'', price:'', currency:'USD',
    location:'', bedrooms:'', bathrooms:'', area_sqm:'',
    type:'apartamento', status:'venta', featured:false,
    image_url:'', whatsapp:'', active:true,
  }
  const [f, setF] = useState(initial || blank)
  const [errs, setErrs] = useState({})
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const validate = () => {
    const e = {}
    if (!f.title.trim())    e.title    = 'Requerido'
    if (!f.location.trim()) e.location = 'Requerido'
    if (!f.price)           e.price    = 'Requerido'
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
          <input id="p-title" className={`af__input${errs.title?' af__input--err':''}`}
            value={f.title} onChange={e=>set('title',e.target.value)} />
        </F>
        <F id="p-loc" label="Ubicación *" err={errs.location}>
          <input id="p-loc" className={`af__input${errs.location?' af__input--err':''}`}
            value={f.location} onChange={e=>set('location',e.target.value)}
            placeholder="Piantini, Santo Domingo" />
        </F>
      </div>

      <F id="p-desc" label="Descripción">
        <textarea id="p-desc" className="af__input af__textarea"
          value={f.description} onChange={e=>set('description',e.target.value)} rows={3} />
      </F>

      <div className="af__grid3">
        <F id="p-price" label="Precio *" err={errs.price}>
          <input id="p-price" type="number" className={`af__input${errs.price?' af__input--err':''}`}
            value={f.price} onChange={e=>set('price',e.target.value)} min="0" />
        </F>
        <F id="p-cur" label="Moneda">
          <select id="p-cur" className="af__input af__select"
            value={f.currency} onChange={e=>set('currency',e.target.value)}>
            <option value="USD">USD</option>
            <option value="DOP">DOP</option>
          </select>
        </F>
        <F id="p-stat" label="Estado">
          <select id="p-stat" className="af__input af__select"
            value={f.status} onChange={e=>set('status',e.target.value)}>
            <option value="venta">En Venta</option>
            <option value="alquiler">En Alquiler</option>
          </select>
        </F>
      </div>

      <div className="af__grid3">
        <F id="p-type" label="Tipo">
          <select id="p-type" className="af__input af__select"
            value={f.type} onChange={e=>set('type',e.target.value)}>
            {['apartamento','casa','villa','local','terreno','oficina'].map(t=>(
              <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
            ))}
          </select>
        </F>
        <F id="p-bed" label="Habitaciones">
          <input id="p-bed" type="number" className="af__input"
            value={f.bedrooms} onChange={e=>set('bedrooms',e.target.value)} min="0" />
        </F>
        <F id="p-bath" label="Baños">
          <input id="p-bath" type="number" className="af__input"
            value={f.bathrooms} onChange={e=>set('bathrooms',e.target.value)} min="0" />
        </F>
      </div>

      <div className="af__grid2">
        <F id="p-area" label="Área (m²)">
          <input id="p-area" type="number" className="af__input"
            value={f.area_sqm} onChange={e=>set('area_sqm',e.target.value)} min="0" />
        </F>
        <F id="p-wa" label="WhatsApp">
          <input id="p-wa" className="af__input" placeholder="18091234567"
            value={f.whatsapp} onChange={e=>set('whatsapp',e.target.value)} />
        </F>
      </div>

      <F id="p-img" label="URL de imagen">
        <input id="p-img" type="url" className="af__input" placeholder="https://…"
          value={f.image_url} onChange={e=>set('image_url',e.target.value)} />
      </F>
      {f.image_url && (
        <img src={f.image_url} alt="Vista previa" className="af__preview" loading="lazy" />
      )}

      <div className="af__checks">
        <label className="af__check">
          <input type="checkbox" checked={f.featured}
            onChange={e=>set('featured',e.target.checked)} />
          Destacada
        </label>
        <label className="af__check">
          <input type="checkbox" checked={f.active}
            onChange={e=>set('active',e.target.checked)} />
          Visible en el sitio
        </label>
      </div>

      <div className="af__actions">
        <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-blue" disabled={saving}>
          {saving ? <><span className="spin"/>Guardando…</> : 'Guardar propiedad'}
        </button>
      </div>
    </form>
  )
}

/* ── Agent Form ─────────────────────────────────────────── */
function AgentForm({ initial, onSave, onCancel, saving }) {
  const blank = { name:'', role:'', bio:'', phone:'', email:'', whatsapp:'', image_url:'', active:true }
  const [f, setF] = useState(initial || blank)
  const [errs, setErrs] = useState({})
  const set = (k,v) => setF(p=>({...p,[k]:v}))

  const submit = (e) => {
    e.preventDefault()
    const e2 = {}
    if (!f.name.trim()) e2.name = 'Requerido'
    if (Object.keys(e2).length) { setErrs(e2); return }
    onSave(f)
  }

  return (
    <form onSubmit={submit} className="af" noValidate>
      <div className="af__grid2">
        <F id="a-name" label="Nombre *" err={errs.name}>
          <input id="a-name" className={`af__input${errs.name?' af__input--err':''}`}
            value={f.name} onChange={e=>set('name',e.target.value)} />
        </F>
        <F id="a-role" label="Cargo">
          <input id="a-role" className="af__input" placeholder="Asesor Senior"
            value={f.role} onChange={e=>set('role',e.target.value)} />
        </F>
      </div>
      <F id="a-bio" label="Biografía">
        <textarea id="a-bio" className="af__input af__textarea"
          value={f.bio} onChange={e=>set('bio',e.target.value)} rows={3} />
      </F>
      <div className="af__grid2">
        <F id="a-phone" label="Teléfono">
          <input id="a-phone" className="af__input"
            value={f.phone} onChange={e=>set('phone',e.target.value)} />
        </F>
        <F id="a-wa" label="WhatsApp">
          <input id="a-wa" className="af__input" placeholder="18091234567"
            value={f.whatsapp} onChange={e=>set('whatsapp',e.target.value)} />
        </F>
      </div>
      <F id="a-email" label="Correo">
        <input id="a-email" type="email" className="af__input"
          value={f.email} onChange={e=>set('email',e.target.value)} />
      </F>
      <F id="a-img" label="URL de foto">
        <input id="a-img" type="url" className="af__input" placeholder="https://…"
          value={f.image_url} onChange={e=>set('image_url',e.target.value)} />
      </F>
      {f.image_url && (
        <img src={f.image_url} alt="Vista previa"
          className="af__preview af__preview-round" loading="lazy" />
      )}
      <label className="af__check">
        <input type="checkbox" checked={f.active}
          onChange={e=>set('active',e.target.checked)} />
        Asesor activo
      </label>
      <div className="af__actions">
        <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-blue" disabled={saving}>
          {saving ? <><span className="spin"/>Guardando…</> : 'Guardar asesor'}
        </button>
      </div>
    </form>
  )
}

/* ── Main Panel ─────────────────────────────────────────── */
export default function AdminPanel({ onLogout, apiBase = '' }) {
  const [tab, setTab]   = useState('properties')
  const [props, setProps] = useState([])
  const [agents, setAgents] = useState([])
  const [leads, setLeads]   = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [modal, setModal]     = useState(null) // {type, data?}
  const [confirm, setConfirm] = useState(null) // {msg, onOk}
  const [toast, setToast]     = useState(null) // {msg, ok}

  const showToast = (msg, ok=true) => {
    setToast({msg, ok})
    setTimeout(()=>setToast(null), 3200)
  }

  /* Load all */
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [pR, aR, lR] = await Promise.all([
        fetch(`${apiBase}/api/admin/properties`, {credentials:'include'}),
        fetch(`${apiBase}/api/admin/agents`,     {credentials:'include'}),
        fetch(`${apiBase}/api/admin/leads`,      {credentials:'include'}),
      ])
      if (pR.status === 401) { onLogout(); return }
      setProps(await pR.json())
      setAgents(await aR.json())
      setLeads(await lR.json())
    } catch {
      showToast('Error al cargar datos.', false)
    } finally {
      setLoading(false)
    }
  }, [apiBase, onLogout])

  useEffect(()=>{ load() }, [load])

  /* ── CRUD helpers ─────────────────────────────────────── */
  const saveEntity = async (endpoint, id, data) => {
    setSaving(true)
    try {
      const url    = id ? `${apiBase}${endpoint}/${id}` : `${apiBase}${endpoint}`
      const method = id ? 'PUT' : 'POST'
      const res    = await fetch(url, {
        method, credentials:'include',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Error')
      showToast(id ? 'Actualizado.' : 'Creado.')
      setModal(null)
      load()
    } catch(e) {
      showToast(e.message, false)
    } finally {
      setSaving(false)
    }
  }

  const deleteEntity = async (endpoint, id) => {
    await fetch(`${apiBase}${endpoint}/${id}`, {method:'DELETE', credentials:'include'})
    showToast('Eliminado.')
    load()
  }

  const markRead = async (id) => {
    await fetch(`${apiBase}/api/admin/leads/${id}/read`, {method:'PUT', credentials:'include'})
    setLeads(ls => ls.map(l => l.id === id ? {...l, read:true} : l))
  }

  const unread = leads.filter(l=>!l.read).length

  const fmtPrice = (price, cur) => price
    ? new Intl.NumberFormat('es-DO',{style:'currency',currency:cur||'USD',minimumFractionDigits:0}).format(price)
    : '—'

  /* ── Render ────────────────────────────────────────────── */
  return (
    <div className="ap">
      {/* Sidebar / bottom tab bar */}
      <aside className="ap__sidebar">
        <div className="ap__brand">
          <span className="ap__brand-mark">INMOVA</span>
          <span className="ap__brand-sub">Admin</span>
        </div>

        <nav className="ap__nav" aria-label="Panel admin">
          {[
            {key:'properties', icon:'🏠', label:'Propiedades'},
            {key:'agents',     icon:'👤', label:'Asesores'},
            {key:'leads',      icon:'✉️', label:'Mensajes', badge:unread},
          ].map(item => (
            <button key={item.key}
              className={`ap__nav-btn${tab===item.key?' ap__nav-btn--active':''}`}
              onClick={()=>setTab(item.key)}
              aria-current={tab===item.key?'page':undefined}>
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
              {item.badge > 0 && (
                <span className="ap__badge" aria-label={`${item.badge} sin leer`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button className="ap__logout" onClick={onLogout}>🚪 Salir</button>
      </aside>

      {/* Main */}
      <main className="ap__main">

        {/* Properties */}
        {tab==='properties' && (
          <section>
            <div className="ap__head">
              <div>
                <h1 className="ap__title">Propiedades</h1>
                <p className="ap__sub">{props.length} en total</p>
              </div>
              <button className="btn btn-blue btn-sm"
                onClick={()=>setModal({type:'new-prop'})}>
                + Nueva
              </button>
            </div>

            {loading ? <p className="ap__loading">Cargando…</p> : (
              <div className="ap__table-wrap">
                <table className="ap__table" aria-label="Propiedades">
                  <thead>
                    <tr>
                      <th>Foto</th><th>Título</th><th>Precio</th>
                      <th>Estado</th><th>Tipo</th><th>Visible</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.map(p => (
                      <tr key={p.id} className={p.active?'':'ap__table-row--inactive'}>
                        <td>
                          <img src={p.image_url||'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=80'}
                            alt={p.title} className="ap__thumb" loading="lazy" />
                        </td>
                        <td>
                          <p className="ap__cell-name">{p.title}</p>
                          <p className="ap__cell-sub">{p.location}</p>
                        </td>
                        <td>{fmtPrice(p.price, p.currency)}</td>
                        <td><span className={`badge badge--${p.status}`}>{p.status==='venta'?'Venta':'Alquiler'}</span></td>
                        <td className="ap__cell-cap">{p.type}</td>
                        <td>
                          <span className={`badge ${p.active?'badge--active':'badge--inactive'}`}>
                            {p.active?'Sí':'No'}
                          </span>
                        </td>
                        <td>
                          <div className="ap__row-actions">
                            <button className="ap__icon-btn" title="Editar"
                              onClick={()=>setModal({type:'edit-prop',data:p})}>✏️</button>
                            <button className="ap__icon-btn ap__icon-btn--del" title="Eliminar"
                              onClick={()=>setConfirm({
                                msg:'¿Eliminar esta propiedad? Se ocultará del sitio.',
                                onOk:()=>deleteEntity('/api/admin/properties',p.id)
                              })}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {props.length===0 && <p className="ap__empty">No hay propiedades aún.</p>}
              </div>
            )}
          </section>
        )}

        {/* Agents */}
        {tab==='agents' && (
          <section>
            <div className="ap__head">
              <div>
                <h1 className="ap__title">Asesores</h1>
                <p className="ap__sub">{agents.length} registrados</p>
              </div>
              <button className="btn btn-blue btn-sm"
                onClick={()=>setModal({type:'new-agent'})}>
                + Nuevo
              </button>
            </div>

            {loading ? <p className="ap__loading">Cargando…</p> : (
              <div className="ap__agents">
                {agents.map(a => (
                  <div key={a.id} className={`ap__agent${a.active?'':' inactive'}`}>
                    <img
                      src={a.image_url||`https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=1560BD&color=fff&size=80`}
                      alt={a.name} className="ap__agent-avatar" loading="lazy" />
                    <div className="ap__agent-info">
                      <strong>{a.name}</strong>
                      <span>{a.role}</span>
                      <span>{a.phone||a.email}</span>
                    </div>
                    <div className="ap__agent-actions">
                      <button className="ap__icon-btn" title="Editar"
                        onClick={()=>setModal({type:'edit-agent',data:a})}>✏️</button>
                      <button className="ap__icon-btn ap__icon-btn--del" title="Desactivar"
                        onClick={()=>setConfirm({
                          msg:'¿Desactivar este asesor?',
                          onOk:()=>deleteEntity('/api/admin/agents',a.id)
                        })}>🗑️</button>
                    </div>
                  </div>
                ))}
                {agents.length===0 && <p className="ap__empty">No hay asesores aún.</p>}
              </div>
            )}
          </section>
        )}

        {/* Leads */}
        {tab==='leads' && (
          <section>
            <div className="ap__head">
              <div>
                <h1 className="ap__title">Mensajes</h1>
                <p className="ap__sub">
                  {unread>0 ? `${unread} sin leer · ${leads.length} total` : `${leads.length} mensajes`}
                </p>
              </div>
            </div>

            {loading ? <p className="ap__loading">Cargando…</p> : (
              <div className="ap__table-wrap">
                <table className="ap__table" aria-label="Mensajes">
                  <thead>
                    <tr>
                      <th>Nombre</th><th>Teléfono</th><th>Correo</th>
                      <th>Mensaje</th><th>Fecha</th><th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id} className={l.read?'':'ap__table-row--unread'}>
                        <td><strong>{l.name}</strong></td>
                        <td><a href={`tel:${l.phone}`} className="ap__link">{l.phone}</a></td>
                        <td>
                          {l.email
                            ? <a href={`mailto:${l.email}`} className="ap__link">{l.email}</a>
                            : '—'}
                        </td>
                        <td className="ap__cell-msg">{l.message}</td>
                        <td className="ap__cell-date">
                          {new Date(l.created_at).toLocaleDateString('es-DO',{
                            day:'2-digit',month:'short',year:'numeric'
                          })}
                        </td>
                        <td>
                          {l.read
                            ? <span className="badge badge--active">Leído</span>
                            : <button className="badge badge--unread"
                                onClick={()=>markRead(l.id)}>Marcar leído</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leads.length===0 && <p className="ap__empty">No hay mensajes aún.</p>}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Modals */}
      {modal?.type==='new-prop' && (
        <Modal title="Nueva propiedad" onClose={()=>setModal(null)}>
          <PropertyForm onSave={d=>saveEntity('/api/admin/properties',null,d)}
            onCancel={()=>setModal(null)} saving={saving} />
        </Modal>
      )}
      {modal?.type==='edit-prop' && (
        <Modal title="Editar propiedad" onClose={()=>setModal(null)}>
          <PropertyForm initial={modal.data}
            onSave={d=>saveEntity('/api/admin/properties',modal.data.id,d)}
            onCancel={()=>setModal(null)} saving={saving} />
        </Modal>
      )}
      {modal?.type==='new-agent' && (
        <Modal title="Nuevo asesor" onClose={()=>setModal(null)}>
          <AgentForm onSave={d=>saveEntity('/api/admin/agents',null,d)}
            onCancel={()=>setModal(null)} saving={saving} />
        </Modal>
      )}
      {modal?.type==='edit-agent' && (
        <Modal title="Editar asesor" onClose={()=>setModal(null)}>
          <AgentForm initial={modal.data}
            onSave={d=>saveEntity('/api/admin/agents',modal.data.id,d)}
            onCancel={()=>setModal(null)} saving={saving} />
        </Modal>
      )}

      {/* Confirm */}
      {confirm && (
        <Modal sm onClose={()=>setConfirm(null)}>
          <p className="confirm__msg">{confirm.msg}</p>
          <div className="confirm__actions">
            <button className="btn-outline" onClick={()=>setConfirm(null)}>Cancelar</button>
            <button className="btn-danger"
              onClick={()=>{ confirm.onOk(); setConfirm(null) }}>
              Confirmar
            </button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.ok?'ok':'err'}`}
          role="status" aria-live="polite">
          {toast.ok?'✓':'✗'} {toast.msg}
        </div>
      )}
    </div>
  )
}

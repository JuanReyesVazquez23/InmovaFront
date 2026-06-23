import { useState, useEffect, useRef, useCallback } from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import PropertyCard from '../components/PropertyCard.jsx'
import ContactForm from '../components/ContactForm.jsx'
import './LandingPage.css'

const API = import.meta.env.VITE_API_URL || ''

/* ── SVG icons (no emojis) ──────────────────────────────── */
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconCash = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M6 12H2M22 12h-4"/>
  </svg>
)
const IconKey = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8" cy="15" r="5"/>
    <path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>
  </svg>
)
const IconWa = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const IconFb = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)
const IconIg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)
const IconPhone  = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.07 6.07l.96-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17l.19.05z"/></svg>)
const IconMail   = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>)
const IconPin    = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>)

/* ── Static content ─────────────────────────────────────── */
const STATS = [
  { val: '+500',   lbl: 'Propiedades vendidas' },
  { val: '+10',    lbl: 'Años de experiencia'  },
  { val: '+1,200', lbl: 'Clientes satisfechos' },
  { val: '100%',   lbl: 'Transparencia'        },
]

const BENEFITS = [
  { Icon: IconUsers,  title: 'Asesoría personalizada',
    desc: 'Un asesor dedicado te acompaña desde la búsqueda hasta la firma, sin presiones.' },
  { Icon: IconShield, title: 'Seguridad jurídica',
    desc: 'Revisamos títulos, hipotecas y documentación para que tu inversión esté protegida.' },
  { Icon: IconCash,   title: 'Opciones de financiamiento',
    desc: 'Te conectamos con las mejores condiciones bancarias del mercado dominicano.' },
  { Icon: IconKey,    title: 'Acompañamiento total',
    desc: 'Desde la primera visita hasta la entrega de llaves, estamos contigo en cada paso.' },
]

const VALUES = [
  { t: 'Transparencia', d: 'Sin costos ocultos ni sorpresas.' },
  { t: 'Confianza',     d: 'Relaciones a largo plazo.' },
  { t: 'Excelencia',    d: 'Estándares premium en cada detalle.' },
  { t: 'Compromiso',    d: 'Tu satisfacción es nuestra prioridad.' },
]

const TESTIMONIALS = [
  { name: 'María González', role: 'Adquirió apartamento en Piantini', av: 'MG', stars: 5,
    text: 'El equipo de Inmova nos guió en cada paso. Conseguimos el apartamento ideal dentro del presupuesto y sin complicaciones legales.' },
  { name: 'Roberto Díaz', role: 'Inversionista en Naco y Evaristo Morales', av: 'RD', stars: 5,
    text: 'Llevo tres propiedades adquiridas con Inmova. Su conocimiento del mercado de Santo Domingo no tiene comparación.' },
  { name: 'Carmen Rodríguez', role: 'Alquiló residencia en Gazcue', av: 'CR', stars: 5,
    text: 'Proceso ágil y completamente transparente. Mi asesora estuvo disponible en todo momento. En menos de una semana tenía mi nuevo hogar.' },
]

const CHANNELS = [
  { href: 'https://wa.me/18090000000', Icon: IconWa,    title: 'WhatsApp',  sub: '809-000-0000', ext: true },
  { href: 'tel:+18090000000',          Icon: IconPhone,  title: 'Teléfono',  sub: '809-000-0000', ext: false },
  { href: 'mailto:info@inmova.do',     Icon: IconMail,   title: 'Correo',    sub: 'info@inmova.do', ext: false },
  { href: '#',                          Icon: IconPin,    title: 'Dirección', sub: 'Av. Abraham Lincoln, Santo Domingo', ext: false },
]

/* ─── Helpers ───────────────────────────────────────────── */
/* Flexible search:
   - Splits query into individual words and checks each word independently
   - A result shows if ANY word matches (OR logic = more open results)
   - Also checks price range when query contains a number
   - Synonyms: "apto" => "apartamento", "piscina" etc.
*/
const SYNONYMS = {
  'apto': 'apartamento', 'depto': 'apartamento', 'dept': 'apartamento',
  'hab': 'habitacion', 'cuarto': 'habitacion',
  'local': 'local comercial', 'oficina': 'oficina',
  'villa': 'villa', 'casa': 'casa',
  'sd': 'santo domingo', 'dn': 'distrito nacional',
}

function matchesSearch(prop, query, tipo) {
  if (tipo !== 'todos' && prop.status !== tipo) return false
  if (!query.trim()) return true

  const raw = query.toLowerCase().trim()
  const words = raw.split(/\s+/).map(w => SYNONYMS[w] || w)

  // Search fields to check (all lowercased)
  const fields = [
    prop.title?.toLowerCase() || '',
    prop.location?.toLowerCase() || '',
    prop.type?.toLowerCase() || '',
    prop.description?.toLowerCase() || '',
    prop.status?.toLowerCase() || '',
    prop.currency?.toLowerCase() || '',
  ].join(' ')

  // Price range check: if query contains a number, match properties within 20% of that value
  const numInQuery = parseFloat(raw.replace(/[^0-9.]/g, ''))
  if (!isNaN(numInQuery) && numInQuery > 0 && prop.price) {
    const price = parseFloat(prop.price)
    const margin = numInQuery * 0.3  // 30% margin
    if (price >= numInQuery - margin && price <= numInQuery + margin) {
      return true
    }
  }

  // OR logic: show result if ANY word matches any field
  return words.some(word => word.length >= 2 && fields.includes(word))
}

/* ─── Component ─────────────────────────────────────────── */
export default function LandingPage({ onSecretFooterTap }) {
  const [allProps, setAllProps]   = useState([])
  const [agents, setAgents]       = useState([])
  const [loading, setLoading]     = useState(true)

  /* Search state — driven by Hero search OR filter tabs */
  const [filter, setFilter]       = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchActive, setSearchActive] = useState(false)

  const [siteImages, setSiteImages] = useState({})
  const [footerTaps, setFooterTaps] = useState(0)
  const tapTimer                    = useRef(null)
  const propsRef                    = useRef(null)

  /* Fetch all data including site images */
  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/properties`).then(r => r.json()),
      fetch(`${API}/api/agents`).then(r => r.json()),
      fetch(`${API}/api/site-images`).then(r => r.json()),
    ])
      .then(([props, agts, imgs]) => {
        setAllProps(Array.isArray(props) ? props : [])
        setAgents(Array.isArray(agts) ? agts : [])
        if (imgs && typeof imgs === 'object') setSiteImages(imgs)
      })
      .catch(() => { setAllProps([]); setAgents([]) })
      .finally(() => setLoading(false))
  }, [])

  /* Filter logic — merges hero search + tab filter */
  const displayed = allProps.filter(p => matchesSearch(p, searchQuery, filter))

  /* Called from Hero's form submit */
  const handleSearch = useCallback(({ tipo, query }) => {
    setFilter(tipo === 'venta' ? 'venta' : tipo === 'alquiler' ? 'alquiler' : 'todos')
    setSearchQuery(query)
    setSearchActive(query.trim().length > 0 || tipo !== 'todos')
    setTimeout(() => {
      propsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])

  const clearSearch = () => {
    setSearchQuery('')
    setFilter('todos')
    setSearchActive(false)
  }

  /* Footer secret tap */
  const handleFooterTap = () => {
    const next = footerTaps + 1
    setFooterTaps(next)
    clearTimeout(tapTimer.current)
    tapTimer.current = setTimeout(() => setFooterTaps(0), 2000)
    if (next >= 5) { setFooterTaps(0); onSecretFooterTap() }
  }

  return (
    <>
      <Navbar />

      {/* Hero — passes search callback and dynamic page images */}
      <Hero onSearch={handleSearch} siteImages={siteImages} />

      {/* Stats bar */}
      <section className="statsbar" aria-label="Cifras de Inmova">
        <div className="statsbar__grid container">
          {STATS.map(s => (
            <div key={s.lbl} className="statsbar__item">
              <span className="statsbar__val">{s.val}</span>
              <span className="statsbar__lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Properties */}
      <section className="section" id="propiedades" aria-labelledby="props-h" ref={propsRef}>
        <div className="container">
          <div className="sec-hd">
            <span className="eyebrow">Portafolio</span>
            <h2 className="h-lg" id="props-h">Propiedades destacadas</h2>
            <p className="body-lg">
              Selección curada de apartamentos, casas y locales en el Gran Santo Domingo.
            </p>
          </div>

          {/* Active search banner */}
          {searchActive && (
            <div className="search-banner" role="status">
              <p>
                {displayed.length === 0
                  ? 'No se encontraron propiedades'
                  : `${displayed.length} resultado${displayed.length !== 1 ? 's' : ''}`}
                {searchQuery && <> para <strong>"{searchQuery}"</strong></>}
              </p>
              <button onClick={clearSearch}>Limpiar búsqueda</button>
            </div>
          )}

          {/* Filter tabs */}
          <div className="filters" role="group" aria-label="Filtrar propiedades">
            {[
              { key: 'todos',    label: 'Todas' },
              { key: 'venta',    label: 'En Venta' },
              { key: 'alquiler', label: 'En Alquiler' },
            ].map(f => (
              <button key={f.key}
                className={`filter${filter === f.key ? ' filter--on' : ''}`}
                onClick={() => { setFilter(f.key); setSearchActive(searchQuery.trim().length > 0) }}
                aria-pressed={filter === f.key}>
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="prop-grid">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="prop-skeleton" aria-hidden="true" />
              ))}
            </div>
          ) : displayed.length > 0 ? (
            <div className="prop-grid">
              {displayed.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <p className="prop-empty">
              No hay propiedades disponibles con los filtros actuales.
            </p>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="section section--gray" aria-labelledby="ben-h">
        <div className="container">
          <div className="sec-hd sec-hd--c">
            <span className="eyebrow">Por qué elegirnos</span>
            <h2 className="h-lg" id="ben-h">Tu inversión, protegida y acompañada</h2>
          </div>
          <div className="ben-grid">
            {BENEFITS.map(b => (
              <div key={b.title} className="ben">
                <div className="ben__icon" aria-hidden="true"><b.Icon /></div>
                <h3 className="ben__title">{b.title}</h3>
                <p className="ben__desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section" id="nosotros" aria-labelledby="about-h">
        <div className="container about-grid">
          <div>
            <div className="about-img-wrap">
              <img src={siteImages.about?.image_url || "/interior-living.jpg"}
                alt="Interior de propiedad residencial de lujo en Santo Domingo"
                className="about-img"
                loading="lazy"
                width="560" height="420"
              />
            </div>
            <div className="about-badge">
              <span className="about-badge__num">+10</span>
              <span className="about-badge__txt">Años en el mercado inmobiliario dominicano</span>
            </div>
          </div>

          <div className="about-body">
            <span className="eyebrow">Nuestra historia</span>
            <h2 className="h-lg" id="about-h">
              Conectamos personas con su hogar ideal en RD
            </h2>
            <p>
              Inmova nació en Santo Domingo con la misión de transformar la experiencia inmobiliaria
              dominicana. Creemos que encontrar una propiedad debe ser un proceso claro, seguro y humano.
            </p>
            <p>
              Con más de una década en el mercado, hemos acompañado a más de 1,200 familias e
              inversionistas a tomar las mejores decisiones en el Gran Santo Domingo.
            </p>
            <div className="values">
              {VALUES.map(v => (
                <div key={v.t} className="val">
                  <p className="val__title">{v.t}</p>
                  <p className="val__desc">{v.d}</p>
                </div>
              ))}
            </div>
            <a href="#contacto" className="btn btn-blue">Conocer más</a>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="showcase" aria-label="Propiedades exclusivas">
        <div className="container showcase__grid">
          <div>
            <span className="eyebrow eyebrow--light">Exclusividad</span>
            <h2 className="h-lg h-lg--white">
              Propiedades con acabados de primera calidad
            </h2>
            <p className="body-lg body-lg--white" style={{ marginBlock: '1rem 1.75rem' }}>
              Cada propiedad de nuestro portafolio es seleccionada por calidad constructiva,
              ubicación estratégica y potencial de revalorización. Espacios diseñados para vivir
              y para invertir.
            </p>
            <a href="#propiedades" className="btn btn-white">Ver portafolio</a>
          </div>
          <div className="showcase__img-wrap">
            <img src={siteImages.showcase?.image_url || "/interior-dining.png"}
              alt="Comedor de residencia exclusiva en Santo Domingo"
              className="showcase__img"
              loading="lazy"
              width="600" height="400"
            />
          </div>
        </div>
      </section>

      {/* Agents */}
      {agents.length > 0 && (
        <section className="section section--gray" id="asesores" aria-labelledby="ag-h">
          <div className="container">
            <div className="sec-hd sec-hd--c">
              <span className="eyebrow">El equipo</span>
              <h2 className="h-lg" id="ag-h">Nuestros asesores</h2>
              <p className="body-lg" style={{ margin: '0 auto' }}>
                Profesionales certificados con amplio conocimiento del mercado dominicano.
              </p>
            </div>
            <div className="agents-grid">
              {agents.map(a => (
                <article key={a.id} className="agent" aria-label={a.name}>
                  <img
                    src={a.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=1457B8&color=fff&size=200`}
                    alt={a.name}
                    className="agent__avatar"
                    loading="lazy"
                    width="200" height="200"
                  />
                  <h3 className="agent__name">{a.name}</h3>
                  <p className="agent__role">{a.role}</p>
                  {a.bio && <p className="agent__bio">{a.bio}</p>}
                  <a href={`https://wa.me/${a.whatsapp || '18090000000'}?text=${encodeURIComponent(`Hola ${a.name}, quiero información sobre propiedades`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-wa btn-sm"
                    aria-label={`Contactar a ${a.name} por WhatsApp`}>
                    Contactar
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="section section--dark" aria-labelledby="testi-h">
        <div className="container">
          <div className="sec-hd sec-hd--c">
            <span className="eyebrow eyebrow--light">Testimonios</span>
            <h2 className="h-lg h-lg--white" id="testi-h">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map(t => (
              <blockquote key={t.name} className="testi">
                <div className="testi__stars" aria-label={`${t.stars} de 5 estrellas`}>
                  {'★'.repeat(t.stars)}
                </div>
                <p className="testi__text">&#8220;{t.text}&#8221;</p>
                <footer className="testi__author">
                  <div className="testi__av" aria-hidden="true">{t.av}</div>
                  <div>
                    <cite className="testi__name">{t.name}</cite>
                    <p className="testi__role">{t.role}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section" id="contacto" aria-labelledby="contact-h">
        <div className="container contact-grid">
          <div className="contact-info">
            <span className="eyebrow">Contacto</span>
            <h2 className="h-lg" id="contact-h">Hablemos de tu próxima propiedad</h2>
            <p className="body-lg">
              Completa el formulario o contáctanos directamente.
              Un asesor te responderá en menos de 24 horas.
            </p>
            <div className="channels">
              {CHANNELS.map(c => (
                <a key={c.title} href={c.href} className="channel"
                  target={c.ext ? '_blank' : undefined}
                  rel={c.ext ? 'noopener noreferrer' : undefined}
                  aria-label={c.title}>
                  <span className="channel__ico"><c.Icon /></span>
                  <div>
                    <strong>{c.title}</strong>
                    <span>{c.sub}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="contact-box">
            <ContactForm apiBase={API} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container footer__grid">
          <div>
            <span className="footer__mark">INMOVA</span>
            <span className="footer__sub">Asesores Inmobiliarios</span>
            <p className="footer__tag">Tu próxima inversión comienza aquí.</p>
            <div className="footer__social" aria-label="Redes sociales">
              <a href="https://facebook.com/inmovard" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFb /></a>
              <a href="https://instagram.com/inmovard" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconIg /></a>
              <a href="https://wa.me/18090000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><IconWa /></a>
            </div>
          </div>
          <div>
            <p className="footer__col-title">Propiedades</p>
            <nav className="footer__links" aria-label="Propiedades">
              <a href="#propiedades" className="footer__link">En venta</a>
              <a href="#propiedades" className="footer__link">En alquiler</a>
              <a href="#propiedades" className="footer__link">Exclusivas</a>
              <a href="#nosotros"    className="footer__link">Vende tu inmueble</a>
            </nav>
          </div>
          <div>
            <p className="footer__col-title">Empresa</p>
            <nav className="footer__links" aria-label="Empresa">
              <a href="#nosotros"  className="footer__link">Nosotros</a>
              <a href="#asesores"  className="footer__link">Asesores</a>
              <a href="#contacto"  className="footer__link">Contacto</a>
            </nav>
          </div>
          <div>
            <p className="footer__col-title">Contacto</p>
            <address className="footer__links">
              <a href="tel:+18090000000"      className="footer__link">809-000-0000</a>
              <a href="mailto:info@inmova.do" className="footer__link">info@inmova.do</a>
              <span className="footer__link">Av. Abraham Lincoln, Santo Domingo</span>
            </address>
          </div>
        </div>
        <div className="footer__bottom container">
          <button className="footer__copy" onClick={handleFooterTap} aria-label="Copyright">
            &copy; {new Date().getFullYear()} Inmova Asesores Inmobiliarios &middot; Santo Domingo, RD
          </button>
          <span className="footer__legal">Todos los derechos reservados</span>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a href="https://wa.me/18090000000?text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20propiedades"
        target="_blank" rel="noopener noreferrer"
        className="fab" aria-label="Abrir WhatsApp">
        <IconWa />
      </a>
    </>
  )
}

import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import PropertyCard from '../components/PropertyCard.jsx'
import ContactForm from '../components/ContactForm.jsx'
import './LandingPage.css'

const API = import.meta.env.VITE_API_URL || ''

/* ── Static content ─────────────────────────────────────── */
const STRIP_ITEMS = [
  { icon: '%',  label: 'Financiamiento', href: '#contacto' },
  { icon: '🕐', label: 'Historial',      href: '#propiedades' },
  { icon: '♥',  label: 'Favoritos',      href: '#propiedades' },
  { icon: '💬', label: 'WhatsApp',        href: 'https://wa.me/18090000000' },
]

const STATS = [
  { val: '+500',   lbl: 'Propiedades vendidas' },
  { val: '+10',    lbl: 'Años de experiencia'  },
  { val: '+1,200', lbl: 'Clientes satisfechos' },
  { val: '100%',   lbl: 'Transparencia'        },
]

const BENEFITS = [
  { icon: '🤝', title: 'Asesoría personalizada',
    desc: 'Un asesor dedicado te acompaña desde la búsqueda hasta la firma.' },
  { icon: '⚖️', title: 'Seguridad jurídica',
    desc: 'Revisamos títulos y documentación para que tu inversión esté protegida.' },
  { icon: '💰', title: 'Financiamiento',
    desc: 'Te conectamos con las mejores opciones bancarias del mercado.' },
  { icon: '🏠', title: 'Acompañamiento total',
    desc: 'Desde la primera visita hasta la entrega de llaves, estamos contigo.' },
]

const VALUES = [
  { t: 'Transparencia', d: 'Sin costos ocultos.' },
  { t: 'Confianza',     d: 'Relaciones a largo plazo.' },
  { t: 'Excelencia',    d: 'Estándares premium.' },
  { t: 'Compromiso',    d: 'Tu satisfacción primero.' },
]

const TESTIMONIALS = [
  { name: 'María González', role: 'Compró en Piantini', avatar: 'MG', stars: 5,
    text: 'El equipo de Inmova fue increíble. Me guiaron en cada paso y conseguí el apartamento ideal dentro de mi presupuesto.' },
  { name: 'Roberto Díaz', role: 'Inversionista – Naco', avatar: 'RD', stars: 5,
    text: 'Llevo 3 propiedades con Inmova. Su conocimiento del mercado dominicano no tiene igual.' },
  { name: 'Carmen Rodríguez', role: 'Alquiló en Gazcue', avatar: 'CR', stars: 5,
    text: 'Proceso muy rápido y transparente. Encontré exactamente lo que buscaba en menos de una semana.' },
]

/* ── WhatsApp SVG ────────────────────────────────────────── */
const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const FbIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const IgIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

/* ── Component ───────────────────────────────────────────── */
export default function LandingPage({ onSecretFooterTap }) {
  const [properties, setProperties] = useState([])
  const [agents, setAgents]         = useState([])
  const [filter, setFilter]         = useState('todos')
  const [loading, setLoading]       = useState(true)
  const [footerTaps, setFooterTaps] = useState(0)
  const tapTimer                    = useRef(null)

  /* Fetch data */
  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/properties`).then(r => r.json()),
      fetch(`${API}/api/agents`).then(r => r.json()),
    ])
      .then(([props, agts]) => {
        setProperties(Array.isArray(props) ? props : [])
        setAgents(Array.isArray(agts) ? agts : [])
      })
      .catch(() => { setProperties([]); setAgents([]) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'todos'
    ? properties
    : properties.filter(p => p.status === filter)

  /* Secret 5-tap footer handler */
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
      <Hero />

      {/* ── Options strip ──────────────────────────────────── */}
      <div className="strip" role="navigation" aria-label="Accesos rápidos">
        <div className="strip__inner container">
          {STRIP_ITEMS.map(item => (
            <a key={item.label} href={item.href} className="strip__item"
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
              <span className="strip__icon" aria-hidden="true">{item.icon}</span>
              <span className="strip__label">{item.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <section className="statsbar" aria-label="Estadísticas">
        <div className="statsbar__grid container">
          {STATS.map(s => (
            <div key={s.lbl} className="statsbar__item">
              <span className="statsbar__val">{s.val}</span>
              <span className="statsbar__lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Properties ─────────────────────────────────────── */}
      <section className="section" id="propiedades" aria-labelledby="props-h">
        <div className="container">
          <div className="sec-header">
            <span className="tag">Portafolio</span>
            <h2 className="heading-lg" id="props-h">Propiedades destacadas</h2>
            <p className="lead">Selección curada de las mejores oportunidades en el Gran Santo Domingo.</p>
          </div>

          <div className="filters" role="group" aria-label="Filtrar">
            {[
              { key: 'todos',    label: 'Todas' },
              { key: 'venta',    label: 'En Venta' },
              { key: 'alquiler', label: 'En Alquiler' },
            ].map(f => (
              <button key={f.key}
                className={`filter${filter === f.key ? ' filter--active' : ''}`}
                onClick={() => setFilter(f.key)}
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
          ) : filtered.length > 0 ? (
            <div className="prop-grid" id="alquiler">
              {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <p className="prop-empty">No hay propiedades con este filtro.</p>
          )}
        </div>
      </section>

      {/* ── Benefits ───────────────────────────────────────── */}
      <section className="section section--gray" aria-labelledby="ben-h">
        <div className="container">
          <div className="sec-header sec-header--center">
            <span className="tag">Por qué elegirnos</span>
            <h2 className="heading-lg" id="ben-h">Tu inversión, protegida y acompañada</h2>
          </div>
          <div className="benefits-grid">
            {BENEFITS.map(b => (
              <div key={b.title} className="benefit">
                <div className="benefit__icon" aria-hidden="true">{b.icon}</div>
                <h3 className="benefit__title">{b.title}</h3>
                <p className="benefit__desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────── */}
      <section className="section" id="nosotros" aria-labelledby="about-h">
        <div className="container about-grid">
          {/* Image column */}
          <div>
            <div className="about-img-wrap">
              <img src="/interior-living.jpg"
                alt="Interior de propiedad de lujo"
                className="about-img"
                loading="lazy"
                width="560" height="420"
              />
            </div>
            <div className="about-badge">
              <span className="about-badge__num">+10</span>
              <span className="about-badge__txt">Años en el mercado dominicano</span>
            </div>
          </div>

          {/* Text column */}
          <div className="about-body">
            <span className="tag">Nuestra historia</span>
            <h2 className="heading-lg" id="about-h">
              Conectando personas con su hogar ideal
            </h2>
            <p>Fundada en Santo Domingo con la misión de transformar la experiencia inmobiliaria dominicana, Inmova nació de la convicción de que encontrar una propiedad debe ser un proceso claro, seguro y humano.</p>
            <p>Con más de una década en el mercado, hemos acompañado a más de 1,200 familias e inversionistas en el Gran Santo Domingo.</p>

            <div className="values">
              {VALUES.map(v => (
                <div key={v.t} className="value">
                  <p className="value__title">{v.t}</p>
                  <p className="value__desc">{v.d}</p>
                </div>
              ))}
            </div>
            <a href="#contacto" className="btn btn-blue">Conocer más →</a>
          </div>
        </div>
      </section>

      {/* ── Interior showcase ──────────────────────────────── */}
      <section className="showcase" aria-label="Propiedades exclusivas">
        <div className="container showcase__grid">
          <div>
            <span className="tag tag--light">Exclusividad</span>
            <h2 className="heading-lg heading-lg--white">
              Propiedades con<br />acabados de primera
            </h2>
            <p className="lead lead--white" style={{ marginBlock: '1rem 1.5rem' }}>
              Cada propiedad es seleccionada por calidad, ubicación y potencial de inversión.
              Espacios diseñados para vivir y crecer.
            </p>
            <a href="#propiedades" className="btn btn-white">Ver propiedades</a>
          </div>
          <div className="showcase__img-wrap">
            <img src="/interior-dining.png"
              alt="Comedor de propiedad exclusiva"
              className="showcase__img"
              loading="lazy"
              width="600" height="400"
            />
          </div>
        </div>
      </section>

      {/* ── Agents ─────────────────────────────────────────── */}
      {agents.length > 0 && (
        <section className="section section--gray" id="asesores" aria-labelledby="ag-h">
          <div className="container">
            <div className="sec-header sec-header--center">
              <span className="tag">El equipo</span>
              <h2 className="heading-lg" id="ag-h">Nuestros asesores</h2>
              <p className="lead" style={{ margin: '0 auto' }}>
                Profesionales certificados listos para ayudarte.
              </p>
            </div>
            <div className="agents-grid">
              {agents.map(a => (
                <article key={a.id} className="agent" aria-label={a.name}>
                  <img
                    src={a.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=1560BD&color=fff&size=200`}
                    alt={a.name}
                    className="agent__avatar"
                    loading="lazy"
                    width="200" height="200"
                  />
                  <h3 className="agent__name">{a.name}</h3>
                  <p className="agent__role">{a.role}</p>
                  {a.bio && <p className="agent__bio">{a.bio}</p>}
                  <a href={`https://wa.me/${a.whatsapp || '18090000000'}?text=${encodeURIComponent(`Hola ${a.name}, quiero información`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn btn-wa btn-sm"
                    aria-label={`Contactar a ${a.name}`}>
                    <WaIcon /> Contactar
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="section section--dark" aria-labelledby="testi-h">
        <div className="container">
          <div className="sec-header sec-header--center">
            <span className="tag tag--light">Testimonios</span>
            <h2 className="heading-lg heading-lg--white" id="testi-h">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map(t => (
              <blockquote key={t.name} className="testi">
                <div className="testi__stars" aria-label={`${t.stars} estrellas`}>
                  {'★'.repeat(t.stars)}
                </div>
                <p className="testi__text">"{t.text}"</p>
                <footer className="testi__author">
                  <div className="testi__avatar" aria-hidden="true">{t.avatar}</div>
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

      {/* ── Contact ────────────────────────────────────────── */}
      <section className="section" id="contacto" aria-labelledby="contact-h">
        <div className="container contact-grid">
          <div className="contact-info">
            <span className="tag">Contacto</span>
            <h2 className="heading-lg" id="contact-h">
              Hablemos de tu<br />próxima propiedad
            </h2>
            <p>Completa el formulario o contáctanos directamente. Un asesor te responderá en menos de 24 horas.</p>
            <div className="channels">
              {[
                { href: 'https://wa.me/18090000000', icon: '💬', title: 'WhatsApp', sub: '809-000-0000' },
                { href: 'tel:+18090000000',          icon: '📞', title: 'Teléfono', sub: '809-000-0000' },
                { href: 'mailto:info@inmova.do',     icon: '✉️', title: 'Correo',   sub: 'info@inmova.do' },
                { href: '#',                          icon: '📍', title: 'Dirección', sub: 'Av. Abraham Lincoln, Santo Domingo' },
              ].map(c => (
                <a key={c.title} href={c.href}
                  className="channel"
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={c.title}>
                  <span className="channel__icon" aria-hidden="true">{c.icon}</span>
                  <div>
                    <strong>{c.title}</strong>
                    <span>{c.sub}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-form-box">
            <ContactForm apiBase={API} />
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="footer" role="contentinfo">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <span className="footer__brand-mark">INMOVA</span>
            <span className="footer__brand-sub">Asesores Inmobiliarios</span>
            <p className="footer__tagline">Tu próxima inversión comienza aquí.</p>
            <div className="footer__social" aria-label="Redes sociales">
              <a href="https://facebook.com/inmovard" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FbIcon /></a>
              <a href="https://instagram.com/inmovard" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IgIcon /></a>
              <a href="https://wa.me/18090000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WaIcon /></a>
            </div>
          </div>

          {/* Propiedades */}
          <div>
            <p className="footer__col-title">Propiedades</p>
            <nav className="footer__links" aria-label="Propiedades">
              <a href="#propiedades" className="footer__link">En venta</a>
              <a href="#alquiler"    className="footer__link">En alquiler</a>
              <a href="#propiedades" className="footer__link">Exclusivas</a>
              <a href="#nosotros"    className="footer__link">Vende tu inmueble</a>
            </nav>
          </div>

          {/* Empresa */}
          <div>
            <p className="footer__col-title">Empresa</p>
            <nav className="footer__links" aria-label="Empresa">
              <a href="#nosotros"  className="footer__link">Nosotros</a>
              <a href="#asesores"  className="footer__link">Asesores</a>
              <a href="#contacto"  className="footer__link">Contacto</a>
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <p className="footer__col-title">Contacto</p>
            <address className="footer__links">
              <a href="tel:+18090000000"      className="footer__link">📞 809-000-0000</a>
              <a href="mailto:info@inmova.do" className="footer__link">✉️ info@inmova.do</a>
              <span className="footer__link">📍 Av. Abraham Lincoln, Santo Domingo</span>
            </address>
          </div>
        </div>

        {/* Bottom — secret tap zone */}
        <div className="footer__bottom container">
          <button className="footer__copy" onClick={handleFooterTap} aria-label="Copyright">
            © {new Date().getFullYear()} Inmova Asesores Inmobiliarios · Santo Domingo, RD
          </button>
          <span className="footer__legal">Todos los derechos reservados</span>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/18090000000?text=Hola,%20quiero%20información%20sobre%20propiedades"
        target="_blank" rel="noopener noreferrer"
        className="fab-wa" aria-label="Abrir WhatsApp">
        <WaIcon />
      </a>
    </>
  )
}

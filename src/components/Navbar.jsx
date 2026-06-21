import { useState, useEffect } from 'react'
import './Navbar.css'

const LINKS = [
  { label: 'Inicio',     href: '#inicio' },
  { label: 'Propiedades', href: '#propiedades' },
  { label: 'Nosotros',   href: '#nosotros' },
  { label: 'Asesores',   href: '#asesores' },
  { label: 'Contacto',   href: '#contacto' },
]

const WA_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <>
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}`} role="banner">
        <div className="nav__inner container">
          <a href="#inicio" className="nav__logo" aria-label="Inmova inicio">
            <span className="nav__logo-mark">INMOVA</span>
            <span className="nav__logo-sub">Asesores Inmobiliarios</span>
          </a>

          <nav className="nav__links" aria-label="Principal">
            {LINKS.map(l => (
              <a key={l.label} href={l.href} className="nav__link">{l.label}</a>
            ))}
          </nav>

          <div className="nav__actions">
            <a href="https://wa.me/18090000000" target="_blank" rel="noopener noreferrer"
              className="btn btn-wa nav__wa" aria-label="WhatsApp">
              {WA_ICON} WhatsApp
            </a>
            <button
              className="nav__burger"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
            >
              {[1,2,3].map(i => (
                <span key={i} className={`nav__bar${open ? ' nav__bar--open' : ''}`} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`nav__drawer${open ? ' nav__drawer--open' : ''}`}
        role="dialog" aria-modal="true" aria-label="Menú">
        <div className="nav__drawer-head">
          <span className="nav__logo-mark">INMOVA</span>
          <button className="nav__drawer-close" onClick={close} aria-label="Cerrar">✕</button>
        </div>
        {LINKS.map(l => (
          <a key={l.label} href={l.href} className="nav__drawer-link" onClick={close}>
            {l.label}
          </a>
        ))}
        <a href="https://wa.me/18090000000" target="_blank" rel="noopener noreferrer"
          className="btn btn-wa nav__drawer-wa" onClick={close}>
          {WA_ICON} WhatsApp
        </a>
      </div>

      {open && <div className="nav__overlay" onClick={close} aria-hidden="true" />}
    </>
  )
}

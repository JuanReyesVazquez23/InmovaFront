import { useState, useEffect } from 'react'
import './Navbar.css'

const LINKS = [
  { label: 'Inicio',       href: '#inicio' },
  { label: 'Propiedades',  href: '#propiedades' },
  { label: 'Nosotros',     href: '#nosotros' },
  { label: 'Asesores',     href: '#asesores' },
  { label: 'Contacto',     href: '#contacto' },
]

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
            <span className="nav__mark">INMOVA</span>
            <span className="nav__sub">Asesores Inmobiliarios</span>
          </a>

          <nav className="nav__links" aria-label="Principal">
            {LINKS.map(l => (
              <a key={l.label} href={l.href} className="nav__link">{l.label}</a>
            ))}
          </nav>

          <div className="nav__actions">
            <a href="https://wa.me/18090000000" target="_blank" rel="noopener noreferrer"
              className="btn btn-wa btn-sm nav__wa">
              Contactar
            </a>
            <button className="nav__burger"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}>
              <span className={`nav__bar${open ? ' nav__bar--o1' : ''}`} />
              <span className={`nav__bar${open ? ' nav__bar--o2' : ''}`} />
              <span className={`nav__bar${open ? ' nav__bar--o3' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div className={`nav__drawer${open ? ' nav__drawer--open' : ''}`}
        role="dialog" aria-modal="true" aria-label="Menú principal">
        <div className="nav__dhead">
          <span className="nav__mark">INMOVA</span>
          <button className="nav__dclose" onClick={close} aria-label="Cerrar">&#x2715;</button>
        </div>
        {LINKS.map(l => (
          <a key={l.label} href={l.href} className="nav__dlink" onClick={close}>{l.label}</a>
        ))}
        <a href="https://wa.me/18090000000" target="_blank" rel="noopener noreferrer"
          className="btn btn-wa nav__dwa" onClick={close}>
          Contactar por WhatsApp
        </a>
      </div>

      {open && <div className="nav__overlay" onClick={close} aria-hidden="true" />}
    </>
  )
}

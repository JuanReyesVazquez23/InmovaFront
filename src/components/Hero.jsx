import { useState, useEffect } from 'react'
import './Hero.css'

const SLIDES = [
  { src: '/hero-city.jpg',  alt: 'Vista aérea Santo Domingo' },
  { src: '/hero-city2.jpg', alt: 'Skyline Santo Domingo' },
  { src: '/hero-city3.jpg', alt: 'Santo Domingo atardecer' },
]

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function Hero() {
  const [active, setActive]         = useState(0)
  const [searchType, setSearchType] = useState('venta')
  const [query, setQuery]           = useState('')

  useEffect(() => {
    const id = setInterval(() => setActive(i => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(id)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    document.querySelector('#propiedades')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="inicio" aria-label="Presentación principal">
      {/* Background */}
      <div className="hero__bg" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div key={s.src}
            className={`hero__slide${i === active ? ' hero__slide--active' : ''}`}
            style={{ backgroundImage: `url(${s.src})` }}
            role="img"
            aria-label={s.alt}
          />
        ))}
        <div className="hero__overlay" />
      </div>

      {/* Content */}
      <div className="hero__body container">
        <div className="hero__left anim-up">
          <p className="hero__eyebrow">Gran Santo Domingo · RD</p>
          <h1 className="hero__title">
            Encuentra tu<br />
            <em>propiedad ideal</em><br />
            en RD
          </h1>
          <p className="hero__sub">
            Apartamentos, casas y villas en venta y alquiler.
            Asesores expertos que te acompañan en cada paso.
          </p>
          <div className="hero__btns">
            <a href="https://wa.me/18090000000?text=Hola,%20quiero%20info%20sobre%20propiedades"
              target="_blank" rel="noopener noreferrer"
              className="btn btn-wa" aria-label="Contactar por WhatsApp">
              <WaIcon /> Escríbenos ahora
            </a>
            <a href="#contacto" className="btn btn-ghost">Ver propiedades</a>
          </div>
        </div>

        {/* Search card */}
        <div className="hero__card anim-up d2" role="search" aria-label="Buscar propiedades">
          <p className="hero__card-title">¿Qué estás buscando?</p>

          <div className="hero__tabs" role="group" aria-label="Tipo">
            {[
              { key: 'venta', label: 'Comprar' },
              { key: 'alquiler', label: 'Alquilar' },
            ].map(t => (
              <button key={t.key}
                className={`hero__tab${searchType === t.key ? ' hero__tab--active' : ''}`}
                onClick={() => setSearchType(t.key)}
                aria-pressed={searchType === t.key}>
                {t.label}
              </button>
            ))}
          </div>

          <form className="hero__search" onSubmit={handleSearch}>
            <div className="hero__search-wrap">
              <SearchIcon />
              <input
                type="search"
                className="hero__input"
                placeholder="Sector, tipo de propiedad…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Buscar"
              />
            </div>
            <button type="submit" className="btn btn-blue hero__search-btn">
              Buscar propiedades
            </button>
          </form>

          <div className="hero__card-stats">
            {[
              { v: '+500', l: 'Vendidas' },
              { v: '+10',  l: 'Años exp.' },
              { v: '100%', l: 'Confianza' },
            ].map(s => (
              <div key={s.l} className="hero__stat">
                <span className="hero__stat-val">{s.v}</span>
                <span className="hero__stat-lbl">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="hero__dots" aria-label="Indicadores" role="group">
        {SLIDES.map((_, i) => (
          <button key={i}
            className={`hero__dot${i === active ? ' hero__dot--active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Imagen ${i + 1}`}
            aria-current={i === active}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__scroll-arrow" />
      </div>
    </section>
  )
}

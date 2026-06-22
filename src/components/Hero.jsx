import { useState, useEffect } from 'react'
import './Hero.css'

const SLIDES = [
  { src: '/hero-city.jpg',  alt: 'Vista aérea de Santo Domingo' },
  { src: '/hero-city2.jpg', alt: 'Skyline de Santo Domingo' },
  { src: '/hero-city3.jpg', alt: 'Santo Domingo al atardecer' },
]

export default function Hero({ onSearch }) {
  const [active, setActive]   = useState(0)
  const [tipo, setTipo]       = useState('venta')
  const [query, setQuery]     = useState('')

  useEffect(() => {
    const id = setInterval(() => setActive(i => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(id)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) onSearch({ tipo, query })
    document.querySelector('#propiedades')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="inicio" aria-label="Encabezado principal">
      {/* Slides — GPU-isolated to prevent shake on Android */}
      <div className="hero__bg" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div key={s.src}
            className={`hero__slide${i === active ? ' hero__slide--on' : ''}`}
            style={{ backgroundImage: `url(${s.src})` }}
          />
        ))}
        <div className="hero__veil" />
      </div>

      <div className="hero__body container">
        {/* Left column — headline */}
        <div className="hero__left anim-up">
          <p className="eyebrow eyebrow--light">Gran Santo Domingo &middot; Rep&uacute;blica Dominicana</p>
          <h1 className="h-xl">
            Encuentra tu<br />
            <em>propiedad ideal</em><br />
            en la capital
          </h1>
          <p className="body-lg body-lg--white" style={{ marginBlock: '1.25rem 2rem' }}>
            Apartamentos, casas y villas en venta y alquiler en el Gran Santo Domingo.
            Asesores certificados que te acompa&ntilde;an en cada paso del proceso.
          </p>
          <div className="hero__btns">
            <a href="https://wa.me/18090000000?text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20propiedades"
              target="_blank" rel="noopener noreferrer"
              className="btn btn-wa">
              Escribir al asesor
            </a>
            <a href="#propiedades" className="btn btn-ghost">Ver propiedades</a>
          </div>
        </div>

        {/* Right column — search card */}
        <div className="hero__card anim-up d2" role="search" aria-label="Buscar propiedades">
          <p className="hero__card-title">Busca tu pr&oacute;xima inversi&oacute;n</p>

          <div className="hero__tabs" role="group" aria-label="Tipo de operaci&oacute;n">
            <button
              className={`hero__tab${tipo === 'venta' ? ' hero__tab--on' : ''}`}
              onClick={() => setTipo('venta')}
              aria-pressed={tipo === 'venta'}>
              Comprar
            </button>
            <button
              className={`hero__tab${tipo === 'alquiler' ? ' hero__tab--on' : ''}`}
              onClick={() => setTipo('alquiler')}
              aria-pressed={tipo === 'alquiler'}>
              Alquilar
            </button>
          </div>

          <form onSubmit={handleSearch} className="hero__form">
            <div className="hero__input-wrap">
              <svg className="hero__search-ico" width="17" height="17" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                className="hero__input"
                placeholder="Sector, tipo de propiedad, precio…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Buscar"
              />
              {query && (
                <button type="button" className="hero__clear"
                  onClick={() => setQuery('')} aria-label="Limpiar búsqueda">
                  &#x2715;
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-blue hero__submit">
              Buscar propiedades
            </button>
          </form>

          <div className="hero__mini-stats">
            {[
              { v: '+500', l: 'Propiedades' },
              { v: '+10 años', l: 'Experiencia' },
              { v: '100%', l: 'Confianza' },
            ].map(s => (
              <div key={s.l} className="hero__mini-stat">
                <strong>{s.v}</strong>
                <span>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="hero__dots" aria-label="Indicadores de imagen" role="group">
        {SLIDES.map((_, i) => (
          <button key={i}
            className={`hero__dot${i === active ? ' hero__dot--on' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Imagen ${i + 1}`}
            aria-current={i === active}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll" aria-hidden="true">
        <span className="hero__arrow" />
      </div>
    </section>
  )
}

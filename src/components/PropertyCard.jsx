import './PropertyCard.css'

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)
const BedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M2 9V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3"/><path d="M2 11v9"/><path d="M22 11v9"/>
    <path d="M2 15h20"/><path d="M5 11V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M13 11V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const BathIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
    <line x1="10" x2="8" y1="5" y2="3"/><line x1="2" x2="22" y1="12" y2="12"/>
  </svg>
)
const AreaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 3h7"/><path d="M14 3h7"/><path d="M3 3v7"/><path d="M21 3v7"/>
    <path d="M3 14v7"/><path d="M21 14v7"/><path d="M3 21h7"/><path d="M14 21h7"/>
  </svg>
)
const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

function fmtPrice(price, currency) {
  if (!price) return 'Consultar'
  return new Intl.NumberFormat('es-DO', {
    style: 'currency', currency: currency || 'USD',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(price)
}

export default function PropertyCard({ property: p }) {
  const waLink = `https://wa.me/${p.whatsapp || '18090000000'}?text=${encodeURIComponent(`Hola, me interesa: ${p.title}`)}`

  return (
    <article className="pcard" aria-label={p.title}>
      <div className="pcard__img-wrap">
        <img
          src={p.image_url || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600'}
          alt={p.title}
          className="pcard__img"
          loading="lazy"
          width="400" height="250"
        />
        <div className="pcard__badges">
          <span className={`pcard__badge pcard__badge--${p.status}`}>
            {p.status === 'venta' ? 'En Venta' : 'En Alquiler'}
          </span>
          {p.type && (
            <span className="pcard__badge pcard__badge--type">
              {p.type.charAt(0).toUpperCase() + p.type.slice(1)}
            </span>
          )}
        </div>
        {p.featured && <span className="pcard__featured">⭐ Destacada</span>}
      </div>

      <div className="pcard__body">
        <p className="pcard__loc">
          <PinIcon />
          {p.location || 'Santo Domingo, RD'}
        </p>

        <h3 className="pcard__name">{p.title}</h3>

        {p.description && <p className="pcard__desc">{p.description}</p>}

        <div className="pcard__stats">
          {p.bedrooms > 0 && (
            <span className="pcard__stat" title="Habitaciones">
              <BedIcon /> {p.bedrooms} hab.
            </span>
          )}
          {p.bathrooms > 0 && (
            <span className="pcard__stat" title="Baños">
              <BathIcon /> {p.bathrooms} baños
            </span>
          )}
          {p.area_sqm > 0 && (
            <span className="pcard__stat" title="Área">
              <AreaIcon /> {p.area_sqm} m²
            </span>
          )}
        </div>

        <p className="pcard__price">
          {fmtPrice(p.price, p.currency)}
          {p.status === 'alquiler' && (
            <span className="pcard__price-period">/mes</span>
          )}
        </p>

        <div className="pcard__actions">
          <a href="#contacto" className="btn btn-dark btn-sm pcard__btn">
            Más info
          </a>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="btn btn-wa btn-sm pcard__btn"
            aria-label={`WhatsApp para ${p.title}`}>
            <WaIcon /> WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

/**
 * ImagePicker — reutilizable
 * Permite seleccionar una imagen desde la galería del dispositivo.
 * Convierte a base64 y la sube a /api/admin/upload-image para validación.
 * Si la validación es OK devuelve la data-URL lista para guardar.
 *
 * Props:
 *   value      {string}  — URL actual (base64 o externa)
 *   onChange   {fn}      — (newUrl: string) => void
 *   apiBase    {string}  — base URL del backend
 *   label      {string}  — texto del botón (opcional)
 *   round      {bool}    — mostrar preview circular (avatares)
 *   maxMB      {number}  — límite en MB (default 5)
 */
import { useRef, useState } from 'react'
import './ImagePicker.css'

export default function ImagePicker({
  value,
  onChange,
  apiBase = '',
  label = 'Seleccionar imagen',
  round = false,
  maxMB = 5,
}) {
  const inputRef            = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]   = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    // Client-side size check before encoding
    if (file.size > maxMB * 1024 * 1024) {
      setError(`La imagen supera los ${maxMB} MB.`)
      return
    }

    // Only images
    if (!file.type.startsWith('image/')) {
      setError('El archivo seleccionado no es una imagen.')
      return
    }

    setUploading(true)

    try {
      // Convert to base64
      const dataUrl = await fileToBase64(file)

      // Validate on backend (type, size, malformed)
      const res  = await fetch(`${apiBase}/api/admin/upload-image`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al procesar la imagen.')
        return
      }

      onChange(data.url)
    } catch {
      setError('Error de conexión al subir la imagen.')
    } finally {
      setUploading(false)
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange('')
    setError('')
  }

  return (
    <div className="imgpicker">
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="imgpicker__input"
        onChange={handleFile}
        aria-label="Seleccionar imagen desde galería"
        tabIndex={-1}
      />

      {/* Preview */}
      {value ? (
        <div className={`imgpicker__preview${round ? ' imgpicker__preview--round' : ''}`}>
          <img
            src={value}
            alt="Vista previa"
            className={`imgpicker__img${round ? ' imgpicker__img--round' : ''}`}
            loading="lazy"
          />
          <div className="imgpicker__overlay">
            <button
              type="button"
              className="imgpicker__change"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              aria-label="Cambiar imagen"
            >
              {uploading ? <span className="imgpicker__spin" /> : 'Cambiar'}
            </button>
            <button
              type="button"
              className="imgpicker__remove"
              onClick={handleRemove}
              disabled={uploading}
              aria-label="Eliminar imagen"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="imgpicker__btn"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label={label}
        >
          {uploading ? (
            <><span className="imgpicker__spin" /> Procesando…</>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {label}
            </>
          )}
        </button>
      )}

      {error && <p className="imgpicker__err" role="alert">{error}</p>}

      <p className="imgpicker__hint">
        JPG, PNG o WebP &middot; M&aacute;x. {maxMB} MB
      </p>
    </div>
  )
}

/* ── Helper ────────────────────────────────────────────── */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsDataURL(file)
  })
}

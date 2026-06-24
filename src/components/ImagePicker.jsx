/**
 * ImagePicker v2 — Galería + CropperJS
 *
 * Flujo completo:
 *   1. Usuario toca "Seleccionar imagen" → abre galería nativa del dispositivo
 *   2. Imagen seleccionada → abre modal de recorte con CropperJS
 *   3. Usuario recorta/ajusta → toca "Aplicar recorte"
 *   4. Imagen recortada se convierte a base64
 *   5. Se valida en el backend (tipo MIME + tamaño máx. 5 MB)
 *   6. Si OK → onChange(dataUrl) → imagen queda guardada en el formulario
 *
 * Bug fix v2: apiBase siempre requerido — nunca usar URL relativa en producción.
 *
 * Props:
 *   value     {string}  — URL actual (base64 data-URL o URL externa)
 *   onChange  {fn}      — (newUrl: string) => void
 *   apiBase   {string}  — URL completa del backend (VITE_API_URL)
 *   label     {string}  — Texto del botón de selección
 *   round     {bool}    — Preview circular (avatares de asesores)
 *   aspect    {number}  — Relación de aspecto del crop (default: 16/10 propiedades, 1 avatares)
 *   maxMB     {number}  — Límite de tamaño en MB (default: 5)
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import './ImagePicker.css'

// CropperJS cargado desde CDN (evita bundle pesado, disponible siempre)
const CROPPER_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css'
const CROPPER_JS  = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js'

/** Lazy-load CropperJS from CDN — only once */
let cropperLoaded   = false
let cropperLoading  = false
let cropperWaiters  = []

function loadCropper() {
  return new Promise((resolve, reject) => {
    if (cropperLoaded) { resolve(); return }

    cropperWaiters.push({ resolve, reject })
    if (cropperLoading) return
    cropperLoading = true

    // CSS
    if (!document.querySelector(`link[href="${CROPPER_CSS}"]`)) {
      const link = document.createElement('link')
      link.rel  = 'stylesheet'
      link.href = CROPPER_CSS
      document.head.appendChild(link)
    }

    // JS
    const script   = document.createElement('script')
    script.src     = CROPPER_JS
    script.onload  = () => {
      cropperLoaded  = true
      cropperLoading = false
      cropperWaiters.forEach(w => w.resolve())
      cropperWaiters = []
    }
    script.onerror = () => {
      cropperLoading = false
      cropperWaiters.forEach(w => w.reject(new Error('No se pudo cargar el editor de recorte.')))
      cropperWaiters = []
    }
    document.head.appendChild(script)
  })
}

/** Convert canvas to base64 data-URL at given quality */
function canvasToBase64(canvas, mimeType = 'image/jpeg', quality = 0.88) {
  return canvas.toDataURL(mimeType, quality)
}

/** Read a File object as data-URL */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Error al leer el archivo.'))
    reader.readAsDataURL(file)
  })
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ImagePicker({
  value,
  onChange,
  apiBase,
  label   = 'Seleccionar imagen',
  round   = false,
  aspect,
  maxMB   = 5,
}) {
  const fileInputRef  = useRef(null)
  const cropImgRef    = useRef(null)
  const cropperRef    = useRef(null)  // Cropper instance

  const [phase, setPhase]       = useState('idle')   // idle | cropping | uploading
  const [cropSrc, setCropSrc]   = useState('')        // data-URL for cropper
  const [origMime, setOrigMime] = useState('image/jpeg')
  const [error, setError]       = useState('')

  // Default aspect ratio: 1:1 for round (avatars), 16:10 for properties
  const cropAspect = aspect ?? (round ? 1 : 16 / 10)

  // ── Cleanup cropper on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy()
        cropperRef.current = null
      }
    }
  }, [])

  // ── Initialize CropperJS once the modal image is in the DOM ───────────────
  useEffect(() => {
    if (phase !== 'cropping' || !cropSrc || !cropImgRef.current) return

    // Destroy any previous instance
    if (cropperRef.current) {
      cropperRef.current.destroy()
      cropperRef.current = null
    }

    loadCropper()
      .then(() => {
        if (!cropImgRef.current) return
        // window.Cropper is the global from the CDN script
        cropperRef.current = new window.Cropper(cropImgRef.current, {
          aspectRatio:  cropAspect,
          viewMode:     1,          // Restrict crop box to canvas
          autoCropArea: 0.85,
          movable:      true,
          rotatable:    true,
          scalable:     true,
          zoomable:     true,
          guides:       true,
          center:       true,
          highlight:    false,
          background:   true,
          cropBoxMovable:   true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: true,
        })
      })
      .catch(err => {
        setError(err.message)
        setPhase('idle')
      })
  }, [phase, cropSrc, cropAspect])

  // ── Step 1: user picks a file ──────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileInputRef.current) fileInputRef.current.value = ''

    setError('')

    if (!file.type.startsWith('image/')) {
      setError('El archivo seleccionado no es una imagen válida.')
      return
    }
    if (file.size > maxMB * 1024 * 1024) {
      setError(`La imagen supera el límite de ${maxMB} MB.`)
      return
    }

    try {
      const dataUrl = await fileToDataUrl(file)
      setOrigMime(file.type || 'image/jpeg')
      setCropSrc(dataUrl)
      setPhase('cropping')
    } catch (err) {
      setError(err.message)
    }
  }

  // ── Step 2: user confirms crop ────────────────────────────────────────────
  const handleApplyCrop = useCallback(async () => {
    if (!cropperRef.current) return

    setError('')
    setPhase('uploading')

    try {
      // Get cropped canvas — output max 1200px wide for performance
      const canvas = cropperRef.current.getCroppedCanvas({
        maxWidth:  1200,
        maxHeight: 1200,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      })

      if (!canvas) throw new Error('No se pudo procesar la imagen.')

      // Use original MIME; fall back to jpeg for anything unusual
      const mime    = ['image/jpeg', 'image/png', 'image/webp'].includes(origMime)
        ? origMime
        : 'image/jpeg'
      const quality = mime === 'image/png' ? 1 : 0.88
      const dataUrl = canvasToBase64(canvas, mime, quality)

      // Check final size (post-crop)
      const base64Data = dataUrl.split(',')[1] || ''
      const byteSize   = Math.ceil(base64Data.length * 0.75)
      if (byteSize > maxMB * 1024 * 1024) {
        throw new Error(`La imagen recortada supera los ${maxMB} MB. Intenta con una imagen más pequeña.`)
      }

      // Validate + store on backend
      if (!apiBase) {
        throw new Error(
          'VITE_API_URL no está configurado. Revisa las variables de entorno en Railway.'
        )
      }

      const res  = await fetch(`${apiBase}/api/admin/upload-image`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ image: dataUrl }),
      })

      // Guard: session expired → reload to login
      if (res.status === 401) {
        throw new Error('Sesión expirada. Por favor vuelve a iniciar sesión.')
      }

      // Guard: if response is not JSON (e.g. HTML from wrong server), show clear error
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error(
          'El servidor devolvió una respuesta inesperada. ' +
          'Verifica que VITE_API_URL apunte al backend correcto en Railway.'
        )
      }

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar la imagen.')

      // Success — destroy cropper, notify parent
      cropperRef.current.destroy()
      cropperRef.current = null
      setCropSrc('')
      setPhase('idle')
      onChange(data.url)

    } catch (err) {
      setError(err.message)
      setPhase('cropping') // Go back to crop so user can retry
    }
  }, [apiBase, maxMB, onChange, origMime])

  // ── Cancel crop ────────────────────────────────────────────────────────────
  const handleCancelCrop = useCallback(() => {
    if (cropperRef.current) {
      cropperRef.current.destroy()
      cropperRef.current = null
    }
    setCropSrc('')
    setError('')
    setPhase('idle')
  }, [])

  // ── Remove current image ───────────────────────────────────────────────────
  const handleRemove = () => {
    onChange('')
    setError('')
  }

  const isBusy = phase === 'uploading'

  return (
    <>
      {/* ── File input (hidden) ────────────────────────────── */}
      <div className="imgpicker">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="imgpicker__input"
          onChange={handleFileChange}
          aria-label="Seleccionar imagen desde galería"
          tabIndex={-1}
        />

        {/* ── Current value preview ─────────────────────── */}
        {value && phase === 'idle' ? (
          <div className={`imgpicker__preview${round ? ' imgpicker__preview--round' : ''}`}>
            <img
              src={value}
              alt="Vista previa"
              className={`imgpicker__img${round ? ' imgpicker__img--round' : ''}`}
              loading="lazy"
            />
            <div className="imgpicker__overlay">
              <button type="button" className="imgpicker__change"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}>
                Cambiar
              </button>
              <button type="button" className="imgpicker__remove-btn"
                onClick={handleRemove}
                disabled={isBusy}>
                Quitar
              </button>
            </div>
          </div>
        ) : phase === 'idle' ? (
          /* ── Upload button (no image yet) ─────────────── */
          <button
            type="button"
            className="imgpicker__btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            aria-label={label}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            {label}
          </button>
        ) : null}

        {error && <p className="imgpicker__err" role="alert">{error}</p>}

        {phase === 'idle' && (
          <p className="imgpicker__hint">
            JPG, PNG o WebP &middot; M&aacute;x. {maxMB}&nbsp;MB
          </p>
        )}
      </div>

      {/* ── Crop Modal ─────────────────────────────────────── */}
      {(phase === 'cropping' || phase === 'uploading') && (
        <div className="crop-modal" role="dialog" aria-modal="true" aria-label="Recortar imagen">
          <div className="crop-modal__box">
            <div className="crop-modal__head">
              <h3 className="crop-modal__title">Ajustar imagen</h3>
              <button
                className="crop-modal__close"
                onClick={handleCancelCrop}
                disabled={isBusy}
                aria-label="Cancelar">
                &#x2715;
              </button>
            </div>

            {/* CropperJS target */}
            <div className="crop-modal__canvas">
              <img
                ref={cropImgRef}
                src={cropSrc}
                alt="Imagen para recortar"
                style={{ maxWidth: '100%', display: 'block' }}
              />
            </div>

            {/* Rotation helpers */}
            <div className="crop-modal__tools">
              <button type="button" className="crop-tool-btn"
                onClick={() => cropperRef.current?.rotate(-90)}
                disabled={isBusy}
                title="Rotar 90° izquierda">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/>
                </svg>
              </button>
              <button type="button" className="crop-tool-btn"
                onClick={() => cropperRef.current?.rotate(90)}
                disabled={isBusy}
                title="Rotar 90° derecha">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/>
                </svg>
              </button>
              <button type="button" className="crop-tool-btn"
                onClick={() => cropperRef.current?.scaleX(
                  cropperRef.current.getData().scaleX === -1 ? 1 : -1
                )}
                disabled={isBusy}
                title="Voltear horizontal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/>
                  <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/>
                  <path d="M12 20v2M12 14v2M12 8v2M12 2v2"/>
                </svg>
              </button>
              <button type="button" className="crop-tool-btn"
                onClick={() => cropperRef.current?.reset()}
                disabled={isBusy}
                title="Restablecer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
            </div>

            <p className="crop-modal__tip">
              Arrastra para mover &middot; Pellizca para hacer zoom &middot; Arrastra las esquinas para ajustar el recorte
            </p>

            <div className="crop-modal__actions">
              <button type="button" className="btn-outline"
                onClick={handleCancelCrop}
                disabled={isBusy}>
                Cancelar
              </button>
              <button type="button" className="btn btn-blue"
                onClick={handleApplyCrop}
                disabled={isBusy}>
                {isBusy
                  ? <><span className="imgpicker__spin" /> Guardando…</>
                  : 'Aplicar recorte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

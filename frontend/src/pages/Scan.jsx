import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ImagePlus, X, AlertCircle, ChevronLeft, Scan } from 'lucide-react'
import { predictScalp } from '../api/client.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import PageShell from '../components/PageShell.jsx'

export default function ScanPage({ setResult }) {
  const navigate    = useNavigate()
  const fileRef     = useRef(null)
  const dropRef     = useRef(null)

  const [preview,  setPreview]  = useState(null)
  const [file,     setFile]     = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [dragging, setDragging] = useState(false)

  /* ── Handle file selection ───────────────────────────────────────── */
  const handleFile = useCallback((f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, or WEBP).')
      return
    }
    setError(null)
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])

  const onInputChange = (e) => handleFile(e.target.files?.[0])

  /* ── Drag & drop ─────────────────────────────────────────────────── */
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true)  }
  const onDragLeave = ()  => setDragging(false)
  const onDrop      = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]) }

  /* ── Submit to backend ───────────────────────────────────────────── */
  const handleAnalyse = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const data = await predictScalp(file)
      setResult(data)
      navigate('/results')
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (err.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : 'Analysis failed. Make sure the backend is running.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const clearImage = () => {
    setPreview(null)
    setFile(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  /* ── Loading state ───────────────────────────────────────────────── */
  if (loading) {
    return (
      <PageShell hideNav>
        <div className="flex flex-col min-h-dvh items-center justify-center bg-stone-50">
          <LoadingSpinner />
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="w-9 h-9 rounded-2xl bg-stone-100 flex items-center justify-center">
          <ChevronLeft size={20} className="text-stone-600" />
        </button>
        <div>
          <h1 className="font-semibold text-stone-900">Scalp Scan</h1>
          <p className="text-xs text-stone-500">Upload a clear, well-lit photo</p>
        </div>
      </div>

      <div className="px-5 space-y-5 pb-8">
        {/* Tips banner */}
        <div className="bg-brand-50 border border-brand-200 rounded-3xl p-4">
          <p className="text-sm font-semibold text-brand-800 mb-2">📸 For best results</p>
          <ul className="text-xs text-brand-700 space-y-1">
            <li>• Ensure good lighting (natural light is ideal)</li>
            <li>• Part your hair to expose the scalp area</li>
            <li>• Hold the camera 10–15 cm from your scalp</li>
            <li>• Keep the image in focus and avoid blur</li>
          </ul>
        </div>

        {/* Upload zone */}
        <div
          ref={dropRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative rounded-4xl border-2 border-dashed transition-all duration-200 overflow-hidden
            ${dragging ? 'border-brand-500 bg-brand-50' : 'border-stone-200 bg-white'}
            ${preview ? 'border-solid border-brand-300' : ''}`}
          style={{ minHeight: 280 }}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="Scalp preview"
                className="w-full object-cover"
                style={{ maxHeight: 360 }}
              />
              {/* Overlay guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-44 h-44 rounded-full border-2 border-white/60 border-dashed" />
              </div>
              {/* Remove button */}
              <button
                onClick={clearImage}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/60 flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
              {/* File name */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="glass rounded-2xl px-3 py-2">
                  <p className="text-xs text-stone-700 truncate font-medium">{file?.name}</p>
                  <p className="text-xs text-stone-500">{file ? (file.size / 1024).toFixed(0) + ' KB' : ''}</p>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-brand-100 flex items-center justify-center">
                <ImagePlus size={28} className="text-brand-600" />
              </div>
              <div>
                <p className="font-semibold text-stone-700">Tap to upload image</p>
                <p className="text-sm text-stone-400 mt-1">or drag and drop here</p>
                <p className="text-xs text-stone-400 mt-2">JPEG · PNG · WEBP · max 10 MB</p>
              </div>
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onInputChange}
          className="hidden"
        />

        {/* Secondary upload button (when no preview) */}
        {!preview && (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 border border-stone-200 bg-white rounded-3xl py-3.5 text-sm font-medium text-stone-600 active:bg-stone-50 transition-colors"
          >
            <Upload size={16} />
            Choose from gallery
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-3xl p-4">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Analyse button */}
        <button
          onClick={handleAnalyse}
          disabled={!file}
          className={`w-full flex items-center justify-center gap-2.5 rounded-3xl py-4 font-semibold text-base transition-all duration-200
            ${file
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 active:scale-[0.98]'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
        >
          <Scan size={20} />
          Analyse Scalp
        </button>
      </div>
    </PageShell>
  )
}

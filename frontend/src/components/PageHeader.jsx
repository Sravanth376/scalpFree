import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

/**
 * Consistent page header with optional back button.
 *
 * @param {string}  title        – page title
 * @param {string}  subtitle     – optional subtitle line
 * @param {boolean} showBack     – show the back arrow (default true)
 * @param {string}  backTo       – route to navigate to (defaults to -1)
 */
export default function PageHeader({ title, subtitle, showBack = true, backTo }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-100">
      <div className="flex items-center gap-3 px-4 py-3">
        {showBack && (
          <button
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-300 transition-all active:scale-95"
          >
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-stone-800 truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-stone-400 truncate mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  )
}

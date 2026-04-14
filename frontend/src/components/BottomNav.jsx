import { NavLink } from 'react-router-dom'
import { Home, ScanLine, BookOpen, Settings } from 'lucide-react'

const NAV = [
  { to: '/',         icon: Home,     label: 'Home'     },
  { to: '/scan',     icon: ScanLine, label: 'Scan'     },
  { to: '/learn',    icon: BookOpen, label: 'Learn'    },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] glass border-t border-stone-200 pb-safe z-50">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-brand-600' : 'text-stone-400 hover:text-stone-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-brand-100' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                </span>
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

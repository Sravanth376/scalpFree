import { useState } from 'react'
import { Moon, Bell, ShieldCheck, FileText, ChevronRight } from 'lucide-react'
import PageShell from '../components/PageShell.jsx'

function Toggle({ value, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-brand-500' : 'bg-stone-200'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

export default function Settings() {
  const [dark, setDark]     = useState(false)
  const [notifs, setNotifs] = useState(true)

  const LINKS = [
    { icon: ShieldCheck, label: 'Privacy Policy',    href: '#' },
    { icon: FileText,    label: 'Terms of Service',  href: '#' },
  ]

  return (
    <PageShell>
      <div className="px-5 pt-14 pb-4">
        <h1 className="font-display text-2xl text-stone-900">Settings</h1>
        <p className="text-sm text-stone-500 mt-1">Preferences & information</p>
      </div>

      <div className="px-5 pb-8 space-y-5">
        {/* Preferences */}
        <section className="bg-white rounded-3xl border border-stone-100 shadow-sm divide-y divide-stone-100">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center">
                <Moon size={15} className="text-stone-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">Dark mode</p>
                <p className="text-xs text-stone-500">Coming soon</p>
              </div>
            </div>
            <Toggle value={dark} onChange={setDark} />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center">
                <Bell size={15} className="text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">Notifications</p>
                <p className="text-xs text-stone-500">Scan reminders</p>
              </div>
            </div>
            <Toggle value={notifs} onChange={setNotifs} />
          </div>
        </section>

        {/* About */}
        <section className="bg-white rounded-3xl border border-stone-100 shadow-sm divide-y divide-stone-100">
          {LINKS.map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center">
                  <Icon size={15} className="text-stone-600" />
                </div>
                <p className="text-sm font-medium text-stone-800">{label}</p>
              </div>
              <ChevronRight size={16} className="text-stone-400" />
            </a>
          ))}
        </section>

        {/* Version */}
        <div className="text-center">
          <p className="text-xs text-stone-400">ScalpFree v1.0.0</p>
          <p className="text-xs text-stone-400 mt-0.5">AI model: CNN + Multi-Head Attention · 10 classes</p>
        </div>
      </div>
    </PageShell>
  )
}

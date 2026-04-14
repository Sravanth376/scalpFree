import { useNavigate } from 'react-router-dom'
import { ScanLine, TrendingUp, Clock, ChevronRight, Sparkles } from 'lucide-react'
import PageShell from '../components/PageShell.jsx'

const RECENT = [
  { disease: 'Seborrheic Dermatitis', date: '2 days ago', confidence: '91%', color: 'bg-amber-100 text-amber-700' },
  { disease: 'Contact Dermatitis',    date: '1 week ago',  confidence: '87%', color: 'bg-blue-100 text-blue-700'  },
]

const TIPS = [
  { title: 'Rinse with cool water', body: 'Hot water strips natural oils and worsens inflammation.' },
  { title: 'Change pillowcase weekly', body: 'Oils and bacteria accumulate and can aggravate scalp conditions.' },
]

export default function Home() {
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <PageShell>
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-6 pt-14 pb-10 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-16 -right-4 w-24 h-24 rounded-full bg-white/5" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-brand-200 text-sm font-medium">{greeting}</p>
            <h1 className="font-display text-3xl mt-0.5">ScalpFree</h1>
            <p className="text-brand-200 text-sm mt-1">Your personal scalp health companion</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
        </div>

        {/* CTA card */}
        <button
          onClick={() => navigate('/scan')}
          className="mt-7 w-full bg-white text-brand-700 rounded-3xl px-5 py-4 flex items-center gap-4 shadow-xl shadow-brand-900/30 active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center shrink-0">
            <ScanLine size={24} className="text-brand-600" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold text-stone-800">Start New Scan</p>
            <p className="text-xs text-stone-500 mt-0.5">Upload a scalp photo for AI analysis</p>
          </div>
          <ChevronRight size={18} className="text-stone-400" />
        </button>
      </div>

      <div className="px-5 py-6 space-y-7">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl p-4 border border-stone-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center mb-3">
              <TrendingUp size={18} className="text-brand-600" />
            </div>
            <p className="text-2xl font-semibold text-stone-800">2</p>
            <p className="text-xs text-stone-500 mt-0.5">Total scans</p>
          </div>
          <div className="bg-white rounded-3xl p-4 border border-stone-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
              <Clock size={18} className="text-amber-600" />
            </div>
            <p className="text-2xl font-semibold text-stone-800">7d</p>
            <p className="text-xs text-stone-500 mt-0.5">Since last scan</p>
          </div>
        </div>

        {/* Recent activity */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-stone-800">Recent Activity</h2>
            <button className="text-brand-600 text-xs font-medium">See all</button>
          </div>
          <div className="space-y-2.5">
            {RECENT.map((item) => (
              <div key={item.disease} className="bg-white rounded-3xl p-4 border border-stone-100 shadow-sm flex items-center gap-3">
                <div className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${item.color}`}>
                  {item.confidence}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{item.disease}</p>
                  <p className="text-xs text-stone-400">{item.date}</p>
                </div>
                <ChevronRight size={16} className="text-stone-300 shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Daily tips */}
        <section>
          <h2 className="font-semibold text-stone-800 mb-3">Daily Tips</h2>
          <div className="space-y-2.5">
            {TIPS.map((tip) => (
              <div key={tip.title} className="bg-brand-50 rounded-3xl p-4 border border-brand-100">
                <p className="text-sm font-semibold text-brand-800">{tip.title}</p>
                <p className="text-xs text-brand-700 mt-0.5 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}

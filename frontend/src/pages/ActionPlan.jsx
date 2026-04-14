import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckSquare, Square, Phone, Apple, Ban } from 'lucide-react'
import PageShell from '../components/PageShell.jsx'

export default function ActionPlan({ result }) {
  const navigate = useNavigate()
  const [checked, setChecked] = useState({})

  const toggle = (key) => setChecked(p => ({ ...p, [key]: !p[key] }))

  const enjoyItems = result.diet?.find(d => d.category === 'enjoy')?.items || []
  const limitItems = result.diet?.find(d => d.category === 'limit')?.items || []

  return (
    <PageShell>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate('/results')} className="w-9 h-9 rounded-2xl bg-stone-100 flex items-center justify-center">
          <ChevronLeft size={20} className="text-stone-600" />
        </button>
        <div>
          <h1 className="font-semibold text-stone-900">Action Plan</h1>
          <p className="text-xs text-stone-500 truncate max-w-[220px]">{result.disease}</p>
        </div>
      </div>

      <div className="px-5 space-y-6 pb-8">
        {/* Diet section */}
        <section>
          <h2 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
            <Apple size={17} className="text-brand-600" />
            Diet Recommendations
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Enjoy */}
            <div className="bg-green-50 border border-green-200 rounded-3xl p-4">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">✅ Enjoy</p>
              <ul className="space-y-2">
                {enjoyItems.map((item) => (
                  <li key={item} className="text-xs text-green-800 flex items-start gap-1.5">
                    <span className="text-green-500 shrink-0 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Limit */}
            <div className="bg-red-50 border border-red-200 rounded-3xl p-4">
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-3">
                <Ban size={11} className="inline mr-1" />
                Limit
              </p>
              <ul className="space-y-2">
                {limitItems.map((item) => (
                  <li key={item} className="text-xs text-red-800 flex items-start gap-1.5">
                    <span className="text-red-400 shrink-0 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Weekly routine checklist */}
        <section>
          <h2 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
            <CheckSquare size={17} className="text-brand-600" />
            Weekly Routine
          </h2>
          <div className="space-y-3">
            {result.weekly_routine?.map((block) => (
              <div key={block.day} className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100">
                  <p className="text-xs font-semibold text-stone-600 uppercase tracking-wide">{block.day}</p>
                </div>
                <div className="px-4 py-3 space-y-2.5">
                  {block.tasks.map((task) => {
                    const key = `${block.day}-${task}`
                    return (
                      <button
                        key={task}
                        onClick={() => toggle(key)}
                        className="w-full flex items-start gap-3 text-left"
                      >
                        {checked[key]
                          ? <CheckSquare size={17} className="text-brand-500 shrink-0 mt-0.5" />
                          : <Square size={17} className="text-stone-300 shrink-0 mt-0.5" />
                        }
                        <span className={`text-sm leading-relaxed ${checked[key] ? 'line-through text-stone-400' : 'text-stone-700'}`}>
                          {task}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Specialist CTA */}
        <section className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-4xl p-6 text-white">
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
            <Phone size={22} />
          </div>
          <h3 className="font-display text-xl mb-1">Talk to a specialist</h3>
          <p className="text-brand-200 text-sm leading-relaxed mb-5">
            Based on your scan, we recommend consulting a <strong className="text-white">{result.specialist}</strong> for a professional evaluation and personalised treatment plan.
          </p>
          <a
            href="https://www.practo.com/dermatologist"
            target="_blank"
            rel="noreferrer"
            className="block text-center bg-white text-brand-700 font-semibold text-sm rounded-2xl py-3 active:opacity-90 transition-opacity"
          >
            Find a Dermatologist →
          </a>
        </section>

        {/* Rescan button */}
        <button
          onClick={() => navigate('/scan')}
          className="w-full border border-stone-200 bg-white rounded-3xl py-3.5 text-sm font-medium text-stone-600 active:bg-stone-50 transition-colors"
        >
          Start a New Scan
        </button>
      </div>
    </PageShell>
  )
}

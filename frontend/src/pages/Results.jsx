import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import PageShell from '../components/PageShell.jsx'

const SEVERITY_STYLE = {
  'Mild':              'bg-green-100  text-green-700  border-green-200',
  'Mild–Moderate':     'bg-amber-100  text-amber-700  border-amber-200',
  'Moderate':          'bg-orange-100 text-orange-700 border-orange-200',
  'Moderate–Severe':   'bg-red-100    text-red-700    border-red-200',
  'Chronic/Progressive':'bg-purple-100 text-purple-700 border-purple-200',
}

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100)
  const color = pct >= 80 ? '#107f69' : pct >= 60 ? '#d97706' : '#ef4444'
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-stone-500">
        <span>Confidence</span>
        <span className="font-semibold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

const TABS = ['Overview', 'Treatment', 'Lifestyle']

export default function Results({ result }) {
  const navigate   = useNavigate()
  const [tab, setTab] = useState('Overview')

  const severityClass = SEVERITY_STYLE[result.severity] || 'bg-stone-100 text-stone-600 border-stone-200'

  return (
    <PageShell>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate('/scan')} className="w-9 h-9 rounded-2xl bg-stone-100 flex items-center justify-center">
          <ChevronLeft size={20} className="text-stone-600" />
        </button>
        <div>
          <h1 className="font-semibold text-stone-900">Analysis Results</h1>
          <p className="text-xs text-stone-500">AI-powered diagnosis</p>
        </div>
      </div>

      <div className="px-5 space-y-5 pb-8">
        {/* Diagnosis card */}
        <div className="bg-white rounded-4xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 px-5 py-5 text-white">
            <p className="text-brand-200 text-xs font-medium uppercase tracking-widest mb-1">Detected Condition</p>
            <h2 className="font-display text-2xl leading-tight">{result.disease}</h2>
            <div className="mt-3">
              <ConfidenceBar value={result.confidence} />
            </div>
          </div>

          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${severityClass}`}>
                {result.severity}
              </span>
              <span className="text-xs text-stone-400">Severity</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Info size={13} />
              <span>See specialist: {result.specialist}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-3xl p-4">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            This is an AI-assisted analysis and <strong>not a medical diagnosis</strong>. Consult a qualified
            dermatologist before starting any treatment.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-stone-100 rounded-2xl p-1 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-200
                ${tab === t ? 'bg-white text-brand-700 shadow-sm' : 'text-stone-500'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'Overview' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-stone-100 p-5">
              <h3 className="font-semibold text-stone-800 mb-2">About this condition</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{result.overview}</p>
            </div>
            <div className="bg-white rounded-3xl border border-stone-100 p-5">
              <h3 className="font-semibold text-stone-800 mb-3">Common symptoms</h3>
              <ul className="space-y-2.5">
                {result.symptoms.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-stone-600">
                    <CheckCircle size={15} className="text-brand-500 shrink-0 mt-0.5" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            {/* All scores */}
            <div className="bg-white rounded-3xl border border-stone-100 p-5">
              <h3 className="font-semibold text-stone-800 mb-3">All predictions</h3>
              <div className="space-y-2.5">
                {result.all_scores.slice(0, 5).map(({ label, score }) => {
                  const pct = Math.round(score * 100)
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-xs text-stone-600 mb-1">
                        <span className={label === result.disease ? 'font-semibold text-brand-700' : ''}>{label}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${label === result.disease ? 'bg-brand-500' : 'bg-stone-300'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {tab === 'Treatment' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-stone-100 p-5">
              <h3 className="font-semibold text-stone-800 mb-3">Recommended treatments</h3>
              <ul className="space-y-3">
                {result.treatment.map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-brand-50 border border-brand-200 rounded-3xl p-4">
              <p className="text-sm font-semibold text-brand-800 mb-1">👨‍⚕️ Specialist to visit</p>
              <p className="text-sm text-brand-700">{result.specialist}</p>
            </div>
          </div>
        )}

        {tab === 'Lifestyle' && (
          <div className="bg-white rounded-3xl border border-stone-100 p-5">
            <h3 className="font-semibold text-stone-800 mb-3">Lifestyle recommendations</h3>
            <ul className="space-y-3">
              {result.lifestyle.map((l, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-stone-600">
                  <span className="text-base shrink-0">{['🌿','💧','🧘','🛌','🥗'][i % 5]}</span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action plan CTA */}
        <button
          onClick={() => navigate('/action-plan')}
          className="w-full bg-brand-600 text-white rounded-3xl py-4 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 active:scale-[0.98] transition-transform"
        >
          View Full Action Plan
          <ChevronRight size={18} />
        </button>
      </div>
    </PageShell>
  )
}

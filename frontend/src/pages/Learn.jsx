import { useState } from 'react'
import { Search } from 'lucide-react'
import PageShell from '../components/PageShell.jsx'

const DISEASES = [
  { name: 'Alopecia Areata',          icon: '🔵', tag: 'Autoimmune',   desc: 'Patchy hair loss caused by immune system attacking follicles.' },
  { name: 'Contact Dermatitis',        icon: '🔴', tag: 'Allergic',     desc: 'Scalp reaction to irritants or allergens in hair products.' },
  { name: 'Folliculitis',              icon: '🟠', tag: 'Bacterial',    desc: 'Infected hair follicles presenting as pus-filled bumps.' },
  { name: 'Head Lice',                 icon: '🟡', tag: 'Parasitic',    desc: 'Contagious infestation causing intense scalp itching.' },
  { name: 'Lichen Planus',             icon: '🟣', tag: 'Inflammatory', desc: 'Scarring alopecia with follicle destruction, progressive.' },
  { name: 'Male Pattern Baldness',     icon: '⚫', tag: 'Genetic',      desc: 'DHT-driven follicle miniaturisation in a predictable pattern.' },
  { name: 'Psoriasis',                 icon: '🔶', tag: 'Autoimmune',   desc: 'Thick silvery plaques from rapid skin cell turnover.' },
  { name: 'Ringworm',                  icon: '🟤', tag: 'Fungal',       desc: 'Dermatophyte infection causing scaly, circular hair-loss patches.' },
  { name: 'Seborrheic Dermatitis',     icon: '🟢', tag: 'Fungal',       desc: 'Malassezia-driven greasy flaking and scalp redness.' },
  { name: 'Telogen Effluvium',         icon: '🩶', tag: 'Physiological',desc: 'Diffuse shedding following stress, illness, or nutritional lack.' },
]

const TAG_COLORS = {
  Autoimmune:    'bg-blue-100   text-blue-700',
  Allergic:      'bg-pink-100   text-pink-700',
  Bacterial:     'bg-orange-100 text-orange-700',
  Parasitic:     'bg-yellow-100 text-yellow-700',
  Inflammatory:  'bg-purple-100 text-purple-700',
  Genetic:       'bg-stone-100  text-stone-600',
  Fungal:        'bg-green-100  text-green-700',
  Physiological: 'bg-sky-100    text-sky-700',
}

export default function Learn() {
  const [query, setQuery] = useState('')
  const filtered = DISEASES.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.tag.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <PageShell>
      <div className="px-5 pt-14 pb-4">
        <h1 className="font-display text-2xl text-stone-900">Disease Library</h1>
        <p className="text-sm text-stone-500 mt-1">Learn about the 10 scalp conditions ScalpFree detects</p>

        {/* Search */}
        <div className="relative mt-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            placeholder="Search conditions…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-colors"
          />
        </div>
      </div>

      <div className="px-5 pb-8 space-y-3">
        {filtered.map((d) => (
          <div key={d.name} className="bg-white rounded-3xl border border-stone-100 shadow-sm p-4 flex items-start gap-3">
            <span className="text-2xl shrink-0">{d.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-semibold text-stone-800 text-sm">{d.name}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[d.tag]}`}>
                  {d.tag}
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">{d.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

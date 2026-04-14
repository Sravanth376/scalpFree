/**
 * Full-screen loading overlay shown while the model is running inference.
 */
export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
      {/* Animated DNA-like spinner */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-brand-300 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '0.9s' }}
        />
        {/* Centre dot */}
        <div className="absolute inset-[30%] rounded-full bg-brand-500" />
      </div>

      <h2 className="font-display text-2xl text-stone-800 mb-2">Analysing your scalp…</h2>
      <p className="text-sm text-stone-400 text-center max-w-xs px-4">
        Our AI model is scanning patterns across 10 condition types. This takes a few seconds.
      </p>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-8">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

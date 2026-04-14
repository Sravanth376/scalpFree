export default function LoadingSpinner({ message = 'Analysing your scalp…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 px-8">
      {/* Animated rings */}
      <div className="relative w-20 h-20">
        <span className="absolute inset-0 rounded-full border-4 border-brand-100" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
        <span className="absolute inset-2 rounded-full border-4 border-transparent border-t-brand-300 animate-spin [animation-duration:1.4s]" />
        <span className="absolute inset-0 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-brand-600">
            <path d="M12 2C9 2 6.5 4.5 6.5 7.5C6.5 9.5 7.5 11.2 9 12.2V14H15V12.2C16.5 11.2 17.5 9.5 17.5 7.5C17.5 4.5 15 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M9 14V16C9 17.1 9.9 18 11 18H13C14.1 18 15 17.1 15 16V14" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 18V20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20V18" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </span>
      </div>
      <div className="text-center">
        <p className="text-stone-700 font-medium">{message}</p>
        <p className="text-stone-400 text-sm mt-1">AI is examining the image</p>
      </div>
      {/* Progress dots */}
      <div className="flex gap-1.5">
        {[0, 0.3, 0.6].map((delay, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  )
}

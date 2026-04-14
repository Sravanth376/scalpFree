import { useEffect, useRef } from 'react'

/**
 * Animated circular confidence gauge.
 * @param {number} value   – confidence 0–1
 * @param {number} size    – SVG diameter in px (default 120)
 */
export default function ConfidenceRing({ value = 0, size = 120 }) {
  const circleRef = useRef(null)

  const radius      = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset  = circumference * (1 - value)

  // Colour based on confidence
  const colour =
    value >= 0.8 ? '#107f69' :
    value >= 0.6 ? '#f59e0b' :
                   '#ef4444'

  useEffect(() => {
    const el = circleRef.current
    if (!el) return
    // Start from full offset (empty), animate to target
    el.style.strokeDashoffset = circumference
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)'
      el.style.strokeDashoffset = targetOffset
    })
  }, [value, circumference, targetOffset])

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="#e7e5e4"
          strokeWidth={6}
        />
        {/* Animated fill */}
        <circle
          ref={circleRef}
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={colour}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold" style={{ color: colour }}>
          {Math.round(value * 100)}%
        </span>
        <span className="text-[10px] text-stone-400 font-medium">match</span>
      </div>
    </div>
  )
}

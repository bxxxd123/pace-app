import { useEffect, useRef } from 'react'
import './TimeWheel.css'

interface Props {
  value: string // HH:mm
  onChange: (v: string) => void
  stepMinutes?: number
  compact?: boolean
}

const ITEM_H = 46

/** 滾輪時間選擇器：CSS scroll-snap 實作 */
export default function TimeWheel({ value, onChange, stepMinutes = 10, compact }: Props) {
  const options = buildOptions(stepMinutes)
  const ref = useRef<HTMLDivElement>(null)
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const suppress = useRef(false)

  // 初始與外部值變動時滾到定位
  useEffect(() => {
    const idx = options.indexOf(value)
    if (idx < 0 || !ref.current) return
    const target = idx * ITEM_H
    if (Math.abs(ref.current.scrollTop - target) > 2) {
      suppress.current = true
      ref.current.scrollTop = target
      setTimeout(() => (suppress.current = false), 120)
    }
  }, [value, options])

  const handleScroll = () => {
    if (suppress.current) return
    clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => {
      if (!ref.current) return
      const idx = Math.round(ref.current.scrollTop / ITEM_H)
      const v = options[Math.max(0, Math.min(options.length - 1, idx))]
      if (v && v !== value) onChange(v)
    }, 90)
  }

  return (
    <div className={`timewheel${compact ? ' timewheel-compact' : ''}`}>
      <div className="timewheel-highlight" />
      <div className="timewheel-scroll" ref={ref} onScroll={handleScroll}>
        <div className="timewheel-pad" />
        {options.map((t) => (
          <button
            key={t}
            className={`timewheel-item${t === value ? ' timewheel-current' : ''}`}
            onClick={() => onChange(t)}
          >
            {t}
          </button>
        ))}
        <div className="timewheel-pad" />
      </div>
    </div>
  )
}

/** 從 18:00 開始排 24 小時，讓晚間時段在前面 */
function buildOptions(step: number): string[] {
  const out: string[] = []
  for (let i = 0; i < (24 * 60) / step; i++) {
    const total = (18 * 60 + i * step) % (24 * 60)
    const h = String(Math.floor(total / 60)).padStart(2, '0')
    const m = String(total % 60).padStart(2, '0')
    out.push(`${h}:${m}`)
  }
  return out
}

import type { DreamRecord } from '../types'
import './DreamStrip.css'

function keyOf(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 近 7 天的夢境足跡：有記錄的那天用亮點標示，日期文字也會跟著變亮 */
export default function DreamStrip({ dreams }: { dreams: Record<string, DreamRecord> }) {
  const days: { label: string; hasDream: boolean }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({ label: `${d.getMonth() + 1}/${d.getDate()}`, hasDream: !!dreams[keyOf(d)] })
  }

  return (
    <div className="dreamstrip">
      {days.map((d, i) => (
        <div key={i} className="dreamstrip-day">
          <span className={`dreamstrip-dot${d.hasDream ? ' dreamstrip-dot-lit' : ''}`} />
          <span className={`dreamstrip-label${d.hasDream ? ' dreamstrip-label-lit' : ''}`}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

import type { SleepRecord } from '../types'
import './WaveChart.css'

const W = 310
const H = 120

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function hoursOf(r: SleepRecord): number | null {
  if (!r.actualSleep || !r.actualWake) return null
  let s = toMinutes(r.actualSleep)
  if (s < 12 * 60) s += 24 * 60
  return (toMinutes(r.actualWake) + 24 * 60 - s) / 60
}

/**
 * 近 14 天睡眠節奏波浪：睡得多＝波高。無座標軸、無數字，
 * 用平滑貝茲曲線把日子連成一條溫柔的波。
 */
export default function WaveChart({ records }: { records: Record<string, SleepRecord> }) {
  const days: { label: string; hours: number | null }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const r = records[key]
    days.push({ label: `${d.getMonth() + 1}/${d.getDate()}`, hours: r ? hoursOf(r) : null })
  }

  // 3–10 小時映射到波高；缺資料以左右鄰居內插（沒有鄰居則取中線）
  const ys = days.map((d, i) => {
    let h = d.hours
    if (h == null) {
      const prev = days.slice(0, i).reverse().find((x) => x.hours != null)?.hours
      const next = days.slice(i + 1).find((x) => x.hours != null)?.hours
      h = prev != null && next != null ? (prev + next) / 2 : (prev ?? next ?? 6.5)
    }
    const clamped = Math.max(3, Math.min(10, h))
    return H - 16 - ((clamped - 3) / 7) * (H - 40)
  })

  const step = W / (days.length - 1)
  const pts = ys.map((y, i) => ({ x: i * step, y }))
  let path = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cx = (pts[i - 1].x + pts[i].x) / 2
    path += ` C ${cx} ${pts[i - 1].y}, ${cx} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`
  }
  const area = `${path} L ${W} ${H} L 0 ${H} Z`

  return (
    <div className="wavechart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path d={area} fill="url(#wave-fill)" />
        <path d={path} fill="none" stroke="var(--lake)" strokeWidth="3" strokeLinecap="round" />
        <defs>
          <linearGradient id="wave-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--lake)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--lake)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="wavechart-labels">
        {days.map((d, i) => (
          <span key={i}>{i % 2 === 1 ? d.label : ''}</span>
        ))}
      </div>
    </div>
  )
}

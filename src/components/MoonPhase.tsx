import type { SleepRecord } from '../types'
import './MoonPhase.css'

type Phase = 'full' | 'gibbous' | 'half' | 'crescent'

const PHASE_TEXT: Record<Phase, string> = {
  full: '這週睡得很飽滿，像一輪滿月',
  gibbous: '這週大致安穩，月亮快圓了',
  half: '這週起起伏伏，一半一半',
  crescent: '這週辛苦了，月亮瘦瘦的也還是月亮',
}

/** 本週平均感受映射月相：不顯示數字，只給隱喻 */
export default function MoonPhase({ records }: { records: Record<string, SleepRecord> }) {
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const key = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const qualities = Object.values(records)
    .filter((r) => r.date >= key(weekAgo) && r.date <= key(now) && r.quality != null)
    .map((r) => r.quality!)

  const avg = qualities.length ? qualities.reduce((a, b) => a + b, 0) / qualities.length : 3
  const phase: Phase = avg >= 4 ? 'full' : avg >= 3 ? 'gibbous' : avg >= 2 ? 'half' : 'crescent'
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  const dateRange = `${fmt(weekAgo)} - ${fmt(now)}`

  return (
    <div className="moonphase">
      <MoonSvg phase={phase} />
      <div className="moonphase-text">
        <span className="moonphase-range">{dateRange}</span>
        <p>{PHASE_TEXT[phase]}</p>
      </div>
    </div>
  )
}

function MoonSvg({ phase }: { phase: Phase }) {
  // 以覆蓋圓的位移表現月相
  const offset = { full: 999, gibbous: 46, half: 30, crescent: 16 }[phase]
  return (
    <svg width="84" height="84" viewBox="0 0 84 84">
      <defs>
        <mask id={`moon-mask-${phase}`}>
          <rect width="84" height="84" fill="#fff" />
          {phase !== 'full' && <circle cx={42 - offset} cy="38" r="34" fill="#000" />}
        </mask>
      </defs>
      <circle cx="42" cy="42" r="34" fill="var(--lavender)" mask={`url(#moon-mask-${phase})`} />
      <circle cx="42" cy="42" r="34" fill="none" stroke="var(--lavender)" strokeOpacity="0.25" strokeWidth="2" />
    </svg>
  )
}

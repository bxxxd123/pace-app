import { useMemo } from 'react'
import { usePace } from '../store'
import { computeInsights } from '../engine/insights'
import WaveChart from '../components/WaveChart'
import MoonPhase from '../components/MoonPhase'
import DreamStrip from '../components/DreamStrip'
import Pet from '../components/Pet'
import { Card } from '../components/ui'
import './Records.css'

export default function Records() {
  const records = usePace((s) => s.records)
  const dreams = usePace((s) => s.dreams)
  const petName = usePace((s) => s.settings.petName)
  const openOverlay = usePace((s) => s.openOverlay)

  const hasData = Object.values(records).some((r) => r.quality != null)
  const insights = useMemo(() => computeInsights(records, dreams, new Date()), [records, dreams])

  // 夢境標籤氣泡雲：統計出現次數
  const tagCounts = useMemo(() => {
    const map = new Map<string, { count: number; kind: 'emotion' | 'theme' }>()
    for (const d of Object.values(dreams)) {
      for (const t of d.tags) {
        const cur = map.get(t.label)
        map.set(t.label, { count: (cur?.count ?? 0) + 1, kind: t.kind })
      }
    }
    return [...map.entries()].sort((a, b) => b[1].count - a[1].count)
  }, [dreams])

  if (!hasData) {
    return (
      <div className="records records-empty">
        <Pet pose="sleep" size={170} />
        <p>記錄幾天後，這裡會慢慢長出你的節奏</p>
      </div>
    )
  }

  return (
    <div className="records">
      <div className="records-scroll">
        <h1 className="records-title">我的節奏</h1>

        <Card className="records-card">
          <MoonPhase records={records} />
        </Card>

        <Card className="records-card records-card-wave" onClick={() => openOverlay('recordsDetail')}>
          <div className="records-card-wave-head">
            <span className="records-card-label">近兩週的睡眠波浪</span>
            <span className="records-card-arrow">›</span>
          </div>
          <WaveChart records={records} />
        </Card>

        <Card className="records-card records-card-wave" onClick={() => openOverlay('dreamMonth')}>
          <div className="records-card-wave-head">
            <span className="records-card-label">我的星空夢境本</span>
            <span className="records-card-arrow">›</span>
          </div>
          <DreamStrip dreams={dreams} />
        </Card>

        {insights.length > 0 && (
          <>
            <div className="records-divider" />
            <div className="records-insights-head">
              <h2 className="records-insights-title">{petName}的睡眠發現</h2>
              <Pet pose="lying" size={64} />
            </div>
          </>
        )}

        {insights.map((ins, i) => (
          <Card key={i} className={`records-card records-insight records-insight-${ins.kind}`}>
            <span className="records-insight-icon">
              {ins.kind === 'pattern' ? '🌙' : ins.kind === 'trend' ? '🌊' : '💭'}
            </span>
            <p>{ins.text}</p>
          </Card>
        ))}

        {tagCounts.length > 0 && (
          <Card className="records-card">
            <span className="records-card-label">最近的夢，長這樣</span>
            <div className="records-tags">
              {tagCounts.map(([label, { count, kind }]) => (
                <span
                  key={label}
                  className={`records-tag records-tag-${kind}${count >= 2 ? ' records-tag-big' : ''}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

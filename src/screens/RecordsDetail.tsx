import { usePace } from '../store'
import type { SleepRecord } from '../types'
import './RecordsDetail.css'

const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六']

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

/** 紀錄細節：藏在波浪圖下一層的簡易列表，給想看實際數字的人 */
export default function RecordsDetail() {
  const records = usePace((s) => s.records)

  const days: { key: string; label: string; record?: SleepRecord }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    days.push({ key, label: `${d.getMonth() + 1}/${d.getDate()} 週${WEEKDAY[d.getDay()]}`, record: records[key] })
  }

  return (
    <div className="records-detail">
      <h2 className="records-detail-title">近兩週紀錄</h2>
      <div className="records-detail-scroll">
        {days
          .slice()
          .reverse()
          .map((d) => {
            const hours = d.record ? hoursOf(d.record) : null
            return (
              <div key={d.key} className="records-detail-row">
                <span className="records-detail-date">{d.label}</span>
                {d.record?.actualSleep && d.record?.actualWake ? (
                  <>
                    <span className="records-detail-range">
                      {d.record.actualSleep} - {d.record.actualWake}
                    </span>
                    <span className="records-detail-hours">
                      {hours != null ? `${hours.toFixed(1)} 小時` : '—'}
                    </span>
                  </>
                ) : (
                  <span className="records-detail-empty">沒有紀錄</span>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

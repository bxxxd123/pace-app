import { useMemo, useState } from 'react'
import { usePace } from '../store'
import type { DreamRecord } from '../types'
import Pet from '../components/Pet'
import './DreamMonth.css'

const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六']

function dateKey(y: number, m: number, day: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** 我的星空夢境本：月曆亮燈 + 當月夢境卡片列表 */
export default function DreamMonth() {
  const dreams = usePace((s) => s.dreams)
  const openDreamFor = usePace((s) => s.openDreamFor)
  const [monthOffset, setMonthOffset] = useState(0)

  const base = new Date()
  base.setDate(1)
  base.setMonth(base.getMonth() + monthOffset)
  const year = base.getFullYear()
  const month = base.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startWeekday = new Date(year, month, 1).getDay()
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`

  const today = new Date()
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate())

  const monthDreams = useMemo(
    () =>
      Object.values(dreams)
        .filter((d) => d.date.startsWith(monthPrefix))
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [dreams, monthPrefix],
  )

  return (
    <div className="dreammonth">
      <div className="dreammonth-scroll">
        <div className="dreammonth-header">
          <button className="dreammonth-nav" onClick={() => setMonthOffset((o) => o - 1)} aria-label="上個月">
            ‹
          </button>
          <h2 className="dreammonth-title">
            {year}年{month + 1}月
          </h2>
          <button className="dreammonth-nav" onClick={() => setMonthOffset((o) => o + 1)} aria-label="下個月">
            ›
          </button>
        </div>

        <div className="dreammonth-weekdays">
          {WEEKDAY.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="dreammonth-grid">
          {Array.from({ length: startWeekday }).map((_, i) => (
            <span key={`empty-${i}`} className="dreammonth-cell dreammonth-cell-empty" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const key = dateKey(year, month, day)
            const lit = !!dreams[key]
            const todayCls = key === todayKey ? ' dreammonth-cell-today' : ''
            if (lit) {
              return (
                <a key={key} href={`#dream-${key}`} className={`dreammonth-cell dreammonth-cell-lit${todayCls}`}>
                  {day}
                </a>
              )
            }
            // 還沒記錄的日子（不含未來）：點一下跳去 F4 補記夢境
            return (
              <button
                key={key}
                type="button"
                className={`dreammonth-cell${todayCls}`}
                disabled={key > todayKey}
                onClick={() => openDreamFor(key)}
              >
                {day}
              </button>
            )
          })}
        </div>

        <h3 className="dreammonth-list-title">這個月的夢</h3>

        {monthDreams.length === 0 ? (
          <div className="dreammonth-empty">
            <Pet pose="sleep" size={110} />
            <p>這個月還沒有記下的夢</p>
          </div>
        ) : (
          <div className="dreammonth-cards">
            {monthDreams.map((d) => (
              <DreamCard key={d.date} dream={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DreamCard({ dream }: { dream: DreamRecord }) {
  const d = parseKey(dream.date)
  const label = `${d.getMonth() + 1}/${d.getDate()} 週${WEEKDAY[d.getDay()]}`
  return (
    <div id={`dream-${dream.date}`} className="dreammonth-card">
      <span className="dreammonth-card-date">{label}</span>
      <p className="dreammonth-card-text">{dream.text}</p>
      {dream.tags.length > 0 && (
        <div className="dreammonth-card-tags">
          {dream.tags.map((t) => (
            <span key={t.label} className={`dreammonth-tag dreammonth-tag-${t.kind}`}>
              {t.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

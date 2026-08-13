import type { SleepRecord, DreamRecord } from '../types'

export interface Insight {
  text: string
  kind: 'pattern' | 'trend' | 'dream'
}

const WEEKDAY = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** 就寢分鐘數（凌晨視為跨日，加 24h 方便比較） */
function bedtimeMinutes(r: SleepRecord): number | null {
  const t = r.actualSleep ?? r.plannedBedtime
  if (!t) return null
  const m = toMinutes(t)
  return m < 12 * 60 ? m + 24 * 60 : m
}

/** 睡眠時數 */
function sleepHours(r: SleepRecord): number | null {
  if (!r.actualSleep || !r.actualWake) return null
  const start = bedtimeMinutes(r)
  if (start == null) return null
  const end = toMinutes(r.actualWake) + 24 * 60
  return (end - start) / 60
}

const LATE_THRESHOLD = toMinutes('00:30') + 24 * 60

export function computeInsights(
  records: Record<string, SleepRecord>,
  dreams: Record<string, DreamRecord>,
  _today: Date,
): Insight[] {
  const list = Object.values(records).filter((r) => r.quality != null)
  if (list.length < 3) {
    return [{ text: '再記錄幾天，我就能慢慢看出你的節奏了。不急，慢慢來', kind: 'pattern' }]
  }

  const insights: Insight[] = []

  // ① 同一星期幾晚睡 ≥3 次
  const lateByWeekday = new Map<number, number>()
  for (const r of list) {
    const bm = bedtimeMinutes(r)
    if (bm != null && bm >= LATE_THRESHOLD) {
      const wd = new Date(`${r.date}T12:00:00`).getDay()
      lateByWeekday.set(wd, (lateByWeekday.get(wd) ?? 0) + 1)
    }
  }
  for (const [wd, count] of lateByWeekday) {
    if (count >= 3) {
      insights.push({ text: `這幾週你常在${WEEKDAY[wd]}晚睡，那天的行程是不是特別滿？`, kind: 'pattern' })
      break
    }
  }

  // ② 近 7 天 vs 前 7 天平均時數差 ≥30 分
  const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date))
  const recent = sorted.slice(-7).map(sleepHours).filter((h): h is number => h != null)
  const prev = sorted.slice(-14, -7).map(sleepHours).filter((h): h is number => h != null)
  if (recent.length >= 4 && prev.length >= 4) {
    const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
    const diff = avg(recent) - avg(prev)
    if (diff >= 0.5) {
      insights.push({ text: '這週的你，睡得比上週更足了一些。身體會謝謝你的', kind: 'trend' })
    } else if (diff <= -0.5) {
      insights.push({ text: '這週的睡眠比上週少了一點。沒關係，今晚可以早一點躺下試試', kind: 'trend' })
    }
  }

  // ③ 焦慮夢 × 低品質日共現 ≥2
  const anxiousBadDays = Object.values(dreams).filter(
    (d) => d.tags.some((t) => t.label === '焦慮') && (records[d.date]?.quality ?? 5) <= 2,
  )
  if (anxiousBadDays.length >= 2) {
    insights.push({ text: '有焦慮感的夢，常出現在比較累的日子。或許它們是身體在幫你說話', kind: 'dream' })
  }

  if (insights.length === 0) {
    insights.push({ text: '最近的節奏蠻穩定的，就照自己的步調繼續走吧', kind: 'pattern' })
  }
  return insights
}

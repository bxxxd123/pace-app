import type { TimeContext } from '../types'

/** 21:00–01:59 evening / 02:00–04:59 midnight / 05:00–10:59 morning / 其餘 day */
export function getTimeContext(now: Date, override?: TimeContext | null): TimeContext {
  if (override) return override
  const h = now.getHours()
  if (h >= 21 || h < 2) return 'evening'
  if (h < 5) return 'midnight'
  if (h < 11) return 'morning'
  return 'day'
}

/** 睡眠日：凌晨 05:00 前歸前一天 */
export function sleepDateFor(now: Date): string {
  const d = new Date(now)
  if (d.getHours() < 5) d.setDate(d.getDate() - 1)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** 起床時間晚於常態 ≥90 分鐘視為賴床 */
export function isLateWake(wakeTime: string, usual: string): boolean {
  return toMinutes(wakeTime) - toMinutes(usual) >= 90
}

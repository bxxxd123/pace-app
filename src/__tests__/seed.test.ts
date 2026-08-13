import { describe, it, expect } from 'vitest'
import { buildSeed } from '../seed'

const today = new Date('2026-07-19T12:00:00')

describe('buildSeed', () => {
  const { records, dreams } = buildSeed(today)
  const list = Object.values(records)

  it('產生 21 天記錄', () => {
    expect(list).toHaveLength(21)
  })

  it('每週三皆為晚睡低品質日（plannedBedtime 01:10、quality ≤ 2）', () => {
    const wednesdays = list.filter((r) => new Date(`${r.date}T12:00:00`).getDay() === 3)
    expect(wednesdays.length).toBeGreaterThanOrEqual(2)
    for (const w of wednesdays) {
      expect(w.plannedBedtime).toBe('01:10')
      expect(w.quality).toBeLessThanOrEqual(2)
    }
  })

  it('非週三日就寢時間落在 23:10–23:50、quality 3–5', () => {
    const others = list.filter((r) => new Date(`${r.date}T12:00:00`).getDay() !== 3)
    for (const r of others) {
      expect(r.plannedBedtime! >= '23:10' && r.plannedBedtime! <= '23:50').toBe(true)
      expect(r.quality).toBeGreaterThanOrEqual(3)
    }
  })

  it('至少 6 天含夢境，其中至少 2 筆焦慮夢落在 quality ≤ 2 的日子', () => {
    const dreamList = Object.values(dreams)
    expect(dreamList.length).toBeGreaterThanOrEqual(6)
    const anxiousOnBadDays = dreamList.filter(
      (d) =>
        d.tags.some((t) => t.label === '焦慮') &&
        (records[d.date]?.quality ?? 5) <= 2,
    )
    expect(anxiousOnBadDays.length).toBeGreaterThanOrEqual(2)
  })

  it('每筆記錄皆含 feelingWord 與起訖時間', () => {
    for (const r of list) {
      expect(r.feelingWord).toBeTruthy()
      expect(r.actualSleep).toBeTruthy()
      expect(r.actualWake).toBeTruthy()
    }
  })
})

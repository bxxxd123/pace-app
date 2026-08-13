import { describe, it, expect } from 'vitest'
import { computeInsights } from '../insights'
import { buildSeed } from '../../seed'

const today = new Date('2026-07-19T12:00:00')

describe('computeInsights', () => {
  it('seed 資料應產出「週三晚睡」模式洞察', () => {
    const { records, dreams } = buildSeed(today)
    const insights = computeInsights(records, dreams, today)
    expect(insights.some((i) => i.kind === 'pattern' && i.text.includes('週三'))).toBe(true)
  })

  it('seed 資料應產出夢境情緒關聯洞察', () => {
    const { records, dreams } = buildSeed(today)
    const insights = computeInsights(records, dreams, today)
    expect(insights.some((i) => i.kind === 'dream')).toBe(true)
  })

  it('不足 3 筆記錄時回單一鼓勵句', () => {
    const insights = computeInsights(
      { '2026-07-18': { date: '2026-07-18', quality: 4 } },
      {},
      today,
    )
    expect(insights).toHaveLength(1)
    expect(insights[0].text).toContain('記錄')
  })

  it('洞察文字不含數字評分', () => {
    const { records, dreams } = buildSeed(today)
    for (const i of computeInsights(records, dreams, today)) {
      expect(i.text).not.toMatch(/[0-9]+ ?分/)
    }
  })
})

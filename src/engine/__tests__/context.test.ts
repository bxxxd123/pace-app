import { describe, it, expect } from 'vitest'
import { getTimeContext, sleepDateFor, isLateWake } from '../context'

const at = (h: number, m: number) => new Date(2026, 6, 18, h, m)

describe('getTimeContext', () => {
  it.each([
    [20, 59, 'day'],
    [21, 0, 'evening'],
    [23, 30, 'evening'],
    [1, 59, 'evening'],
    [2, 0, 'midnight'],
    [4, 59, 'midnight'],
    [5, 0, 'morning'],
    [10, 59, 'morning'],
    [11, 0, 'day'],
    [15, 0, 'day'],
  ] as const)('%i:%i → %s', (h, m, expected) => {
    expect(getTimeContext(at(h, m))).toBe(expected)
  })

  it('override 優先於時刻', () => {
    expect(getTimeContext(at(15, 0), 'midnight')).toBe('midnight')
    expect(getTimeContext(at(15, 0), null)).toBe('day')
  })
})

describe('sleepDateFor', () => {
  it('凌晨 05:00 前歸前一天', () => {
    expect(sleepDateFor(new Date(2026, 6, 18, 1, 30))).toBe('2026-07-17')
    expect(sleepDateFor(new Date(2026, 6, 18, 4, 59))).toBe('2026-07-17')
  })
  it('05:00 起算當天', () => {
    expect(sleepDateFor(new Date(2026, 6, 18, 5, 0))).toBe('2026-07-18')
    expect(sleepDateFor(new Date(2026, 6, 18, 23, 0))).toBe('2026-07-18')
  })
})

describe('isLateWake', () => {
  it('晚於常態 90 分鐘（含）為賴床', () => {
    expect(isLateWake('08:30', '07:00')).toBe(true)
    expect(isLateWake('08:29', '07:00')).toBe(false)
    expect(isLateWake('07:00', '07:00')).toBe(false)
  })
})

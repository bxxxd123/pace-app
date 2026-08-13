import { describe, it, expect } from 'vitest'
import { feelingWord, suggestBedtime } from '../feeling'
import type { OnboardingAnswers } from '../../types'

describe('feelingWord', () => {
  it.each([
    [5, '深沉的一夜'],
    [4, '睡得不錯'],
    [3, '普普通通，也沒關係'],
    [2, '有點累的早晨'],
    [1, '辛苦了，昨晚不太好睡'],
  ] as const)('quality %i（時數充足）→ %s', (q, word) => {
    expect(feelingWord(q, 7.5)).toBe(word)
  })

  it('睡不足 6 小時往下降一級', () => {
    expect(feelingWord(5, 5.5)).toBe('睡得不錯')
    expect(feelingWord(3, 5.5)).toBe('有點累的早晨')
  })

  it('quality 1 睡不足時維持最底級', () => {
    expect(feelingWord(1, 4)).toBe('辛苦了，昨晚不太好睡')
  })
})

describe('suggestBedtime', () => {
  const base: OnboardingAnswers = {
    usualBedtime: '23:30',
    mainStruggle: '難入睡',
    chronotype: '早鳥',
  }

  it('一般情況：常態時間提前 20 分鐘', () => {
    expect(suggestBedtime(base)).toBe('23:10')
  })

  it('夜貓不提前', () => {
    expect(suggestBedtime({ ...base, chronotype: '夜貓' })).toBe('23:30')
  })

  it('跨午夜正確計算', () => {
    expect(suggestBedtime({ ...base, usualBedtime: '00:10' })).toBe('23:50')
  })
})

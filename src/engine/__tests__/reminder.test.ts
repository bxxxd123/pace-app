import { describe, it, expect } from 'vitest'
import { detectNegative, reminderMessage } from '../reminder'

describe('detectNegative', () => {
  it('命中疲憊/負面詞', () => {
    expect(detectNegative('今天好累喔')).toBe(true)
    expect(detectNegative('壓力有點大')).toBe(true)
    expect(detectNegative('就是睡不著')).toBe(true)
  })
  it('一般句子不命中', () => {
    expect(detectNegative('今天還不錯')).toBe(false)
    expect(detectNegative('')).toBe(false)
  })
})

describe('reminderMessage', () => {
  it('normal 語氣三層文案各不相同且不含數字評分', () => {
    const l1 = reminderMessage(1, 'normal')
    const l2 = reminderMessage(2, 'normal')
    const l3 = reminderMessage(3, 'normal')
    expect(new Set([l1, l2, l3]).size).toBe(3)
    expect(l1).toContain('幾點睡')
    expect(l3).toContain('休息')
  })

  it('gentle 語氣時 L2 直接降級為 L3 關心文案', () => {
    expect(reminderMessage(2, 'gentle')).toBe(reminderMessage(3, 'gentle'))
    expect(reminderMessage(1, 'gentle')).not.toBe(reminderMessage(3, 'gentle'))
  })
})

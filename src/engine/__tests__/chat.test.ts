import { describe, it, expect } from 'vitest'
import { chatReply } from '../chat'

describe('chatReply', () => {
  it('壓力/工作關鍵字有專屬回應', () => {
    const r = chatReply('工作壓力好大', 'evening')
    expect(r).toContain('負荷')
  })

  it('睡不著關鍵字有專屬回應', () => {
    const r = chatReply('我睡不著', 'evening')
    expect(r).toContain('不是你的錯')
  })

  it('midnight 情境任何輸入都優先回安撫語', () => {
    const r = chatReply('工作壓力好大', 'midnight')
    expect(r).toContain('呼吸')
  })

  it('無匹配時回通用暖回應（輪替不重複連續兩句）', () => {
    const a = chatReply('嗯', 'day')
    const b = chatReply('嗯', 'day')
    expect(a).toBeTruthy()
    expect(b).toBeTruthy()
    expect(a).not.toBe(b)
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { load, persist, clearStorage } from '../storage'
import type { SleepRecord, Settings } from '../types'

const record: SleepRecord = { date: '2026-07-18', quality: 4, feelingWord: '還算安穩' }
const settings: Settings = {
  reminderTime: '22:30',
  toneLevel: 'gentle',
  notifications: true,
  petName: '咘咘',
  userName: '',
}

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    clearStorage()
  })

  it('persist 後 load 可還原 records 與 settings', () => {
    persist({ records: { '2026-07-18': record }, settings })
    const loaded = load()
    expect(loaded.records?.['2026-07-18']).toEqual(record)
    expect(loaded.settings).toEqual(settings)
  })

  it('localStorage 拋錯時退化為記憶體模式，persist/load 仍可運作', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => persist({ records: { '2026-07-18': record } })).not.toThrow()
    const loaded = load()
    expect(loaded.records?.['2026-07-18']).toEqual(record)
    setSpy.mockRestore()
    getSpy.mockRestore()
  })
})

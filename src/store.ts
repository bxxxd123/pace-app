import { create } from 'zustand'
import type { TimeContext, SleepRecord, DreamRecord, DreamTag, Settings, OnboardingAnswers } from './types'
import { load, persist, clearStorage } from './storage'
import { buildSeed } from './seed'

export type Tab = 'home' | 'records' | 'settings'
export type OverlayName = null | 'onboarding' | 'bedtime' | 'wake' | 'chat' | 'dream' | 'dreamTags' | 'recordsDetail' | 'dreamMonth'

export interface PaceState {
  records: Record<string, SleepRecord>
  dreams: Record<string, DreamRecord>
  settings: Settings
  onboarding: OnboardingAnswers | null
  reminderLayer: 0 | 1 | 2 | 3
  pendingDream: boolean
  tab: Tab
  overlay: OverlayName
  /** 從夢境本日曆點選補記的目標日期；null 代表一般（今晚）流程 */
  dreamDate: string | null
  demo: { contextOverride: TimeContext | null; lateWake: boolean }

  setTab: (tab: Tab) => void
  openOverlay: (o: Exclude<OverlayName, null>) => void
  closeOverlay: () => void
  openDreamFor: (date: string) => void
  finishDream: () => void
  saveWake: (date: string, sleep: string, wake: string, quality: 1 | 2 | 3 | 4 | 5, feelingWord: string) => void
  saveDream: (date: string, text: string, tags: DreamTag[]) => void
  setPendingDream: (v: boolean) => void
  setSettings: (patch: Partial<Settings>) => void
  setOnboarding: (a: OnboardingAnswers) => void
  advanceReminder: () => void
  resetReminder: () => void
  setSoftReminder: () => void
  setContextOverride: (c: TimeContext | null) => void
  setLateWake: (v: boolean) => void
  loadSeed: () => void
  resetAll: () => void
}

const DEFAULT_SETTINGS: Settings = {
  reminderTime: '22:30',
  toneLevel: 'normal',
  notifications: true,
  petName: '咘咘',
  userName: '',
}

const saved = load()

export const usePace = create<PaceState>()((set) => ({
  records: saved.records ?? {},
  dreams: saved.dreams ?? {},
  settings: { ...DEFAULT_SETTINGS, ...saved.settings },
  onboarding: saved.onboarding ?? null,
  reminderLayer: 0,
  pendingDream: saved.pendingDream ?? false,
  tab: 'home',
  overlay: null,
  dreamDate: null,
  demo: { contextOverride: null, lateWake: false },

  setTab: (tab) => set({ tab }),
  openOverlay: (overlay) => set({ overlay }),
  closeOverlay: () => set({ overlay: null, dreamDate: null }),
  openDreamFor: (date) => set({ dreamDate: date, overlay: 'dream' }),
  // 補記流程結束後回到夢境本月曆；一般流程則直接關閉
  finishDream: () => set((s) => ({ overlay: s.dreamDate ? 'dreamMonth' : null, dreamDate: null })),
  saveWake: (date, sleep, wake, quality, feelingWord) =>
    set((s) => ({
      records: {
        ...s.records,
        [date]: { ...s.records[date], date, actualSleep: sleep, actualWake: wake, quality, feelingWord },
      },
      pendingDream: true,
    })),
  saveDream: (date, text, tags) =>
    set((s) => ({
      dreams: { ...s.dreams, [date]: { date, text, tags } },
      pendingDream: false,
    })),
  setPendingDream: (pendingDream) => set({ pendingDream }),
  setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
  setOnboarding: (onboarding) => set({ onboarding }),
  advanceReminder: () =>
    set((s) => ({ reminderLayer: Math.min(3, s.reminderLayer + 1) as 0 | 1 | 2 | 3 })),
  resetReminder: () => set({ reminderLayer: 0 }),
  // 偵測到疲憊/負面情緒：語氣直接轉為關心（Layer 3），不再催促
  setSoftReminder: () => set({ reminderLayer: 3 }),
  setContextOverride: (contextOverride) => set((s) => ({ demo: { ...s.demo, contextOverride } })),
  setLateWake: (lateWake) => set((s) => ({ demo: { ...s.demo, lateWake } })),
  loadSeed: () => {
    const { records, dreams } = buildSeed(new Date())
    set((s) => ({
      records: { ...records, ...s.records },
      dreams: { ...dreams, ...s.dreams },
    }))
  },
  resetAll: () => {
    clearStorage()
    set({
      records: {},
      dreams: {},
      settings: DEFAULT_SETTINGS,
      onboarding: null,
      reminderLayer: 0,
      pendingDream: false,
      tab: 'home',
      overlay: 'onboarding',
      dreamDate: null,
      demo: { contextOverride: null, lateWake: false },
    })
  },
}))

// dev 除錯用：console 可直接操作 store
if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).pace = usePace
}

// 任何資料變動即持久化
usePace.subscribe((s) => {
  persist({
    records: s.records,
    dreams: s.dreams,
    settings: s.settings,
    onboarding: s.onboarding,
    pendingDream: s.pendingDream,
  })
})

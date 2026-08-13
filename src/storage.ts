import type { SleepRecord, DreamRecord, Settings, OnboardingAnswers } from './types'

export interface PersistedState {
  records?: Record<string, SleepRecord>
  dreams?: Record<string, DreamRecord>
  settings?: Settings
  onboarding?: OnboardingAnswers | null
  pendingDream?: boolean
}

const KEY = 'pace:state'

// localStorage 不可用時的記憶體退路
let memory: string | null = null

export function persist(state: PersistedState): void {
  const json = JSON.stringify(state)
  memory = json
  try {
    localStorage.setItem(KEY, json)
  } catch {
    /* 退化為記憶體模式 */
  }
}

export function load(): PersistedState {
  let json: string | null = null
  try {
    json = localStorage.getItem(KEY)
  } catch {
    /* 退化為記憶體模式 */
  }
  json ??= memory
  if (!json) return {}
  try {
    return JSON.parse(json) as PersistedState
  } catch {
    return {}
  }
}

export function clearStorage(): void {
  memory = null
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

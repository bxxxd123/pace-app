export type TimeContext = 'evening' | 'midnight' | 'morning' | 'day'

export interface SleepRecord {
  date: string // YYYY-MM-DD，睡眠日（凌晨歸前一天）
  plannedBedtime?: string
  actualSleep?: string
  actualWake?: string
  quality?: 1 | 2 | 3 | 4 | 5
  feelingWord?: string
}

export interface DreamTag {
  label: string
  kind: 'emotion' | 'theme'
}

export interface DreamRecord {
  date: string
  text: string
  tags: DreamTag[]
}

export interface Settings {
  reminderTime: string
  toneLevel: 'gentle' | 'normal'
  notifications: boolean
  petName: string
  userName: string
}

export interface OnboardingAnswers {
  usualBedtime: string
  mainStruggle: '難入睡' | '睡不飽' | '作息亂' | '壓力大'
  chronotype: '夜貓' | '早鳥' | '不一定'
}

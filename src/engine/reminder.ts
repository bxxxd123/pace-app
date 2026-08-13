import type { Settings } from '../types'

export const NEGATIVE_WORDS = [
  '累', '疲憊', '煩', '壓力', '焦慮', '難過', '睡不著', '心情不好', '撐不住', '好忙',
]

export function detectNegative(text: string): boolean {
  return NEGATIVE_WORDS.some((w) => text.includes(w))
}

const MESSAGES: Record<1 | 2 | 3, string> = {
  1: '夜深了，想好今晚幾點睡了嗎？',
  2: '還在忙嗎？留一點時間給自己休息吧',
  3: '感覺你今天累了。不勉強記錄，好好休息就好 💙',
}

/** 分層提醒：gentle 語氣下 L2 直接降級為 L3 的關心文案 */
export function reminderMessage(layer: 1 | 2 | 3, tone: Settings['toneLevel']): string {
  if (tone === 'gentle' && layer === 2) return MESSAGES[3]
  return MESSAGES[layer]
}

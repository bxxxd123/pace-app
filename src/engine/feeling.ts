import type { OnboardingAnswers } from '../types'

const WORDS: Record<1 | 2 | 3 | 4 | 5, string> = {
  5: '深沉的一夜',
  4: '睡得不錯',
  3: '普普通通，也沒關係',
  2: '有點累的早晨',
  1: '辛苦了，昨晚不太好睡',
}

/** 感受詞：介面永不顯示數字，只給這句話。睡不足 6 小時往下降一級。 */
export function feelingWord(quality: 1 | 2 | 3 | 4 | 5, hours: number): string {
  const level = hours < 6 ? Math.max(1, quality - 1) : quality
  return WORDS[level as 1 | 2 | 3 | 4 | 5]
}

/** 建議入睡時間：常態提前 20 分鐘；夜貓不勉強提前 */
export function suggestBedtime(o: OnboardingAnswers): string {
  if (o.chronotype === '夜貓') return o.usualBedtime
  const [h, m] = o.usualBedtime.split(':').map(Number)
  const total = (h * 60 + m - 20 + 24 * 60) % (24 * 60)
  const hh = String(Math.floor(total / 60)).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

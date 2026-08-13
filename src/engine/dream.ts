import type { DreamTag } from '../types'

interface TagRule {
  pattern: RegExp
  label: string
  kind: DreamTag['kind']
}

const RULES: TagRule[] = [
  // 情緒
  { pattern: /追|逃|怕|黑|考試|遲到|找不到/, label: '焦慮', kind: 'emotion' },
  { pattern: /飛|笑|朋友|玩|好玩|開心/, label: '開心', kind: 'emotion' },
  { pattern: /忘|模糊|不記得|好像/, label: '模糊', kind: 'emotion' },
  // 主題
  { pattern: /工作|老闆|同事|會議|辦公/, label: '工作', kind: 'theme' },
  { pattern: /家人|朋友|同學|媽|爸/, label: '人物', kind: 'theme' },
  { pattern: /追|逃/, label: '追逐', kind: 'theme' },
  { pattern: /飛/, label: '飛行', kind: 'theme' },
]

/** 夢境標籤化：關鍵字比對，自我覺察用，不做解夢 */
export function tagDream(text: string): DreamTag[] {
  const tags: DreamTag[] = []
  for (const rule of RULES) {
    if (rule.pattern.test(text) && !tags.some((t) => t.label === rule.label)) {
      tags.push({ label: rule.label, kind: rule.kind })
    }
  }
  if (!tags.some((t) => t.kind === 'emotion')) {
    tags.unshift({ label: '平靜', kind: 'emotion' })
  }
  return tags
}

/** F5 可加選的固定標籤清單 */
export const TAG_CHOICES: DreamTag[] = [
  { label: '焦慮', kind: 'emotion' },
  { label: '開心', kind: 'emotion' },
  { label: '平靜', kind: 'emotion' },
  { label: '模糊', kind: 'emotion' },
  { label: '工作', kind: 'theme' },
  { label: '人物', kind: 'theme' },
  { label: '追逐', kind: 'theme' },
  { label: '飛行', kind: 'theme' },
]

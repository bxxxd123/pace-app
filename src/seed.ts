import type { SleepRecord, DreamRecord, DreamTag } from './types'

const FEELING: Record<number, string> = {
  5: '深沉的一夜',
  4: '睡得不錯',
  3: '普普通通，也沒關係',
  2: '有點累的早晨',
  1: '辛苦了，昨晚不太好睡',
}

interface DreamSeed {
  text: string
  tags: DreamTag[]
  onBadDay: boolean // true = 安插在週三（低品質日）
}

const DREAMS: DreamSeed[] = [
  {
    text: '夢到被老闆追著跑，怎麼跑都跑不動',
    tags: [{ label: '焦慮', kind: 'emotion' }, { label: '工作', kind: 'theme' }, { label: '追逐', kind: 'theme' }],
    onBadDay: true,
  },
  {
    text: '在會議室找不到自己的位子，大家都在看我',
    tags: [{ label: '焦慮', kind: 'emotion' }, { label: '工作', kind: 'theme' }],
    onBadDay: true,
  },
  {
    text: '和朋友在海邊玩水，天氣很好',
    tags: [{ label: '開心', kind: 'emotion' }, { label: '人物', kind: 'theme' }],
    onBadDay: false,
  },
  {
    text: '飛在城市上空，看到好多屋頂',
    tags: [{ label: '開心', kind: 'emotion' }, { label: '飛行', kind: 'theme' }],
    onBadDay: false,
  },
  {
    text: '好像有夢到什麼，但醒來就忘了',
    tags: [{ label: '模糊', kind: 'emotion' }],
    onBadDay: false,
  },
  {
    text: '回到老家，家人都在，安安靜靜吃了一頓飯',
    tags: [{ label: '平靜', kind: 'emotion' }, { label: '人物', kind: 'theme' }],
    onBadDay: false,
  },
  {
    text: '夢到在海邊撿貝殼，撿到一半天就亮了',
    tags: [{ label: '平靜', kind: 'emotion' }],
    onBadDay: false,
  },
  {
    text: '夢到在飛，看到城市的燈光',
    tags: [{ label: '開心', kind: 'emotion' }, { label: '飛行', kind: 'theme' }],
    onBadDay: false,
  },
]

function fmt(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** 產生 today（不含）之前 21 天的擬真資料；週三固定晚睡低品質 */
export function buildSeed(today: Date): {
  records: Record<string, SleepRecord>
  dreams: Record<string, DreamRecord>
} {
  const records: Record<string, SleepRecord> = {}
  const dreams: Record<string, DreamRecord> = {}
  const badDays: string[] = []
  const goodDays: string[] = []

  for (let i = 21; i >= 1; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const date = fmt(d)
    const isWed = d.getDay() === 3
    // 以日期字元和決定變化量，固定可重現
    const jitter = (d.getDate() * 7) % 5 // 0–4

    if (isWed) {
      const quality = (jitter % 2 === 0 ? 1 : 2) as 1 | 2
      records[date] = {
        date,
        plannedBedtime: '01:10',
        actualSleep: '01:32',
        actualWake: '07:45',
        quality,
        feelingWord: FEELING[quality],
      }
      badDays.push(date)
    } else {
      const quality = (3 + (jitter % 3)) as 3 | 4 | 5
      const minute = 10 + jitter * 10 // 10–50
      records[date] = {
        date,
        plannedBedtime: `23:${minute}`,
        actualSleep: `23:${Math.min(minute + 8, 59)}`,
        actualWake: quality >= 4 ? '07:10' : '07:40',
        quality,
        feelingWord: FEELING[quality],
      }
      goodDays.push(date)
    }
  }

  let bad = 0
  let good = 0
  for (const seedDream of DREAMS) {
    const date = seedDream.onBadDay ? badDays[bad++] : goodDays[good * 3 + 1]
    if (!seedDream.onBadDay) good++
    if (!date) continue
    dreams[date] = { date, text: seedDream.text, tags: seedDream.tags }
  }

  return { records, dreams }
}

import type { TimeContext } from '../types'

interface Rule {
  pattern: RegExp
  replies: string[]
}

const MIDNIGHT_REPLIES = [
  '我在，慢慢呼吸。不用想著要馬上睡回去，放鬆躺著就很好了',
  '半夜醒來很正常，別擔心。跟著我慢慢呼吸，吸——吐——',
]

const RULES: Rule[] = [
  {
    pattern: /壓力|工作|忙|加班|老闆/,
    replies: [
      '聽起來今天負荷不小。要不要把其中一件事說給我聽？說出來有時就輕一點了',
      '工作的事情放不下來嗎？沒關係，它們明天還在，但今晚是你自己的',
    ],
  },
  {
    pattern: /睡不著|失眠|睡不好/,
    replies: [
      '沒關係，睡不著的夜晚不是你的錯。要不要試試把燈調暗，跟我聊聊今天有什麼掛在心上？',
      '不是你的錯，只是身體還沒準備好。我們可以先不想「睡」這件事，聊點別的',
    ],
  },
  {
    pattern: /累|疲憊|撐不住/,
    replies: [
      '辛苦了。累的時候不用逼自己做什麼，能躺著就是一種休息',
      '今天真的辛苦了。把重量放下來一點點，剩下的交給睡眠吧',
    ],
  },
  {
    pattern: /難過|心情不好|低落|想哭/,
    replies: [
      '我聽著呢。難過的感覺不需要馬上被解決，先讓它待一會兒也可以',
      '謝謝你願意說出來。今天也還好，有這種心情也還好',
    ],
  },
  {
    pattern: /還不錯|開心|很好|不錯/,
    replies: [
      '太好了，聽到這個我也開心。希望今晚也睡得穩穩的',
      '真好。把這個好心情帶進被窩裡吧',
    ],
  },
]

const DEFAULT_REPLIES = [
  '嗯嗯，我在聽。想說什麼都可以，不急',
  '謝謝你跟我說。今天也辛苦了',
  '好，我記下了。無論如何，今晚好好休息',
]

// 輪替索引（模組層級，讓連續 default 回覆不重複）
let defaultIdx = 0
let ruleIdx = 0
let midnightIdx = 0

export function chatReply(text: string, ctx: TimeContext): string {
  if (ctx === 'midnight') {
    return MIDNIGHT_REPLIES[midnightIdx++ % MIDNIGHT_REPLIES.length]
  }
  for (const rule of RULES) {
    if (rule.pattern.test(text)) {
      return rule.replies[ruleIdx++ % rule.replies.length]
    }
  }
  return DEFAULT_REPLIES[defaultIdx++ % DEFAULT_REPLIES.length]
}

const TIP_PAIRS: [string, string][] = [
  ['中午找個時間小睡一下吧～上班加油！', '今天可以挑戰 12 點前就躺下'],
  ['起床後曬點陽光，晚上會更好睡', '午後盡量少喝咖啡，今晚會謝謝你的'],
]

/** 每天固定給兩句小建議（依日期輪替） */
export function dailyTips(date: Date): [string, string] {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
  )
  return TIP_PAIRS[dayOfYear % TIP_PAIRS.length]
}

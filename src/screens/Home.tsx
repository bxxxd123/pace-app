import type { ReactNode } from 'react'
import { usePace } from '../store'
import { getTimeContext, sleepDateFor } from '../engine/context'
import { dailyTips } from '../engine/tips'
import Pet, { type PetPose } from '../components/Pet'
import Scenery, { type SceneryVariant } from '../components/Scenery'
import { Card, PrimaryButton, GhostButton } from '../components/ui'
import type { TimeContext } from '../types'
import './Home.css'

const SCENE: Record<TimeContext, SceneryVariant> = {
  evening: 'night',
  midnight: 'midnight',
  morning: 'morning',
  day: 'morning',
}

function formatDate(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()} 天氣晴`
}

export default function Home() {
  const records = usePace((s) => s.records)
  const dreams = usePace((s) => s.dreams)
  const settings = usePace((s) => s.settings)
  const pendingDream = usePace((s) => s.pendingDream)
  const contextOverride = usePace((s) => s.demo.contextOverride)
  const openOverlay = usePace((s) => s.openOverlay)

  const now = new Date()
  const ctx = getTimeContext(now, contextOverride)
  const scene = SCENE[ctx]
  const today = sleepDateFor(now)
  const todayRecord = records[today]
  const todayDream = dreams[today]
  const { petName, userName } = settings

  const wakeRecorded = !!todayRecord?.actualWake

  const latest = Object.values(records)
    .filter((r) => r.feelingWord)
    .sort((a, b) => b.date.localeCompare(a.date))[0]

  let pose: PetPose = 'wave'
  let title = ''
  let sub = ''
  let content: ReactNode = null

  if (ctx === 'evening') {
    pose = 'cuddle'
    title = todayDream
      ? '今晚會有香甜的夢'
      : userName
        ? `${userName}，今天過得還好嗎？`
        : '嘿，今天過得還好嗎？'
    sub = `${settings.reminderTime} ${petName}陪你一起入眠`
    content = (
      <>
        <PrimaryButton onClick={() => openOverlay('chat')}>跟{petName}聊天</PrimaryButton>
        <GhostButton onClick={() => openOverlay('bedtime')}>修改睡眠提醒</GhostButton>
      </>
    )
  } else if (ctx === 'morning') {
    if (!wakeRecorded) {
      pose = 'stretch'
      title = '早安~睡的如何呢？'
      sub = `${petName}陪你一起度過美好的一天`
      content = <PrimaryButton onClick={() => openOverlay('wake')}>記錄一下吧</PrimaryButton>
    } else {
      pose = 'lying'
      title = `${petName}給你滿滿元氣！`
      sub = `${petName}陪你一起度過美好的一天`
      content = (
        <>
          <Card className="home-tip">
            <span className="home-tip-label">🐾 {petName}今日小建議</span>
            <ul className="home-tip-list">
              {dailyTips(now).map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </Card>
          <PrimaryButton onClick={() => openOverlay('chat')}>跟{petName}聊天</PrimaryButton>
        </>
      )
    }
  } else if (ctx === 'midnight') {
    pose = 'peek'
    title = '醒了嗎？'
    sub = '我在這裡陪你，不用急著做什麼'
    content = <GhostButton onClick={() => openOverlay('chat')}>找{petName}聊聊</GhostButton>
  } else {
    pose = 'wave'
    title = userName ? `午安，${userName}` : '午安'
    sub = '今晚也要好好休息喔'
    content = <GhostButton onClick={() => openOverlay('chat')}>找{petName}聊聊</GhostButton>
  }

  return (
    <div className={`home${scene === 'morning' ? ' theme-morning' : ''}`}>
      <Scenery variant={scene} />
      <div className="home-content">
        <div className="home-block">
          <div className="home-greeting-group">
            <span className="home-date-pill">{formatDate(now)}</span>

            <div className="home-greeting-inner">
              <header className="home-greeting-text">
                <h1>{title}</h1>
                <p>{sub}</p>
              </header>
              <Pet pose={pose} size={196} />
            </div>
          </div>

          <div className="home-actions">
            {content}

            {pendingDream && (
              <button className="home-dream-hint" onClick={() => openOverlay('dream')}>
                <span className="home-dream-dot" />
                今早的夢還沒記下來
              </button>
            )}

            {latest && (ctx === 'day' || ctx === 'midnight') && latest.date !== today && (
              <Card className="home-summary" onClick={() => openOverlay('chat')}>
                <span className="home-summary-label">昨晚的你</span>
                <span className="home-summary-word">{latest.feelingWord}</span>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

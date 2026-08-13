import { useState } from 'react'
import { usePace } from '../store'
import { suggestBedtime } from '../engine/feeling'
import TimeWheel from '../components/TimeWheel'
import Pet from '../components/Pet'
import { PrimaryButton, GhostButton, Chip } from '../components/ui'
import './flows.css'

/** 睡眠提醒時間設定：Onboarding 設定一次後，之後都用同一個時間提醒；此畫面供事後修改 */
export default function Bedtime() {
  const onboarding = usePace((s) => s.onboarding)
  const petName = usePace((s) => s.settings.petName)
  const reminderTime = usePace((s) => s.settings.reminderTime)
  const setSettings = usePace((s) => s.setSettings)
  const closeOverlay = usePace((s) => s.closeOverlay)
  const openOverlay = usePace((s) => s.openOverlay)

  const suggested = onboarding ? suggestBedtime(onboarding) : '23:30'
  const [time, setTime] = useState(reminderTime)
  const [done, setDone] = useState(false)

  const finish = () => {
    setSettings({ reminderTime: time })
    setDone(true)
  }

  if (done) {
    return (
      <div className="flow flow-bedtime-done">
        <div className="flow-bedtime-block">
          <Pet pose="ok" size={188} />
          <h2 className="flow-title">晚安，{petName}知道囉！</h2>
          <p className="flow-sub">我會在 {time} 輕輕提醒你入眠</p>
        </div>
        <div className="flow-actions">
          <PrimaryButton onClick={() => openOverlay('chat')}>睡前想聊聊嗎？</PrimaryButton>
          <GhostButton onClick={closeOverlay}>今天先這樣</GhostButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flow">
      <header className="flow-header">
        <Pet pose="sitSleep" size={163} />
        <h2 className="flow-title">今晚想幾點睡？</h2>
        <p className="flow-sub">大概就好，不用太精準</p>
      </header>

      <TimeWheel value={time} onChange={setTime} />

      <div className="flow-suggest">
        <Chip selected={time === suggested} onClick={() => setTime(suggested)}>
          🐾 {petName}建議 {suggested}
        </Chip>
      </div>

      <div className="flow-actions">
        <PrimaryButton onClick={finish}>就這個時間</PrimaryButton>
      </div>
    </div>
  )
}

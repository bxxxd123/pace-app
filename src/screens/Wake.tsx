import { useState } from 'react'
import { usePace } from '../store'
import { sleepDateFor, isLateWake } from '../engine/context'
import { feelingWord } from '../engine/feeling'
import TimeWheel from '../components/TimeWheel'
import Pet, { type PetPose } from '../components/Pet'
import { PrimaryButton, GhostButton } from '../components/ui'
import './flows.css'

const FACES: { q: 1 | 2 | 3 | 4 | 5; pose: PetPose; label: string }[] = [
  { q: 1, pose: 'exhausted', label: '超累' },
  { q: 2, pose: 'notGood', label: '不太好' },
  { q: 3, pose: 'normal', label: '普通' },
  { q: 4, pose: 'good', label: '不錯' },
  { q: 5, pose: 'sleepWell', label: '睡得香' },
]

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function sleepHours(sleep: string, wake: string): number {
  const s = toMinutes(sleep)
  const w = toMinutes(wake)
  const sAdj = s < 12 * 60 ? s + 24 * 60 : s
  return (w + 24 * 60 - sAdj) / 60
}

function nowRounded(): string {
  const d = new Date()
  const m = Math.round(d.getMinutes() / 10) * 10
  const h = (d.getHours() + Math.floor(m / 60)) % 24
  return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

function addMinutes(t: string, mins: number): string {
  const total = (toMinutes(t) + mins) % (24 * 60)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

/** F2 起床快速紀錄：評分＋起訖 → 完成（睡眠摘要 + 夢境邀請） */
const USUAL_WAKE = '07:30'

export default function Wake() {
  const petName = usePace((s) => s.settings.petName)
  const reminderTime = usePace((s) => s.settings.reminderTime)
  const lateWakeDemo = usePace((s) => s.demo.lateWake)
  const saveWake = usePace((s) => s.saveWake)
  const closeOverlay = usePace((s) => s.closeOverlay)
  const openOverlay = usePace((s) => s.openOverlay)

  const date = sleepDateFor(new Date())
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5 | null>(null)
  const [sleep, setSleep] = useState(reminderTime)
  // 賴床模擬：以常態起床時間 +2 小時為預設（不受展示當下真實時刻影響）
  const [wake, setWake] = useState(lateWakeDemo ? addMinutes(USUAL_WAKE, 120) : nowRounded())
  const [step, setStep] = useState<'rate' | 'dream'>('rate')
  const [word, setWord] = useState('')

  const hours = sleepHours(sleep, wake)

  const finish = () => {
    if (!quality) return
    const w = feelingWord(quality, hours)
    saveWake(date, sleep, wake, quality, w)
    setWord(w)
    setStep('dream')
  }

  const late = isLateWake(wake, USUAL_WAKE)

  if (step === 'dream') {
    return (
      <div className="flow flow-center">
        <h2 className="flow-title flow-title-accent">{petName}記錄睡眠囉！</h2>
        <p className="flow-sub">{late ? `${word}，今天也不用急，慢慢來` : word}</p>
        <Pet pose="ok" size={166} className="flow-pet-gap" />
        <div className="flow-summary">
          <span className="flow-summary-label">睡眠時間</span>
          <p className="flow-summary-hours">
            {Math.round(hours)}
            <span>小時</span>
          </p>
          <span className="flow-summary-range">{sleep} - {wake}</span>
        </div>
        <div className="flow-divider" />
        <div className="flow-dreamcard">
          <p className="flow-dreamcard-title">還記得昨晚的夢嗎？</p>
          <p className="flow-dreamcard-sub">要不要趁新鮮記一下</p>
        </div>
        <div className="flow-actions">
          <PrimaryButton onClick={() => openOverlay('dream')}>記一下</PrimaryButton>
          <GhostButton onClick={closeOverlay}>跳過</GhostButton>
        </div>
      </div>
    )
  }

  return (
    <div className="flow">
      <header className="flow-header flow-header-tight">
        <h2 className="flow-title">昨晚睡得如何？</h2>
        <p className="flow-sub">憑感覺選就好</p>
      </header>

      <div className="flow-faces">
        {FACES.map((f) => (
          <button
            key={f.q}
            className={`flow-face${quality === f.q ? ' flow-face-active' : ''}`}
            onClick={() => setQuality(f.q)}
          >
            <Pet pose={f.pose} size={40} className="flow-face-icon" />
            <span className="flow-face-label">{f.label}</span>
          </button>
        ))}
      </div>

      <div className="flow-times">
        <div className="flow-time-col">
          <span className="flow-time-label">大概幾點睡著</span>
          <TimeWheel compact value={sleep} onChange={setSleep} />
        </div>
        <div className="flow-time-col">
          <span className="flow-time-label">幾點醒來</span>
          <TimeWheel compact value={wake} onChange={setWake} />
        </div>
      </div>

      <div className="flow-actions">
        <PrimaryButton onClick={finish} disabled={!quality}>
          好了
        </PrimaryButton>
      </div>
    </div>
  )
}

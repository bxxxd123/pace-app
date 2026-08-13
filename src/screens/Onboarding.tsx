import { useState } from 'react'
import { usePace } from '../store'
import type { OnboardingAnswers } from '../types'
import Pet from '../components/Pet'
import Scenery from '../components/Scenery'
import { PrimaryButton } from '../components/ui'
import './Onboarding.css'

interface Option {
  label: string
  value: string
}

interface Question {
  key: keyof OnboardingAnswers
  title: string
  sub: string
  options: Option[]
}

const BEDTIME_QUESTION: Question = {
  key: 'usualBedtime',
  title: '平常大概幾點睡？',
  sub: '不用精準，大概就好',
  options: [
    { label: '10 點前', value: '21:30' },
    { label: '10 點～12 點', value: '23:00' },
    { label: '12 點～2 點', value: '00:30' },
    { label: '2 點以後', value: '02:30' },
  ],
}

const REMINDER_OPTIONS: Option[] = [
  { label: '10 點前', value: '21:30' },
  { label: '10 點～12 點', value: '23:00' },
  { label: '12 點～2 點', value: '00:30' },
  { label: '2 點以後', value: '02:30' },
]

const QUESTIONS: Question[] = [
  {
    key: 'mainStruggle',
    title: '睡眠這件事，最困擾你的是？',
    sub: '選一個最有感的',
    options: [
      { label: '躺下了卻睡不著', value: '難入睡' },
      { label: '睡了還是好累', value: '睡不飽' },
      { label: '作息老是亂掉', value: '作息亂' },
      { label: '腦子停不下來', value: '壓力大' },
    ],
  },
  {
    key: 'chronotype',
    title: '你覺得自己是？',
    sub: '沒有標準答案',
    options: [
      { label: '夜貓 🌙', value: '夜貓' },
      { label: '早鳥 ☀️', value: '早鳥' },
      { label: '看日子，不一定', value: '不一定' },
    ],
  },
]

// step: -1 歡迎, 0 姓名, 1 平常幾點睡, 2 睡眠提醒時間, 3.. QUESTIONS
const TOTAL_STEPS = QUESTIONS.length + 2

/** O1 歡迎 + 姓名題 + 平常幾點睡 + 睡眠提醒時間 + 其餘問答 */
export default function Onboarding() {
  const petName = usePace((s) => s.settings.petName)
  const setSettings = usePace((s) => s.setSettings)
  const setOnboarding = usePace((s) => s.setOnboarding)
  const closeOverlay = usePace((s) => s.closeOverlay)
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState<Partial<Record<keyof OnboardingAnswers, string>>>({})
  const [name, setName] = useState('')
  const [reminderTime, setReminderTime] = useState('')

  const advance = (finalAnswers: Partial<Record<keyof OnboardingAnswers, string>>) => {
    if (step < TOTAL_STEPS - 1) {
      setTimeout(() => setStep(step + 1), 220)
    } else {
      setOnboarding(finalAnswers as unknown as OnboardingAnswers)
      setTimeout(closeOverlay, 220)
    }
  }

  const pick = (key: keyof OnboardingAnswers, value: string) => {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    advance(next)
  }

  const pickReminder = (value: string) => {
    setReminderTime(value)
    setSettings({ reminderTime: value })
    setTimeout(() => setStep(step + 1), 220)
  }

  const confirmName = () => {
    if (name.trim()) setSettings({ userName: name.trim() })
    setStep(1)
  }

  const progressDots = (activeUpTo: number) => (
    <div className="onb-progress">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <span key={i} className={i <= activeUpTo ? 'onb-dot-on' : 'onb-dot'} />
      ))}
    </div>
  )

  if (step === -1) {
    return (
      <div className="onb">
        <Scenery variant="night" />
        <div className="onb-welcome">
          <Pet pose="wave" size={200} />
          <h1>嗨，我是{petName}</h1>
          <p>
            不打分數、不催你睡，
            <br />
            只是陪你找到自己的節奏
          </p>
          <div className="onb-welcome-action">
            <PrimaryButton onClick={() => setStep(0)}>開始吧</PrimaryButton>
          </div>
        </div>
      </div>
    )
  }

  if (step === 0) {
    return (
      <div className="onb">
        <Scenery variant="night" />
        <div className="onb-question">
          {progressDots(0)}
          <Pet pose="listen" size={96} />
          <h2>怎麼稱呼你呢？</h2>
          <p className="onb-sub">{petName}陪伴的時候會用到</p>
          <input
            className="onb-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="輸入你的名字"
            maxLength={12}
          />
          <div className="onb-options">
            <PrimaryButton onClick={confirmName}>繼續</PrimaryButton>
            <button className="onb-skip" onClick={() => setStep(1)}>
              先不填
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="onb">
        <Scenery variant="night" />
        <div className="onb-question">
          {progressDots(1)}
          <Pet pose="listen" size={96} />
          <h2>{BEDTIME_QUESTION.title}</h2>
          <p className="onb-sub">{BEDTIME_QUESTION.sub}</p>
          <div className="onb-options">
            {BEDTIME_QUESTION.options.map((o) => (
              <button
                key={o.value}
                className={`onb-option${answers.usualBedtime === o.value ? ' onb-option-picked' : ''}`}
                onClick={() => pick('usualBedtime', o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="onb">
        <Scenery variant="night" />
        <div className="onb-question">
          {progressDots(2)}
          <Pet pose="listen" size={96} />
          <h2>你想幾點被{petName}提醒睡覺？</h2>
          <p className="onb-sub">之後可以在設定裡再調整</p>
          <div className="onb-options">
            {REMINDER_OPTIONS.map((o) => (
              <button
                key={o.value}
                className={`onb-option${reminderTime === o.value ? ' onb-option-picked' : ''}`}
                onClick={() => pickReminder(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const q = QUESTIONS[step - 3]
  return (
    <div className="onb">
      <Scenery variant="night" />
      <div className="onb-question">
        {progressDots(step)}
        <Pet pose="listen" size={96} />
        <h2>{q.title}</h2>
        <p className="onb-sub">{q.sub}</p>
        <div className="onb-options">
          {q.options.map((o) => (
            <button
              key={o.value}
              className={`onb-option${answers[q.key] === o.value ? ' onb-option-picked' : ''}`}
              onClick={() => pick(q.key, o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

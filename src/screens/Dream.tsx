import { useEffect, useState } from 'react'
import { usePace } from '../store'
import { sleepDateFor } from '../engine/context'
import { tagDream, TAG_CHOICES } from '../engine/dream'
import type { DreamTag } from '../types'
import Pet from '../components/Pet'
import { PrimaryButton, GhostButton } from '../components/ui'
import './Dream.css'

const VOICE_SAMPLE = '夢到在一個很大的車站找不到月台，一直跑一直跑，廣播都在叫我的名字…'
const SAVED_NOTICE_MS = 2000

/** F4 夢境輸入（語音模擬優先）+ F5 AI 標籤結果 + 儲存後的通知彈窗 */
export default function Dream() {
  const petName = usePace((s) => s.settings.petName)
  const saveDream = usePace((s) => s.saveDream)
  const setPendingDream = usePace((s) => s.setPendingDream)
  const dreamDateOverride = usePace((s) => s.dreamDate)
  const finishDream = usePace((s) => s.finishDream)

  const [step, setStep] = useState<'input' | 'tags' | 'saved'>('input')
  const [text, setText] = useState('')
  const [recording, setRecording] = useState(false)
  const [tags, setTags] = useState<DreamTag[]>([])
  const [showPicker, setShowPicker] = useState(false)

  const isBackfill = dreamDateOverride != null
  const date = dreamDateOverride ?? sleepDateFor(new Date())
  const dateLabel = `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`

  // 模擬語音輸入：波紋動畫 2 秒後填入範例文字
  const record = () => {
    if (recording) return
    setRecording(true)
    setTimeout(() => {
      setText((t) => (t ? t : VOICE_SAMPLE))
      setRecording(false)
    }, 2000)
  }

  const toTags = () => {
    setTags(tagDream(text))
    setStep('tags')
  }

  const skip = () => {
    if (!isBackfill) setPendingDream(false)
    finishDream()
  }

  const confirm = () => {
    saveDream(date, text, tags)
    setStep('saved')
  }

  // 通知彈窗：顯示幾秒後自動消失，補記則回到夢境本月曆，一般流程則返回首頁
  useEffect(() => {
    if (step !== 'saved') return
    const t = setTimeout(finishDream, SAVED_NOTICE_MS)
    return () => clearTimeout(t)
  }, [step, finishDream])

  if (step === 'saved') {
    return (
      <div className="dream-notice-backdrop">
        <div className="dream-notice-card">
          <h2 className="dream-title dream-notice-title">{petName}把夢收進口袋囉！</h2>
          <p className="dream-sub dream-notice-sub">我會幫你好好守護它</p>
          <Pet pose="ok" size={166} className="dream-notice-pet" />
        </div>
      </div>
    )
  }

  if (step === 'tags') {
    const addable = TAG_CHOICES.filter((c) => !tags.some((t) => t.label === c.label))
    return (
      <div className="dream dream-center">
        <Pet pose="tag" size={130} />
        <h2 className="dream-title">{petName}幫你分類小標籤</h2>
        <p className="dream-sub">自我覺察小紀錄</p>
        <div className="dream-tags">
          {tags.map((t) => (
            <button
              key={t.label}
              className={`dream-tag dream-tag-${t.kind}`}
              onClick={() => setTags(tags.filter((x) => x.label !== t.label))}
              title="點擊移除"
            >
              {t.label} ✕
            </button>
          ))}
          <button className="dream-tag dream-tag-add" onClick={() => setShowPicker(!showPicker)}>
            ＋
          </button>
        </div>
        {showPicker && addable.length > 0 && (
          <div className="dream-picker">
            {addable.map((c) => (
              <button
                key={c.label}
                className={`dream-tag dream-tag-${c.kind}`}
                onClick={() => {
                  setTags([...tags, c])
                  setShowPicker(false)
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
        <p className="dream-text-readonly">{text}</p>
        <div className="dream-actions">
          <PrimaryButton onClick={confirm}>儲存夢境</PrimaryButton>
          <GhostButton onClick={() => setStep('input')}>修改夢境</GhostButton>
        </div>
      </div>
    )
  }

  return (
    <div className="dream">
      <Pet pose="dreaming" size={140} />
      <header className="dream-header">
        <h2 className="dream-title">{isBackfill ? `幫 ${dateLabel} 補記一下夢` : '還記得夢見什麼嗎？'}</h2>
        <p className="dream-sub">
          {isBackfill ? '想到什麼都可以，慢慢想沒關係' : '說的或打字都可以，片段也沒關係'}
        </p>
      </header>

      <button className={`dream-mic${recording ? ' dream-mic-recording' : ''}`} onClick={record}>
        {recording && (
          <>
            <span className="dream-ripple" />
            <span className="dream-ripple dream-ripple-2" />
          </>
        )}
        <MicIcon />
      </button>
      <span className="dream-mic-hint">{recording ? '聽你說…' : '按一下用說的'}</span>

      <textarea
        className="dream-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="或是在這裡打字…"
        rows={4}
      />

      <div className="dream-actions">
        <PrimaryButton onClick={toTags} disabled={!text.trim()}>
          記好了
        </PrimaryButton>
        <GhostButton onClick={skip}>不記得了，沒關係</GhostButton>
      </div>
    </div>
  )
}

function MicIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="currentColor">
      <rect x="12" y="4" width="10" height="17" rx="5" />
      <path d="M8 16a9 9 0 0 0 18 0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M17 25v5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

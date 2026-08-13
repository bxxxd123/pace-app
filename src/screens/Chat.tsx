import { useEffect, useRef, useState } from 'react'
import { usePace } from '../store'
import { getTimeContext } from '../engine/context'
import { chatReply } from '../engine/chat'
import { detectNegative } from '../engine/reminder'
import Pet from '../components/Pet'
import { Chip } from '../components/ui'
import './Chat.css'

interface Msg {
  from: 'doog' | 'me'
  text: string
}

const OPENERS = {
  evening: '今天過得怎麼樣？想說什麼都可以',
  midnight: '睡不著嗎？我陪你。不用急著睡回去',
  morning: '早安。昨晚的事、今天的事，都可以聊',
  day: '想聊什麼都可以，我在',
} as const

const QUICK_REPLIES = ['今天壓力好大', '睡不著', '還不錯啦']

/** F3 AI 陪伴對話：規則式回應 + 輸入中延遲擬真 */
export default function Chat() {
  const petName = usePace((s) => s.settings.petName)
  const contextOverride = usePace((s) => s.demo.contextOverride)
  const reminderLayer = usePace((s) => s.reminderLayer)
  const setSoftReminder = usePace((s) => s.setSoftReminder)

  const ctx = getTimeContext(new Date(), contextOverride)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'doog', text: OPENERS[ctx] }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  const send = (text: string) => {
    const t = text.trim()
    if (!t || typing) return
    setMsgs((m) => [...m, { from: 'me', text: t }])
    setInput('')
    setTyping(true)

    const negative = detectNegative(t)
    // 偵測到負面情緒：提醒直接降級為關心（Layer 3）
    if (negative && reminderLayer > 0) setSoftReminder()

    const delay = 1000 + Math.random() * 900
    setTimeout(() => {
      const reply = chatReply(t, ctx)
      const prefix =
        negative && ctx !== 'midnight' && !reply.startsWith('聽起來') ? '聽起來今天真的辛苦了。' : ''
      setMsgs((m) => [...m, { from: 'doog', text: prefix + reply }])
      setTyping(false)
    }, delay)
  }

  return (
    <div className="chat">
      <header className="chat-header">
        <Pet pose="listen" size={64} />
        <div>
          <span className="chat-name">{petName}</span>
          <span className="chat-status">{typing ? '正在輸入…' : '在這裡陪你'}</span>
        </div>
      </header>

      <div className="chat-scroll" ref={scrollRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`chat-bubble chat-${m.from}`}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="chat-bubble chat-doog chat-typing">
            <span /><span /><span />
          </div>
        )}
      </div>

      <div className="chat-quick">
        {QUICK_REPLIES.map((q) => (
          <Chip key={q} onClick={() => send(q)}>{q}</Chip>
        ))}
      </div>

      <form
        className="chat-inputrow"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="說點什麼…"
          maxLength={200}
        />
        <button type="submit" className="chat-send" disabled={!input.trim() || typing} aria-label="送出">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M2 9 16 2 12 9l4 7z" />
          </svg>
        </button>
      </form>
    </div>
  )
}

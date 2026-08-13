import { usePace } from '../store'
import type { TimeContext } from '../types'
import './DemoPanel.css'

const CONTEXTS: { id: TimeContext; label: string }[] = [
  { id: 'evening', label: '睡前' },
  { id: 'morning', label: '起床' },
  { id: 'midnight', label: '半夜' },
  { id: 'day', label: '白天' },
]

/** 隱藏展示面板（連點狀態列時鐘 3 下開啟）：切換情境、模擬分支、灌假資料 */
export default function DemoPanel({ onClose }: { onClose: () => void }) {
  const demo = usePace((s) => s.demo)
  const reminderLayer = usePace((s) => s.reminderLayer)
  const setContextOverride = usePace((s) => s.setContextOverride)
  const setLateWake = usePace((s) => s.setLateWake)
  const advanceReminder = usePace((s) => s.advanceReminder)
  const resetReminder = usePace((s) => s.resetReminder)
  const setPendingDream = usePace((s) => s.setPendingDream)
  const loadSeed = usePace((s) => s.loadSeed)
  const resetAll = usePace((s) => s.resetAll)

  return (
    <div className="demo-backdrop" onClick={onClose}>
      <div className="demo-panel" onClick={(e) => e.stopPropagation()}>
        <div className="demo-titlerow">
          <span className="demo-title">展示面板</span>
          <button className="demo-close" onClick={onClose}>完成</button>
        </div>

        <span className="demo-section">情境（覆寫真實時間）</span>
        <div className="demo-row">
          {CONTEXTS.map((c) => (
            <button
              key={c.id}
              className={`demo-btn${demo.contextOverride === c.id ? ' demo-btn-on' : ''}`}
              onClick={() => setContextOverride(demo.contextOverride === c.id ? null : c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <span className="demo-section">分支模擬</span>
        <div className="demo-row">
          <button className="demo-btn" onClick={advanceReminder}>
            推進提醒 L{reminderLayer}
          </button>
          <button className="demo-btn" onClick={resetReminder}>
            清除提醒
          </button>
          <button
            className={`demo-btn${demo.lateWake ? ' demo-btn-on' : ''}`}
            onClick={() => setLateWake(!demo.lateWake)}
          >
            賴床 +2hr
          </button>
          <button className="demo-btn" onClick={() => setPendingDream(true)}>
            夢境補記
          </button>
        </div>

        <span className="demo-section">資料</span>
        <div className="demo-row">
          <button className="demo-btn" onClick={loadSeed}>
            載入三週資料
          </button>
          <button
            className="demo-btn demo-btn-danger"
            onClick={() => {
              resetAll()
              onClose()
            }}
          >
            全部重置
          </button>
        </div>
      </div>
    </div>
  )
}

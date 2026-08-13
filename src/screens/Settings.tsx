import { useState } from 'react'
import { usePace } from '../store'
import TimeWheel from '../components/TimeWheel'
import RenameModal from '../components/RenameModal'
import { Card, Chip } from '../components/ui'
import './Settings.css'

export default function Settings() {
  const settings = usePace((s) => s.settings)
  const setSettings = usePace((s) => s.setSettings)
  const openOverlay = usePace((s) => s.openOverlay)
  const [renaming, setRenaming] = useState<null | 'pet' | 'user'>(null)

  return (
    <div className="settings">
      <div className="settings-scroll">
        <h1 className="settings-title">設定</h1>

        <Card className="settings-card">
          <span className="settings-label">每天晚上幾點提醒我</span>
          <TimeWheel
            compact
            value={settings.reminderTime}
            onChange={(t) => setSettings({ reminderTime: t })}
            stepMinutes={30}
          />
        </Card>

        <Card className="settings-card">
          <span className="settings-label">陪伴寵物的語氣</span>
          <div className="settings-chips">
            <Chip
              selected={settings.toneLevel === 'gentle'}
              onClick={() => setSettings({ toneLevel: 'gentle' })}
            >
              溫柔一點
            </Chip>
            <Chip
              selected={settings.toneLevel === 'normal'}
              onClick={() => setSettings({ toneLevel: 'normal' })}
            >
              一般
            </Chip>
          </div>
          <p className="settings-hint">溫柔模式下，提醒會更快轉成關心，不催促</p>
        </Card>

        <Card className="settings-card" onClick={() => setRenaming('pet')}>
          <div className="settings-row">
            <span className="settings-label settings-label-tight">修改陪伴寵物的名字</span>
            <span className="settings-arrow">›</span>
          </div>
        </Card>

        <Card className="settings-card" onClick={() => setRenaming('user')}>
          <div className="settings-row">
            <span className="settings-label settings-label-tight">修改我的名字</span>
            <span className="settings-arrow">›</span>
          </div>
        </Card>

        <Card className="settings-card">
          <div className="settings-row">
            <div>
              <span className="settings-label settings-label-tight">通知</span>
              <p className="settings-hint">睡前提醒與早晨問候</p>
            </div>
            <button
              className={`settings-toggle${settings.notifications ? ' settings-toggle-on' : ''}`}
              onClick={() => setSettings({ notifications: !settings.notifications })}
              aria-label="通知開關"
            >
              <span />
            </button>
          </div>
        </Card>

        <Card className="settings-card" onClick={() => openOverlay('onboarding')}>
          <div className="settings-row">
            <span className="settings-label settings-label-tight">重新認識我一次</span>
            <span className="settings-arrow">›</span>
          </div>
        </Card>

        <p className="settings-version">Pace 原型 · {settings.petName} 陪你 🐾</p>
      </div>

      {renaming === 'pet' && (
        <RenameModal
          title="幫寵物改個名字吧"
          placeholder="輸入寵物的名字"
          initialValue={settings.petName}
          onConfirm={(v) => setSettings({ petName: v })}
          onClose={() => setRenaming(null)}
        />
      )}
      {renaming === 'user' && (
        <RenameModal
          title="怎麼稱呼你呢？"
          placeholder="輸入你的名字"
          initialValue={settings.userName}
          onConfirm={(v) => setSettings({ userName: v })}
          onClose={() => setRenaming(null)}
        />
      )}
    </div>
  )
}

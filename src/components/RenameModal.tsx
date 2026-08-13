import { useState } from 'react'
import { PrimaryButton, GhostButton } from './ui'
import './RenameModal.css'

interface Props {
  title: string
  placeholder: string
  initialValue: string
  onConfirm: (value: string) => void
  onClose: () => void
}

/** 通用改名彈窗：深色遮罩 + 置中卡片，用於改寵物名字／改使用者名字 */
export default function RenameModal({ title, placeholder, initialValue, onConfirm, onClose }: Props) {
  const [value, setValue] = useState(initialValue)

  const confirm = () => {
    const v = value.trim()
    if (v) onConfirm(v)
    onClose()
  }

  return (
    <div className="rename-backdrop" onClick={onClose}>
      <div className="rename-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <input
          autoFocus
          className="rename-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          maxLength={12}
        />
        <div className="rename-actions">
          <GhostButton onClick={onClose}>取消</GhostButton>
          <PrimaryButton onClick={confirm} disabled={!value.trim()}>
            確定
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

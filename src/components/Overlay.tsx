import type { ReactNode } from 'react'
import './Overlay.css'

interface Props {
  children: ReactNode
  onClose?: () => void
  variant?: 'night' | 'morning' | 'midnight'
  hideClose?: boolean
}

/** 情境式流程容器：自底滑入，蓋在 Tab 畫面之上 */
export default function Overlay({ children, onClose, variant = 'night', hideClose }: Props) {
  return (
    <div className={`overlay overlay-${variant}${variant === 'morning' ? ' theme-morning' : ''}`}>
      {!hideClose && onClose && (
        <button className="overlay-close" onClick={onClose} aria-label="關閉">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      )}
      {children}
    </div>
  )
}

import { useEffect, useRef, useState, type ReactNode } from 'react'
import './PhoneFrame.css'

interface Props {
  children: ReactNode
  onClockTriple?: () => void
  statusColor?: string
}

export default function PhoneFrame({ children, onClockTriple, statusColor }: Props) {
  const [now, setNow] = useState(new Date())
  const taps = useRef<number[]>([])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const fit = () => {
      const s = Math.min(1, (window.innerHeight - 24) / 860, (window.innerWidth - 24) / 406)
      document.documentElement.style.setProperty('--frame-scale', String(s))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const clock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const handleClockTap = () => {
    const ts = Date.now()
    taps.current = [...taps.current.filter((t) => ts - t < 900), ts]
    if (taps.current.length >= 3) {
      taps.current = []
      onClockTriple?.()
    }
  }

  return (
    <div className="frame-outer">
      <div className="frame-phone">
        <div className="frame-screen">
          <div className="frame-statusbar" style={{ color: statusColor }}>
            <button id="status-clock" onClick={handleClockTap}>{clock}</button>
            <div className="frame-notch" />
            <span className="frame-status-icons">
              <SignalIcon /> <WifiIcon /> <BatteryIcon />
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

function SignalIcon() {
  return (
    <svg width="15" height="10" viewBox="0 0 15 10" fill="currentColor">
      <rect x="0" y="6" width="2.5" height="4" rx="1" />
      <rect x="4" y="4" width="2.5" height="6" rx="1" />
      <rect x="8" y="2" width="2.5" height="8" rx="1" />
      <rect x="12" y="0" width="2.5" height="10" rx="1" opacity="0.4" />
    </svg>
  )
}

function WifiIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
      <path d="M7 9.5 4.6 7.2a3.4 3.4 0 0 1 4.8 0Z" />
      <path d="M2.9 5.4a5.9 5.9 0 0 1 8.2 0l-1.3 1.3a4.1 4.1 0 0 0-5.6 0Z" opacity="0.7" />
      <path d="M1 3.5a8.6 8.6 0 0 1 12 0l-1.3 1.3a6.8 6.8 0 0 0-9.4 0Z" opacity="0.4" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg width="22" height="11" viewBox="0 0 22 11" fill="currentColor">
      <rect x="0.5" y="0.5" width="18" height="10" rx="3" fill="none" stroke="currentColor" opacity="0.5" />
      <rect x="2" y="2" width="12" height="7" rx="1.8" />
      <path d="M20.5 3.5v4a2.2 2.2 0 0 0 0-4Z" opacity="0.5" />
    </svg>
  )
}

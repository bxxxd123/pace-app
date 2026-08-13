import { usePace, type Tab } from '../store'
import './TabBar.css'

const TABS: { id: Tab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  { id: 'home', label: '首頁', icon: (a) => <MoonIcon active={a} /> },
  { id: 'records', label: '紀錄', icon: (a) => <WaveIcon active={a} /> },
  { id: 'settings', label: '設定', icon: (a) => <GearIcon active={a} /> },
]

export default function TabBar() {
  const tab = usePace((s) => s.tab)
  const setTab = usePace((s) => s.setTab)

  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tabbar-item${tab === t.id ? ' tabbar-active' : ''}`}
          onClick={() => setTab(t.id)}
        >
          {t.icon(tab === t.id)}
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

function MoonIcon({ active }: { active: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path
        d="M21 15.5A9 9 0 0 1 10.5 5 9 9 0 1 0 21 15.5Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WaveIcon({ active }: { active: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path
        d="M2 16c3-6 5-6 8 0s5 6 8 0 3.5-4.5 6-5"
        stroke="currentColor"
        strokeWidth={active ? 3 : 2}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M2 21c3-4.5 5-4.5 8 0s5 4.5 8 0"
        stroke="currentColor"
        strokeWidth={active ? 3 : 2}
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  )
}

function GearIcon({ active }: { active: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="4" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" />
      <path
        d="M13 3v3M13 20v3M23 13h-3M6 13H3M20.1 5.9l-2.2 2.2M8.1 17.9l-2.2 2.2M20.1 20.1l-2.2-2.2M8.1 8.1 5.9 5.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

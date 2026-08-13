import { useState } from 'react'
import PhoneFrame from './components/PhoneFrame'
import DemoPanel from './components/DemoPanel'
import TabBar from './components/TabBar'
import Overlay from './components/Overlay'
import Home from './screens/Home'
import Bedtime from './screens/Bedtime'
import Wake from './screens/Wake'
import Records from './screens/Records'
import RecordsDetail from './screens/RecordsDetail'
import DreamMonth from './screens/DreamMonth'
import Onboarding from './screens/Onboarding'
import Chat from './screens/Chat'
import Settings from './screens/Settings'
import Dream from './screens/Dream'
import { useEffect } from 'react'
import { usePace } from './store'
import { getTimeContext } from './engine/context'

export default function App() {
  const [demoOpen, setDemoOpen] = useState(false)
  const tab = usePace((s) => s.tab)
  const overlay = usePace((s) => s.overlay)
  const closeOverlay = usePace((s) => s.closeOverlay)
  const contextOverride = usePace((s) => s.demo.contextOverride)

  const onboarding = usePace((s) => s.onboarding)
  const records = usePace((s) => s.records)
  const openOverlay = usePace((s) => s.openOverlay)

  // 首次使用：自動進入 Onboarding
  useEffect(() => {
    if (onboarding === null && Object.keys(records).length === 0 && !overlay) {
      openOverlay('onboarding')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ctx = getTimeContext(new Date(), contextOverride)
  const isWarm = ctx === 'morning' || ctx === 'day'
  const overlayVariant = isWarm ? 'morning' : ctx === 'midnight' ? 'midnight' : 'night'
  // 目前可見表層是否為晨間暖色（決定狀態列/TabBar 文字顏色）
  const statusDark = overlay ? overlayVariant === 'morning' : tab === 'home' && isWarm

  return (
    <PhoneFrame
      onClockTriple={() => setDemoOpen(true)}
      statusColor={statusDark ? 'var(--ink)' : 'var(--cream)'}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          color: statusDark ? 'var(--ink)' : 'var(--cream)',
        }}
      >
        {tab === 'home' && <Home />}
        {tab === 'records' && <Records />}
        {tab === 'settings' && <Settings />}
        <TabBar />

        {overlay === 'bedtime' && (
          <Overlay variant="night" onClose={closeOverlay}>
            <Bedtime />
          </Overlay>
        )}
        {overlay === 'wake' && (
          <Overlay variant="morning" onClose={closeOverlay}>
            <Wake />
          </Overlay>
        )}
        {overlay === 'onboarding' && (
          <Overlay variant="night" hideClose>
            <Onboarding />
          </Overlay>
        )}
        {overlay === 'chat' && (
          <Overlay variant={overlayVariant} onClose={closeOverlay}>
            <Chat />
          </Overlay>
        )}
        {overlay === 'dream' && (
          <Overlay variant={overlayVariant} onClose={closeOverlay}>
            <Dream />
          </Overlay>
        )}
        {overlay === 'recordsDetail' && (
          <Overlay variant="night" onClose={closeOverlay}>
            <RecordsDetail />
          </Overlay>
        )}
        {overlay === 'dreamMonth' && (
          <Overlay variant="night" onClose={closeOverlay}>
            <DreamMonth />
          </Overlay>
        )}

        {demoOpen && <DemoPanel onClose={() => setDemoOpen(false)} />}
      </div>
    </PhoneFrame>
  )
}

import { useEffect, useState } from 'react'
import { BootSequence } from './components/BootSequence/BootSequence'
import { Screen } from './components/Screen/Screen'
import { TabNav } from './components/TabNav/TabNav'
import { Stat } from './components/tabs/Stat/Stat'
import { StatusBar } from './components/StatusBar/StatusBar'
import { usePowerState } from './hooks/usePowerState'
import { useActiveTab } from './hooks/useActiveTab'
import { useScreenScale } from './hooks/useScreenScale'
import { playSfx } from './utils/sfx'
import './App.css'

import toggleSwitchSfx from './assets/sfx/toggle-switch.mp3'
import bootSequenceSfx from './assets/sfx/UI_PipBoy_BootSequence_C.ogg'
import bootOkSfx from './assets/sfx/UI_Pipboy_OK.ogg'
import bootFrame1 from './assets/images/boot/1.png'
import bootFrame2 from './assets/images/boot/2.png'
import bootFrame3 from './assets/images/boot/3.png'
import bootFrame4 from './assets/images/boot/4.png'
import bootFrame5 from './assets/images/boot/5.png'
import bootFrame6 from './assets/images/boot/6.png'
import bootFrame7 from './assets/images/boot/7.png'
import bootFrame8 from './assets/images/boot/8.png'

const BOOT_FRAMES = [
  bootFrame1,
  bootFrame2,
  bootFrame3,
  bootFrame4,
  bootFrame5,
  bootFrame6,
  bootFrame7,
  bootFrame8,
]

function App() {
  const { phase, isOn, toggle, completeBoot } = usePowerState()
  const { tabs, activeTab, setActiveTab } = useActiveTab()
  useScreenScale()
  const [crtEnabled] = useState(true)

  useEffect(() => {
    if (phase === 'turning-on') {
      playSfx(bootSequenceSfx)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'on') {
      playSfx(bootOkSfx)
    }
  }, [phase])

  const handlePowerPress = () => {
    playSfx(toggleSwitchSfx)
    toggle()
  }

  return (
    <main className="app">
      <div className="app__screen">
        <Screen phase={phase} crtEnabled={crtEnabled}>
          {phase === 'turning-on' ? (
            <BootSequence frames={BOOT_FRAMES} onBootComplete={completeBoot} />
          ) : phase === 'on' ? (
            <div className="hud">
              <TabNav
                tabs={tabs}
                activeTab={activeTab}
                onSelect={setActiveTab}
                label="Módulos"
              />
              <div className="hud__content">
                {activeTab === 'STAT' ? (
                  <Stat />
                ) : (
                  <div className="placeholder">
                    <p className="placeholder__title">{activeTab}</p>
                    <p className="placeholder__subtitle">MÓDULO EN CONSTRUCCIÓN</p>
                  </div>
                )}
              </div>
              <StatusBar />
            </div>
          ) : (
            <div className="placeholder">
              <p className="placeholder__title">VAULT ARCHIVE</p>
            </div>
          )}
        </Screen>
      </div>
      <button
        className={`power-button ${isOn ? 'power-button--on' : ''}`}
        type="button"
        aria-pressed={isOn}
        aria-label="Encender o apagar la pantalla"
        onClick={handlePowerPress}
      >
        <svg className="power-button__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3v8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M7.2 5.5a8 8 0 1 0 9.6 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </main>
  )
}

export default App
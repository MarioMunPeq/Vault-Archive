import { useEffect, useState } from 'react'
import { BootSequence } from './components/BootSequence/BootSequence'
import { Screen } from './components/Screen/Screen'
import { usePowerState } from './hooks/usePowerState'
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
  const [crtEnabled] = useState(true)

  useEffect(() => {
    if (phase === 'turning-on') {
      void new Audio(bootSequenceSfx).play()
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'on') {
      void new Audio(bootOkSfx).play()
    }
  }, [phase])

  const handlePowerPress = () => {
    void new Audio(toggleSwitchSfx).play()
    toggle()
  }

  return (
    <main className="app">
      <div className="app__screen">
        <Screen phase={phase} crtEnabled={crtEnabled}>
          {phase === 'turning-on' ? (
            <BootSequence frames={BOOT_FRAMES} onBootComplete={completeBoot} />
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
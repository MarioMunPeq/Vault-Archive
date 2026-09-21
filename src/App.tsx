import { useEffect, useState } from 'react'
import { BootSequence } from './components/BootSequence/BootSequence'
import { Screen } from './components/Screen/Screen'
import { TabNav } from './components/TabNav/TabNav'
import { Stat } from './components/tabs/Stat/Stat'
import { Misiones } from './components/tabs/Misiones/Misiones'
import { Data } from './components/tabs/Data/Data'
import { Radio } from './components/tabs/Radio/Radio'
import { RadioProvider } from './components/tabs/Radio/RadioProvider'
import { Map } from './components/tabs/Map/Map'
import { HackView } from './components/tabs/Hack/HackView'
import { useActiveTab } from './hooks/useActiveTab'
import { playSfx } from './utils/sfx'
import './App.css'

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
  const { tabs, activeTab, setActiveTab } = useActiveTab()
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    playSfx(bootSequenceSfx)
  }, [])

  useEffect(() => {
    if (booted) {
      playSfx(bootOkSfx)
    }
  }, [booted])

  return (
    <RadioProvider>
      <main className="app">
        <Screen>
          {!booted ? (
            <BootSequence
              frames={BOOT_FRAMES}
              frameIntervalMs={150}
              durationMs={6000}
              onBootComplete={() => setBooted(true)}
            />
          ) : (
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
                ) : activeTab === 'MISIONES' ? (
                  <Misiones />
                ) : activeTab === 'DATA' ? (
                  <Data />
                ) : activeTab === 'RADIO' ? (
                  <Radio />
                ) : activeTab === 'MAP' ? (
                  <Map />
                ) : activeTab === 'HACK' ? (
                  <HackView />
                ) : (
                  <div className="placeholder">
                    <p className="placeholder__title">{activeTab}</p>
                    <p className="placeholder__subtitle">MÓDULO EN CONSTRUCCIÓN</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Screen>
      </main>
    </RadioProvider>
  )
}

export default App
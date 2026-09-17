import { useState } from 'react'
import { TabNav } from '../../TabNav/TabNav'
import submoduleChangeSfx from '../../../assets/sfx/submodule_change.ogg'
import { StatusView } from './StatusView'
import { SpecialView } from './SpecialView'
import { PerksView } from './PerksView'
import './Stat.css'

export type StatSubTab = 'STATUS' | 'SPECIAL' | 'PERKS'

const SUB_TABS: readonly StatSubTab[] = ['STATUS', 'SPECIAL', 'PERKS']

export function Stat() {
  const [subTab, setSubTab] = useState<StatSubTab>('STATUS')

  return (
    <div className="stat">
      <TabNav
        tabs={SUB_TABS}
        activeTab={subTab}
        onSelect={setSubTab}
        label="Secciones de estado"
        confirmSfx={submoduleChangeSfx}
        variant="secondary"
      />
      <div className="stat__content">
        {subTab === 'STATUS' ? (
          <StatusView />
        ) : subTab === 'SPECIAL' ? (
          <SpecialView />
        ) : (
          <PerksView />
        )}
      </div>
    </div>
  )
}
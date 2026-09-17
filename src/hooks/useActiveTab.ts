import { useState } from 'react'

export type TabId = 'STAT' | 'ITEMS' | 'DATA' | 'MAP' | 'RADIO'

export const TABS: readonly TabId[] = ['STAT', 'ITEMS', 'DATA', 'MAP', 'RADIO']

export interface UseActiveTabResult {
  tabs: readonly TabId[]
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
}

export function useActiveTab(initialTab: TabId = 'STAT'): UseActiveTabResult {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)

  return {
    tabs: TABS,
    activeTab,
    setActiveTab,
  }
}
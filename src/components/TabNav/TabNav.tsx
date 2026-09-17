import { useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { playSfx } from '../../utils/sfx'
import dialMoveSfx from '../../assets/sfx/dial_move.ogg'
import moduleChangeSfx from '../../assets/sfx/module_change.ogg'
import './TabNav.css'

export interface TabNavProps<T extends string> {
  tabs: readonly T[]
  activeTab: T
  onSelect: (tab: T) => void
  label: string
  moveSfx?: string
  confirmSfx?: string
  variant?: 'primary' | 'secondary'
}

export function TabNav<T extends string>({
  tabs,
  activeTab,
  onSelect,
  label,
  moveSfx = dialMoveSfx,
  confirmSfx = moduleChangeSfx,
  variant = 'primary',
}: TabNavProps<T>) {
  const [highlightIndex, setHighlightIndex] = useState(() =>
    Math.max(0, tabs.indexOf(activeTab)),
  )
  const [prevActiveTab, setPrevActiveTab] = useState(activeTab)

  if (activeTab !== prevActiveTab) {
    setPrevActiveTab(activeTab)
    setHighlightIndex(tabs.indexOf(activeTab))
  }

  const move = (direction: -1 | 1) => {
    setHighlightIndex((current) => {
      const next = (current + direction + tabs.length) % tabs.length
      return next
    })
    playSfx(moveSfx)
  }

  const confirm = (index: number) => {
    const tab = tabs[index]
    if (tab) {
      onSelect(tab)
      playSfx(confirmSfx)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        move(-1)
        break
      case 'ArrowRight':
        event.preventDefault()
        move(1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        confirm(highlightIndex)
        break
    }
  }

  const handleTabClick =
    (index: number) => (event: MouseEvent<HTMLButtonElement>) => {
      confirm(index)
      event.currentTarget.blur()
    }

  return (
    <div
      className={`tabnav tabnav--${variant}`}
      role="tablist"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab, index) => {
        const isActive = tab === activeTab
        const isHighlighted = index === highlightIndex
        const classes = ['tabnav__tab']
        if (isActive) classes.push('tabnav__tab--active')
        if (isHighlighted) classes.push('tabnav__tab--highlight')

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            tabIndex={-1}
            className={classes.join(' ')}
            aria-selected={isActive}
            onClick={handleTabClick(index)}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
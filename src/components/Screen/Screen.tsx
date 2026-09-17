import type { ReactNode } from 'react'
import type { PowerPhase } from '../../hooks/usePowerState'
import './Screen.css'

export interface ScreenProps {
  phase: PowerPhase
  crtEnabled?: boolean
  children?: ReactNode
}

const STATE_CLASS: Record<PowerPhase, string> = {
  off: 'crt--off',
  'turning-on': '',
  on: '',
  'turning-off': 'crt--turn-off',
}

export function Screen({ phase, crtEnabled = true, children }: ScreenProps) {
  const showContent = phase !== 'off'
  const classes = ['screen', 'crt', STATE_CLASS[phase]]
  if (crtEnabled) {
    classes.push('crt--fx')
  }

  return (
    <div className={classes.filter(Boolean).join(' ')} data-phase={phase}>
      {showContent && <div className="crt__content">{children}</div>}
    </div>
  )
}
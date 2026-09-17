import type { ReactNode } from 'react'
import './Screen.css'

export interface ScreenProps {
  children?: ReactNode
}

export function Screen({ children }: ScreenProps) {
  return (
    <div className="screen crt crt--fx">
      <div className="crt__content">{children}</div>
    </div>
  )
}
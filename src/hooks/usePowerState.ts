import { useCallback, useEffect, useRef, useState } from 'react'

export type PowerPhase = 'off' | 'turning-on' | 'on' | 'turning-off'

export const TURN_OFF_DURATION_MS = 700

export interface UsePowerStateOptions {
  turnOffDurationMs?: number
}

export interface UsePowerStateResult {
  phase: PowerPhase
  isOn: boolean
  isOff: boolean
  toggle: () => void
  completeBoot: () => void
}

export function usePowerState(
  options: UsePowerStateOptions = {},
): UsePowerStateResult {
  const { turnOffDurationMs = TURN_OFF_DURATION_MS } = options

  const [phase, setPhase] = useState<PowerPhase>('off')
  const timerRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (phase === 'turning-off') {
      timerRef.current = window.setTimeout(
        () => setPhase('off'),
        turnOffDurationMs,
      )
    }
    return clearTimer
  }, [phase, turnOffDurationMs, clearTimer])

  const toggle = useCallback(() => {
    setPhase((current) => {
      switch (current) {
        case 'off':
          return 'turning-on'
        case 'on':
          return 'turning-off'
        case 'turning-on':
        case 'turning-off':
          return current
      }
    })
  }, [])

  const completeBoot = useCallback(() => {
    setPhase((current) => (current === 'turning-on' ? 'on' : current))
  }, [])

  return {
    phase,
    isOn: phase === 'on',
    isOff: phase === 'off',
    toggle,
    completeBoot,
  }
}
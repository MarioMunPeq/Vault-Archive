import { createContext, useContext } from 'react'
import type { RefObject } from 'react'

export interface RadioContextValue {
  stationIndex: number
  trackIndex: number
  volume: number
  radioOn: boolean
  isPlaying: boolean
  currentTime: number
  duration: number
  tuning: boolean
  scanFrequency: number
  frequency: string
  stationName: string
  trackName: string | undefined
  audioRef: RefObject<HTMLAudioElement | null>
  changeStation: (target: number) => void
  changeTrack: (direction: -1 | 1) => void
  togglePower: () => void
  seek: (seconds: number) => void
  changeVolume: (value: number) => void
}

export const RadioContext = createContext<RadioContextValue | null>(null)

export function useRadio(): RadioContextValue {
  const ctx = useContext(RadioContext)
  if (!ctx) throw new Error('useRadio must be used within RadioProvider')
  return ctx
}
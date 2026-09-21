import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { playSfx } from '../../../utils/sfx'
import clickSfx from '../../../assets/sfx/mechanical-click.wav'
import tuneSfx from '../../../assets/sfx/electric-hum.wav'
import { RADIO_STATIONS, radioSession } from './radioStations'
import { RadioContext } from './radioContext'
import type { RadioContextValue } from './radioContext'

export function RadioProvider({ children }: { children: ReactNode }) {
  const [stationIndex, setStationIndex] = useState(radioSession.stationIndex)
  const [trackIndex, setTrackIndex] = useState(0)
  const [volume, setVolume] = useState(radioSession.volume)
  const [radioOn, setRadioOn] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [tuning, setTuning] = useState(false)
  const [scanFrequency, setScanFrequency] = useState(88)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const tuneTimerRef = useRef<number | null>(null)

  const stationCount = RADIO_STATIONS.length
  const station = RADIO_STATIONS[stationIndex] ?? RADIO_STATIONS[0]
  const track = station.tracks[trackIndex] ?? undefined

  useEffect(() => {
    return () => {
      if (tuneTimerRef.current !== null) {
        window.clearTimeout(tuneTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    audio.volume = radioSession.volume / 100
    if (radioOn) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [track, radioOn])

  useEffect(() => {
    if (!tuning) return
    const id = window.setInterval(() => {
      setScanFrequency((value) => (value >= 108 ? 88 : value + 0.25))
    }, 40)
    return () => window.clearInterval(id)
  }, [tuning])

  const changeStation = (target: number) => {
    if (tuning || target === stationIndex) return
    const wrapped = (target + stationCount) % stationCount
    audioRef.current?.pause()
    playSfx(clickSfx)
    setTuning(true)
    playSfx(tuneSfx)
    setScanFrequency(88)
    tuneTimerRef.current = window.setTimeout(() => {
      radioSession.stationIndex = wrapped
      setStationIndex(wrapped)
      setTrackIndex(0)
      setCurrentTime(0)
      setDuration(0)
      setTuning(false)
    }, 800)
  }

  const changeTrack = (direction: -1 | 1) => {
    const count = station.tracks.length
    if (count === 0) return
    playSfx(clickSfx)
    setTrackIndex((index) => (index + direction + count) % count)
    setCurrentTime(0)
  }

  const togglePower = () => {
    playSfx(clickSfx)
    setRadioOn((value) => !value)
  }

  const seek = (seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(seconds)) return
    audio.currentTime = seconds
    setCurrentTime(seconds)
  }

  const changeVolume = (value: number) => {
    const clamped = Math.min(100, Math.max(0, value))
    radioSession.volume = clamped
    setVolume(clamped)
    const audio = audioRef.current
    if (audio) audio.volume = clamped / 100
  }

  const value: RadioContextValue = {
    stationIndex,
    trackIndex,
    volume,
    radioOn,
    isPlaying,
    currentTime,
    duration,
    tuning,
    scanFrequency,
    frequency: station.frequency,
    stationName: station.name,
    trackName: track?.name,
    audioRef,
    changeStation,
    changeTrack,
    togglePower,
    seek,
    changeVolume,
  }

  return (
    <RadioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={track?.url}
        preload="auto"
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration)
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => changeTrack(1)}
        onError={() => setIsPlaying(false)}
      />
    </RadioContext.Provider>
  )
}
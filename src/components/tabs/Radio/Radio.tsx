import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import { playSfx } from '../../../utils/sfx'
import clickSfx from '../../../assets/sfx/mechanical-click.wav'
import tuneSfx from '../../../assets/sfx/electric-hum.wav'
import { RADIO_STATIONS, radioSession } from './radioStations'
import { RadioScope } from './RadioScope'
import './Radio.css'

export function Radio() {
  const [stationIndex, setStationIndex] = useState(radioSession.stationIndex)
  const [trackIndex, setTrackIndex] = useState(0)
  const [volume, setVolume] = useState(radioSession.volume)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [tuning, setTuning] = useState(false)
  const [scanFrequency, setScanFrequency] = useState(88)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const tuneTimerRef = useRef<number | null>(null)

  const station =
    RADIO_STATIONS[stationIndex] ?? RADIO_STATIONS[0]
  const tracks = station.tracks
  const track = tracks[trackIndex] ?? undefined

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
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
    return () => {
      audio.pause()
    }
  }, [track])

  useEffect(() => {
    if (!tuning) return
    const id = window.setInterval(() => {
      setScanFrequency((value) => (value >= 108 ? 88 : value + 0.25))
    }, 40)
    return () => window.clearInterval(id)
  }, [tuning])

  const changeStation = (target: number) => {
    if (tuning || target === stationIndex) return
    audioRef.current?.pause()
    playSfx(clickSfx)
    setTuning(true)
    playSfx(tuneSfx)
    tuneTimerRef.current = window.setTimeout(() => {
      radioSession.stationIndex = target
      setStationIndex(target)
      setTrackIndex(0)
      setCurrentTime(0)
      setDuration(0)
      setTuning(false)
    }, 800)
  }

  const changeTrack = (direction: -1 | 1) => {
    const count = tracks.length
    if (count === 0) return
    playSfx(clickSfx)
    setTrackIndex((index) => (index + direction + count) % count)
    setCurrentTime(0)
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !track) return
    playSfx(clickSfx)
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }

  const seek = (seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(seconds)) return
    audio.currentTime = seconds
    setCurrentTime(seconds)
  }

  const changeVolume = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    radioSession.volume = value
    setVolume(value)
    const audio = audioRef.current
    if (audio) audio.volume = value / 100
  }

  const showFrequency = tuning ? scanFrequency.toFixed(1) : station.frequency

  return (
    <div className="radio">
      <aside className="radio__panel">
        <div className="radio__dial">
          <p className="radio__dial-title">SINTONIZADOR</p>

          <div className="radio__knob-wrap">
            <div className="radio__knob" />
            <div
              className="radio__knob-hand"
              style={{ '--knob-angle': `${stationIndex * 140}deg` } as CSSProperties}
            />
            <span className="radio__knob-mark radio__knob-mark--a">A</span>
            <span className="radio__knob-mark radio__knob-mark--b">B</span>
          </div>

          <p className="radio__freq" aria-live="polite">
            {showFrequency}
            <span className="radio__freq-unit">MHz</span>
          </p>

          <div className="radio__scan">
            <button
              type="button"
              className="radio__scan-btn"
              onClick={() => changeStation(stationIndex - 1)}
              aria-label="Emisora anterior"
            >
              ◀
            </button>
            <span className="radio__scan-label">BUSCAR</span>
            <button
              type="button"
              className="radio__scan-btn"
              onClick={() => changeStation(stationIndex + 1)}
              aria-label="Emisora siguiente"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="radio__list">
          <p className="radio__list-title">EMISORAS</p>
          {RADIO_STATIONS.map((preset, index) => {
            const active = index === stationIndex
            const offAir = preset.tracks.length === 0
            return (
              <button
                key={preset.id}
                type="button"
                className={[
                  'radio__station',
                  active ? 'radio__station--active' : '',
                  offAir ? 'radio__station--offair' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => changeStation(index)}
              >
                <span className="radio__station-mark" aria-hidden="true" />
                <span className="radio__station-name">{preset.name}</span>
              </button>
            )
          })}
        </div>
      </aside>

      <section className="radio__display">
        <div className="radio__stage">
          {track ? (
            <>
              <div className="radio__now">
                <span className="radio__now-name">
                  <span className="radio__track-icon" aria-hidden="true">
                    {isPlaying ? '♪' : '…'}
                  </span>
                  {track.name}
                </span>
                <span className="radio__now-times">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <input
                className="radio__seek"
                type="range"
                min={0}
                max={duration > 0 ? duration : 1}
                step={0.1}
                value={Math.min(currentTime, duration > 0 ? duration : 1)}
                onChange={(event) => seek(Number(event.target.value))}
                aria-label="Posición de la pista"
              />
            </>
          ) : (
            <div className="radio__missing">
              <p className="radio__missing-title">SEÑAL NO DISPONIBLE</p>
              <p className="radio__missing-hint">
                LA CARPETA DE LA EMISORA ESTÁ VACÍA
              </p>
              <p className="radio__missing-sub">
                ARRASTRA MP3 A SYS:\AUDIO\RADIO\ESTACION-{stationIndex + 1}
              </p>
            </div>
          )}

          <RadioScope audioRef={audioRef} isPlaying={isPlaying} />

          <div className="radio__transport">
            <button
              type="button"
              className="radio__transport-btn"
              onClick={() => changeTrack(-1)}
              aria-label="Pista anterior"
            >
              ⟨⟨
            </button>
            <button
              type="button"
              className="radio__transport-btn radio__transport-btn--play"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? '││' : '▶'}
            </button>
            <button
              type="button"
              className="radio__transport-btn"
              onClick={() => changeTrack(1)}
              aria-label="Pista siguiente"
            >
              ⟩⟩
            </button>
          </div>

          <div className="radio__volume">
            <span className="radio__volume-label">VOL</span>
            <input
              className="radio__volume-slider"
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={changeVolume}
              aria-label="Volumen"
            />
            <span className="radio__volume-value">{volume}%</span>
          </div>

          {tuning && (
            <div className="radio__tune" role="status">
              <span className="radio__tune-text">SINTONIZANDO…</span>
            </div>
          )}
        </div>

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
      </section>
    </div>
  )
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${rest}`
}
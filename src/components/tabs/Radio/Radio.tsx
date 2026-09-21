import type { CSSProperties } from 'react'
import { RADIO_STATIONS } from './radioStations'
import { useRadio } from './radioContext'
import { RadioScope } from './RadioScope'
import './Radio.css'

const TICK_COUNT = 20
const TICK_STEP = 360 / TICK_COUNT

function KnobTicks() {
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = i * TICK_STEP
    const isMajor = i % 5 === 0
    return (
      <span
        key={i}
        className={`radio__knob-tick ${isMajor ? 'radio__knob-tick--major' : 'radio__knob-tick--minor'}`}
        style={{ transform: `rotate(${angle}deg)` } as CSSProperties}
      />
    )
  })
  return <div className="radio__knob-ticks" aria-hidden="true">{ticks}</div>
}

function HudCorners() {
  return (
    <div className="radio__corners" aria-hidden="true">
      <span className="radio__corner radio__corner--tl" />
      <span className="radio__corner radio__corner--tr" />
      <span className="radio__corner radio__corner--bl" />
      <span className="radio__corner radio__corner--br" />
    </div>
  )
}

export function Radio() {
  const {
    stationIndex,
    volume,
    radioOn,
    isPlaying,
    currentTime,
    duration,
    tuning,
    scanFrequency,
    frequency,
    trackName,
    audioRef,
    changeStation,
    changeTrack,
    togglePower,
    seek,
    changeVolume,
  } = useRadio()

  const showFrequency = tuning ? scanFrequency.toFixed(1) : frequency

  return (
    <div className="radio">
      <aside className="radio__left-col">
        <section className="radio__panel radio__panel--tuner">
          <HudCorners />
          <div className="radio__dial">
            <p className="radio__dial-title">SINTONIZADOR</p>

            <div className="radio__knob-wrap">
              <div className="radio__knob" />
              <KnobTicks />
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
        </section>

        <section className="radio__panel radio__panel--list">
          <HudCorners />
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
        </section>
      </aside>

      <section className="radio__right-col">
        <section className="radio__panel radio__panel--scope">
          <HudCorners />
          <div className="radio__scope-panel">
            {trackName ? (
              <>
                <div className="radio__now">
                  <span className="radio__now-name">
                    <span className="radio__track-icon" aria-hidden="true">
                      {isPlaying ? '♪' : '…'}
                    </span>
                    {trackName}
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
          </div>
        </section>

        <section className="radio__panel radio__panel--controls">
          <HudCorners />
          <div className="radio__controls-panel">
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
                onClick={togglePower}
                aria-pressed={radioOn}
                aria-label={radioOn ? 'Apagar la radio' : 'Encender la radio'}
              >
                {radioOn ? 'ON' : 'OFF'}
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
                onChange={(event) => changeVolume(Number(event.target.value))}
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
        </section>
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
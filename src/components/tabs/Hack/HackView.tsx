import { useEffect, useState } from 'react'
import { TabNav } from '../../TabNav/TabNav'
import submoduleChangeSfx from '../../../assets/sfx/submodule_change.ogg'
import clickSfx from '../../../assets/sfx/mechanical-click.wav'
import okSfx from '../../../assets/sfx/UI_Pipboy_OK.ogg'
import blockedSfx from '../../../assets/sfx/electric-hum.wav'
import dudSfx from '../../../assets/sfx/computer-beep.wav'
import restartSfx from '../../../assets/sfx/toggle-switch.mp3'
import { playSfx } from '../../../utils/sfx'
import {
  DIFFICULTIES,
  MAX_ATTEMPTS,
  applyDud,
  applyGuess,
  createGame,
  isWordRemoved,
} from './hackGame'
import type { Game, Slot } from './hackGame'
import type { DifficultyId } from './hackTypes'
import { getBucketsSync, loadDictionary } from './words'
import './HackView.css'

const DIFFICULTY_LABELS = DIFFICULTIES.map((difficulty) => difficulty.label)
const BOOT_TEXT =
  'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL\nENTER PASSWORD NOW'

export function HackView() {
  const [difficultyId, setDifficultyId] = useState<DifficultyId>('novato')
  const [game, setGame] = useState<Game | null>(() => {
    const buckets = getBucketsSync()
    return buckets ? createGame('novato', buckets) : null
  })
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    () => (getBucketsSync() ? 'ready' : 'loading'),
  )
  const [bootChars, setBootChars] = useState(0)

  useEffect(() => {
    if (getBucketsSync()) return

    let cancelled = false
    loadDictionary()
      .then((loaded) => {
        if (!cancelled) {
          setGame(createGame(difficultyId, loaded))
          setLoadState('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState('error')
      })

    return () => {
      cancelled = true
    }
  }, [difficultyId])

  useEffect(() => {
    const step = Math.max(1, Math.ceil(BOOT_TEXT.length / 60))
    const id = window.setInterval(() => {
      setBootChars((previous) => {
        const next = Math.min(previous + step, BOOT_TEXT.length)
        if (next === BOOT_TEXT.length) window.clearInterval(id)
        return next
      })
    }, 16)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!game || game.phase !== 'accessing') return
    const id = window.setTimeout(() => {
      setGame((current) =>
        current && current.phase === 'accessing'
          ? { ...current, phase: 'success' }
          : current,
      )
    }, 1600)
    return () => window.clearTimeout(id)
  }, [game])

  const booted = bootChars >= BOOT_TEXT.length

  const skipBoot = () => {
    if (booted) return
    setBootChars(BOOT_TEXT.length)
  }

  const newGame = () => {
    playSfx(restartSfx)
    const buckets = getBucketsSync()
    if (buckets) setGame(createGame(difficultyId, buckets))
  }

  const retry = () => {
    setLoadState('loading')
    loadDictionary()
      .then((loaded) => {
        setGame(createGame(difficultyId, loaded))
        setLoadState('ready')
      })
      .catch(() => {
        setLoadState('error')
      })
  }

  const handleDifficulty = (label: string) => {
    const next = DIFFICULTIES.find((difficulty) => difficulty.label === label)
    if (!next) return
    setDifficultyId(next.id)
    const buckets = getBucketsSync()
    if (buckets) {
      setGame(createGame(next.id, buckets))
      setLoadState('ready')
    }
  }

  const handleGuess = (slot: Slot) => {
    if (!game || game.phase !== 'playing' || slot.wordIndex === undefined) return
    const next = applyGuess(game, slot.wordIndex)
    setGame(next)
    if (next.phase === 'accessing') playSfx(okSfx)
    else if (next.phase === 'blocked') playSfx(blockedSfx)
    else playSfx(clickSfx)
  }

  const handleDud = (slot: Slot) => {
    if (!game || game.phase !== 'playing') return
    setGame(applyDud(game, slot.id))
    playSfx(dudSfx)
  }

  const renderSlot = (slot: Slot) => {
    if (slot.kind === 'noise') {
      return <span className="terminal__cell">{slot.text}</span>
    }

    if (slot.kind === 'dud') {
      return (
        <span className="terminal__cell">
          {slot.prefix}
          <button
            type="button"
            className="hack-word hack-word--dud"
            onClick={() => handleDud(slot)}
          >
            {slot.text}
          </button>
          {slot.suffix}
        </span>
      )
    }

    if (game && isWordRemoved(game, slot)) {
      return (
        <span className="terminal__cell">
          {slot.prefix}
          {slot.text}
          {slot.suffix}
        </span>
      )
    }

    const struck = game ? game.struck.has(slot.wordIndex as number) : false
    return (
      <span className="terminal__cell">
        {slot.prefix}
        <button
          type="button"
          className={
            struck ? 'hack-word hack-word--struck' : 'hack-word'
          }
          disabled={struck}
          onClick={() => handleGuess(slot)}
        >
          {slot.text}
        </button>
        {slot.suffix}
      </span>
    )
  }

  if (loadState === 'loading') {
    return (
      <div className="hack hack--status">
        <p className="hack__status-text">INICIANDO TERMINAL...</p>
        <span className="terminal__cursor" />
      </div>
    )
  }

  if (loadState === 'error' || game === null) {
    return (
      <div className="hack hack--status">
        <p className="hack__status-text">ERROR DE DICCIONARIO</p>
        <button type="button" className="hack-button" onClick={retry}>
          REINTENTAR
        </button>
      </div>
    )
  }

  const remaining = MAX_ATTEMPTS - game.attemptsUsed

  return (
    <div className="hack">
      <div className="hack__top">
        <TabNav
          tabs={DIFFICULTY_LABELS}
          activeTab={game.difficulty.label}
          onSelect={handleDifficulty}
          label="Dificultad"
          confirmSfx={submoduleChangeSfx}
          variant="secondary"
        />
      </div>

      <div className="hack__body">
        <div className="terminal">
          <div
            className={booted ? 'terminal__boot terminal__boot--done' : 'terminal__boot'}
            onClick={skipBoot}
          >
            {BOOT_TEXT.slice(0, bootChars)}
            {!booted && <span className="terminal__cursor" />}
          </div>

          {booted && (
            <>
              <div className="terminal__attempts">
                <span className="terminal__attempts-text">
                  &gt;Attempt(s) Remaining: {remaining}
                </span>
                <span className="terminal__attempts-blocks" aria-hidden="true">
                  {Array.from({ length: MAX_ATTEMPTS }, (_, index) => (
                    <span
                      key={index}
                      className={
                        index < remaining
                          ? 'terminal__attempt-block terminal__attempt-block--on'
                          : 'terminal__attempt-block'
                      }
                    >
                      {index < remaining ? '■' : '□'}
                    </span>
                  ))}
                </span>
              </div>

              <div className="terminal__memory">
                {game.lines.map((line) => (
                  <div key={line.row} className="terminal__line">
                    <span className="terminal__addr">{line.address}</span>
                    <span className="terminal__col">{renderSlot(line.colA)}</span>
                    <span className="terminal__col terminal__col--b">
                      {renderSlot(line.colB)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="terminal__log">
                {game.log.map((line, index) => (
                  <div key={index} className="terminal__log-line">
                    {line}
                  </div>
                ))}
              </div>

              <div className="terminal__prompt">
                <span>&gt; </span>
                <span className="terminal__cursor" />
              </div>
            </>
          )}

          {game.phase === 'success' && (
            <div className="terminal__overlay">
              <p className="terminal__overlay-line">
                [ACCESO CONCEDIDO — CONTENIDO PENDIENTE]
              </p>
              <button type="button" className="hack-button" onClick={newGame}>
                REINICIAR
              </button>
            </div>
          )}

          {game.phase === 'blocked' && (
            <div className="terminal__overlay">
              <p className="terminal__overlay-line">&gt;Attempt(s) Remaining: 0</p>
              <p className="terminal__overlay-line">&gt;TERMINAL LOCKED</p>
              <p className="terminal__overlay-line">
                &gt;PLEASE CONTACT AN ADMINISTRATOR
              </p>
              <button type="button" className="hack-button" onClick={newGame}>
                REINICIAR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
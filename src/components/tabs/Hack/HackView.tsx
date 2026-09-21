import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { TabNav } from '../../TabNav/TabNav'
import submoduleChangeSfx from '../../../assets/sfx/submodule_change.ogg'
import clickSfx from '../../../assets/sfx/mechanical-click.wav'
import okSfx from '../../../assets/sfx/UI_Pipboy_OK.ogg'
import blockedSfx from '../../../assets/sfx/electric-hum.wav'
import dudSfx from '../../../assets/sfx/computer-beep.wav'
import restartSfx from '../../../assets/sfx/toggle-switch.mp3'
import { playSfx } from '../../../utils/sfx'
import {
  DEFAULT_COLS,
  DEFAULT_ROWS,
  DIFFICULTIES,
  MAX_ATTEMPTS,
  MIN_COLS,
  MIN_ROWS,
  applyDud,
  applyGuess,
  createGame,
  parseLineTokens,
} from './hackGame'
import type { BoardLine, Game } from './hackGame'
import type { DifficultyId } from './hackTypes'
import { getBucketsSync, loadDictionary } from './words'
import './HackView.css'

const DIFFICULTY_LABELS = DIFFICULTIES.map((difficulty) => difficulty.label)
const BOOT_TEXT =
  'ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL\nENTER PASSWORD NOW'
const PROBE_TEXT = 'MMMMMMMMMM'

interface BoardSize {
  cols: number
  rows: number
}

export function HackView() {
  const [difficultyId, setDifficultyId] = useState<DifficultyId>('novato')
  const [game, setGame] = useState<Game | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const [bootChars, setBootChars] = useState(0)
  const memoryRef = useRef<HTMLDivElement | null>(null)
  const sizeRef = useRef<BoardSize>({ cols: DEFAULT_COLS, rows: DEFAULT_ROWS })

  useEffect(() => {
    let cancelled = false
    loadDictionary()
      .then(() => {
        if (!cancelled) setLoadState('ready')
      })
      .catch(() => {
        if (!cancelled) setLoadState('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const booted = bootChars >= BOOT_TEXT.length

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
    const element = memoryRef.current
    if (!element) return

    const measure = () => {
      const probe = element.querySelector<HTMLSpanElement>('.terminal__probe')
      if (!probe) return
      const style = window.getComputedStyle(element)
      const charWidth = probe.offsetWidth / PROBE_TEXT.length
      const lineHeight =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) || 16

      const cols = Math.max(
        MIN_COLS,
        Math.floor(element.clientWidth / charWidth),
      )
      const rows = Math.max(MIN_ROWS, Math.floor(element.clientHeight / lineHeight))
      sizeRef.current = { cols, rows }
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [booted])

  useEffect(() => {
    if (!booted || loadState !== 'ready') return
    const buckets = getBucketsSync()
    if (!buckets) return
    const { cols, rows } = sizeRef.current
    setGame(createGame(difficultyId, buckets, cols, rows))
  }, [booted, loadState, difficultyId])

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

  const skipBoot = () => {
    if (booted) return
    setBootChars(BOOT_TEXT.length)
  }

  const newGame = () => {
    playSfx(restartSfx)
    const buckets = getBucketsSync()
    if (!buckets) return
    const { cols, rows } = sizeRef.current
    setGame(createGame(difficultyId, buckets, cols, rows))
  }

  const retry = () => {
    setLoadState('loading')
    loadDictionary()
      .then(() => setLoadState('ready'))
      .catch(() => setLoadState('error'))
  }

  const handleDifficulty = (label: string) => {
    const next = DIFFICULTIES.find((difficulty) => difficulty.label === label)
    if (!next) return
    setDifficultyId(next.id)
  }

  const handleGuess = (wordIndex: number) => {
    if (!game || game.phase !== 'playing') return
    const next = applyGuess(game, wordIndex)
    setGame(next)
    if (next.phase === 'accessing') playSfx(okSfx)
    else if (next.phase === 'blocked') playSfx(blockedSfx)
    else playSfx(clickSfx)
  }

  const handleDud = (slotId: string) => {
    if (!game || game.phase !== 'playing') return
    setGame(applyDud(game, slotId))
    playSfx(dudSfx)
  }

  const renderLine = (line: BoardLine) => {
    const tokens = parseLineTokens(line)
    const children: ReactNode[] = []
    let cursor = 0
    const lineKey = `${line.column}-${line.row}`

    tokens.forEach((token) => {
      if (token.start > cursor) {
        children.push(
          <span key={`noise-${lineKey}-${cursor}`}>
            {line.content.slice(cursor, token.start)}
          </span>,
        )
      }

      const isDud = token.kind === 'dud'
      const dudUsed = game ? game.usedDuds.has(token.id) : false

      if (isDud) {
        if (dudUsed) {
          children.push(
            <span
              key={token.id}
              className="hack-token hack-token--dud hack-token--dud--used"
            >
              {token.text}
            </span>,
          )
} else {
           children.push(
             <span
               key={token.id}
               className="hack-token hack-token--dud"
               onClick={(e) => {
                const target = e.currentTarget as HTMLElement
                const rect = target.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const charWidth = rect.width / token.text.length
                const clickedCharIndex = Math.floor(clickX / charWidth)
                if (clickedCharIndex === 0) {
                  handleDud(token.id)
                }
              }}
            >
              {token.text}
            </span>,
          )
        }
      } else {
        const wordIndex = token.wordIndex as number
        const removed = game ? game.removed.has(wordIndex) : false
        const struck = game ? game.struck.has(wordIndex) : false

        if (removed) {
          children.push(<span key={token.id}>{token.text}</span>)
        } else {
          const displayText = struck ? '.'.repeat(token.text.length) : token.text
          children.push(
            <span
              key={token.id}
              className={`hack-token hack-token--word${struck ? ' hack-token--struck' : ''}`}
              onClick={() => handleGuess(wordIndex)}
            >
              {displayText}
            </span>,
          )
        }
      }

      cursor = token.end
    })

    if (cursor < line.content.length) {
      children.push(
        <span key={`noise-end-${lineKey}-${cursor}`}>
          {line.content.slice(cursor)}
        </span>,
      )
    }

    return (
      <div key={lineKey} className="terminal__line">
        <span className="terminal__addr">{line.address}</span>
        <span className="terminal__content">{children}</span>
      </div>
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

  if (loadState === 'error') {
    return (
      <div className="hack hack--status">
        <p className="hack__status-text">ERROR DE DICCIONARIO</p>
        <button type="button" className="hack-button" onClick={retry}>
          REINTENTAR
        </button>
      </div>
    )
  }

  const remaining = game ? MAX_ATTEMPTS - game.attemptsUsed : MAX_ATTEMPTS

  return (
    <div className="hack">
      <div className="hack__top">
        <TabNav
          tabs={DIFFICULTY_LABELS}
          activeTab={game?.difficulty.label ?? DIFFICULTIES[0].label}
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
                  {'>'}Attempt(s) Remaining: {remaining}
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

              <div ref={memoryRef} className="terminal__memory">
                <span className="terminal__probe" aria-hidden="true">
                  {PROBE_TEXT}
                </span>
                {game &&
                  [0, 1].map((column) => (
                    <div
                      key={column}
                      className="terminal__column"
                      data-column={column}
                    >
                      {game.lines
                        .filter((line) => line.column === column)
                        .map((line) => renderLine(line))}
                    </div>
                  ))}
              </div>

              <div className="terminal__log">
                {game &&
                  game.log.map((line, index) => (
                    <div key={index} className="terminal__log-line">
                      {line}
                    </div>
                  ))}
              </div>

              <div className="terminal__prompt">
                <span>{'>'} </span>
                <span className="terminal__cursor" />
              </div>
            </>
          )}

          {game?.phase === 'success' && (
            <div className="terminal__overlay">
              <p className="terminal__overlay-line">
                [ACCESO CONCEDIDO — CONTENIDO PENDIENTE]
              </p>
              <button type="button" className="hack-button" onClick={newGame}>
                REINICIAR
              </button>
            </div>
          )}

          {game?.phase === 'blocked' && (
            <div className="terminal__overlay">
              <p className="terminal__overlay-line">{'>'}Attempt(s) Remaining: 0</p>
              <p className="terminal__overlay-line">{'>'}TERMINAL LOCKED</p>
              <p className="terminal__overlay-line">
                {'>'}PLEASE CONTACT AN ADMINISTRATOR
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
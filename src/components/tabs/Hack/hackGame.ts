import type { Difficulty, DifficultyId } from './hackTypes'
import type { WordBuckets } from './words'

export const MAX_ATTEMPTS = 4
export const GRID_ROWS = 11

const DUD_TYPES: readonly string[] = ['<>', '{}', '[]', '()']
const DUD_COUNT = 3
const MIN_WORDS = 8
const MAX_WORDS = 10
const MARGIN = 2 // noise cells framing each word / dud on each side
const NOISE_BASE = '.,;:!?'
const NOISE_EXTRA: Record<DifficultyId, string> = {
  novato: '()',
  avanzado: '()[]',
  experto: '()[]{}/\\=+-*#%',
  maestro: '()[]{}/\\=+-*#%@&_|"$^~<>',
}
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const HEX = '0123456789ABCDEF'

export const DIFFICULTIES: readonly Difficulty[] = [
  {
    id: 'novato',
    label: 'NOVATO',
    minLen: 4,
    maxLen: 5,
    symbols: NOISE_EXTRA.novato,
    spaceChance: 0.22,
  },
  {
    id: 'avanzado',
    label: 'AVANZADO',
    minLen: 6,
    maxLen: 7,
    symbols: NOISE_EXTRA.avanzado,
    spaceChance: 0.14,
  },
  {
    id: 'experto',
    label: 'EXPERTO',
    minLen: 8,
    maxLen: 9,
    symbols: NOISE_EXTRA.experto,
    spaceChance: 0.08,
  },
  {
    id: 'maestro',
    label: 'MAESTRO',
    minLen: 10,
    maxLen: 12,
    symbols: NOISE_EXTRA.maestro,
    spaceChance: 0.05,
  },
]

export type SlotKind = 'word' | 'dud' | 'noise'

export interface Slot {
  id: string
  col: 0 | 1
  row: number
  kind: SlotKind
  /** Index into Game.candidates, set on `word` slots. */
  wordIndex?: number
  /** The pair of characters, set on `dud` slots. */
  dudType?: string
  prefix: string
  text: string
  suffix: string
}

export interface BoardLine {
  row: number
  address: string
  colA: Slot
  colB: Slot
}

export interface Game {
  difficulty: Difficulty
  wordLen: number
  candidates: readonly string[]
  correctIndex: number
  lines: readonly BoardLine[]
  attemptsUsed: number
  /** Candidate indexes already tried and marked as wrong. */
  struck: ReadonlySet<number>
  /** Candidate indexes erased from the board by a dud. */
  removed: ReadonlySet<number>
  /** Console feedback lines (">[WORD]" / ">Entry Denied" / ">X/Y correct"). */
  log: readonly string[]
  phase: 'playing' | 'accessing' | 'success' | 'blocked'
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)]
}

function shuffle<T>(list: readonly T[]): T[] {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    const tmp = copy[i]
    copy[i] = copy[j]
    copy[j] = tmp
  }
  return copy
}

function makeNoise(length: number, difficulty: Difficulty): string {
  const symbols = NOISE_BASE + difficulty.symbols
  let out = ''
  for (let i = 0; i < length; i++) {
    const roll = Math.random()
    if (roll < difficulty.spaceChance) {
      out += ' '
    } else if (roll < difficulty.spaceChance + 0.25) {
      out += LETTERS[randInt(0, LETTERS.length - 1)]
    } else {
      out += symbols[randInt(0, symbols.length - 1)]
    }
  }
  return out
}

function makeAddress(): string {
  let hex = ''
  for (let i = 0; i < 4; i++) hex += HEX[randInt(0, HEX.length - 1)]
  return `0x${hex}`
}

/** How many character positions match exactly, the game's core hint. */
export function likeness(guess: string, correct: string): number {
  let count = 0
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === correct[i]) count++
  }
  return count
}

interface Cell {
  col: 0 | 1
  row: number
}

function buildLines(
  wordLen: number,
  difficulty: Difficulty,
  candidates: readonly string[],
): BoardLine[] {
  const cells: Cell[] = []
  for (let row = 0; row < GRID_ROWS; row++) {
    for (const col of [0, 1] as const) cells.push({ col, row })
  }

  const slotWidth = wordLen + MARGIN * 2
  const byCell = new Map<string, Slot>()
  const key = (cell: Cell) => `${cell.col}:${cell.row}`
  let cellIndex = 0

  for (let i = 0; i < candidates.length; i++) {
    const cell = cells[cellIndex++]
    byCell.set(key(cell), {
      id: `w${cell.col}-${cell.row}`,
      col: cell.col,
      row: cell.row,
      kind: 'word',
      wordIndex: i,
      prefix: makeNoise(MARGIN, difficulty),
      text: candidates[i],
      suffix: makeNoise(MARGIN, difficulty),
    })
  }

  for (let i = 0; i < DUD_COUNT; i++) {
    const cell = cells[cellIndex++]
    const dudType = pick(DUD_TYPES)
    byCell.set(key(cell), {
      id: `d${cell.col}-${cell.row}`,
      col: cell.col,
      row: cell.row,
      kind: 'dud',
      dudType,
      prefix: makeNoise(MARGIN, difficulty),
      text: dudType,
      suffix: makeNoise(MARGIN, difficulty),
    })
  }

  for (; cellIndex < cells.length; cellIndex++) {
    const cell = cells[cellIndex]
    byCell.set(key(cell), {
      id: `n${cell.col}-${cell.row}`,
      col: cell.col,
      row: cell.row,
      kind: 'noise',
      prefix: '',
      text: makeNoise(slotWidth, difficulty),
      suffix: '',
    })
  }

  const lines: BoardLine[] = []
  for (let row = 0; row < GRID_ROWS; row++) {
    lines.push({
      row,
      address: makeAddress(),
      colA: byCell.get(`0:${row}`)!,
      colB: byCell.get(`1:${row}`)!,
    })
  }
  return lines
}

/** Builds a brand-new random game for the given difficulty. */
export function createGame(
  difficultyId: DifficultyId,
  buckets: WordBuckets,
): Game {
  const difficulty =
    DIFFICULTIES.find((item) => item.id === difficultyId) ?? DIFFICULTIES[0]

  let wordLen = randInt(difficulty.minLen, difficulty.maxLen)
  let pool = buckets.get(wordLen)
  if (!pool || pool.length < MIN_WORDS) {
    wordLen = difficulty.minLen
    pool = buckets.get(wordLen) ?? []
  }

  const count = pool.length >= MAX_WORDS ? randInt(MIN_WORDS, MAX_WORDS) : pool.length
  const candidates = shuffle(pool).slice(0, count)
  const correctIndex = randInt(0, candidates.length - 1)

  return {
    difficulty,
    wordLen,
    candidates,
    correctIndex,
    lines: buildLines(wordLen, difficulty, candidates),
    attemptsUsed: 0,
    struck: new Set(),
    removed: new Set(),
    log: [],
    phase: 'playing',
  }
}

/** Replaces a slot on the board with pure noise (used by duds). */
function replaceWithNoise(
  lines: readonly BoardLine[],
  slotId: string,
  difficulty: Difficulty,
  wordLen: number,
): BoardLine[] {
  const slotWidth = wordLen + MARGIN * 2
  return lines.map((line) => {
    if (line.colA.id === slotId) {
      return {
        ...line,
        colA: {
          ...line.colA,
          kind: 'noise' as const,
          dudType: undefined,
          prefix: '',
          text: makeNoise(slotWidth, difficulty),
          suffix: '',
        },
      }
    }
    if (line.colB.id === slotId) {
      return {
        ...line,
        colB: {
          ...line.colB,
          kind: 'noise' as const,
          dudType: undefined,
          prefix: '',
          text: makeNoise(slotWidth, difficulty),
          suffix: '',
        },
      }
    }
    return line
  })
}

/**
 * Selects a candidate word. Wrong words cost an attempt and log the exact
 * FO3/NV feedback ("[WORD]" / ">Entry Denied" / ">X/Y correct"); the correct
 * word logs the match lines and moves to the "accessing" phase.
 */
export function applyGuess(game: Game, wordIndex: number): Game {
  if (game.phase !== 'playing') return game

  const word = game.candidates[wordIndex]

  if (wordIndex === game.correctIndex) {
    return {
      ...game,
      phase: 'accessing',
      log: [
        ...game.log,
        `>${word}`,
        '>Exact match!',
        '>Please wait while system is accessed...',
      ],
    }
  }

  const value = likeness(word, game.candidates[game.correctIndex])
  const struck = new Set(game.struck).add(wordIndex)
  const attemptsUsed = game.attemptsUsed + 1
  const phase = attemptsUsed >= MAX_ATTEMPTS ? 'blocked' : 'playing'

  const log = [
    ...game.log,
    `>${word}`,
    '>Entry Denied',
    `>${value}/${word.length} correct`,
  ]
  if (phase === 'blocked') log.push('>Attempt(s) Remaining: 0')

  return {
    ...game,
    struck,
    attemptsUsed,
    phase,
    log,
  }
}

/**
 * Triggers a dud pair. Two random effects, picked each time it is used:
 * either one remaining wrong word vanishes (replaced with noise) or the
 * used attempts are reset to zero. Never consumes an attempt; the pair is
 * consumed on use (replaced with noise).
 */
export function applyDud(game: Game, slotId: string): Game {
  if (game.phase !== 'playing') return game

  let lines = replaceWithNoise(game.lines, slotId, game.difficulty, game.wordLen)

  if (Math.random() < 0.5) {
    // Remove a wrong, still-present word from the board.
    const removable = lines.flatMap((line) => [line.colA, line.colB]).find(
      (slot) =>
        slot.kind === 'word' &&
        slot.wordIndex !== undefined &&
        slot.wordIndex !== game.correctIndex &&
        !game.struck.has(slot.wordIndex) &&
        !game.removed.has(slot.wordIndex),
    )

    if (removable) {
      lines = replaceWithNoise(lines, removable.id, game.difficulty, game.wordLen)
      return {
        ...game,
        lines,
        removed: new Set(game.removed).add(removable.wordIndex as number),
      }
    }

    return { ...game, lines }
  }

  return {
    ...game,
    lines,
    attemptsUsed: 0,
  }
}

export function isWordRemoved(game: Game, slot: Slot): boolean {
  return slot.wordIndex !== undefined && game.removed.has(slot.wordIndex)
}
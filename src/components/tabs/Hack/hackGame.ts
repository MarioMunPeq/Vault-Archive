import type { Difficulty, DifficultyId } from './hackTypes'
import type { WordBuckets } from './words'

export const MAX_ATTEMPTS = 4

/** Safe lower bounds for the measured board so games always fit. */
export const MIN_COLS = 48
export const MIN_ROWS = 12

/** Defaults used before the terminal is measured (or in unit-test scripts). */
export const DEFAULT_COLS = 76
export const DEFAULT_ROWS = 14

/** "0x" + 6 hex digits + 1 separating space (per line, both columns). */
export const ADDRESS_WIDTH = 9

/** Separator (in characters) between the two memory columns. */
export const COLUMN_GAP = 2

const DUD_TYPES: readonly string[] = ['<>', '{}', '[]', '()']
const DUD_COUNT = 3
const MIN_WORDS = 8
const MAX_WORDS = 10
const NOISE_BASE = ".,;:!?'`-"
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
    letterChance: 0.1,
  },
  {
    id: 'avanzado',
    label: 'AVANZADO',
    minLen: 6,
    maxLen: 7,
    symbols: NOISE_EXTRA.avanzado,
    letterChance: 0.09,
  },
  {
    id: 'experto',
    label: 'EXPERTO',
    minLen: 8,
    maxLen: 9,
    symbols: NOISE_EXTRA.experto,
    letterChance: 0.08,
  },
  {
    id: 'maestro',
    label: 'MAESTRO',
    minLen: 10,
    maxLen: 12,
    symbols: NOISE_EXTRA.maestro,
    letterChance: 0.07,
  },
]

export type MemorySlotKind = 'word' | 'dud'

/** A clickable run of characters inside a board line. */
export interface MemorySlot {
  id: string
  lineIndex: number
  /** Column in the line's content where the token starts. */
  col: number
  /** Token length in characters. */
  length: number
  kind: MemorySlotKind
  /** Index into Game.candidates, set on `word` slots. */
  wordIndex?: number
  /** The pair of characters, set on `dud` slots. */
  dudType?: string
}

export interface BoardSegment {
  kind: MemorySlotKind | 'noise'
  /** Column in the line's content where the segment starts. */
  start: number
  text: string
  slot?: MemorySlot
}

export interface BoardLine {
  /** Vertical index inside its own column. */
  row: number
  /** 0 = left column, 1 = right column. */
  column: 0 | 1
  address: string
  content: string
  segments: readonly BoardSegment[]
}

/**
 * One selectable token inside a board line. Every candidate word and every
 * complete matching bracket pair (`<...>`, `{...}`, `[...]`, `(...)`) is a
 * separate token; anything else is inert noise.
 */
export interface LineToken {
  /** Column in the line's content where the token starts. */
  start: number
  /** Column just after the token (exclusive end). */
  end: number
  text: string
  kind: MemorySlotKind
  /** Index into Game.candidates, set on `word` tokens. */
  wordIndex?: number
  /** Stable id (words reuse their slot id, duds encode line + range). */
  id: string
}

/** Opening bracket -> the closing bracket that completes the dud pair. */
const DUD_OPENER: Record<string, string> = {
  '<': '>',
  '{': '}',
  '[': ']',
  '(': ')',
}

/**
 * Parses one board line into selectable tokens by scanning the full rendered
 * text once, before drawing. Words come from the placed slots; every matching
 * bracket pair anywhere in the content (even pairs hidden inside the noise)
 * becomes its own dud token, exactly like the real terminal. A bracket without
 * its same-type closer on the same line is pure inert noise, never a token.
 * A pair is only a dud when no candidate word sits between its brackets, so a
 * word is always selectable on its own.
 */
export function parseLineTokens(line: BoardLine): LineToken[] {
  const content = line.content
  const words = line.segments
    .filter((segment) => segment.kind === 'word')
    .map((segment) => ({
      start: segment.start,
      end: segment.start + segment.text.length,
      wordIndex: (segment.slot as MemorySlot).wordIndex as number,
      id: (segment.slot as MemorySlot).id,
    }))
    .sort((a, b) => a.start - b.start)

  const tokens: LineToken[] = []
  let cursor = 0

  while (cursor < content.length) {
    const word = words.find((w) => w.start === cursor)
    if (word) {
      tokens.push({
        start: word.start,
        end: word.end,
        text: content.slice(word.start, word.end),
        kind: 'word',
        wordIndex: word.wordIndex,
        id: word.id,
      })
      cursor = word.end
      continue
    }

    const closer = DUD_OPENER[content[cursor]]
    if (closer) {
      const close = content.indexOf(closer, cursor + 1)
      const spansWord = close !== -1 && words.some(
        (w) => w.start > cursor && w.start < close + 1,
      )
      if (close !== -1 && !spansWord) {
        const end = close + 1
        tokens.push({
          start: cursor,
          end,
          text: content.slice(cursor, end),
          kind: 'dud',
          id: `d${line.column}-${line.row}:${cursor}:${end}`,
        })
        cursor = end
        continue
      }
    }

    cursor++
  }

  return tokens
}

export interface Game {
  difficulty: Difficulty
  wordLen: number
  /** Total measure characters across both columns (addresses + gap included). */
  cols: number
  /** Characters of text per column line, addresses excluded. */
  contentWidth: number
  rows: number
  candidates: readonly string[]
  correctIndex: number
  lines: readonly BoardLine[]
  attemptsUsed: number
  /** Candidate indexes already tried and marked as wrong. */
  struck: ReadonlySet<number>
  /** Candidate indexes erased from the board by a dud. */
  removed: ReadonlySet<number>
  /** Ids of dud pairs that have already been activated (kept visible but dead). */
  usedDuds: ReadonlySet<string>
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
    if (Math.random() < difficulty.letterChance) {
      out += LETTERS[randInt(0, LETTERS.length - 1)]
    } else {
      out += symbols[randInt(0, symbols.length - 1)]
    }
  }
  return out
}

function makeAddress(): string {
  let hex = ''
  for (let i = 0; i < 6; i++) hex += HEX[randInt(0, HEX.length - 1)]
  return `0x${hex} `
}

/** How many character positions match exactly, the game's core hint. */
export function likeness(guess: string, correct: string): number {
  let count = 0
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === correct[i]) count++
  }
  return count
}

interface PlannedToken {
  lineIndex: number
  col: number
  text: string
  kind: MemorySlotKind
  wordIndex?: number
  dudType?: string
}

/** Characters of text per column line (addresses and gap excluded). */
function contentWidthFor(cols: number): number {
  return Math.max(13, Math.floor((cols - 2 * ADDRESS_WIDTH - COLUMN_GAP) / 2))
}

/**
 * Builds the memory board as two independent columns side by side. Every row
 * renders two lines (left / right), each with its own hex address. Candidates
 * and duds are spread over the two columns, one token per line at most.
 */
function buildBoard(
  difficulty: Difficulty,
  candidates: readonly string[],
  cols: number,
  rows: number,
): BoardLine[] {
  const contentWidth = contentWidthFor(cols)
  const totalLines = rows * 2

  const planned: PlannedToken[] = candidates.map((text, wordIndex) => ({
    lineIndex: -1,
    col: 0,
    text,
    kind: 'word',
    wordIndex,
  }))

  for (let i = 0; i < DUD_COUNT; i++) {
    const dudType = pick(DUD_TYPES)
    const filler = makeNoise(randInt(1, 3), { ...difficulty, letterChance: 0 })
    planned.push({
      lineIndex: -1,
      col: 0,
      text: `${dudType[0]}${filler}${dudType[1]}`,
      kind: 'dud',
      dudType,
    })
  }

  const linePool = shuffle(
    Array.from({ length: totalLines }, (_, index) => index),
  ).slice(0, planned.length)

  planned.forEach((token, index) => {
    token.lineIndex = linePool[index]
    token.col = randInt(1, Math.max(1, contentWidth - token.text.length))
  })

  const lines: BoardLine[] = []
  for (let lineIndex = 0; lineIndex < totalLines; lineIndex++) {
    const column: 0 | 1 = lineIndex < rows ? 0 : 1
    const row = lineIndex % rows
    let content = makeNoise(contentWidth, difficulty)
    const segments: BoardSegment[] = []

    const token = planned.find((item) => item.lineIndex === lineIndex)
    if (token) {
      const length = token.text.length
      const col = Math.min(Math.max(1, token.col), contentWidth - length)
      content =
        content.slice(0, col) + token.text + content.slice(col + length)

      const slot: MemorySlot = {
        id: `${token.kind === 'word' ? 'w' : 'd'}${lineIndex}`,
        lineIndex,
        col,
        length,
        kind: token.kind,
        wordIndex: token.wordIndex,
        dudType: token.dudType,
      }

      if (col > 0) {
        segments.push({ kind: 'noise', start: 0, text: content.slice(0, col) })
      }
      segments.push({
        kind: token.kind,
        start: col,
        text: content.slice(col, col + length),
        slot,
      })
      if (col + length < contentWidth) {
        segments.push({
          kind: 'noise',
          start: col + length,
          text: content.slice(col + length),
        })
      }
    } else {
      segments.push({ kind: 'noise', start: 0, text: content })
    }

    lines.push({
      row,
      column,
      address: makeAddress(),
      content,
      segments,
    })
  }

  return lines
}

/** Builds a brand-new random game for the given difficulty. */
export function createGame(
  difficultyId: DifficultyId,
  buckets: WordBuckets,
  cols = DEFAULT_COLS,
  rows = DEFAULT_ROWS,
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
  const safeCols = Math.max(cols, MIN_COLS)
  const safeRows = Math.max(rows, MIN_ROWS)

  return {
    difficulty,
    wordLen,
    cols: safeCols,
    rows: safeRows,
    contentWidth: contentWidthFor(safeCols),
    candidates,
    correctIndex,
    lines: buildBoard(difficulty, candidates, safeCols, safeRows),
    attemptsUsed: 0,
    struck: new Set(),
    removed: new Set(),
    usedDuds: new Set(),
    log: [],
    phase: 'playing',
  }
}

/**
 * Turns a slot's characters into fresh noise and rebuilds the line's
 * segments (merging the replaced slice with whatever noise surrounds it).
 */
function replaceSlotNoise(
  lines: readonly BoardLine[],
  slotId: string,
  difficulty: Difficulty,
): BoardLine[] {
  return lines.map((line) => {
    const index = line.segments.findIndex(
      (segment) => segment.slot?.id === slotId,
    )
    if (index === -1) return line

    const slot = line.segments[index].slot as MemorySlot
    const replacement = makeNoise(slot.length, difficulty)
    const content =
      line.content.slice(0, slot.col) +
      replacement +
      line.content.slice(slot.col + slot.length)

    const prev = line.segments[index - 1]
    const next = line.segments[index + 1]
    const beforeStart =
      prev && prev.kind === 'noise' ? prev.start : slot.col
    const afterEnd =
      next && next.kind === 'noise'
        ? next.start + next.text.length
        : slot.col + slot.length
    const merged = content.slice(beforeStart, afterEnd)

    const segments = line.segments.filter((segment) => (
      segment !== line.segments[index] &&
      segment !== prev &&
      segment !== next
    ))
    segments.push({ kind: 'noise', start: beforeStart, text: merged })
    segments.sort((a, b) => a.start - b.start)

    return { ...line, content, segments }
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
 * Triggers a dud pair. One of two effects is picked at call time: either one
 * remaining wrong word turns back into noise or all used attempts are restored
 * (the attempts bar and the remaining counter update instantly). Never costs
 * an attempt. The pair is then consumed: it stays visible on the board but is
 * no longer hoverable/clickable, so it can't be reused.
 */
export function applyDud(game: Game, slotId: string): Game {
  if (game.phase !== 'playing') return game
  if (game.usedDuds.has(slotId)) return game

  const usedDuds = new Set(game.usedDuds).add(slotId)
  let lines = game.lines
  let removed = new Set(game.removed)
  let attemptsUsed = game.attemptsUsed

  if (Math.random() < 0.5) {
    const removable = lines
      .flatMap((line) =>
        line.segments
          .map((segment) => segment.slot)
          .filter((slot): slot is MemorySlot => slot?.kind === 'word'),
      )
      .find(
        (slot) =>
          slot.wordIndex !== undefined &&
          slot.wordIndex !== game.correctIndex &&
          !game.struck.has(slot.wordIndex) &&
          !game.removed.has(slot.wordIndex),
      )

    if (removable) {
      lines = replaceSlotNoise(lines, removable.id, game.difficulty)
      removed = new Set(game.removed).add(removable.wordIndex as number)
    } else {
      // No wrong word left to erase this time: fall back to restoring attempts.
      attemptsUsed = 0
    }
  } else {
    attemptsUsed = 0
  }

  return { ...game, lines, usedDuds, removed, attemptsUsed }
}

export function isDudUsed(game: Game, slot: MemorySlot): boolean {
  return game.usedDuds.has(slot.id)
}

export function isWordRemoved(game: Game, slot: MemorySlot): boolean {
  return slot.wordIndex !== undefined && game.removed.has(slot.wordIndex)
}

/**
 * Handles an invalid selection (clicking on noise or non-first character of a token).
 * Costs an attempt, logs a generic failure message, and blocks the terminal on 4th failure.
 */
export function applyInvalidSelection(game: Game): Game {
  if (game.phase !== 'playing') return game

  const attemptsUsed = game.attemptsUsed + 1
  const phase = attemptsUsed >= MAX_ATTEMPTS ? 'blocked' : 'playing'

  const log = [
    ...game.log,
    '>INVALID SELECTION',
    '>Entry Denied',
  ]
  if (phase === 'blocked') log.push('>Attempt(s) Remaining: 0')

  return {
    ...game,
    attemptsUsed,
    phase,
    log,
  }
}
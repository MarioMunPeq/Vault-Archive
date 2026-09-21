// Dictionaries for the HACK minigame, served as static assets (never inlined):
//
// - `words.txt`: full English dictionary taken verbatim from the public,
//   open-license (MIT) `word-list` npm package (~274k words).
//   `scripts/sync-words.mjs` copies it here on every dev/build.
// - `common.txt`: a hand-curated allowlist of ~4k common, recognizable English
//   words (4-12 letters). It guarantees the board only ever shows words that
//   read as real text instead of obscure Scrabble filler.
//
// `loadDictionary()` fetches both and keeps only the words that appear in the
// full dictionary AND the curated list, bucketed by length. If the curated
// list fails to load, it falls back to the full dictionary so the minigame is
// never blocked.
import wordsUrl from '../../../assets/dictionary/words.txt?url'
import commonUrl from '../../../assets/dictionary/common.txt?url'

export const MIN_WORD_LEN = 4
export const MAX_WORD_LEN = 12

export type WordBuckets = ReadonlyMap<number, readonly string[]>

let cached: WordBuckets | null = null
let pending: Promise<WordBuckets> | null = null

async function buildFromText(text: string): Promise<Map<number, string[]>> {
  const buckets = new Map<number, string[]>()

  for (const raw of text.split('\n')) {
    const word = raw.trim().toLowerCase()
    const length = word.length
    if (length < MIN_WORD_LEN || length > MAX_WORD_LEN) continue
    if (!/^[a-z]+$/.test(word)) continue

    const bucket = buckets.get(length)
    if (bucket) bucket.push(word.toUpperCase())
    else buckets.set(length, [word.toUpperCase()])
  }

  return buckets
}

async function buildBuckets(): Promise<Map<number, string[]>> {
  const [wordsText, commonText] = await Promise.all([
    fetch(wordsUrl).then((response) => response.text()),
    fetch(commonUrl).then((response) => response.text()),
  ])

  const dictionary = new Set<string>()
  for (const raw of wordsText.split('\n')) {
    const word = raw.trim().toLowerCase()
    if (word) dictionary.add(word)
  }

  const buckets = new Map<number, string[]>()
  for (const raw of commonText.split('\n')) {
    const word = raw.trim().toLowerCase()
    const length = word.length
    if (length < MIN_WORD_LEN || length > MAX_WORD_LEN) continue
    if (!/^[a-z]+$/.test(word)) continue
    if (!dictionary.has(word)) continue

    const bucket = buckets.get(length)
    if (bucket) bucket.push(word.toUpperCase())
    else buckets.set(length, [word.toUpperCase()])
  }

  return buckets
}

/** Synchronous access to the already-loaded dictionary, or null. */
export function getBucketsSync(): WordBuckets | null {
  return cached
}

/** Loads (once) and caches the length-indexed dictionary. */
export function loadDictionary(): Promise<WordBuckets> {
  if (cached) return Promise.resolve(cached)
  if (!pending) {
    pending = buildBuckets().catch(async () => {
      // Curated list unavailable: fall back to the raw dictionary.
      const text = await fetch(wordsUrl).then((response) => response.text())
      return buildFromText(text)
    })
      .then((buckets) => {
        cached = buckets
        return buckets
      })
      .finally(() => {
        pending = null
      })
  }
  return pending
}
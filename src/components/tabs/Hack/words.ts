// English dictionary for the HACK minigame, taken verbatim from the public,
// open-license (MIT) `word-list` npm package (a plain-text list ~274k words).
// `scripts/sync-words.mjs` copies the package's words.txt into
// src/assets/dictionary on every dev/build, and this module serves it as a
// separate asset (not inlined in the JS bundle), fetched lazily the first time
// the HACK tab is opened, then cached.
//
// At build time `?url` only wires up the URL: Vite copies `words.txt` to
// dist/assets as a static file, so the ~2.8MB dictionary never bloats the
// bundle. The list is filtered in-memory (only a-z, length 4..12) and bucketed
// by length so a new game can pick words of any difficulty instantly.
import wordsUrl from '../../../assets/dictionary/words.txt?url'

export const MIN_WORD_LEN = 4
export const MAX_WORD_LEN = 12

export type WordBuckets = ReadonlyMap<number, readonly string[]>

let cached: WordBuckets | null = null
let pending: Promise<WordBuckets> | null = null

async function buildBuckets(): Promise<WordBuckets> {
  const text = await fetch(wordsUrl).then((response) => response.text())
  const buckets = new Map<number, string[]>()

  for (const raw of text.split('\n')) {
    const word = raw.trim().toUpperCase()
    const length = word.length
    if (length < MIN_WORD_LEN || length > MAX_WORD_LEN) continue
    if (!/^[A-Z]+$/.test(word)) continue

    const bucket = buckets.get(length)
    if (bucket) bucket.push(word)
    else buckets.set(length, [word])
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
    pending = buildBuckets()
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
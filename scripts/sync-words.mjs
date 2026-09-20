// Copies the English word list from the `word-list` npm package (public MIT
// license) into src/assets so Vite can bundle it as a static asset. The
// package is the single source of truth; the copy stays in sync on every
// dev/build run. Kept as a plain .mjs so it needs no tsconfig wiring.
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const from = join(root, 'node_modules', 'word-list', 'words.txt')
const to = join(root, 'src', 'assets', 'dictionary', 'words.txt')
mkdirSync(dirname(to), { recursive: true })
copyFileSync(from, to)
console.log('dictionary synced:', to)
export type DifficultyId = 'novato' | 'avanzado' | 'experto' | 'maestro'

export interface Difficulty {
  id: DifficultyId
  label: string
  /** Range of word lengths (in letters) for this level. */
  minLen: number
  maxLen: number
  /** Extra symbols added to the base noise set (. , ; : ! ?). */
  symbols: string
  /** Probability (0..1) that a noise cell is a blank space. */
  spaceChance: number
}
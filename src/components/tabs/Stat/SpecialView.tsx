import { SpriteLoop } from '../../SpriteLoop/SpriteLoop'
import './SpecialView.css'

interface SpecialStat {
  id: string
  name: string
  value: number
  frames: readonly string[]
}

function framesFromGlob(modules: Record<string, string>): string[] {
  return Object.entries(modules)
    .map(([path, source]) => ({
      source,
      index: Number(path.match(/(\d+)\.[a-zA-Z]+(?:\?.*)?$/)?.[1] ?? 0),
    }))
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.source)
}

function toGreenSvgDataUri(rawSvg: string): string {
  const recolored = rawSvg.replace(/fill="#(?:FFF|FFFFFF)"/gi, 'fill="#1eff00"')
  return `data:image/svg+xml;utf8,${encodeURIComponent(recolored)}`
}

function svgFrames(modules: Record<string, string>): string[] {
  return framesFromGlob(modules).map(toGreenSvgDataUri)
}

const STRENGTH_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/strength/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const PERCEPTION_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/perception/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const ENDURANCE_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/endurance/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const CHARISMA_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/charisma/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const INTELLIGENCE_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/intelligence/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const AGILITY_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/agility/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const LUCK_FRAMES = svgFrames(
  import.meta.glob<string>('../../../assets/images/stats/special/luck/*.svg', {
    eager: true,
    query: '?raw',
    import: 'default',
  }),
)

const SPECIAL_STATS: readonly SpecialStat[] = [
  { id: 'STR', name: 'Fuerza', value: 7, frames: STRENGTH_FRAMES },
  { id: 'PER', name: 'Percepción', value: 6, frames: PERCEPTION_FRAMES },
  { id: 'END', name: 'Resistencia', value: 5, frames: ENDURANCE_FRAMES },
  { id: 'CHR', name: 'Carisma', value: 4, frames: CHARISMA_FRAMES },
  { id: 'INT', name: 'Inteligencia', value: 8, frames: INTELLIGENCE_FRAMES },
  { id: 'AGL', name: 'Agilidad', value: 6, frames: AGILITY_FRAMES },
  { id: 'LCK', name: 'Suerte', value: 5, frames: LUCK_FRAMES },
]

// 2/3/2 central composition: two attributes up top, three in the middle row,
// two at the bottom. Each row is offset a few px so the grid reads slightly
// imperfect (hand-placed), like the original Pip-Boy.
const SPECIAL_ROWS: readonly (number[] | readonly number[])[] = [
  [0, 1],
  [2, 3, 4],
  [5, 6],
]

export function SpecialView() {
  return (
    <div className="special-grid" aria-label="Atributos S.P.E.C.I.A.L.">
      {SPECIAL_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`special-row special-row--${rowIndex + 1}`}
        >
          {row.map((statIndex) => {
            const stat = SPECIAL_STATS[statIndex]
            return (
              <div
                key={stat.id}
                className="special-cell"
                role="button"
                tabIndex={0}
                aria-label={`${stat.name}, ${stat.value}`}
              >
                <span className="special-cell__sigla">{stat.id}</span>
                <SpriteLoop
                  className="special-cell__icon"
                  frames={stat.frames}
                />
                <span className="special-cell__value">{stat.value}</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
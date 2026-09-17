import { SpriteLoop } from '../../SpriteLoop/SpriteLoop'
import agilitySvg0 from '../../../assets/images/stats/special/agility/0.svg?raw'
import agilitySvg1 from '../../../assets/images/stats/special/agility/1.svg?raw'
import agilitySvg2 from '../../../assets/images/stats/special/agility/2.svg?raw'
import agilitySvg3 from '../../../assets/images/stats/special/agility/3.svg?raw'
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
      index: Number(path.match(/(\d+)\.png$/)?.[1] ?? 0),
    }))
    .sort((a, b) => a.index - b.index)
    .map((entry) => entry.source)
}

function toGreenSvgDataUri(rawSvg: string): string {
  const recolored = rawSvg.replace(/fill="#(?:FFF|FFFFFF)"/gi, 'fill="#1eff00"')
  return `data:image/svg+xml;utf8,${encodeURIComponent(recolored)}`
}

const STRENGTH_FRAMES = framesFromGlob(
  import.meta.glob<string>(
    '../../../assets/images/stats/special/strength/png/*.png',
    { eager: true, import: 'default' },
  ),
)

const PERCEPTION_FRAMES = framesFromGlob(
  import.meta.glob<string>(
    '../../../assets/images/stats/special/perception/png/*.png',
    { eager: true, import: 'default' },
  ),
)

const ENDURANCE_FRAMES = framesFromGlob(
  import.meta.glob<string>(
    '../../../assets/images/stats/special/endurance/PNG/*.png',
    { eager: true, import: 'default' },
  ),
)

const CHARISMA_FRAMES = framesFromGlob(
  import.meta.glob<string>(
    '../../../assets/images/stats/special/charisma/PNG/*.png',
    { eager: true, import: 'default' },
  ),
)

const INTELLIGENCE_FRAMES = framesFromGlob(
  import.meta.glob<string>(
    '../../../assets/images/stats/special/intelligence/png/*.png',
    { eager: true, import: 'default' },
  ),
)

const AGILITY_FRAMES = [
  agilitySvg0,
  agilitySvg1,
  agilitySvg2,
  agilitySvg3,
].map(toGreenSvgDataUri)

const LUCK_FRAMES = framesFromGlob(
  import.meta.glob<string>('../../../assets/images/stats/special/luck/png/*.png', {
    eager: true,
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

export function SpecialView() {
  return (
    <div className="special-grid" aria-label="Atributos S.P.E.C.I.A.L.">
      {SPECIAL_STATS.map((stat) => (
        <div
          key={stat.id}
          className="special-cell"
          role="button"
          tabIndex={0}
          aria-label={`${stat.name}, ${stat.value}`}
        >
          <span className="special-cell__sigla">{stat.id}</span>
          <SpriteLoop className="special-cell__icon" frames={stat.frames} />
          <span className="special-cell__value">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}
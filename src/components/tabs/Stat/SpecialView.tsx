import strengthSvg from '../../../assets/images/stats/special/strength/0.svg?raw'
import perceptionSvg from '../../../assets/images/stats/special/perception/0.svg?raw'
import enduranceSvg from '../../../assets/images/stats/special/endurance/0.svg?raw'
import charismaSvg from '../../../assets/images/stats/special/charisma/0.svg?raw'
import intelligenceSvg from '../../../assets/images/stats/special/intelligence/00.svg?raw'
import agilitySvg from '../../../assets/images/stats/special/agility/0.svg?raw'
import luckSvg from '../../../assets/images/stats/special/luck/00.svg?raw'
import './SpecialView.css'

interface SpecialStat {
  id: string
  name: string
  value: number
  icon: string
}

function toGreenSvgDataUri(rawSvg: string): string {
  const recolored = rawSvg.replace(/fill="#(?:FFF|FFFFFF)"/gi, 'fill="#1eff00"')
  return `data:image/svg+xml;utf8,${encodeURIComponent(recolored)}`
}

const SPECIAL_STATS: readonly SpecialStat[] = [
  { id: 'STR', name: 'Fuerza', value: 7, icon: toGreenSvgDataUri(strengthSvg) },
  { id: 'PER', name: 'Percepción', value: 6, icon: toGreenSvgDataUri(perceptionSvg) },
  { id: 'END', name: 'Resistencia', value: 5, icon: toGreenSvgDataUri(enduranceSvg) },
  { id: 'CHR', name: 'Carisma', value: 4, icon: toGreenSvgDataUri(charismaSvg) },
  { id: 'INT', name: 'Inteligencia', value: 8, icon: toGreenSvgDataUri(intelligenceSvg) },
  { id: 'AGL', name: 'Agilidad', value: 6, icon: toGreenSvgDataUri(agilitySvg) },
  { id: 'LCK', name: 'Suerte', value: 5, icon: toGreenSvgDataUri(luckSvg) },
]

// 2/3/2 central composition: two attributes up top, three in the middle row,
// two at the bottom, each row offset a couple of px (slightly imperfect).
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
                <img
                  className="special-cell__icon"
                  src={stat.icon}
                  alt=""
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
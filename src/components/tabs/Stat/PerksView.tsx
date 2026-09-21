import {
  type SimpleIcon,
  siAndroidstudio,
  siDotnet,
  siGit,
  siGodotengine,
  siJavascript,
  siKotlin,
  siMysql,
  siOpenjdk,
  siPython,
  siReact,
} from 'simple-icons'
import './PerksView.css'

interface Perk {
  id: string
  name: string
  tag: string
  icon: SimpleIcon
}

const PERKS: readonly Perk[] = [
  { id: 'java', name: 'JAVA', tag: 'LENGUAJE', icon: siOpenjdk },
  { id: 'python', name: 'PYTHON', tag: 'LENGUAJE', icon: siPython },
  { id: 'kotlin', name: 'KOTLIN', tag: 'LENGUAJE', icon: siKotlin },
  { id: 'csharp', name: 'C#', tag: 'LENGUAJE', icon: siDotnet },
  { id: 'ts', name: 'JAVASCRIPT', tag: 'TYPESCRIPT', icon: siJavascript },
  { id: 'react', name: 'REACT', tag: 'FRAMEWORK', icon: siReact },
  { id: 'sql', name: 'SQL', tag: 'BASE DE DATOS', icon: siMysql },
  { id: 'git', name: 'GIT', tag: 'CONTROL DE VERSIONES', icon: siGit },
  { id: 'godot', name: 'GODOT', tag: 'MOTOR DE JUEGOS', icon: siGodotengine },
  { id: 'androidstudio', name: 'ANDROID STUDIO', tag: 'IDE', icon: siAndroidstudio },
]

// Three rows: 4 + 3 + 3, offset so the grid reads hand-placed like the
// SPECIAL screen.
const PERK_ROWS: readonly (readonly number[])[] = [
  [0, 1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]

export function PerksView() {
  return (
    <div className="perks">
      <p className="perks__header">PERKS INSTALADOS</p>
      <div className="perks-grid" aria-label="Perks">
        {PERK_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className={`perks-row perks-row--${rowIndex + 1}`}>
            {row.map((perkIndex) => {
              const perk = PERKS[perkIndex]
              return (
                <div key={perk.id} className="perks-cell">
                  <svg
                    className="perks-cell__icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={perk.icon.path} />
                  </svg>
                  <span className="perks-cell__name">{perk.name}</span>
                  <span className="perks-cell__tag">{perk.tag}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
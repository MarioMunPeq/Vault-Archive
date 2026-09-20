import './PerksView.css'

interface Perk {
  id: string
  name: string
  tag: string
}

const PERKS: readonly Perk[] = [
  { id: 'java', name: 'JAVA', tag: 'LENGUAJE' },
  { id: 'python', name: 'PYTHON', tag: 'LENGUAJE' },
  { id: 'kotlin', name: 'KOTLIN', tag: 'LENGUAJE' },
  { id: 'csharp', name: 'C#', tag: 'LENGUAJE' },
  { id: 'ts', name: 'JAVASCRIPT', tag: 'TYPESCRIPT' },
  { id: 'react', name: 'REACT', tag: 'FRAMEWORK' },
  { id: 'sql', name: 'SQL', tag: 'BASE DE DATOS' },
  { id: 'git', name: 'GIT', tag: 'CONTROL DE VERSIONES' },
]

// Two rows of four, offset a few px so the grid reads hand-placed like the
// SPECIAL screen.
const PERK_ROWS: readonly (readonly number[])[] = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
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
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { TabNav } from '../../TabNav/TabNav'
import submoduleChangeSfx from '../../../assets/sfx/submodule_change.ogg'
import { DATA_SECTIONS } from './dataSections'
import type { DataEntry } from './dataSections'
import './Data.css'

export type DataSubTab = 'ABOUT' | 'EDUCATION' | 'EXPERIENCE' | 'CONTACT'

const SUB_TABS: readonly DataSubTab[] = [
  'ABOUT',
  'EDUCATION',
  'EXPERIENCE',
  'CONTACT',
]

export function Data() {
  const [sectionTab, setSectionTab] = useState<DataSubTab>('ABOUT')
  const [selectedId, setSelectedId] = useState<string>(
    () => DATA_SECTIONS[0].entries[0].id,
  )

  const section = DATA_SECTIONS.find((s) => s.id === sectionTab)
  const entries = section ? section.entries : DATA_SECTIONS[0].entries
  const selected =
    entries.find((entry) => entry.id === selectedId) ?? entries[0]

  const handleSelectSection = (tab: DataSubTab) => {
    setSectionTab(tab)
    const next = DATA_SECTIONS.find((s) => s.id === tab)
    const firstId = next?.entries[0]?.id ?? ''
    setSelectedId(firstId)
  }

  return (
    <div className="data">
      <TabNav
        tabs={SUB_TABS}
        activeTab={sectionTab}
        onSelect={handleSelectSection}
        label="Secciones de datos"
        confirmSfx={submoduleChangeSfx}
        variant="secondary"
      />
      <div className="data__body">
        <div className="register">
          <p className="register__path">{section?.path}</p>
          <div className="register__list" role="listbox" aria-label="Registros">
            {entries.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                role="option"
                aria-selected={entry.id === selected.id}
                className={[
                  'register-row',
                  entry.id === selected.id ? 'register-row--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedId(entry.id)}
              >
                <span className="register-row__addr">{hexAddr(index)}</span>
                <span className="register-row__mark">&gt;</span>
                <span className="register-row__name">{entry.name}</span>
              </button>
            ))}
          </div>
          <p className="register__footer">REGISTROS: {entries.length}</p>
        </div>

        <div className="viewer" aria-live="polite">
          <div className="viewer__head">
            <span className="viewer__file">
              {hexAddr(entries.indexOf(selected))}▸ {selected.name}
            </span>
            <span className="viewer__meta">
              ENTRADA {entries.indexOf(selected) + 1}/{entries.length} · TAM{' '}
              {selected.lines.join('').length}B
            </span>
          </div>
          <div className="viewer__body">
            {selected.level !== undefined ? (
              <SkillView key={selected.id} entry={selected} />
            ) : selected.url ? (
              <ContactView key={selected.id} entry={selected} />
            ) : (
              <Typewriter key={selected.id} text={selected.lines.join('\n')} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface TypewriterProps {
  text: string
}

function Typewriter({ text }: TypewriterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (text.length === 0) return
    const step = Math.max(1, Math.ceil(text.length / 150))
    const id = window.setInterval(() => {
      setCount((previous) => {
        const next = Math.min(previous + step, text.length)
        if (next === text.length) window.clearInterval(id)
        return next
      })
    }, 12)
    return () => window.clearInterval(id)
  }, [text])

  return (
    <span className="data-text">
      {text.slice(0, count)}
      <span className="data-cursor" aria-hidden="true" />
    </span>
  )
}

interface SkillViewProps {
  entry: DataEntry
}

function SkillView({ entry }: SkillViewProps) {
  const level = entry.level ?? 0
  const style = { '--pct': `${level}%` } as CSSProperties

  return (
    <div className="skill">
      <Typewriter text={entry.lines.join('\n')} />
      <div className="skill__bar" style={style}>
        <span className="skill-bar__fill" />
      </div>
      <span className="skill__meter">
        {level}% · {levelLabel(level)}
      </span>
    </div>
  )
}

interface ContactViewProps {
  entry: DataEntry
}

function ContactView({ entry }: ContactViewProps) {
  const isMailto = entry.url?.startsWith('mailto:') ?? false
  const linkProps = isMailto
    ? {}
    : { target: '_blank', rel: 'noreferrer' }

  return (
    <div className="contact">
      <Typewriter text={entry.lines.join('\n')} />
      <a className="contact__link" href={entry.url} {...linkProps}>
        [ {entry.urlText} ▸ ]
      </a>
    </div>
  )
}

function levelLabel(level: number): string {
  if (level >= 80) return 'EXPERTO'
  if (level >= 60) return 'AVANZADO'
  if (level >= 40) return 'COMPETENTE'
  return 'NOVATO'
}

function hexAddr(index: number): string {
  const safeIndex = Math.max(0, index)
  const value = 0x2000 + safeIndex * 0x40
  return '0x' + value.toString(16).toUpperCase().padStart(5, '0')
}
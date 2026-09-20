import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { TabNav } from '../../TabNav/TabNav'
import submoduleChangeSfx from '../../../assets/sfx/submodule_change.ogg'
import { INVENTORY_CATEGORIES } from './itemsData'
import type { InventoryItem } from './itemsData'
import { ItemIcon } from './ItemIcon'
import './Items.css'

export type ItemsSubTab = 'WEAPONS' | 'APPAREL' | 'AID' | 'MISC'

const SUB_TABS: readonly ItemsSubTab[] = ['WEAPONS', 'APPAREL', 'AID', 'MISC']

export function Items() {
  const [categoryTab, setCategoryTab] = useState<ItemsSubTab>('WEAPONS')
  const [selectedId, setSelectedId] = useState<string>(
    () => INVENTORY_CATEGORIES[0].items[0].id,
  )

  const category =
    INVENTORY_CATEGORIES.find((entry) => entry.id === categoryTab) ??
    INVENTORY_CATEGORIES[0]
  const selected =
    category.items.find((item) => item.id === selectedId) ?? category.items[0]

  const handleSelectCategory = (tab: ItemsSubTab) => {
    setCategoryTab(tab)
    const next = INVENTORY_CATEGORIES.find((entry) => entry.id === tab)
    setSelectedId(next?.items[0]?.id ?? '')
  }

  const totalWeight = category.items.reduce((sum, item) => {
    return sum + (statValue(item, 'PESO') ?? 0)
  }, 0)

  const selectedIndex = category.items.indexOf(selected)
  const selectedSerial = `${category.serialCode}·${String(selectedIndex + 1).padStart(2, '0')}`

  return (
    <div className="items">
      <TabNav
        tabs={SUB_TABS}
        activeTab={categoryTab}
        onSelect={handleSelectCategory}
        label="Categorías del inventario"
        confirmSfx={submoduleChangeSfx}
        variant="secondary"
      />
      <div className="items__body">
        <div className="inv-list">
          <p className="inv-list__path">{category.path}</p>
          <div className="inv-list__head">
            <span>OBJETO</span>
            <span>{category.primary}</span>
          </div>
          <div className="inv-list__scroll">
            {category.items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={item.id === selected.id}
                className={[
                  'inv-row',
                  item.id === selected.id ? 'inv-row--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedId(item.id)}
              >
                <span className="inv-row__serial">
                  {category.serialCode}·{String(index + 1).padStart(2, '0')}
                </span>
                <ItemIcon icon={item.icon} className="inv-row__icon" />
                <span className="inv-row__name">{item.name}</span>
                <span className="inv-row__primary">
                  {item.stats[0]?.value ?? 0}
                </span>
              </button>
            ))}
          </div>
          <p className="inv-list__footer">
            <span>
              OBJETOS: {category.items.length} · PESO: {totalWeight}
            </span>
            <span className="inv-list__credits">ICONOS: GAME-ICONS.NET</span>
          </p>
        </div>

        <div className="inv-view">
          <div className="inv-view__head">
            <span className="inv-view__file">
              [{selectedSerial}] {selected.name}
            </span>
            <span className="inv-view__meta">
              PESO: {statValue(selected, 'PESO') ?? 0} LIBRAS
            </span>
          </div>
          <div key={selected.id} className="inv-view__body">
            <div className="inv-item">
              <div className="inv-item__top">
                <div className="inv-item__iconwrap">
                  <ItemIcon icon={selected.icon} className="inv-item__icon" />
                </div>
                <Typewriter text={selected.epithet} />
              </div>
              <div className="inv-stats" aria-label="Estadísticas">
                {selected.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="inv-stat"
                    style={{ '--pct': `${stat.value}%` } as CSSProperties}
                  >
                    <span className="inv-stat__label">{stat.label}</span>
                    <span className="inv-stat__bar">
                      <span className="inv-stat__fill" />
                    </span>
                    <span className="inv-stat__value">{stat.value}</span>
                  </div>
                ))}
              </div>
              <div className="inv-item__desc">
                <Typewriter text={selected.description.join('\n')} />
              </div>
            </div>
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
    const step = Math.max(1, Math.ceil(text.length / 120))
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
    <span className="items-text">
      {text.slice(0, count)}
      <span className="items-cursor" aria-hidden="true" />
    </span>
  )
}

function statValue(
  item: InventoryItem,
  label: string,
): number | undefined {
  return item.stats.find((stat) => stat.label === label)?.value
}
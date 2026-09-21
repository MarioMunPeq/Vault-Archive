import { useEffect } from 'react'
import type { MapLocation, MapCategory } from '../../../data/mapLocations'
import { playSfx } from '../../../utils/sfx'
import clickSfx from '../../../assets/sfx/mechanical-click.wav'
import studyIcon from '../../../assets/icons/map/graduate-cap.svg?raw'
import workIcon from '../../../assets/icons/map/briefcase.svg?raw'
import './LocationPanel.css'

const CATEGORY_ICONS: Record<MapCategory, string> = {
  estudio: studyIcon,
  trabajo: workIcon,
}

interface LocationPanelProps {
  location: MapLocation
  onClose: () => void
}

export function LocationPanel({ location, onClose }: LocationPanelProps) {
  useEffect(() => {
    playSfx(clickSfx)
  }, [location.id])

  return (
    <aside
      className="locpanel"
      role="dialog"
      aria-label={`Ubicación: ${location.nombre}`}
    >
      <div className="locpanel__corners">
        <span className="locpanel__corner locpanel__corner--tl" aria-hidden="true" />
        <span className="locpanel__corner locpanel__corner--tr" aria-hidden="true" />
        <span className="locpanel__corner locpanel__corner--bl" aria-hidden="true" />
        <span className="locpanel__corner locpanel__corner--br" aria-hidden="true" />
      </div>

      <header className="locpanel__header">
        <span className="locpanel__title">LOCATION DATA</span>
        <button
          type="button"
          className="locpanel__close"
          onClick={onClose}
          aria-label="Cerrar panel de ubicación"
        >
          [X]
        </button>
      </header>

      <hr className="locpanel__header-separator" />

      <div className="locpanel__name-row">
        <span className="locpanel__icon" aria-hidden="true">
          {CATEGORY_ICONS[location.categoria]}
        </span>
        <h2 className="locpanel__name">{location.nombre}</h2>
      </div>

      <hr className="locpanel__separator" />

      <div className="locpanel__meta">
        <dl className="locpanel__meta-grid">
          <dt className="locpanel__meta-label">CLASSIFICATION</dt>
          <dd className="locpanel__meta-value">
            {location.categoria === 'estudio' ? 'EDUCATION' : 'EMPLOYMENT'}
          </dd>
          <dt className="locpanel__meta-label">STATUS</dt>
          <dd className="locpanel__meta-value">ARCHIVED</dd>
        </dl>
      </div>

      <p className="locpanel__desc">{location.descripcion}</p>
    </aside>
  )
}
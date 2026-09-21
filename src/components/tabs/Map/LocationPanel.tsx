import { useEffect } from 'react'
import type { MapLocation } from '../../../data/mapLocations'
import { playSfx } from '../../../utils/sfx'
import clickSfx from '../../../assets/sfx/mechanical-click.wav'
import './LocationPanel.css'

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

      <h2 className="locpanel__name">{location.nombre}</h2>

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
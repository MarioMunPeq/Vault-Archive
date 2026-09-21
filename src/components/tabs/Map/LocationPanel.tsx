import { useEffect, useRef } from 'react'
import type { MapLocation } from '../../../data/mapLocations'
import { playSfx } from '../../../utils/sfx'
import clickSfx from '../../../assets/sfx/mechanical-click.wav'
import './LocationPanel.css'

interface LocationPanelProps {
  location: MapLocation
  onClose: () => void
}

export function LocationPanel({ location, onClose }: LocationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    playSfx(clickSfx)
  }, [location.id])

  return (
    <aside
      ref={panelRef}
      className="locpanel"
      role="dialog"
      aria-label={`Ubicación: ${location.nombre}`}
    >
      <header className="locpanel__head">
        <span className="locpanel__cat">
          {location.categoria === 'estudio' ? 'ESTUDIO' : 'TRABAJO'}
        </span>
        <button
          type="button"
          className="locpanel__close"
          onClick={onClose}
          aria-label="Cerrar panel de ubicación"
        >
          ✕
        </button>
      </header>
      <h2 className="locpanel__name">{location.nombre}</h2>
      <p className="locpanel__desc">{location.descripcion}</p>
    </aside>
  )
}

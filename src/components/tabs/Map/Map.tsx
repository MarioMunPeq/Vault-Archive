import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAP_LOCATIONS } from '../../../data/mapLocations'
import type { MapCategory, MapLocation } from '../../../data/mapLocations'
import { LocationPanel } from './LocationPanel'
import studyIcon from '../../../assets/icons/map/graduate-cap.svg?raw'
import workIcon from '../../../assets/icons/map/briefcase.svg?raw'
import './Map.css'

const MAPBOX_TOKEN: string | undefined = import.meta.env
  .VITE_MAPBOX_TOKEN as string | undefined
const MAPBOX_STYLE_URL: string | undefined = import.meta.env
  .VITE_MAPBOX_STYLE_URL as string | undefined

const CATEGORY_ICONS: Record<MapCategory, string> = {
  estudio: studyIcon,
  trabajo: workIcon,
}

function markerHtml(location: MapLocation): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'map-marker'
  wrapper.setAttribute('aria-label', location.nombre)
  wrapper.innerHTML = `
    <div class="map-marker__pin">
      <span class="map-marker__icon">${CATEGORY_ICONS[location.categoria]}</span>
    </div>
  `
  return wrapper
}

export function Map() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null,
  )

  const configured = Boolean(MAPBOX_TOKEN && MAPBOX_STYLE_URL)

  useEffect(() => {
    if (!configured) return
    if (!containerRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN as string

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE_URL as string,
      // PARCHE TEMPORAL: se desactiva TODA forma de cambiar el zoom para evitar
      // el bug de desalineación de los marcadores al hacer zoom. Reactivar el
      // zoom cuando se investigue y resuelva la causa raíz del bug de
      // reposicionamiento.
      dragPan: true,
      scrollZoom: false,
      boxZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      attributionControl: false,
    })

    // Encuadre inicial automático: caja que contiene las 6 coordenadas de
    // MAP_LOCATIONS para que la ciudad y todos los marcadores sean visibles.
    const bounds = new mapboxgl.LngLatBounds()
    for (const location of MAP_LOCATIONS) {
      bounds.extend([location.lng, location.lat])
    }

    map.on('load', () => {
      map.fitBounds(bounds, { padding: 80, maxZoom: 14 })
    })

    for (const location of MAP_LOCATIONS) {
      const element = markerHtml(location)
      element.addEventListener('click', () => setSelectedLocation(location))
      new mapboxgl.Marker({ element })
        .setLngLat([location.lng, location.lat])
        .addTo(map)
    }

    return () => {
      map.remove()
    }
  }, [configured])

  if (!configured) {
    return (
      <div className="map map--status">
        <p className="map__status-title">SEÑAL GPS NO DISPONIBLE</p>
        <p className="map__status-sub">
          CONFIGURA VITE_MAPBOX_TOKEN Y VITE_MAPBOX_STYLE_URL EN TU .env
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="map">
      {selectedLocation ? (
        <LocationPanel
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      ) : null}
    </div>
  )
}
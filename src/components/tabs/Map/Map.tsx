import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAP_CENTER, MAP_LOCATIONS } from '../../../data/mapLocations'
import type { MapCategory, MapLocation } from '../../../data/mapLocations'
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
  const popupRef = useRef<mapboxgl.Popup | null>(null)

  const configured = Boolean(MAPBOX_TOKEN && MAPBOX_STYLE_URL)

  useEffect(() => {
    if (!configured) return
    if (!containerRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN as string

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE_URL as string,
      center: MAP_CENTER,
      zoom: 13,
      attributionControl: false,
    })

    const openPopup = (location: MapLocation) => {
      if (popupRef.current) popupRef.current.remove()
      popupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        offset: 18,
        className: 'map-popup',
      })
        .setLngLat([location.lng, location.lat])
        .setHTML(
          `<p class="map-popup__name">${location.nombre}</p>` +
            `<p class="map-popup__desc">${location.descripcion}</p>`,
        )
        .addTo(map)
    }

    for (const location of MAP_LOCATIONS) {
      const element = markerHtml(location)
      element.addEventListener('click', () => openPopup(location))
      new mapboxgl.Marker({ element })
        .setLngLat([location.lng, location.lat])
        .addTo(map)
    }

    map.on('click', () => {
      if (popupRef.current) {
        popupRef.current.remove()
        popupRef.current = null
      }
    })

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

  return <div ref={containerRef} className="map" />
}
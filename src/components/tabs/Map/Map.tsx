import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Map as MapboxMap } from 'mapbox-gl'
import { MAP_CENTER, MAP_LOCATIONS } from '../../../data/mapLocations'
import type { MapCategory, MapLocation } from '../../../data/mapLocations'
import { LocationPanel } from './LocationPanel'
import { OffscreenPOIIndicators } from './OffscreenPOIIndicators'
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
      <div class="map-marker__head">
        <span class="map-marker__icon">${CATEGORY_ICONS[location.categoria]}</span>
      </div>
      <div class="map-marker__tip" aria-hidden="true"></div>
    </div>
  `
  return wrapper
}

export function Map() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null,
  )
  const [mapInstance, setMapInstance] = useState<MapboxMap | null>(null)

  const configured = Boolean(MAPBOX_TOKEN && MAPBOX_STYLE_URL)

  useEffect(() => {
    if (!configured) return
    if (!containerRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN as string

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE_URL as string,
      // Cámara cercana fija y SIN zoom: todas las interacciones de zoom quedan
      // bloqueadas porque, al hacer zoom, los marcadores se desalinean (bug de
      // este proyecto). La vista queda clavada en este nivel.
      center: MAP_CENTER,
      zoom: 15,
      // Vista siempre cenital: sin pitch ni bearing inicial y sin giro/rotación
      // que pueda inclinar la cámara en 3D.
      pitch: 0,
      bearing: 0,
      pitchWithRotate: false,
      dragRotate: false,
      dragPan: true,
      scrollZoom: false,
      boxZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      attributionControl: false,
    })

    setMapInstance(map)

    // Sin fitBounds: encuadrar las 6 coordenadas obligaría a alejar la cámara
    // hasta caber todo el conjunto (≈7,5 km de norte a sur). Queremos una
    // vista fija más cercana, así que la cámara es la del constructor.

    for (const location of MAP_LOCATIONS) {
      const element = markerHtml(location)
      element.addEventListener('click', () => setSelectedLocation(location))
      new mapboxgl.Marker({ element, anchor: 'bottom' })
        .setLngLat([location.lng, location.lat])
        .addTo(map)
    }

    return () => {
      setMapInstance(null)
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
      <OffscreenPOIIndicators map={mapInstance} />
      {selectedLocation ? (
        <LocationPanel
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      ) : null}
    </div>
  )
}
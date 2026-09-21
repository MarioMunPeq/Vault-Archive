import { useEffect, useRef, useState } from 'react'
import type { Map } from 'mapbox-gl'
import { MAP_LOCATIONS } from '../../../data/mapLocations'
import type { MapLocation } from '../../../data/mapLocations'
import './OffscreenPOIIndicators.css'

interface OffscreenIndicator {
  id: string
  x: number
  y: number
  rotation: number
  edge: 'top' | 'right' | 'bottom' | 'left'
}

function projectLocation(map: Map, location: MapLocation): { x: number; y: number } | null {
  try {
    const point = map.project([location.lng, location.lat])
    return { x: point.x, y: point.y }
  } catch {
    return null
  }
}

function isInViewport(x: number, y: number, bounds: DOMRect, padding = 0): boolean {
  return (
    x >= -padding &&
    x <= bounds.width + padding &&
    y >= -padding &&
    y <= bounds.height + padding
  )
}

function calculateEdgeIntersection(
  centerX: number,
  centerY: number,
  targetX: number,
  targetY: number,
  bounds: DOMRect,
  margin = 16
): { x: number; y: number; edge: 'top' | 'right' | 'bottom' | 'left'; rotation: number } {
  const dx = targetX - centerX
  const dy = targetY - centerY
  const angle = Math.atan2(dy, dx)

  const halfWidth = bounds.width / 2 - margin
  const halfHeight = bounds.height / 2 - margin

  const cosA = Math.cos(angle)
  const sinA = Math.sin(angle)

  const tX = cosA > 0 ? halfWidth / cosA : cosA < 0 ? -halfWidth / cosA : Infinity
  const tY = sinA > 0 ? halfHeight / sinA : sinA < 0 ? -halfHeight / sinA : Infinity

  const t = Math.min(Math.abs(tX), Math.abs(tY))

  const x = centerX + cosA * t
  const y = centerY + sinA * t

  const edge = Math.abs(tX) < Math.abs(tY)
    ? (cosA > 0 ? 'right' : 'left')
    : (sinA > 0 ? 'bottom' : 'top')

  const rotation = angle * (180 / Math.PI)

  return { x, y, edge, rotation }
}

function clampToEdge(
  x: number,
  y: number,
  edge: 'top' | 'right' | 'bottom' | 'left',
  bounds: DOMRect,
  margin = 16
): { x: number; y: number } {
  const maxX = bounds.width - margin
  const maxY = bounds.height - margin
  const minCoord = margin

  switch (edge) {
    case 'top':
      return { x: Math.max(minCoord, Math.min(maxX, x)), y: margin }
    case 'bottom':
      return { x: Math.max(minCoord, Math.min(maxX, x)), y: maxY }
    case 'left':
      return { x: margin, y: Math.max(minCoord, Math.min(maxY, y)) }
    case 'right':
      return { x: maxX, y: Math.max(minCoord, Math.min(maxY, y)) }
  }
}

export function OffscreenPOIIndicators({ map }: { map: Map | null }) {
  const [indicators, setIndicators] = useState<OffscreenIndicator[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const boundsRef = useRef<DOMRect | undefined>(undefined)

  useEffect(() => {
    if (!map) return

    const updateIndicators = () => {
      if (!map) return

      const bounds = map.getContainer().getBoundingClientRect()
      boundsRef.current = bounds
      const centerX = bounds.width / 2
      const centerY = bounds.height / 2

      const newIndicators: OffscreenIndicator[] = []

      for (const location of MAP_LOCATIONS) {
        const projected = projectLocation(map, location)
        if (!projected) continue

        const { x, y } = projected

        if (isInViewport(x, y, bounds, 8)) continue

        const { x: edgeX, y: edgeY, edge, rotation } = calculateEdgeIntersection(
          centerX,
          centerY,
          x,
          y,
          bounds,
          16
        )

        const { x: clampedX, y: clampedY } = clampToEdge(edgeX, edgeY, edge, bounds, 16)

        newIndicators.push({
          id: location.id,
          x: clampedX,
          y: clampedY,
          rotation,
          edge,
        })
      }

      setIndicators(newIndicators)
    }

    const onMove = () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = requestAnimationFrame(updateIndicators)
    }

    map.on('move', onMove)
    map.on('zoom', onMove)
    map.on('rotate', onMove)
    map.on('pitch', onMove)
    map.on('resize', onMove)

    updateIndicators()

    return () => {
      map.off('move', onMove)
      map.off('zoom', onMove)
      map.off('rotate', onMove)
      map.off('pitch', onMove)
      map.off('resize', onMove)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [map])

  if (indicators.length === 0) return null

  return (
    <div className="offscreen-indicators" aria-hidden="true">
      {indicators.map((indicator) => (
        <div
          key={indicator.id}
          className="offscreen-indicator"
          style={{
            '--indicator-x': `${indicator.x}px`,
            '--indicator-y': `${indicator.y}px`,
            '--indicator-rotation': `${indicator.rotation}deg`,
          } as React.CSSProperties}
          data-edge={indicator.edge}
        >
          <div className="offscreen-indicator__arrow" />
        </div>
      ))}
    </div>
  )
}
import { useEffect, useRef } from 'react'
import { useFrameSequence } from '../../hooks/useFrameSequence'
import './BootSequence.css'

export interface BootSequenceProps {
  frames: readonly string[]
  frameIntervalMs?: number
  durationMs?: number
  onBootComplete?: () => void
}

export function BootSequence({
  frames,
  frameIntervalMs = 180,
  durationMs,
  onBootComplete,
}: BootSequenceProps) {
  const frameIndex = useFrameSequence(frames.length, {
    intervalMs: frameIntervalMs,
    durationMs,
    onComplete: onBootComplete,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const frame = frameRef.current
    if (!container || !frame) return
    const measure = () => {
      const screen = document.querySelector<HTMLElement>('.screen')
      const c = container.getBoundingClientRect()
      const f = frame.getBoundingClientRect()
      const s = screen?.getBoundingClientRect()
      console.log(
        '[BootSequence] screen',
        s ? `${s.width.toFixed(1)}x${s.height.toFixed(1)}px` : 'n/a',
        '| container',
        `${c.width.toFixed(1)}x${c.height.toFixed(1)}px`,
        '| frame',
        `${f.width.toFixed(1)}x${f.height.toFixed(1)}px`,
        '| %width',
        ((f.width / c.width) * 100).toFixed(1),
        '| %height',
        ((f.height / c.height) * 100).toFixed(1),
      )
    }
    measure()
    const raf = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (frames.length === 0) {
    return null
  }

  return (
    <div className="boot-sequence" ref={containerRef}>
      <img
        className="boot-sequence__frame"
        ref={frameRef}
        src={frames[frameIndex]}
        alt=""
      />
    </div>
  )
}
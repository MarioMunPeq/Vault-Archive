import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

interface ScopeWire {
  analyser: AnalyserNode
  ctx: AudioContext
}

const scopeWires = new WeakMap<HTMLAudioElement, ScopeWire>()

function createScopeWire(audio: HTMLAudioElement): ScopeWire | null {
  const cached = scopeWires.get(audio)
  if (cached) return cached

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!Ctor) return null

  try {
    const ctx = new Ctor()
    if (ctx.state === 'suspended') void ctx.resume()
    const source = ctx.createMediaElementSource(audio)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.85
    source.connect(analyser)
    analyser.connect(ctx.destination)

    const wire: ScopeWire = { analyser, ctx }
    scopeWires.set(audio, wire)
    return wire
  } catch {
    return null
  }
}

function getScreenColors() {
  const styles = getComputedStyle(document.documentElement)
  const color = styles.getPropertyValue('--pipboy-color').trim() || '#1eff00'
  const glow =
    styles.getPropertyValue('--pipboy-color-glow').trim() ||
    'rgba(30, 255, 0, 0.55)'
  const faint =
    styles.getPropertyValue('--pipboy-color-faint').trim() ||
    'rgba(30, 255, 0, 0.22)'
  return { color, glow, faint }
}

export interface RadioScopeProps {
  audioRef: RefObject<HTMLAudioElement | null>
  isPlaying: boolean
}

export function RadioScope({ audioRef, isPlaying }: RadioScopeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const audio = audioRef.current
    if (!canvas || !audio) return

    const wire = createScopeWire(audio)
    const { color, glow, faint } = getScreenColors()
    const g = canvas.getContext('2d')
    if (!g) return

    const dpr = window.devicePixelRatio || 1
    const buffer = new Uint8Array(wire ? wire.analyser.fftSize : 0)
    let rafId = 0

    const drawRest = (now: number) => {
      const height = canvas.height
      g.clearRect(0, 0, canvas.width, height)
      const midY = height / 2
      g.lineWidth = Math.max(1, Math.round(dpr))
      g.strokeStyle = color
      g.shadowColor = glow
      g.shadowBlur = 6 * dpr
      g.globalAlpha = 0.32 + 0.08 * Math.sin(now * 0.0025)
      g.beginPath()
      g.moveTo(0, midY)
      g.lineTo(canvas.width, midY)
      g.stroke()
      g.globalAlpha = 1
      g.shadowBlur = 0
    }

    const trace = (midY: number, amplitude: number) => {
      const width = canvas.width
      const step = buffer.length / width
      g.beginPath()
      for (let x = 0; x < width; x++) {
        const index = Math.min(buffer.length - 1, Math.floor(x * step))
        const value = (buffer[index] - 128) / 128
        const y = midY - value * amplitude
        if (x === 0) g.moveTo(x, y)
        else g.lineTo(x, y)
      }
    }

    const drawWave = () => {
      if (!wire) return
      if (wire.ctx.state === 'suspended') void wire.ctx.resume()
      wire.analyser.getByteTimeDomainData(buffer)

      const height = canvas.height
      const midY = height / 2
      const amplitude = height * 0.42
      g.clearRect(0, 0, canvas.width, height)
      g.lineCap = 'round'
      g.lineJoin = 'round'

      g.strokeStyle = faint
      g.shadowColor = glow
      g.shadowBlur = 12 * dpr
      g.lineWidth = 2.5 * dpr
      trace(midY, amplitude)
      g.stroke()

      g.strokeStyle = color
      g.shadowColor = glow
      g.shadowBlur = 6 * dpr
      g.lineWidth = Math.max(1, Math.round(dpr))
      trace(midY, amplitude)
      g.stroke()
      g.shadowBlur = 0
    }

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame)
      const cssWidth = canvas.clientWidth
      const cssHeight = canvas.clientHeight
      if (cssWidth === 0 || cssHeight === 0) return
      const nextWidth = Math.max(1, Math.round(cssWidth * dpr))
      const nextHeight = Math.max(1, Math.round(cssHeight * dpr))
      if (canvas.width !== nextWidth) canvas.width = nextWidth
      if (canvas.height !== nextHeight) canvas.height = nextHeight
      if (isPlaying && wire) drawWave()
      else drawRest(now)
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      window.setTimeout(() => {
        if (!audio.isConnected) {
          if (wire) {
            try {
              wire.analyser.disconnect()
            } catch {
              /* noop */
            }
            if (wire.ctx.state !== 'closed') {
              void wire.ctx.close().catch(() => {})
            }
            scopeWires.delete(audio)
          }
        }
      }, 0)
    }
  }, [audioRef, isPlaying])

  return (
    <div className="radio__scope-wrap">
      <span className="radio__scope-label">OSCILOSCOPIO</span>
      <canvas ref={canvasRef} className="radio__scope" aria-hidden="true" />
    </div>
  )
}
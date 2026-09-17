import { useFrameSequence } from '../../hooks/useFrameSequence'
import './SpriteLoop.css'

export interface SpriteLoopProps {
  frames: readonly string[]
  frameIntervalMs?: number
  className?: string
}

export function SpriteLoop({
  frames,
  frameIntervalMs = 150,
  className,
}: SpriteLoopProps) {
  const frameIndex = useFrameSequence(frames.length, {
    intervalMs: frameIntervalMs,
    loop: true,
  })

  if (frames.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <img className="sprite-loop__frame" src={frames[frameIndex]} alt="" />
    </div>
  )
}
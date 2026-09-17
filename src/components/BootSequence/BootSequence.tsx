import { useFrameSequence } from '../../hooks/useFrameSequence'
import './BootSequence.css'

export interface BootSequenceProps {
  frames: readonly string[]
  frameIntervalMs?: number
  onBootComplete?: () => void
}

export function BootSequence({
  frames,
  frameIntervalMs = 180,
  onBootComplete,
}: BootSequenceProps) {
  const frameIndex = useFrameSequence(frames.length, {
    intervalMs: frameIntervalMs,
    onComplete: onBootComplete,
  })

  if (frames.length === 0) {
    return null
  }

  return (
    <div className="boot-sequence">
      <img className="boot-sequence__frame" src={frames[frameIndex]} alt="" />
    </div>
  )
}
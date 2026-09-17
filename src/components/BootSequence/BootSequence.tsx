import { useEffect, useRef, useState } from 'react'
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
  const [frameIndex, setFrameIndex] = useState(0)
  const completeRef = useRef(false)
  const onBootCompleteRef = useRef(onBootComplete)

  useEffect(() => {
    onBootCompleteRef.current = onBootComplete
  })

  const lastIndex = frames.length - 1

  useEffect(() => {
    if (frameIndex < lastIndex) {
      const id = window.setTimeout(
        () => setFrameIndex((index) => index + 1),
        frameIntervalMs,
      )
      return () => window.clearTimeout(id)
    }

    if (!completeRef.current) {
      const id = window.setTimeout(() => {
        completeRef.current = true
        onBootCompleteRef.current?.()
      }, frameIntervalMs)
      return () => window.clearTimeout(id)
    }
  }, [frameIndex, lastIndex, frameIntervalMs])

  if (frames.length === 0) {
    return null
  }

  return (
    <div className="boot-sequence">
      <img className="boot-sequence__frame" src={frames[frameIndex]} alt="" />
    </div>
  )
}
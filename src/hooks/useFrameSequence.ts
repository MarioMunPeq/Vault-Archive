import { useEffect, useRef, useState } from 'react'

export interface FrameSequenceOptions {
  intervalMs: number
  loop?: boolean
  durationMs?: number
  onComplete?: () => void
}

export function useFrameSequence(
  frameCount: number,
  { intervalMs, loop = false, durationMs, onComplete }: FrameSequenceOptions,
): number {
  const [frameIndex, setFrameIndex] = useState(0)
  const completeRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  const lastIndex = frameCount - 1

  useEffect(() => {
    if (!durationMs || lastIndex < 0) {
      return
    }

    const id = window.setTimeout(() => {
      completeRef.current = true
      onCompleteRef.current?.()
    }, durationMs)
    return () => window.clearTimeout(id)
  }, [durationMs, lastIndex])

  useEffect(() => {
    if (lastIndex < 0) {
      return
    }

    if (loop || durationMs) {
      const id = window.setTimeout(() => {
        if (!completeRef.current) {
          setFrameIndex((index) => (index + 1) % frameCount)
        }
      }, intervalMs)
      return () => window.clearTimeout(id)
    }

    if (frameIndex < lastIndex) {
      const id = window.setTimeout(
        () => setFrameIndex((index) => index + 1),
        intervalMs,
      )
      return () => window.clearTimeout(id)
    }

    if (completeRef.current) {
      return
    }

    const id = window.setTimeout(() => {
      completeRef.current = true
      onCompleteRef.current?.()
    }, intervalMs)
    return () => window.clearTimeout(id)
  }, [frameIndex, intervalMs, loop, durationMs, frameCount, lastIndex])

  return frameIndex
}
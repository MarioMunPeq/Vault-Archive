import { useEffect, useRef, useState } from 'react'

export type FrameSequenceMode = 'loop' | 'pingpong'

export interface FrameSequenceOptions {
  intervalMs: number
  loop?: boolean
  mode?: FrameSequenceMode
  durationMs?: number
  onComplete?: () => void
}

export function useFrameSequence(
  frameCount: number,
  { intervalMs, loop = false, mode, durationMs, onComplete }: FrameSequenceOptions,
): number {
  const [frameIndex, setFrameIndex] = useState(0)
  const completeRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const pingpongDirRef = useRef<1 | -1>(1)

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

    const looping = loop || mode === 'loop' || mode === 'pingpong' || !!durationMs
    if (looping) {
      const id = window.setTimeout(() => {
        if (!completeRef.current) {
          if (mode === 'pingpong') {
            setFrameIndex((index) => {
              if (lastIndex === 0) {
                return 0
              }
              let next = index + pingpongDirRef.current
              if (next > lastIndex) {
                pingpongDirRef.current = -1
                next = lastIndex - 1
              } else if (next < 0) {
                pingpongDirRef.current = 1
                next = 1
              }
              return next
            })
          } else {
            setFrameIndex((index) => (index + 1) % frameCount)
          }
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
  }, [
    frameIndex,
    intervalMs,
    loop,
    mode,
    durationMs,
    frameCount,
    lastIndex,
  ])

  return frameIndex
}
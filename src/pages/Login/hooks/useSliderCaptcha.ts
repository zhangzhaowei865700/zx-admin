import { useState, useRef, useCallback, useEffect } from 'react'

const THRESHOLD = 0.95

interface UseSliderCaptchaOptions {
  thumbWidth?: number
}

export interface UseSliderCaptchaReturn {
  verified: boolean
  dragging: boolean
  offsetX: number
  trackRef: React.RefObject<HTMLDivElement>
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void
  reset: () => void
}

export function useSliderCaptcha(options?: UseSliderCaptchaOptions): UseSliderCaptchaReturn {
  const { thumbWidth = 44 } = options || {}
  const [verified, setVerified] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const startOffsetRef = useRef(0)

  const getMaxOffset = useCallback(() => {
    if (!trackRef.current) return 0
    return trackRef.current.offsetWidth - thumbWidth
  }, [thumbWidth])

  const getClientX = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) return e.touches[0]?.clientX ?? 0
    return e.clientX
  }

  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (verified) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    startXRef.current = clientX
    startOffsetRef.current = offsetX
    setDragging(true)
  }, [verified, offsetX])

  useEffect(() => {
    if (!dragging) return

    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      const clientX = getClientX(e)
      const delta = clientX - startXRef.current
      const maxOffset = getMaxOffset()
      const newOffset = Math.max(0, Math.min(maxOffset, startOffsetRef.current + delta))
      setOffsetX(newOffset)
    }

    const onEnd = () => {
      setDragging(false)
      const maxOffset = getMaxOffset()
      setOffsetX((current) => {
        if (current >= maxOffset * THRESHOLD) {
          setVerified(true)
          return maxOffset
        }
        return 0
      })
    }

    document.addEventListener('mousemove', onMove, { passive: false })
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }
  }, [dragging, getMaxOffset])

  const reset = useCallback(() => {
    setVerified(false)
    setDragging(false)
    setOffsetX(0)
  }, [])

  return { verified, dragging, offsetX, trackRef, onDragStart, reset }
}

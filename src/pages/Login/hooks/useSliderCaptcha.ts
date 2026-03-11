import { useState, useRef, useCallback, useEffect } from 'react'

const THRESHOLD = 0.95
/** 鼠标垂直偏离轨道超过此距离则取消拖拽 */
const VERTICAL_CANCEL_DISTANCE = 100

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
  const startYRef = useRef(0)
  const startOffsetRef = useRef(0)

  const getMaxOffset = useCallback(() => {
    if (!trackRef.current) return 0
    return trackRef.current.offsetWidth - thumbWidth
  }, [thumbWidth])

  const getClientPos = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      const touch = e.touches[0] ?? e.changedTouches[0]
      return { x: touch?.clientX ?? 0, y: touch?.clientY ?? 0 }
    }
    return { x: e.clientX, y: e.clientY }
  }

  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (verified) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    startXRef.current = clientX
    startYRef.current = clientY
    startOffsetRef.current = offsetX
    setDragging(true)
  }, [verified, offsetX])

  useEffect(() => {
    if (!dragging) return

    const cancel = () => {
      setDragging(false)
      setOffsetX(0)
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      const { x, y } = getClientPos(e)
      // 垂直偏离过远时取消
      if (Math.abs(y - startYRef.current) > VERTICAL_CANCEL_DISTANCE) {
        cancel()
        return
      }
      const delta = x - startXRef.current
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
    document.addEventListener('touchcancel', cancel)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
      document.removeEventListener('touchcancel', cancel)
    }
  }, [dragging, getMaxOffset])

  const reset = useCallback(() => {
    setVerified(false)
    setDragging(false)
    setOffsetX(0)
  }, [])

  return { verified, dragging, offsetX, trackRef, onDragStart, reset }
}

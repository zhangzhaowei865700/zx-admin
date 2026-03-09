import React, { Suspense, useRef, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '@/stores'
import { PageSkeleton } from '@/components/common/PageSkeleton'

const AnimatedOutlet: React.FC = () => {
  const location = useLocation()
  const { enableTransition, transitionName } = useAppStore()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el || !enableTransition || transitionName === 'none') return

    const cls = `page-transition-${transitionName}`
    el.classList.remove(cls)
    void el.offsetHeight
    el.classList.add(cls)

    const onEnd = () => el.classList.remove(cls)
    el.addEventListener('animationend', onEnd)
    return () => el.removeEventListener('animationend', onEnd)
  }, [location.key, enableTransition, transitionName])

  return (
    <div ref={wrapperRef}>
      <Outlet />
    </div>
  )
}

export const PageTransitionWrapper: React.FC = () => {
  return (
    <Suspense fallback={<PageSkeleton type="table" />}>
      <AnimatedOutlet />
    </Suspense>
  )
}

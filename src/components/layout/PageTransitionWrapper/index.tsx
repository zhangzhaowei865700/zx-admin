import React, { Suspense, useRef, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'

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
  const { t } = useTranslation()

  return (
    <Suspense
      fallback={
        <div style={{ padding: 50, textAlign: 'center' }}>
          <Spin tip={t('common:loading')} />
        </div>
      }
    >
      <AnimatedOutlet />
    </Suspense>
  )
}

import React from 'react'
import { Switch, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import type { PageTransition } from '@/stores/useAppStore'

const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <span>{label}</span>
    {children}
  </div>
)

export const TransitionSettings: React.FC = () => {
  const {
    enableTransition, setEnableTransition,
    transitionName, setTransitionName,
  } = useAppStore(useShallow((s) => ({
    enableTransition: s.enableTransition, setEnableTransition: s.setEnableTransition,
    transitionName: s.transitionName, setTransitionName: s.setTransitionName,
  })))
  const { t } = useTranslation('settings')

  const transitionOptions: { value: PageTransition; label: string }[] = [
    { value: 'fade', label: t('transition.fade') },
    { value: 'slide-left', label: t('transition.slideLeft') },
    { value: 'slide-up', label: t('transition.slideUp') },
    { value: 'zoom', label: t('transition.zoom') },
    { value: 'none', label: t('transition.none') },
  ]

  return (
    <>
      <SettingRow label={t('transition.pageTransition')}>
        <Switch checked={enableTransition} onChange={setEnableTransition} />
      </SettingRow>
      <SettingRow label={t('transition.transitionType')}>
        <Select
          value={transitionName}
          onChange={setTransitionName}
          options={transitionOptions}
          disabled={!enableTransition}
          style={{ width: 120 }}
          size="small"
        />
      </SettingRow>
    </>
  )
}

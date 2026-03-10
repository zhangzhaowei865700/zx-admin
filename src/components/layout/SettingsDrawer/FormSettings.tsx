import React from 'react'
import { Segmented } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import type { FormSizePreset } from '@/stores/useAppStore'

const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <span>{label}</span>
    {children}
  </div>
)

export const FormSettings: React.FC = () => {
  const { formDisplayMode, setFormDisplayMode, formColumns, setFormColumns, formSizePreset, setFormSizePreset } = useAppStore(useShallow((s) => ({ formDisplayMode: s.formDisplayMode, setFormDisplayMode: s.setFormDisplayMode, formColumns: s.formColumns, setFormColumns: s.setFormColumns, formSizePreset: s.formSizePreset, setFormSizePreset: s.setFormSizePreset })))
  const { t } = useTranslation('settings')

  return (
    <>
      <SettingRow label={t('form.formDisplay')}>
        <Segmented
          size="small"
          value={formDisplayMode}
          onChange={(v) => setFormDisplayMode(v as 'modal' | 'drawer')}
          options={[
            { label: t('form.modal'), value: 'modal' },
            { label: t('form.drawer'), value: 'drawer' },
          ]}
        />
      </SettingRow>
      <SettingRow label={t('form.formColumns')}>
        <Segmented
          size="small"
          value={formColumns}
          onChange={(v) => setFormColumns(v as 1 | 2)}
          options={[
            { label: t('form.singleColumn'), value: 1 },
            { label: t('form.doubleColumn'), value: 2 },
          ]}
        />
      </SettingRow>
      <SettingRow label={t('form.formSize')}>
        <Segmented
          size="small"
          value={formSizePreset}
          onChange={(v) => setFormSizePreset(v as FormSizePreset)}
          options={[
            { label: t('form.small'), value: 'small' },
            { label: t('form.medium'), value: 'medium' },
            { label: t('form.large'), value: 'large' },
          ]}
        />
      </SettingRow>
    </>
  )
}

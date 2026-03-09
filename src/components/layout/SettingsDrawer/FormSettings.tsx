import React from 'react'
import { Segmented } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'

const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <span>{label}</span>
    {children}
  </div>
)

export const FormSettings: React.FC = () => {
  const { formDisplayMode, setFormDisplayMode, formColumns, setFormColumns } = useAppStore()
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
    </>
  )
}

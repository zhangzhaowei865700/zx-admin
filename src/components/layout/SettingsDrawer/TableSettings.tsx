import React from 'react'
import { Switch, Segmented } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import type { TableSize } from '@/stores/useAppStore'

const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <span>{label}</span>
    {children}
  </div>
)

export const TableSettings: React.FC = () => {
  const {
    tableSize, setTableSize,
    tableBordered, setTableBordered,
    tableResizable, setTableResizable,
  } = useAppStore(useShallow((s) => ({
    tableSize: s.tableSize, setTableSize: s.setTableSize,
    tableBordered: s.tableBordered, setTableBordered: s.setTableBordered,
    tableResizable: s.tableResizable, setTableResizable: s.setTableResizable,
  })))
  const { t } = useTranslation('settings')

  return (
    <>
      <SettingRow label={t('table.tableSize')}>
        <Segmented
          size="small"
          value={tableSize}
          onChange={(v) => setTableSize(v as TableSize)}
          options={[
            { label: t('table.large'), value: 'large' },
            { label: t('table.medium'), value: 'middle' },
            { label: t('table.small'), value: 'small' },
          ]}
        />
      </SettingRow>
      <SettingRow label={t('table.tableBorder')}>
        <Switch checked={tableBordered} onChange={setTableBordered} />
      </SettingRow>
      <SettingRow label={t('table.tableResizable')}>
        <Switch checked={tableResizable} onChange={setTableResizable} />
      </SettingRow>
    </>
  )
}

import React from 'react'
import { Switch, Segmented, Select, Slider } from 'antd'
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
    tableStriped, setTableStriped,
    tableDefaultPageSize, setTableDefaultPageSize,
    tableShowIndex, setTableShowIndex,
    tableFixedHeader, setTableFixedHeader,
    tableMaxHeight, setTableMaxHeight,
  } = useAppStore(useShallow((s) => ({
    tableSize: s.tableSize, setTableSize: s.setTableSize,
    tableBordered: s.tableBordered, setTableBordered: s.setTableBordered,
    tableResizable: s.tableResizable, setTableResizable: s.setTableResizable,
    tableStriped: s.tableStriped, setTableStriped: s.setTableStriped,
    tableDefaultPageSize: s.tableDefaultPageSize, setTableDefaultPageSize: s.setTableDefaultPageSize,
    tableShowIndex: s.tableShowIndex, setTableShowIndex: s.setTableShowIndex,
    tableFixedHeader: s.tableFixedHeader, setTableFixedHeader: s.setTableFixedHeader,
    tableMaxHeight: s.tableMaxHeight, setTableMaxHeight: s.setTableMaxHeight,
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
      <SettingRow label={t('table.tableStriped')}>
        <Switch checked={tableStriped} onChange={setTableStriped} />
      </SettingRow>
      <SettingRow label={t('table.tableShowIndex')}>
        <Switch checked={tableShowIndex} onChange={setTableShowIndex} />
      </SettingRow>
      <SettingRow label={t('table.tableResizable')}>
        <Switch checked={tableResizable} onChange={setTableResizable} />
      </SettingRow>
      <SettingRow label={t('table.tableDefaultPageSize')}>
        <Select
          size="small"
          value={tableDefaultPageSize}
          onChange={setTableDefaultPageSize}
          style={{ width: 80 }}
          options={[
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
            { label: '100', value: 100 },
          ]}
        />
      </SettingRow>
      <SettingRow label={t('table.tableFixedHeader')}>
        <Switch checked={tableFixedHeader} onChange={setTableFixedHeader} />
      </SettingRow>
      {tableFixedHeader && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, color: 'var(--ant-color-text-secondary)', fontSize: 12 }}>
            {t('table.tableMaxHeight')}：{tableMaxHeight}px
          </div>
          <Slider
            min={300}
            max={1200}
            step={50}
            value={tableMaxHeight}
            onChange={setTableMaxHeight}
            marks={{ 300: '300', 600: '600', 900: '900', 1200: '1200' }}
          />
        </div>
      )}
    </>
  )
}

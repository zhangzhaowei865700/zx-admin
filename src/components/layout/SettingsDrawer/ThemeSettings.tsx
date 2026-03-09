import React from 'react'
import { Switch, ColorPicker, Segmented } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'

const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <span>{label}</span>
    {children}
  </div>
)

export const ThemeSettings: React.FC = () => {
  const {
    darkMode, setDarkMode,
    primaryColor, setPrimaryColor,
    colorWeak, setColorWeak,
    grayMode, setGrayMode,
    compactMode, setCompactMode,
    fontSize, setFontSize,
    borderRadius, setBorderRadius,
  } = useAppStore()
  const { t } = useTranslation('settings')

  return (
    <>
      <SettingRow label={t('theme.darkMode')}>
        <Switch checked={darkMode} onChange={setDarkMode} />
      </SettingRow>
      <SettingRow label={t('theme.primaryColor')}>
        <ColorPicker
          value={primaryColor}
          onChange={(_, hex) => setPrimaryColor(hex)}
          presets={[
            {
              label: t('theme.recommended'),
              colors: ['#1677ff', '#13c2c2', '#52c41a', '#eb2f96', '#722ed1', '#fa8c16', '#f5222d'],
            },
          ]}
        />
      </SettingRow>
      <SettingRow label={t('theme.fontSize')}>
        <Segmented
          size="small"
          value={fontSize}
          onChange={(v) => setFontSize(v as number)}
          options={[
            { label: '12', value: 12 },
            { label: '13', value: 13 },
            { label: '14', value: 14 },
            { label: '15', value: 15 },
            { label: '16', value: 16 },
          ]}
        />
      </SettingRow>
      <SettingRow label={t('theme.borderRadius')}>
        <Segmented
          size="small"
          value={borderRadius}
          onChange={(v) => setBorderRadius(v as number)}
          options={[
            { label: '0', value: 0 },
            { label: '2', value: 2 },
            { label: '4', value: 4 },
            { label: '6', value: 6 },
            { label: '8', value: 8 },
          ]}
        />
      </SettingRow>
      <SettingRow label={t('theme.colorWeak')}>
        <Switch checked={colorWeak} onChange={setColorWeak} />
      </SettingRow>
      <SettingRow label={t('theme.grayMode')}>
        <Switch checked={grayMode} onChange={setGrayMode} />
      </SettingRow>
      <SettingRow label={t('theme.compactMode')}>
        <Switch checked={compactMode} onChange={setCompactMode} />
      </SettingRow>
    </>
  )
}

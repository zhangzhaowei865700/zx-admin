import React from 'react'
import { Switch, Input, Avatar, Select } from 'antd'
import { PictureOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { LANGUAGE_OPTIONS } from '@/locales'
import type { LocaleType } from '@/locales'

const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
    <span>{label}</span>
    {children}
  </div>
)

export const SystemSettings: React.FC = () => {
  const { t } = useTranslation('settings')
  const {
    systemName, setSystemName,
    systemLogo, setSystemLogo,
    showWatermark, setShowWatermark,
    watermarkText, setWatermarkText,
    locale, setLocale,
  } = useAppStore()

  return (
    <>
      <SettingRow label={t('system.language')}>
        <Select
          size="small"
          style={{ width: 140 }}
          value={locale}
          onChange={(v: LocaleType) => setLocale(v)}
          options={LANGUAGE_OPTIONS.map((l) => ({ value: l.value, label: l.label }))}
        />
      </SettingRow>
      <div style={{ display: 'none' }}>
        <SettingRow label={t('system.systemName')}>
          <Input
            size="small"
            style={{ width: 140 }}
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            placeholder={t('system.enterSystemName')}
          />
        </SettingRow>
      </div>
      <SettingRow label={t('system.systemLogo')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {systemLogo && (
            <Avatar size="small" src={systemLogo} shape="square" />
          )}
          <Input
            size="small"
            style={{ width: systemLogo ? 104 : 140 }}
            value={systemLogo}
            onChange={(e) => setSystemLogo(e.target.value)}
            placeholder={t('system.logoUrl')}
            prefix={<PictureOutlined />}
            allowClear
          />
        </div>
      </SettingRow>
      <SettingRow label={t('system.showWatermark')}>
        <Switch checked={showWatermark} onChange={setShowWatermark} />
      </SettingRow>
      {showWatermark && (
        <SettingRow label={t('system.watermarkText')}>
          <Input
            size="small"
            style={{ width: 140 }}
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder={t('system.defaultWatermark')}
          />
        </SettingRow>
      )}
    </>
  )
}

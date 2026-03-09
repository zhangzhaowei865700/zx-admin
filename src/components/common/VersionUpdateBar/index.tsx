import React from 'react'
import { Alert, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useVersionCheck } from '@/hooks/useVersionCheck'

export const VersionUpdateBar: React.FC = () => {
  const { t } = useTranslation()
  const { hasNewVersion, refresh } = useVersionCheck()

  if (!hasNewVersion) return null

  return (
    <Alert
      message={t('common:newVersionAvailable')}
      type="info"
      banner
      closable
      action={
        <Button size="small" type="primary" onClick={refresh}>
          {t('common:refreshNow')}
        </Button>
      }
    />
  )
}

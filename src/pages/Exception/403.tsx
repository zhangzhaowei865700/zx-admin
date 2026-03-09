import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  return (
    <Result
      status="403"
      title="403"
      subTitle={t('page403Desc')}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('backHome')}
        </Button>
      }
    />
  )
}

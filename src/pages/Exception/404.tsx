import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('page404Desc')}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('backHome')}
        </Button>
      }
    />
  )
}

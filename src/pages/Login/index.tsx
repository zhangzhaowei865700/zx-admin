import { useState, useEffect } from 'react'
import { message, Button, Form, Input, Card, Spin, theme } from 'antd'
import { UserOutlined, LockOutlined, SafetyCertificateOutlined, CloudServerOutlined, SkinOutlined, AppstoreOutlined, RightOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { preLogin, loginPlatform, getPlatforms, switchPlatform } from '@/api/modules/platform/auth'
import { useUserStore, useAppStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { setToken, setUserInfo } from '@/utils/storage'
import { broadcastAuthEvent } from '@/utils/authChannel'
import { LanguageSwitch } from '@/components/layout/HeaderActions/LanguageSwitch'
import { SliderCaptcha } from './components'
import type { Platform } from '@/types'

type Step = 'login' | 'selectPlatform'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { token, setToken: setGlobalToken, setUserInfo: setGlobalUserInfo, setSaasName } = useUserStore()
  const { setSystemName, removeAllTabs } = useAppStore(useShallow((s) => ({ setSystemName: s.setSystemName, removeAllTabs: s.removeAllTabs })))
  const { token: themeToken } = theme.useToken()
  const { t } = useTranslation('login')

  const isSwitchMode = !!searchParams.get('switch') && !!token

  const [step, setStep] = useState<Step>(isSwitchMode ? 'selectPlatform' : 'login')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [tempToken, setTempToken] = useState('')
  const [platformLoading, setPlatformLoading] = useState<number | null>(null)
  const [fetchingPlatforms, setFetchingPlatforms] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [hoveredPlatformId, setHoveredPlatformId] = useState<number | null>(null)

  // 切换平台模式：用正式 token 获取平台列表
  useEffect(() => {
    if (isSwitchMode) {
      setFetchingPlatforms(true)
      getPlatforms()
        .then((data) => {
          setPlatforms(data)
        })
        .catch(() => {
          message.error(t('getPlatformListFailed'))
          navigate(-1)
        })
        .finally(() => setFetchingPlatforms(false))
    }
  }, [])

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      const { tempToken: token, platforms: list } = await preLogin(values)
      setTempToken(token)
      if (list.length === 1) {
        // 只有一个平台，直接登录
        setPlatformLoading(list[0].id)
        const result = await loginPlatform({ tempToken: token, platformId: list[0].id })
        setToken(result.token)
        setGlobalToken(result.token)
        setSaasName(result.saasName)
        setUserInfo(result.userInfo)
        setGlobalUserInfo(result.userInfo)
        removeAllTabs()
        message.success(`${t('entered')}${list[0].name}`)
        setSystemName(list[0].name)
        navigate(list[0].path)
        setPlatformLoading(null)
      } else {
        setPlatforms(list)
        setStep('selectPlatform')
      }
    } catch {
      // 错误消息已在 request.ts 中显示
    }
  }

  const handleSelectPlatform = async (platform: Platform) => {
    setPlatformLoading(platform.id)
    try {
      let newToken: string
      let saasName: string
      let userInfo: { id: number; username: string; nickname: string; avatar?: string }

      if (isSwitchMode) {
        broadcastAuthEvent('switchPlatform')
        const result = await switchPlatform({ platformId: platform.id })
        newToken = result.token
        saasName = result.saasName
        userInfo = result.userInfo
      } else {
        const result = await loginPlatform({ tempToken, platformId: platform.id })
        newToken = result.token
        saasName = result.saasName
        userInfo = result.userInfo
      }

      setToken(newToken)
      setGlobalToken(newToken)
      setSaasName(saasName)
      setUserInfo(userInfo)
      setGlobalUserInfo(userInfo)
      removeAllTabs()

      message.success(`${t('entered')}${platform.name}`)
      setSystemName(platform.name)
      navigate(platform.path)
    } catch {
      // 错误消息已在 request.ts 中显示
    } finally {
      setPlatformLoading(null)
    }
  }

  const features = [
    { icon: <CloudServerOutlined />, title: t('featureMultiPlatform'), desc: t('featureMultiPlatformDesc') },
    { icon: <SafetyCertificateOutlined />, title: t('featurePermission'), desc: t('featurePermissionDesc') },
    { icon: <SkinOutlined />, title: t('featureTheme'), desc: t('featureThemeDesc') },
  ]

  const renderLoginForm = () => (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{t('welcome')}</h2>
      <p style={{ color: '#999', marginBottom: 40 }}>{t('subtitle')}</p>

      <Form onFinish={handleSubmit} size="large" layout="vertical">
        <Form.Item name="username" rules={[{ required: true, message: t('enterUsername') }]} >
          <Input prefix={<UserOutlined style={{ color: '#bbb' }} />} placeholder={t('usernamePlaceholder')} />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: t('enterPassword') }]}>
          <Input.Password prefix={<LockOutlined style={{ color: '#bbb' }} />} placeholder={t('passwordPlaceholder')} />
        </Form.Item>
        <Form.Item>
          <SliderCaptcha onVerified={() => setCaptchaVerified(true)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block style={{ height: 44 }} disabled={!captchaVerified}>
            {t('loginBtn')}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', color: '#bbb', fontSize: 12 }}>
        {t('defaultAccount')}
      </div>
    </div>
  )

  const loginStyles = `
    .login-container {
      display: flex;
      height: 100vh;
    }
    .login-brand {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 80px;
      position: relative;
      overflow: hidden;
    }
    .login-content {
      width: 480px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 60px;
      background: #fff;
      position: relative;
    }
    .platform-card.disabled {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }
    .platform-card.loading {
      cursor: not-allowed;
    }
    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
      }
      .login-brand {
        display: none;
      }
      .login-content {
        width: 100%;
        flex: 1;
        padding: 0 24px;
      }
    }
  `

  const renderPlatformSelect = () => (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
        {isSwitchMode ? t('selectPlatformTab') : t('choosePlatformTab')}
      </h2>
      <p style={{ color: '#999', marginBottom: 32 }}>{t('selectPlatformDesc')}</p>

      {fetchingPlatforms ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'calc(100vh - 280px)', overflowY: 'auto', padding: '32px', margin: '-32px' }}>
          {platforms.map((platform) => {
            const isHovered = hoveredPlatformId === platform.id
            const isDisabled = !!platformLoading && platformLoading !== platform.id
            const isLoading = platformLoading === platform.id
            return (
            <Card
              key={platform.id}
              className={`platform-card${isDisabled ? ' disabled' : ''}${isLoading ? ' loading' : ''}`}
              onClick={() => !platformLoading && handleSelectPlatform(platform)}
              onMouseEnter={() => { if (!isDisabled && !isLoading) setHoveredPlatformId(platform.id) }}
              onMouseLeave={() => setHoveredPlatformId(null)}
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                border: `1px solid ${isHovered ? themeToken.colorPrimary : themeToken.colorBorderSecondary}`,
                boxShadow: isHovered ? `0 12px 28px ${themeToken.colorPrimary}30, 0 4px 12px rgba(0,0,0,0.08)` : 'none',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: isDisabled || isLoading ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
              }}
              styles={{
                body: {
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                },
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${themeToken.colorPrimary}, ${themeToken.colorPrimaryHover})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 22,
                  flexShrink: 0,
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <AppstoreOutlined />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
                  {platform.name}
                </div>
                {platform.description && (
                  <div style={{ color: '#999', fontSize: 13 }}>
                    {platform.description}
                  </div>
                )}
              </div>
              {isLoading ? <Spin size="small" /> : (
                <RightOutlined style={{
                  fontSize: 14,
                  color: isHovered ? themeToken.colorPrimary : '#ccc',
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.35s',
                }} />
              )}
            </Card>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <div className="login-container">
      <style>{loginStyles}</style>
      {/* 左侧品牌区 */}
      <div
        className="login-brand"
        style={{
          background: `linear-gradient(145deg, color-mix(in srgb, ${themeToken.colorPrimaryActive} 60%, #000) 0%, color-mix(in srgb, ${themeToken.colorPrimary} 70%, #001030) 50%, color-mix(in srgb, ${themeToken.colorPrimaryHover} 80%, #001030) 100%)`,
        }}
      >
        {/* 装饰元素 */}
        <div style={{
          position: 'absolute', top: '10%', right: '10%',
          width: 200, height: 200, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '20%',
          width: 120, height: 120, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '-5%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <h1 style={{ color: '#fff', fontSize: 38, fontWeight: 700, marginBottom: 12 }}>
            {t('systemTitle')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 56 }}>
            {t('systemSubtitle')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {features.map((item) => (
              <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 20, flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: 15, fontWeight: 500, marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="login-content">
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <LanguageSwitch />
        </div>
        {step === 'login' ? renderLoginForm() : renderPlatformSelect()}
      </div>
    </div>
  )
}

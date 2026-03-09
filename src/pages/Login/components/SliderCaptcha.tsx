import { useEffect } from 'react'
import { theme as antTheme } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useSliderCaptcha } from '../hooks/useSliderCaptcha'

const TRACK_HEIGHT = 40
const THUMB_WIDTH = 48

interface SliderCaptchaProps {
  onVerified: () => void
  style?: React.CSSProperties
}

export const SliderCaptcha: React.FC<SliderCaptchaProps> = ({ onVerified, style }) => {
  const { token: themeToken } = antTheme.useToken()
  const { t } = useTranslation('login')
  const { verified, dragging, offsetX, trackRef, onDragStart } = useSliderCaptcha({ thumbWidth: THUMB_WIDTH })

  useEffect(() => {
    if (verified) onVerified()
  }, [verified, onVerified])

  const progress = trackRef.current ? offsetX / (trackRef.current.offsetWidth - THUMB_WIDTH) : 0

  return (
    <div
      ref={trackRef}
      style={{
        position: 'relative',
        height: TRACK_HEIGHT,
        borderRadius: themeToken.borderRadiusLG,
        background: verified ? themeToken.colorSuccessBg : themeToken.colorFillAlter,
        border: `1px solid ${verified ? themeToken.colorSuccessBorder : themeToken.colorBorder}`,
        userSelect: 'none',
        overflow: 'hidden',
        transition: 'all 0.3s',
        ...style,
      }}
    >
      {/* 填充条 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: offsetX + THUMB_WIDTH,
          background: verified ? themeToken.colorSuccessBg : themeToken.colorPrimaryBg,
          transition: dragging ? 'none' : 'width 0.3s ease',
        }}
      />

      {/* 提示文字 */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontSize: 14,
          color: verified ? themeToken.colorSuccess : themeToken.colorTextQuaternary,
          pointerEvents: 'none',
          transition: 'opacity 0.2s, color 0.3s',
          opacity: (progress < 0.15 || verified) ? 1 : 0,
        }}
      >
        {verified && <CheckOutlined style={{ fontSize: 13 }} />}
        {verified ? t('captchaVerified') : t('captchaSlideToVerify')}
      </span>

      {/* 滑块 */}
      <div
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: THUMB_WIDTH,
          height: TRACK_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: verified ? themeToken.colorSuccess : themeToken.colorBgContainer,
          borderRadius: themeToken.borderRadiusLG,
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          cursor: verified ? 'default' : dragging ? 'grabbing' : 'grab',
          transform: `translateX(${offsetX}px)`,
          transition: dragging ? 'none' : 'all 0.3s ease',
          zIndex: 1,
        }}
      >
        {verified ? (
          <CheckOutlined style={{ fontSize: 16, color: '#fff' }} />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke={dragging ? themeToken.colorPrimary : themeToken.colorTextSecondary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 6l6 6-6 6"
              stroke={dragging ? themeToken.colorPrimary : themeToken.colorTextSecondary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />
          </svg>
        )}
      </div>
    </div>
  )
}

import { forwardRef } from 'react'
import { theme as antTheme } from 'antd'

interface ActionIconProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  className?: string
  style?: React.CSSProperties
}

/**
 * Header 工具栏统一图标按钮
 * 提供一致的尺寸、hover 效果和交互反馈
 */
export const ActionIcon = forwardRef<HTMLSpanElement, ActionIconProps>(
  ({ children, onClick, style }, ref) => {
    const { token } = antTheme.useToken()

    return (
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick(e as any) }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 16,
          color: token.colorTextSecondary,
          transition: 'all 0.2s',
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = token.colorFillTertiary
          e.currentTarget.style.color = token.colorText
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = token.colorTextSecondary
        }}
      >
        {children}
      </span>
    )
  }
)

ActionIcon.displayName = 'ActionIcon'

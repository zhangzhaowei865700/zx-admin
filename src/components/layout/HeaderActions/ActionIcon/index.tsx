import { forwardRef } from 'react'

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
          color: 'inherit',
          opacity: 0.65,
          transition: 'all 0.2s',
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, currentColor 8%, transparent)'
          e.currentTarget.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.opacity = '0.65'
        }}
      >
        {children}
      </span>
    )
  }
)

ActionIcon.displayName = 'ActionIcon'

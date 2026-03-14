/**
 * Header 工具栏分隔线
 * 用于分组显示不同类型的操作按钮
 */
export const ActionDivider: React.FC = () => {
  return (
    <span
      style={{
        width: 1,
        height: 16,
        backgroundColor: 'color-mix(in srgb, currentColor 15%, transparent)',
        flexShrink: 0,
      }}
    />
  )
}

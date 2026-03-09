import { usePermission } from '@/hooks/usePermission'

interface HasPermissionProps {
  /** 权限码，支持单个或数组（数组为 OR 逻辑） */
  code: string | string[]
  children: React.ReactNode
  /** 无权限时的占位内容，默认不渲染 */
  fallback?: React.ReactNode
}

/**
 * 按钮级权限控制组件
 *
 * @example
 * <HasPermission code="tenant:delete">
 *   <Button danger>删除</Button>
 * </HasPermission>
 *
 * <HasPermission code={['tenant:edit', 'admin']} fallback={<span>无权限</span>}>
 *   <Button>编辑</Button>
 * </HasPermission>
 */
export const HasPermission: React.FC<HasPermissionProps> = ({ code, children, fallback = null }) => {
  const { hasPermission } = usePermission()
  return hasPermission(code) ? <>{children}</> : <>{fallback}</>
}

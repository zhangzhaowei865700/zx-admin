import { useMemo, useCallback, useState, useEffect, memo, type FC } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SwapOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { getPlatformMenuItems, type MenuItem } from '@/constants/platformMenu'
import { BaseLayout } from '../BaseLayout'
import { MenuSearch, FullScreen, DarkModeToggle, LockScreenButton, NotificationBell, LanguageSwitch, OverflowActions } from '../HeaderActions'

// 递归转换菜单数据为 ProLayout route 格式
const convertMenuToRoutes = (items: MenuItem[]): any[] =>
  items.map((item) => ({
    path: item.path,
    name: item.name,
    icon: item.icon,
    ...(item.group ? { group: item.group } : {}),
    ...(item.children ? { routes: convertMenuToRoutes(item.children) } : {}),
  }))

export const AppLayout: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const {
    showBreadcrumb,
    menuAccordion,
    sideMenuType,
    systemName,
    systemLogo,
    collapsed,
  } = useAppStore()

  // 根据当前路径提取应该展开的父菜单 key
  const getParentKeys = useCallback((path: string): string[] => {
    const menuItems = getPlatformMenuItems()
    for (const item of menuItems) {
      if (item.children) {
        const hasChild = item.children.some((child) => path.startsWith(child.path))
        if (hasChild) return [item.path]
      }
    }
    return []
  }, [])

  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>(() => getParentKeys(location.pathname))

  const pathname = useMemo(() => location.pathname, [location.pathname])

  // 路由切换时同步展开的父菜单
  useEffect(() => {
    const parentKeys = getParentKeys(pathname)
    if (menuAccordion) {
      setMenuOpenKeys(parentKeys)
    } else {
      setMenuOpenKeys((prev) => [...new Set([...prev, ...parentKeys])])
    }
  }, [pathname, menuAccordion, getParentKeys])

  // 动态生成路由配置（语言切换时 menu name 会更新）
  const staticRoute = useMemo(() => ({
    path: '/',
    routes: convertMenuToRoutes(getPlatformMenuItems()),
  }), [t])

  const handleExtraMenuClick = useCallback((key: string) => {
    if (key === 'switchPlatform') {
      navigate('/login?switch=1')
    }
  }, [navigate])

  const extraMenuItems = useMemo(() => [
    { type: 'divider' as const },
    { key: 'switchPlatform', label: t('common:switchPlatform'), icon: <SwapOutlined /> },
  ], [t])

  const headerActions = useMemo(() => (
    <OverflowActions gap={4}>
      <NotificationBell />
      <MenuSearch />
      <DarkModeToggle />
      <LanguageSwitch />
      <LockScreenButton />
      <FullScreen />
    </OverflowActions>
  ), [])

  const menuProps = useMemo(() => ({
    ...(menuAccordion ? {
      openKeys: collapsed ? undefined : menuOpenKeys,
      onOpenChange: (keys: string[]) => {
        if (keys.length === 0) { setMenuOpenKeys([]); return }
        const newKey = keys.find((k) => !menuOpenKeys.includes(k))
        if (!newKey) { setMenuOpenKeys(keys); return }
        setMenuOpenKeys(keys.filter((k) => newKey.startsWith(k + '/') || k === newKey))
      },
    } : {}),
  }), [menuAccordion, collapsed, menuOpenKeys])

  return (
    <BaseLayout
      title={systemName}
      logo={systemLogo}
      route={staticRoute}
      homePath="/"
      headerActions={headerActions}
      extraMenuItems={extraMenuItems}
      onExtraMenuClick={handleExtraMenuClick}
      footerText={systemName}
      watermarkContent={systemName}
      breadcrumbRender={showBreadcrumb ? undefined : false}
      breadcrumbProps={{
        itemRender: (route: any) => <span>{route.breadcrumbName}</span>,
      }}
      menuProps={menuProps}
      siderMenuType={sideMenuType}
    />
  )
}

export default memo(AppLayout)

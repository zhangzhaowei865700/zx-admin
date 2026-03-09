import { useMemo, useCallback, useEffect, useState, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Avatar, Dropdown, Modal, Form, Input, message, theme as antTheme, ConfigProvider, Watermark, Grid } from 'antd'
import { ProLayout } from '@ant-design/pro-components'
import {
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppStore, useUserStore } from '@/stores'
import { logout } from '@/api/modules/platform/auth'
import { removeToken, removeUserInfo, getUserInfo } from '@/utils/storage'
import { broadcastAuthEvent, onAuthEvent } from '@/utils/authChannel'
import { getPlatformMenuItems, type MenuItem } from '@/constants/platformMenu'
import { MultiTabs } from '../MultiTabs'
import { PageTransitionWrapper } from '../PageTransitionWrapper'
import { SettingsDrawer } from '../SettingsDrawer'
import { MenuSearch, FullScreen, DarkModeToggle, LockScreenButton, LockScreenOverlay, NotificationBell, LanguageSwitch, OverflowActions } from '../HeaderActions'

// 递归转换菜单数据为 ProLayout route 格式
const convertMenuToRoutes = (items: MenuItem[]): any[] =>
  items.map((item) => ({
    path: item.path,
    name: item.name,
    icon: item.icon,
    ...(item.children ? { routes: convertMenuToRoutes(item.children) } : {}),
  }))

export const AppLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token: themeToken } = antTheme.useToken()
  const { t } = useTranslation()

  const {
    collapsed, setCollapsed,
    layoutMode, setLayoutMode,
    showHeader,
    fixedHeader,
    showSidebar,
    fixedSidebar,
    showFooter,
    showBreadcrumb,
    sidebarWidth,
    darkMode,
    primaryColor,
    compactMode,
    systemName,
    systemLogo,
    showWatermark,
    watermarkText,
    contentWidth,
    menuAccordion,
    contentPadding,
  } = useAppStore()

  const { userInfo: storeUserInfo, setUserInfo: setStoreUserInfo, logout: storeLogout } = useUserStore()
  const [profileVisible, setProfileVisible] = useState(false)
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md

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

  // PC 端设置了 side/top 布局后切到移动端，自动回退为 mix
  useEffect(() => {
    if (isMobile && layoutMode !== 'mix') {
      setLayoutMode('mix')
    }
  }, [isMobile, layoutMode, setLayoutMode])

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

  // 从 localStorage 初始化用户信息
  const [userInfo, setUserInfo] = useState(storeUserInfo)
  useEffect(() => {
    if (!storeUserInfo) {
      const info = getUserInfo()
      if (info) {
        setUserInfo(info)
        setStoreUserInfo(info)
      }
    } else {
      setUserInfo(storeUserInfo)
    }
  }, [storeUserInfo, setStoreUserInfo])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
    } catch {
      // ignore error
    }
    broadcastAuthEvent('logout')
    storeLogout()
    removeToken()
    removeUserInfo()
    message.success(t('loggedOut'))
    navigate('/login')
  }, [navigate, storeLogout, t])

  // 监听其他标签页的登出/切换平台事件
  useEffect(() => {
    return onAuthEvent((event) => {
      if (event === 'logout' || event === 'switchPlatform') {
        storeLogout()
        removeToken()
        removeUserInfo()
        navigate('/login')
      }
    })
  }, [navigate, storeLogout])

  const handleProfileSubmit = useCallback(() => {
    message.success(t('saveSuccess'))
    setProfileVisible(false)
  }, [t])

  const menuItemRender = useCallback((item: any, defaultDom: React.ReactNode) => {
    if (!item.path) {
      return defaultDom
    }

    return (
      <span
        role="button"
        tabIndex={0}
        style={{ display: 'block', width: '100%', cursor: 'pointer' }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          navigate(item.path)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            navigate(item.path)
          }
        }}
      >
        {defaultDom}
      </span>
    )
  }, [navigate])

  const handleMenuClick = useCallback(({ key }: { key: string }) => {
    if (key === 'profile') {
      setProfileVisible(true)
    } else if (key === 'switchPlatform') {
      navigate('/login?switch=1')
    } else if (key === 'logout') {
      handleLogout()
    }
  }, [handleLogout, navigate])

  const rightContentRender = useCallback(() => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <OverflowActions gap={4}>
        <NotificationBell />
        <MenuSearch />
        <DarkModeToggle />
        <LanguageSwitch />
        <LockScreenButton />
        <FullScreen />
      </OverflowActions>
      <span style={{ width: 1, height: 20, flexShrink: 0, background: themeToken.colorBorderSecondary, margin: isMobile ? '0 4px' : '0 8px' }} />
      <Dropdown
        menu={{
          items: [
            { key: 'profile', label: t('profileCenter'), icon: <UserOutlined /> },
            { type: 'divider' as const },
            { key: 'switchPlatform', label: t('switchPlatform'), icon: <SwapOutlined /> },
            { key: 'logout', label: t('logoutBtn'), icon: <LogoutOutlined />, danger: true },
          ],
          onClick: handleMenuClick,
        }}
        trigger={['click']}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            padding: '0 8px',
            borderRadius: 6,
            height: 32,
            transition: 'background-color 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = themeToken.colorFillTertiary }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <Avatar
            style={{ backgroundColor: themeToken.colorPrimary, flexShrink: 0 }}
            size="small"
            src={userInfo?.avatar}
          >
            {userInfo?.nickname?.[0] || userInfo?.username?.[0] || 'A'}
          </Avatar>
          {!isMobile && (
            <span style={{ color: themeToken.colorText, fontSize: 14, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userInfo?.nickname || userInfo?.username || t('admin')}
            </span>
          )}
        </div>
      </Dropdown>
    </div>
  ), [userInfo, handleMenuClick, themeToken, isMobile, t])

  return (
    <>
      <ProLayout
        key={`${layoutMode}-${isMobile}`}
        title={systemName}
        logo={systemLogo || undefined}
        route={staticRoute}
        location={{ pathname }}
        layout={layoutMode}
        contentWidth={contentWidth === 'fixed' ? 'Fixed' : 'Fluid'}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        onMenuHeaderClick={() => navigate('/')}
        menuItemRender={menuItemRender}
        rightContentRender={rightContentRender}
        fixSiderbar={fixedSidebar}
        fixedHeader={fixedHeader}
        headerRender={showHeader ? undefined : false}
        menuRender={layoutMode === 'top' ? undefined : (showSidebar ? undefined : false)}
        siderWidth={sidebarWidth}
        breadcrumbRender={showBreadcrumb ? undefined : false}
        breadcrumbProps={{
          itemRender: (route) => <span>{route.breadcrumbName}</span>,
        }}
        menuProps={{
          ...(menuAccordion ? {
            openKeys: collapsed ? undefined : menuOpenKeys,
            onOpenChange: (keys: string[]) => {
              if (keys.length === 0) { setMenuOpenKeys([]); return }
              const newKey = keys.find((k) => !menuOpenKeys.includes(k))
              if (!newKey) { setMenuOpenKeys(keys); return }
              // 只保留 newKey 及其祖先 key，关闭其他根级菜单
              setMenuOpenKeys(keys.filter((k) => newKey.startsWith(k + '/') || k === newKey))
            },
          } : {}),
        }}        footerRender={showFooter ? () => (
          <div style={{ textAlign: 'center', padding: '16px 0', color: themeToken.colorTextSecondary }}>
            {systemName} ©{new Date().getFullYear()}
          </div>
        ) : false}
        navTheme={darkMode ? 'realDark' : 'light'}
        token={{
          header: {
            colorBgHeader: darkMode ? '#141414' : '#ffffff',
            colorBgScrollHeader: darkMode ? '#141414' : '#ffffff',
          },
          pageContainer: {
            paddingBlockPageContainerContent: contentPadding,
            paddingInlinePageContainerContent: contentPadding,
          },
        }}
        bgLayoutImgList={darkMode ? [] : undefined}
      >
        <Watermark content={showWatermark ? (watermarkText || systemName) : ''}>
          <ConfigProvider
            theme={{
              algorithm: [
                darkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
                ...(compactMode ? [antTheme.compactAlgorithm] : []),
              ],
              token: { colorPrimary: primaryColor, colorLink: primaryColor },
            }}
          >
            <MultiTabs />
            <PageTransitionWrapper />
          </ConfigProvider>
        </Watermark>

        <Modal
          title={t('profileCenter')}
          open={profileVisible}
          onCancel={() => setProfileVisible(false)}
          onOk={handleProfileSubmit}
          okText={t('save')}
        >
          <Form layout="vertical" initialValues={userInfo ?? undefined}>
            <Form.Item label={t('username')} name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item label={t('nickname')} name="nickname">
              <Input prefix={<EditOutlined />} placeholder={t('enterNickname')} />
            </Form.Item>
            <Form.Item label={t('avatar')} name="avatar">
              <Input prefix={<UserOutlined />} placeholder={t('avatarUrl')} />
            </Form.Item>
          </Form>
        </Modal>
      </ProLayout>

      <SettingsDrawer />
      <LockScreenOverlay />
    </>
  )
}

export default memo(AppLayout)

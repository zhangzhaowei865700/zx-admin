import { useMemo, useCallback, useState, useEffect, memo } from 'react'
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { Avatar, Dropdown, Modal, Form, Input, message, theme as antTheme, ConfigProvider, Watermark, Grid } from 'antd'
import { ProLayout } from '@ant-design/pro-components'
import {
  LogoutOutlined,
  RollbackOutlined,
  UserOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppStore, useUserStore } from '@/stores'
import { logout } from '@/api/modules/platform/auth'
import { getTenantDetail } from '@/api/modules/platform/tenant'
import { removeToken, removeUserInfo, getUserInfo } from '@/utils/storage'
import { broadcastAuthEvent, onAuthEvent } from '@/utils/authChannel'
import { getTenantMenuItems } from '@/constants/tenantMenu'
import type { MenuItem } from '@/constants/platformMenu'
import { MultiTabs } from '../MultiTabs'
import { PageTransitionWrapper } from '../PageTransitionWrapper'
import { SettingsDrawer } from '../SettingsDrawer'
import { MenuSearch, FullScreen, DarkModeToggle, LockScreenButton, LockScreenOverlay, OverflowActions } from '../HeaderActions'

// 递归转换菜单数据为 ProLayout route 格式（带 tenantId 前缀）
const convertMenuToRoutes = (items: MenuItem[], basePath: string): any[] =>
  items.map((item) => ({
    path: item.path ? `${basePath}/${item.path}` : basePath,
    name: item.name,
    icon: item.icon,
    ...(item.children ? { routes: convertMenuToRoutes(item.children, basePath) } : {}),
  }))

export const TenantLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { tenantId } = useParams<{ tenantId: string }>()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
  const [tenantName, setTenantName] = useState(() => {
    // 优先从 URL 参数获取，其次从 sessionStorage 缓存读取
    const nameFromUrl = searchParams.get('name')
    if (nameFromUrl) {
      sessionStorage.setItem(`tenant_name_${tenantId}`, nameFromUrl)
      return nameFromUrl
    }
    return sessionStorage.getItem(`tenant_name_${tenantId}`) || t('tenant:tenantId', { id: tenantId })
  })

  // 如果没有缓存的名称，从 API 获取
  useEffect(() => {
    if (!sessionStorage.getItem(`tenant_name_${tenantId}`) && tenantId) {
      getTenantDetail(Number(tenantId)).then((res) => {
        if (res?.name) {
          sessionStorage.setItem(`tenant_name_${tenantId}`, res.name)
          setTenantName(res.name)
        }
      }).catch((e) => {
        console.warn('[TenantLayout] Failed to fetch tenant detail:', e)
      })
    }
  }, [tenantId])

  const { token: themeToken } = antTheme.useToken()

  const {
    collapsed, setCollapsed,
    layoutMode, setLayoutMode,
    showHeader,
    fixedHeader,
    showSidebar,
    fixedSidebar,
    showFooter,
    sidebarWidth,
    darkMode,
    primaryColor,
    compactMode,
    showWatermark,
    watermarkText,
    contentWidth,
    contentPadding,
  } = useAppStore()

  const { userInfo: storeUserInfo, setUserInfo: setStoreUserInfo, logout: storeLogout, saasName } = useUserStore()

  const [userInfo, setUserInfo] = useState(storeUserInfo)
  const [profileVisible, setProfileVisible] = useState(false)
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md

  // PC 端设置了 side/top 布局后切到移动端，自动回退为 mix
  useEffect(() => {
    if (isMobile && layoutMode !== 'mix') {
      setLayoutMode('mix')
    }
  }, [isMobile, layoutMode, setLayoutMode])

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

  const basePath = `/tenant-admin/${tenantId}`

  const staticRoute = useMemo(() => ({
    path: basePath,
    routes: convertMenuToRoutes(getTenantMenuItems(), basePath),
  }), [basePath])

  const pathname = useMemo(() => location.pathname, [location.pathname])

  // 精确匹配当前路径对应的菜单项，避免首页因前缀匹配始终高亮
  const selectedKeys = useMemo(() => {
    const menuItems = getTenantMenuItems()
    for (const item of menuItems) {
      const fullPath = item.path ? `${basePath}/${item.path}` : basePath
      if (fullPath === pathname) return [fullPath]
    }
    return [pathname]
  }, [pathname, basePath])

  // 面包屑：第一级显示租户名称，后续显示菜单层级
  const breadcrumbItems = useMemo(() => {
    const findMenuPath = (items: MenuItem[], path: string, parents: MenuItem[] = []): MenuItem[] | null => {
      for (const item of items) {
        const fullPath = item.path ? `${basePath}/${item.path}` : basePath
        if (fullPath === path) return [...parents, item]
        if (item.children) {
          const found = findMenuPath(item.children, path, [...parents, item])
          if (found) return found
        }
      }
      return null
    }
    const menuPath = findMenuPath(getTenantMenuItems(), pathname) || []
    return [
      { title: tenantName },
      ...menuPath.map((item) => ({ title: item.name })),
    ]
  }, [pathname, basePath, tenantName])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
    } catch (e) {
      console.warn('[TenantLayout] logout API failed:', e)
    }
    broadcastAuthEvent('logout')
    storeLogout()
    removeToken()
    removeUserInfo()
    message.success(t('common:loggedOut'))
    navigate('/login')
  }, [navigate, storeLogout])

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

  const handleBackToPlatform = useCallback(() => {
    navigate('/tenant')
  }, [navigate])

  const handleProfileSubmit = useCallback(() => {
    message.success(t('common:saveSuccess'))
    setProfileVisible(false)
  }, [])

  const menuItemRender = useCallback((item: any, defaultDom: React.ReactNode) => {
    if (!item.path) return defaultDom
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
    } else if (key === 'backToPlatform') {
      handleBackToPlatform()
    } else if (key === 'logout') {
      handleLogout()
    }
  }, [handleLogout, handleBackToPlatform])

  const rightContentRender = useCallback(() => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', overflow: 'hidden' }}>
      <OverflowActions gap={4}>
        <MenuSearch menuItems={getTenantMenuItems()} basePath={basePath} />
        <DarkModeToggle />
        <LockScreenButton />
        <FullScreen />
      </OverflowActions>
      <span style={{ width: 1, height: 20, flexShrink: 0, background: themeToken.colorBorderSecondary, margin: isMobile ? '0 4px' : '0 8px' }} />
      <Dropdown
        menu={{
          items: [
            { key: 'profile', label: t('common:profileCenter'), icon: <UserOutlined /> },
            { key: 'backToPlatform', label: t('common:backToPlatform'), icon: <RollbackOutlined /> },
            { type: 'divider' as const },
            { key: 'logout', label: t('common:logoutBtn'), icon: <LogoutOutlined /> },
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
              {userInfo?.nickname || userInfo?.username || t('common:admin')}
            </span>
          )}
        </div>
      </Dropdown>
    </div>
  ), [userInfo, handleMenuClick, themeToken, isMobile, basePath, t])

  return (
    <>
      <ProLayout
      key={`${layoutMode}-${isMobile}`}
      title={saasName ? `${saasName} - ${tenantName}` : tenantName}
      route={staticRoute}
      location={{ pathname }}
      layout={layoutMode}
      contentWidth={contentWidth === 'fixed' ? 'Fixed' : 'Fluid'}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      onMenuHeaderClick={() => navigate(basePath)}
      menuItemRender={menuItemRender}
      menuFooterRender={undefined}
      rightContentRender={showHeader ? rightContentRender : false}
      fixSiderbar={fixedSidebar}
      fixedHeader={fixedHeader}
      headerRender={showHeader ? undefined : false}
      menuRender={layoutMode === 'top' ? undefined : (showSidebar ? undefined : false)}
      siderWidth={sidebarWidth}
      breadcrumbProps={{
        itemRender: (route) => <span>{route.title}</span>,
        items: breadcrumbItems,
      }}
      menuProps={{
        selectedKeys,
      }}
      footerRender={showFooter ? () => (
        <div style={{ textAlign: 'center', padding: '16px 0', color: themeToken.colorTextSecondary }}>
          {tenantName} ©{new Date().getFullYear()}
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
    >
      <Watermark content={showWatermark ? (watermarkText || (saasName ? `${saasName} - ${tenantName}` : tenantName)) : ''}>
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
          title={t('common:profileCenter')}
          open={profileVisible}
          onCancel={() => setProfileVisible(false)}
          onOk={handleProfileSubmit}
          okText={t('common:save')}
        >
          <Form layout="vertical" initialValues={userInfo ?? undefined}>
            <Form.Item label={t('common:username')} name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item label={t('common:nickname')} name="nickname">
              <Input prefix={<EditOutlined />} placeholder={t('common:enterNickname')} />
            </Form.Item>
            <Form.Item label={t('common:avatar')} name="avatar">
              <Input prefix={<UserOutlined />} placeholder={t('common:avatarUrl')} />
            </Form.Item>
          </Form>
        </Modal>
    </ProLayout>

      <SettingsDrawer />
      <LockScreenOverlay />
    </>
  )
}

export default memo(TenantLayout)

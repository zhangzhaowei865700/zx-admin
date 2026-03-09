import React, { useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, Dropdown, theme as antTheme } from 'antd'
import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { getPlatformMenuLabelByPath } from '@/constants/platformMenu'
import { getTenantMenuLabelByPath } from '@/constants/tenantMenu'
import './index.css'

/** 判断当前路径属于哪套后台 */
const isTenantAdminPath = (path: string) => path.startsWith('/tenant-admin/')

/** 获取当前后台的首页路径 */
const getHomePath = (path: string) => {
  if (isTenantAdminPath(path)) {
    // 从 /tenant-admin/123/xxx 中提取 /tenant-admin/123
    const match = path.match(/^\/tenant-admin\/[^/]+/)
    return match ? match[0] : path
  }
  return '/'
}

export const MultiTabs: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token: themeToken } = antTheme.useToken()
  const { t } = useTranslation('common')
  const {
    tabs,
    activeTabKey,
    showTabs,
    tabStyle,
    addTab,
    removeTab,
    removeOtherTabs,
    removeAllTabs,
    setActiveTabKey,
  } = useAppStore()

  const isTenant = isTenantAdminPath(location.pathname)
  const homePath = getHomePath(location.pathname)
  // 当前后台的路径前缀，用于 scope 过滤
  const scope = isTenant ? homePath : '/'

  /** 根据 tab path 动态获取当前语言的标签名（语言切换时自动更新） */
  const getTabLabel = useCallback((tabKey: string) => {
    if (isTenantAdminPath(tabKey)) {
      return getTenantMenuLabelByPath(tabKey)
    }
    return getPlatformMenuLabelByPath(tabKey)
  }, [t])

  // 只显示当前后台的标签页（不同商户互相隔离）
  const filteredTabs = useMemo(
    () => isTenant
      ? tabs.filter((t) => t.key.startsWith(homePath))
      : tabs.filter((t) => !isTenantAdminPath(t.key)),
    [tabs, isTenant, homePath]
  )

  // 路由变化时自动添加标签
  useEffect(() => {
    const label = isTenant
      ? getTenantMenuLabelByPath(location.pathname)
      : getPlatformMenuLabelByPath(location.pathname)
    addTab({
      key: location.pathname,
      label,
      closable: location.pathname !== homePath,
    })
    setActiveTabKey(location.pathname)
  }, [location.pathname, addTab, setActiveTabKey, isTenant, homePath])

  const handleTabChange = useCallback(
    (key: string) => {
      navigate(key)
    },
    [navigate]
  )

  const handleTabEdit = useCallback(
    (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
      if (action === 'remove' && typeof targetKey === 'string') {
        removeTab(targetKey)
        // 如果关闭的是当前标签，导航到新的活动标签
        const { activeTabKey: newActive } = useAppStore.getState()
        if (targetKey === location.pathname) {
          navigate(newActive)
        }
      }
    },
    [removeTab, navigate, location.pathname]
  )

  const getContextMenuItems = useCallback(
    (tabKey: string): MenuProps['items'] => [
      {
        key: 'refresh',
        label: t('refreshCurrent'),
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation()
          // 通过导航到空路由再回来实现刷新
          navigate(tabKey, { replace: true })
        },
      },
      {
        key: 'close',
        label: t('closeCurrent'),
        disabled: tabKey === homePath,
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation()
          removeTab(tabKey)
          const { activeTabKey: newActive } = useAppStore.getState()
          if (tabKey === location.pathname) {
            navigate(newActive)
          }
        },
      },
      { type: 'divider' as const },
      {
        key: 'closeOthers',
        label: t('closeOthers'),
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation()
          removeOtherTabs(tabKey, scope)
          navigate(tabKey)
        },
      },
      {
        key: 'closeAll',
        label: t('closeAll'),
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation()
          removeAllTabs(scope, homePath)
          navigate(homePath)
        },
      },
    ],
    [removeTab, removeOtherTabs, removeAllTabs, navigate, location.pathname, homePath, scope, t]
  )

  if (!showTabs) return null

  const isCardStyle = tabStyle === 'card'

  const tabItems = filteredTabs.map((tab) => ({
    key: tab.key,
    label: (
      <Dropdown
        menu={{ items: getContextMenuItems(tab.key) }}
        trigger={['contextMenu']}
      >
        <span className="multi-tab-label">{getTabLabel(tab.key)}</span>
      </Dropdown>
    ),
    closable: isCardStyle ? tab.closable : false,
  }))

  return (
    <div
      className="multi-tabs-wrapper"
      style={{
        padding: '0 8px',
        background: themeToken.colorBgContainer,
        borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
      }}
    >
      <Tabs
        type={isCardStyle ? 'editable-card' : 'line'}
        size="small"
        activeKey={activeTabKey}
        onChange={handleTabChange}
        onEdit={isCardStyle ? handleTabEdit : undefined}
        hideAdd
        items={tabItems}
      />
    </div>
  )
}

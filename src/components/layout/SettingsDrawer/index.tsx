import React, { useState, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { Drawer, Button, Tabs, Space, message, theme } from 'antd'
import { SettingOutlined, CopyOutlined, UndoOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { ThemeSettings } from './ThemeSettings'
import { LayoutSettings } from './LayoutSettings'
import { TabsSettings } from './TabsSettings'
import { TransitionSettings } from './TransitionSettings'
import { FormSettings } from './FormSettings'
import { SystemSettings } from './SystemSettings'
import { TableSettings } from './TableSettings'

const STORAGE_KEY = 'settings-float-ball-position'

export const SettingsDrawer: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : { x: window.innerWidth - 80, y: window.innerHeight - 120 }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const hasMovedRef = useRef(false)
  const buttonRef = useRef<HTMLDivElement>(null)
  const resetSettings = useAppStore((s) => s.resetSettings)
  const { token } = theme.useToken()
  const { t } = useTranslation('settings')

  // 贴边吸附
  const snapToEdge = (x: number, y: number) => {
    const buttonSize = 40
    const padding = 16
    const maxX = window.innerWidth - buttonSize - padding
    const maxY = window.innerHeight - buttonSize - padding

    // 限制在视口内
    let newX = Math.max(padding, Math.min(maxX, x))
    let newY = Math.max(padding, Math.min(maxY, y))

    // 判断靠左还是靠右
    const centerX = window.innerWidth / 2
    if (newX < centerX) {
      newX = padding // 吸附到左边
    } else {
      newX = maxX // 吸附到右边
    }

    return { x: newX, y: newY }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    hasMovedRef.current = false
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    hasMovedRef.current = false
    setIsDragging(true)
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y })
    e.preventDefault()
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (clientX: number, clientY: number) => {
      hasMovedRef.current = true
      setPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y })
    }

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

  const handleEnd = () => {
      // flushSync 强制同步渲染，让 transition 先生效，再更新吸附位置
      flushSync(() => setIsDragging(false))

      if (hasMovedRef.current) {
        setPosition((prev) => {
          const snapped = snapToEdge(prev.x, prev.y)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(snapped))
          return snapped
        })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, dragStart])

  const handleClick = (e: React.MouseEvent) => {
    // 如果刚拖拽过，阻止点击
    if (hasMovedRef.current) {
      e.stopPropagation()
      e.preventDefault()
      return
    }
    setOpen(true)
  }

  const handleCopySettings = () => {
    const state = useAppStore.getState()
    const settingsJson = {
      theme: {
        darkMode: state.darkMode,
        primaryColor: state.primaryColor,
        colorWeak: state.colorWeak,
        grayMode: state.grayMode,
        compactMode: state.compactMode,
        fontSize: state.fontSize,
        borderRadius: state.borderRadius,
      },
      layout: {
        layoutMode: state.layoutMode,
        collapsed: state.collapsed,
        sidebarWidth: state.sidebarWidth,
        showHeader: state.showHeader,
        fixedHeader: state.fixedHeader,
        showSidebar: state.showSidebar,
        fixedSidebar: state.fixedSidebar,
        showFooter: state.showFooter,
        showBreadcrumb: state.showBreadcrumb,
        contentWidth: state.contentWidth,
        menuAccordion: state.menuAccordion,
        contentPadding: state.contentPadding,
      },
      tabs: {
        showTabs: state.showTabs,
        tabStyle: state.tabStyle,
        maxTabs: state.maxTabs,
      },
      transition: {
        enableTransition: state.enableTransition,
        transitionName: state.transitionName,
      },
      form: {
        formDisplayMode: state.formDisplayMode,
      },
      system: {
        systemName: state.systemName,
        systemLogo: state.systemLogo,
        showWatermark: state.showWatermark,
        watermarkText: state.watermarkText,
      },
      table: {
        tableSize: state.tableSize,
        tableBordered: state.tableBordered,
        tableResizable: state.tableResizable,
      },
    }
    navigator.clipboard.writeText(JSON.stringify(settingsJson, null, 2)).then(() => {
      message.success(t('copiedSuccess'))
    })
  }

  const tabItems = [
    { key: 'theme', label: t('tabTheme'), children: <ThemeSettings /> },
    { key: 'layout', label: t('tabLayout'), children: <LayoutSettings /> },
    { key: 'tabs', label: t('tabTabs'), children: <TabsSettings /> },
    { key: 'transition', label: t('tabTransition'), children: <TransitionSettings /> },
    { key: 'table', label: t('tabTable'), children: <TableSettings /> },
    { key: 'form', label: t('tabForm'), children: <FormSettings /> },
    { key: 'system', label: t('tabSystem'), children: <SystemSettings /> },
  ]

  return (
    <>
      <div
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%)`,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          boxShadow: isDragging
            ? '0 6px 20px rgba(0,0,0,0.25)'
            : '0 2px 12px rgba(0,0,0,0.15)',
          transition: isDragging ? 'box-shadow 0.2s, transform 0.2s' : 'left 0.3s ease-out, top 0.3s ease-out, box-shadow 0.2s, transform 0.2s',
          transform: isDragging ? 'scale(1.08)' : 'scale(1)',
          zIndex: 1000,
          userSelect: 'none',
          touchAction: 'none',
        }}
        title={t('drawerTitle')}
      >
        <SettingOutlined style={{ fontSize: 18 }} />
      </div>
      <Drawer
        title={t('drawerTitle')}
        placement="right"
        width={500}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <Space style={{ width: '100%' }} direction="vertical">
            <Button block icon={<CopyOutlined />} onClick={handleCopySettings}>
              {t('copySettings')}
            </Button>
            <Button block danger icon={<UndoOutlined />} onClick={resetSettings}>
              {t('resetSettings')}
            </Button>
          </Space>
        }
      >
        <Tabs
          defaultActiveKey="theme"
          items={tabItems}
          size="small"
          tabPosition="top"
        />
      </Drawer>
    </>
  )
}

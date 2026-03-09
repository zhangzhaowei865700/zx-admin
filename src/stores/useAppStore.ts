import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useUserStore } from './useUserStore'
import settings from '@/config/defaultSettings.json'
import i18n from '@/locales'
import type { LocaleType } from '@/locales'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import 'dayjs/locale/ja'

export type LayoutMode = 'side' | 'top' | 'mix'
export type PageTransition = 'fade' | 'slide-left' | 'slide-up' | 'zoom' | 'none'
export type FormDisplayMode = 'modal' | 'drawer'
export type FormColumns = 1 | 2
export type TabStyle = 'card' | 'line'
export type ContentWidth = 'fluid' | 'fixed'
export type TableSize = 'large' | 'middle' | 'small'

export interface TabItem {
  key: string
  label: string
  closable: boolean
}

interface AppSettings {
  // 主题
  darkMode: boolean
  primaryColor: string
  colorWeak: boolean
  grayMode: boolean
  compactMode: boolean
  fontSize: number
  borderRadius: number

  // 布局
  layoutMode: LayoutMode
  collapsed: boolean
  sidebarWidth: number
  showHeader: boolean
  fixedHeader: boolean
  showSidebar: boolean
  fixedSidebar: boolean
  showFooter: boolean
  showBreadcrumb: boolean
  contentWidth: ContentWidth
  menuAccordion: boolean
  contentPadding: number

  // 标签页
  showTabs: boolean
  tabStyle: TabStyle
  maxTabs: number
  tabs: TabItem[]
  activeTabKey: string

  // 动画
  enableTransition: boolean
  transitionName: PageTransition

  // 锁屏
  isLocked: boolean
  lockPassword: string

  // 表单
  formDisplayMode: FormDisplayMode
  formColumns: FormColumns

  // 系统
  systemName: string
  systemLogo: string
  showWatermark: boolean
  watermarkText: string

  // 表格
  tableSize: TableSize
  tableBordered: boolean
  tableResizable: boolean

  // 国际化
  locale: LocaleType
}

interface AppActions {
  // 主题
  setDarkMode: (v: boolean) => void
  setPrimaryColor: (v: string) => void
  setColorWeak: (v: boolean) => void
  setGrayMode: (v: boolean) => void
  setCompactMode: (v: boolean) => void
  setFontSize: (v: number) => void
  setBorderRadius: (v: number) => void

  // 布局
  setLayoutMode: (v: LayoutMode) => void
  setCollapsed: (v: boolean) => void
  setSidebarWidth: (v: number) => void
  setShowHeader: (v: boolean) => void
  setFixedHeader: (v: boolean) => void
  setShowSidebar: (v: boolean) => void
  setFixedSidebar: (v: boolean) => void
  setShowFooter: (v: boolean) => void
  setShowBreadcrumb: (v: boolean) => void
  setContentWidth: (v: ContentWidth) => void
  setMenuAccordion: (v: boolean) => void
  setContentPadding: (v: number) => void

  // 标签页
  setShowTabs: (v: boolean) => void
  setTabStyle: (v: TabStyle) => void
  setMaxTabs: (v: number) => void
  addTab: (tab: TabItem) => void
  removeTab: (key: string) => void
  removeOtherTabs: (key: string, scope?: string) => void
  removeAllTabs: (scope?: string, homePath?: string) => void
  setActiveTabKey: (key: string) => void

  // 动画
  setEnableTransition: (v: boolean) => void
  setTransitionName: (v: PageTransition) => void

  // 锁屏
  setIsLocked: (v: boolean) => void
  setLockPassword: (v: string) => void

  // 表单
  setFormDisplayMode: (v: FormDisplayMode) => void
  setFormColumns: (v: FormColumns) => void

  // 系统
  setSystemName: (v: string) => void
  setSystemLogo: (v: string) => void
  setShowWatermark: (v: boolean) => void
  setWatermarkText: (v: string) => void

  // 表格
  setTableSize: (v: TableSize) => void
  setTableBordered: (v: boolean) => void
  setTableResizable: (v: boolean) => void

  // 国际化
  setLocale: (v: LocaleType) => void

  // 通用
  resetSettings: () => void
}

type AppState = AppSettings & AppActions

const HOME_TAB: TabItem = { key: '/', label: i18n.t('menu:home'), closable: false }

const DEFAULT_SETTINGS: AppSettings = {
  // 主题
  darkMode: settings.theme.darkMode,
  primaryColor: settings.theme.primaryColor,
  colorWeak: settings.theme.colorWeak,
  grayMode: settings.theme.grayMode,
  compactMode: settings.theme.compactMode,
  fontSize: settings.theme.fontSize,
  borderRadius: settings.theme.borderRadius,

  // 布局
  layoutMode: settings.layout.layoutMode as LayoutMode,
  collapsed: settings.layout.collapsed,
  sidebarWidth: settings.layout.sidebarWidth,
  showHeader: settings.layout.showHeader,
  fixedHeader: settings.layout.fixedHeader,
  showSidebar: settings.layout.showSidebar,
  fixedSidebar: settings.layout.fixedSidebar,
  showFooter: settings.layout.showFooter,
  showBreadcrumb: settings.layout.showBreadcrumb,
  contentWidth: settings.layout.contentWidth as ContentWidth,
  menuAccordion: settings.layout.menuAccordion,
  contentPadding: settings.layout.contentPadding,

  // 标签页
  showTabs: settings.tabs.showTabs,
  tabStyle: settings.tabs.tabStyle as TabStyle,
  maxTabs: settings.tabs.maxTabs,
  tabs: [HOME_TAB],
  activeTabKey: '/',

  // 动画
  enableTransition: settings.transition.enableTransition,
  transitionName: settings.transition.transitionName as PageTransition,

  // 锁屏（运行时状态，不放入配置文件）
  isLocked: false,
  lockPassword: '',

  // 表单
  formDisplayMode: settings.form.formDisplayMode as FormDisplayMode,
  formColumns: (settings.form as { formColumns?: number }).formColumns as FormColumns ?? 1,

  // 系统
  systemName: settings.system.systemName,
  systemLogo: settings.system.systemLogo,
  showWatermark: settings.system.showWatermark,
  watermarkText: settings.system.watermarkText,

  // 表格
  tableSize: settings.table.tableSize as TableSize,
  tableBordered: settings.table.tableBordered,
  tableResizable: settings.table.tableResizable,

  // 国际化
  locale: (i18n.language || 'zh-CN') as LocaleType,
}

/**
 * 使用 View Transition API 包裹状态更新
 * 先截图当前画面，等 DOM 完全更新后再做整体过渡，消除黑白闪烁
 */
function withViewTransition(callback: () => void, className?: string) {
  if (!document.startViewTransition) {
    callback()
    return
  }
  if (className) {
    document.documentElement.classList.add(className)
  }
  const transition = document.startViewTransition(callback)
  transition.finished.then(() => {
    if (className) {
      document.documentElement.classList.remove(className)
    }
  })
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,

      // 主题（使用 View Transition 平滑过渡）
      setDarkMode: (darkMode) => withViewTransition(() => set({ darkMode }), 'dark-transition'),
      setPrimaryColor: (primaryColor) => withViewTransition(() => set({ primaryColor })),
      setColorWeak: (colorWeak) => withViewTransition(() => set({ colorWeak }), 'dark-transition'),
      setGrayMode: (grayMode) => withViewTransition(() => set({ grayMode }), 'dark-transition'),
      setCompactMode: (compactMode) => withViewTransition(() => set({ compactMode })),
      setFontSize: (fontSize) => set({ fontSize }),
      setBorderRadius: (borderRadius) => set({ borderRadius }),

      // 布局
      setLayoutMode: (layoutMode) => set({ layoutMode }),
      setCollapsed: (collapsed) => set({ collapsed }),
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),
      setShowHeader: (showHeader) => set({ showHeader }),
      setFixedHeader: (fixedHeader) => set({ fixedHeader }),
      setShowSidebar: (showSidebar) => set({ showSidebar }),
      setFixedSidebar: (fixedSidebar) => set({ fixedSidebar }),
      setShowFooter: (showFooter) => set({ showFooter }),
      setShowBreadcrumb: (showBreadcrumb) => set({ showBreadcrumb }),
      setContentWidth: (contentWidth) => set({ contentWidth }),
      setMenuAccordion: (menuAccordion) => set({ menuAccordion }),
      setContentPadding: (contentPadding) => set({ contentPadding }),

      // 标签页
      setShowTabs: (showTabs) => set({ showTabs }),
      setTabStyle: (tabStyle) => set({ tabStyle }),
      setMaxTabs: (maxTabs) => set({ maxTabs }),
      addTab: (tab) => {
        const { tabs, maxTabs } = get()
        if (!tabs.find((t) => t.key === tab.key)) {
          let newTabs = [...tabs, tab]
          // 超出最大数量时，关闭最早的可关闭标签
          if (maxTabs > 0) {
            while (newTabs.length > maxTabs) {
              const idx = newTabs.findIndex((t) => t.closable)
              if (idx === -1) break
              newTabs = newTabs.filter((_, i) => i !== idx)
            }
          }
          set({ tabs: newTabs })
        }
      },
      removeTab: (key) => {
        const { tabs, activeTabKey } = get()
        const newTabs = tabs.filter((t) => t.key !== key || !t.closable)
        if (activeTabKey === key && newTabs.length > 0) {
          const idx = tabs.findIndex((t) => t.key === key)
          const newActive = newTabs[Math.min(idx, newTabs.length - 1)]
          set({ tabs: newTabs, activeTabKey: newActive.key })
        } else {
          set({ tabs: newTabs })
        }
      },
      removeOtherTabs: (key, scope) => {
        const { tabs } = get()
        const filtered = scope
          ? tabs.filter((t) => t.key === key || !t.closable || !t.key.startsWith(scope))
          : tabs.filter((t) => t.key === key || !t.closable)
        set({ tabs: filtered, activeTabKey: key })
      },
      removeAllTabs: (scope, homePath) => {
        if (scope && homePath) {
          const { tabs } = get()
          // 只移除当前后台的可关闭标签，保留另一套后台的标签
          const otherTabs = tabs.filter((t) => !t.key.startsWith(scope))
          const homeTab: TabItem = { key: homePath, label: i18n.t('menu:home'), closable: false }
          set({ tabs: [...otherTabs, homeTab], activeTabKey: homePath })
        } else {
          set({ tabs: [HOME_TAB], activeTabKey: '/' })
        }
      },
      setActiveTabKey: (activeTabKey) => set({ activeTabKey }),

      // 动画
      setEnableTransition: (enableTransition) => set({ enableTransition }),
      setTransitionName: (transitionName) => set({ transitionName }),

      // 锁屏
      setIsLocked: (isLocked) => set({ isLocked }),
      setLockPassword: (lockPassword) => set({ lockPassword }),

      // 表单
      setFormDisplayMode: (formDisplayMode) => set({ formDisplayMode }),
      setFormColumns: (formColumns) => set({ formColumns }),

      // 系统
      setSystemName: (systemName) => set({ systemName }),
      setSystemLogo: (systemLogo) => set({ systemLogo }),
      setShowWatermark: (showWatermark) => set({ showWatermark }),
      setWatermarkText: (watermarkText) => set({ watermarkText }),

      // 表格
      setTableSize: (tableSize) => set({ tableSize }),
      setTableBordered: (tableBordered) => set({ tableBordered }),
      setTableResizable: (tableResizable) => set({ tableResizable }),

      // 国际化
      setLocale: (locale) => {
        const dayjsLocaleMap: Record<LocaleType, string> = {
          'zh-CN': 'zh-cn',
          'en-US': 'en',
          'ja-JP': 'ja',
        }
        i18n.changeLanguage(locale)
        dayjs.locale(dayjsLocaleMap[locale])
        localStorage.setItem('app-locale', locale)
        set({ locale })
      },

      // 通用
      resetSettings: () => {
        const { tabs, activeTabKey } = get()
        const saasName = useUserStore.getState().saasName
        set({
          ...DEFAULT_SETTINGS,
          tabs,
          activeTabKey,
          ...(saasName ? { systemName: saasName } : {}),
        })
      },
    }),
    {
      name: 'app-settings',
      partialize: (state) => ({
        darkMode: state.darkMode,
        primaryColor: state.primaryColor,
        colorWeak: state.colorWeak,
        grayMode: state.grayMode,
        compactMode: state.compactMode,
        fontSize: state.fontSize,
        borderRadius: state.borderRadius,
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
        showTabs: state.showTabs,
        tabStyle: state.tabStyle,
        maxTabs: state.maxTabs,
        tabs: state.tabs,
        activeTabKey: state.activeTabKey,
        enableTransition: state.enableTransition,
        transitionName: state.transitionName,
        isLocked: state.isLocked,
        lockPassword: state.lockPassword,
        systemName: state.systemName,
        systemLogo: state.systemLogo,
        showWatermark: state.showWatermark,
        watermarkText: state.watermarkText,
        formDisplayMode: state.formDisplayMode,
        formColumns: state.formColumns,
        tableSize: state.tableSize,
        tableBordered: state.tableBordered,
        tableResizable: state.tableResizable,
        locale: state.locale,
      }),
    }
  )
)

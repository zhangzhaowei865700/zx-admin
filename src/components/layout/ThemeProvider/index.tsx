import React, { useEffect, useMemo } from 'react'
import { ConfigProvider, theme as antTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'
import { useAppStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import type { LocaleType } from '@/locales'

const antdLocaleMap: Record<LocaleType, typeof zhCN> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode, primaryColor, compactMode, colorWeak, grayMode, fontSize, borderRadius, locale } = useAppStore(useShallow((s) => ({ darkMode: s.darkMode, primaryColor: s.primaryColor, compactMode: s.compactMode, colorWeak: s.colorWeak, grayMode: s.grayMode, fontSize: s.fontSize, borderRadius: s.borderRadius, locale: s.locale })))

  const antdLocale = useMemo(() => antdLocaleMap[locale] || zhCN, [locale])

  // 组合主题算法
  const algorithms = []
  if (darkMode) algorithms.push(antTheme.darkAlgorithm)
  if (compactMode) algorithms.push(antTheme.compactAlgorithm)
  if (algorithms.length === 0) algorithms.push(antTheme.defaultAlgorithm)

  // CSS 滤镜模式（灰色/色弱）
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('gray-mode', grayMode)
    root.classList.toggle('color-weak', colorWeak)
  }, [grayMode, colorWeak])

  // 暗黑模式 body 背景色（同步更新，避免 View Transition 闪烁）
  useMemo(() => {
    document.body.style.backgroundColor = darkMode ? '#141414' : '#fff'
  }, [darkMode])

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        algorithm: algorithms,
        token: { colorPrimary: primaryColor, colorLink: primaryColor, fontSize, borderRadius },
        components: {
          Pagination: { itemSize: 28 },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

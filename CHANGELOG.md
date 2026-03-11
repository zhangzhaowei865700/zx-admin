# Changelog

## v1.3.0 (2026-03-11)

功能增强与体验优化版本，新增水印自定义、导出功能增强，修复多个 UI 交互问题。

### 新功能 (Features)

- **水印自定义**: 支持自定义水印文本内容
- **表单和表格设置增强**: 新增多项自定义配置选项，提升用户个性化体验

### 功能增强 (Enhancement)

- **导出功能增强**: 支持表头、表尾汇总、列标题和 xlsx 样式，提供更专业的数据导出能力

### 问题修复 (Bug Fixes)

- **表单布局修复**: 修复表单水平布局左对齐时标签宽度固定的问题
- **导出参数优化**: 调整导出参数设置和表头的翻译文案
- **ExportModal 修复**: 移除不存在的 setHeaderTitle 调用
- **暗黑模式优化**: 修复暗黑模式切换闪烁和 View Transition 边框问题
- **设置悬浮球优化**: 修复抽屉关闭时 View Transition 类名残留，重构贴边逻辑
- **拖拽状态修复**: 修复悬浮球拖拽状态竞态条件导致位置异常跳动

### 重构 (Refactor)

- **React Query 配置调整**: 全局 staleTime 从 5 分钟改为 0，避免缓存导致数据不同步
- **constants 目录重构**: 按领域分组组织常量，提升代码可维护性

### 文档 (Docs)

- **Codex 文档**: 添加 Codex 项目指导文档
- **导出功能文档**: 更新导出功能文档，补充表尾汇总用法说明

---

## v1.2.1 (2026-03-10)

代码结构重构，统一类型定义和 API 导入风格。

### 重构 (Refactor)

- **API 导入统一**: 统一 platform API 导入风格，新增 `index.ts` 并替换所有子模块直接引用
- **租户类型拆分**: 拆分 `types/tenant/index.ts` 为独立领域文件（order、product、setting），删除原聚合文件
- **冗余类型清理**: 移除 `src/api/types.ts` 冗余文件，所有类型统一从 `@/types` 导入
- **类型定义整合**: 整合类型定义到 `src/types/` 目录，消除重复和分散定义
- **租户模块拆分**: 拆分租户模块 API 和 Mock 为独立领域文件（order、product、setting）

---

## v1.2.0 (2026-03-10)

安全加固、性能优化与代码质量提升。

### 安全加固 (Security)

- **CSP 策略**: `index.html` 添加 Content-Security-Policy meta 标签，限制脚本、样式、连接等资源来源
- **decrypt 错误处理**: `crypto.ts` 的 `decrypt()` 失败时抛出错误而非静默返回原文，防止安全问题被掩盖
- **路由权限匹配加固**: `Guard.tsx` 权限路径匹配增加尾部斜杠归一化，防止 `/admin` 误匹配 `/admin-panel`
- **环境变量密钥清理**: 所有 `.env.*` 文件的 `VITE_APP_SECRET` 替换为占位符，新增 `.env.example` 模板

### 性能优化 (Performance)

- **Vite 代码分割**: 添加 `manualChunks` 配置，将 react、antd、pro-components、react-query、i18n 拆分为独立 chunk
- **Store 订阅优化**: 所有 `useAppStore()` 调用改用 `useShallow` 选择器（19 个组件），避免无关属性变更触发重渲染
- **字典缓存优化**: `useDictionary` 的 `options` 数组用 `useMemo` 包裹，避免每次渲染重建

### 代码质量 (Code Quality)

- **竞态条件修复**: `request.ts` 的 `isRedirecting` 布尔标志改为 `redirectTimer` 自动重置机制，修复并发 401 竞态
- **TypeScript 类型安全**: 消除 `crypto.ts`、`storage.ts`、`ProTable.tsx` 中的 `any` 类型，改用泛型和具体类型
- **内存泄漏修复**: `SettingsDrawer` 添加 `useEffect` 清理拖拽 timer，防止组件卸载时泄漏
- **JSON.parse 安全**: `storage.ts` 和 `SettingsDrawer` 的 `JSON.parse` 添加 try-catch 防护
- **ErrorBoundary 增强**: 展示错误信息详情，增加"刷新页面"按钮作为兜底恢复手段

### 工程化 (Chore)

- **环境变量模板**: 新增 `.env.example` 文件，方便新开发者快速配置

## v1.1.0 (2026-03-10)

基于 v1.0.0 的全面优化版本，涵盖架构重构、新功能、问题修复和工程化改进。

### 新功能 (Features)

- **环境变量配置基础路径**: 支持通过 `VITE_BASE_PATH` 环境变量配置应用基础路径
- **字典管理模块**: 新增字典数据管理功能，包含 API、类型定义、Mock 数据及 `DictTag` 组件
- **版本更新检测**: 新增 `VersionUpdateBar` 组件和 `useVersionCheck` Hook，支持前端版本更新提示
- **通用骨架屏优化**: `PageSkeleton` 组件增强，支持更多场景

### 架构重构 (Refactor)

- **布局抽取 BaseLayout**: 从 `AppLayout` 和 `TenantLayout` 中提取公共布局逻辑为 `BaseLayout`，消除重复代码
- **统一项目命名**: 项目统一命名为 ZX-Admin，更新 package.json 及 README
- **租户后台链接构建优化**: 优化租户管理页面中后台链接的构建逻辑
- **页面过渡动画优化**: 优化 `PageTransitionWrapper` 实现

### 问题修复 (Bug Fixes)

- **密钥硬编码修复**: 将硬编码的加密密钥移至环境变量配置
- **401 登录失效处理**: 优化 API 请求 401 状态码的处理逻辑，改善登录失效体验
- **React Query 缓存配置**: 合理配置 staleTime 和 gcTime，减少不必要的重复请求
- **控制台警告修复**:
  - 过滤 antd 内部 `findDOMNode` 废弃警告
  - 修复 `useForm` 未连接 Form 元素的警告（TenantSetting 页面）
  - 修复 Upload 组件 `value` prop 警告，改用 `fileList`
- **角色管理类型修复**: 修正角色页面类型定义避免 TypeScript 错误
- **Demo 模式路由修复**: 为 demo 模式配置 HashRouter basename，解决 GitHub Pages 刷新 404

### 工程化 (Chore)

- **GitHub Pages 自动部署**: 配置 GitHub Actions CI/CD 自动部署流程
- **部署基础路径更新**: 更新 GitHub Pages 部署的基础路径配置
- **Jekyll 处理禁用**: 添加 `.nojekyll` 文件避免 GitHub Pages 的 Jekyll 处理
- **i18n 补全**: 补充 zh-CN、en-US、ja-JP 三语言的缺失翻译项
- **依赖更新**: 更新项目依赖，新增 `dayjs` 等依赖包
- **错误处理增强**: 优化 ProTable、NotificationBell 等组件的错误处理

### 文档 (Docs)

- 完善 README 中英文文档
- 删除首页中过时的文档和更新日志链接

---

## v1.0.0 (2026-03-09)

初始发布版本。

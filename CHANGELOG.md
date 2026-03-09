# Changelog

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

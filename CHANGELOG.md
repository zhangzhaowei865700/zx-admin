# Changelog

## v1.5.0 (2026-03-20)

Mock 体系升级与跨标签页同步版本，将 Mock 方案迁移至 MSW，实现配置驱动路由，支持跨标签页实时同步设置与语言，强化认证机制。

### 新功能 (Features)

- **MSW Mock 迁移**: 将 mock 方案从 vite-plugin-mock 迁移至 msw，支持 dev/demo 环境统一拦截
- **Session 持久化**: token 嵌入用户信息，支持开发服务器重启后自动恢复 session
- **商户后台菜单**: 补充商户后台菜单树（工作台/订单/商品/设置/系统管理），统一添加 `backend:` 权限前缀
- **跨标签页设置同步**: 支持跨标签页同步 app-settings 及语言切换
- **租户设置跨标签页同步**: 租户设置跨标签页实时同步，mock 数据持久化

### 重构 (Refactor)

- **配置驱动路由**: 将菜单与路由配置迁移至 `config/routes`，支持配置驱动生成路由
- **平台级 Mock 认证统一**: 统一平台级 mock 接口认证机制，严格验证 Authorization header
- **租户级 Mock 认证统一**: 统一租户级 mock 接口认证机制，确保与平台接口认证一致性
- **BroadcastChannel 重构**: 跨标签页通信改用独立 BroadcastChannel，i18n 同步移至 onRehydrateStorage

### 问题修复 (Bug Fixes)

- **Token 验证机制**: 修复 token 验证机制，确保 localStorage 清空后立即失效；请求拦截器改用 `getToken()` 直接读取
- **热重载 Session 丢失**: 迁移 session 存储至 globalThis，修复热重载时 session 丢失
- **登录过期与首屏闪白**: 修复登录过期时步骤未重置及首屏路由守卫闪白问题
- **菜单权限前缀**: 修正商户后台菜单权限前缀，统一改为 `tenant:list:backend:` 命名空间
- **MSW 子路径部署**: 修复 msw serviceWorker 在子路径部署时 404 问题
- **商户后台权限码**: 修正商户后台页面权限码，与 mock 菜单定义保持一致
- **语言切换实时更新**: 修复语言切换后菜单和标签页名称未实时更新的问题
- **类型注解补全**: 补全 tenant setting PUT handler 的参数类型注解

### 文档 (Docs)

- **认证机制说明**: 更新认证机制和 Mock 验证说明，���充 `withAuth` 使用方式
- **CLAUDE.md 整理**: 整理 CLAUDE.md 结构，精简内容，新增设计原则

---

## v1.4.1 (2026-03-16)

权限体系优化与体验增强版本，简化权限代码格式，优化组件 props 传递，提升用户体验。

### 新功能 (Features)

- **Header 操作区域优化**: 添加分组分隔线和角色显示，提升视觉层次
- **Tooltip 提示增强**: Header 操作图标添加 Tooltip 提示；侧边栏暗色禁用时添加 Tooltip 提示
- **侧边栏暗色模式适配**: 弹出菜单适配深色样式，提升暗黑模式体验

### 重构 (Refactor)

- **权限代码格式简化**: 统一菜单和路由权限标识，简化权限代码格式（如 `dashboard:view` → `dashboard`）
- **FormContainer 优化**: 优化 props 传递机制，避免无关属性污染底层组件
- **规格抽屉尺寸固定**: 规格抽屉固定使用 large 尺寸，简化代码逻辑
- **Mock 数据权限结构优化**: 简化菜单层级，优化权限数据结构
- **User 类型重构**: role 字段改为 roles 数组，支持多角色场景

### 问题修复 (Bug Fixes)

- **悬浮球吸附优化**: 窗口缩放时悬浮球自动重新吸附，防止超出视口
- **登录错误提示**: 登录失败时显式读取错误信息并弹出提示
- **401 处理优化**: 切换平台时避免 401 触发全局登出导致重复弹出登录已过期提示

### 工程化 (Chore)

- **调试日志**: 登录流程添加临时调试日志
- **默认密码更新**: 更新默认密码为 zx@123

### 文档 (Docs)

- **README 重写**: 精简风格并补全文档细节
- **GitHub 信息更新**: 更新 GitHub 用户名为 zhangxiaowei6
- **License 更新**: 更新 License 年份及作者信息

---

## v1.4.0 (2026-03-12)

租户权限体系与商品管理增强版本，完整实现租户级权限控制，重构商品管理模块，优化认证状态管理。

### 新功能 (Features)

- **路由级权限控制系统**: 重写 Guard 为基于 `route handle.permission` 的权限校验，替代原路径匹配方案；平台路由和菜单配置添加 `permission` 字段；提取 `PermissionTreePanel` 为通用组件；平台用户/角色/菜单管理页集成 `HasPermission` 权限控制
- **租户级系统管理模块**: 新增租户 System 页面，包含用户管理、角色管理、菜单管理；租户路由新增 system 子路由及权限配置；TenantLayout 适配菜单权限过滤和子菜单导航；租户业务页面适配权限控制
- **商品管理重构与规格管理**: 商品管理从行内编辑表格改为 FormContainer 弹窗表单；新增商品规格 CRUD（`SpecDrawer` 可编辑表格）；扩展商品类型字段（description、unit）；完善商品国际化翻译
- **权限树父子联动模式**: `PermissionTreePanel` 新增 `checkStrictly` 模式切换和 `onHalfCheckedChange` 回调；平台/租户角色权限分配支持半选状态回显和保存
- **用户权限查看面板优化**: 用户权限查看面板仅展示已授权菜单节点（只读模式），隐藏未授权节点
- **规格管理适配全局表单模式**: 规格管理抽屉适配全局表单显示模式（modal/drawer）设置
- **登录页交互动效优化**: 优化登录页加载和交互动效，提升视觉体验

### 重构 (Refactor)

- **类型定义与权限持久化重构**: `LoginResult` 新增 `permissions` 字段；`SystemUser` 的 `roleId/roleName` 改为 `roleIds/roleNames` 支持多角色；新增 `tenant/auth` 类型定义；`useUserStore` 持久化 `permissions` 到 localStorage；Mock auth 重构为集中式 store 管理
- **认证状态管理重构**: 从存储工具中移除 token 的 get/set/remove 方法；请求拦截器改为从 Zustand 状态读取 token；`BaseLayout`、`Login` 等页面移除 token 直接存储调用，统一改用全局状态管理；批量操作 UI 升级使用 `Antd Space` 组件

### 问题修复 (Bug Fixes)

- **Mock 路由参数修复**: Mock 路由参数从 `params` 改为 `query`，匹配 vite-plugin-mock 实际行为
- **Demo 构建 Mock 路由修复**: 修复 demo 构建下含路径参数的 Mock 接口 404 问题
- **401 处理优化**: 优化 401 错误处理和切换平台逻辑，避免重复跳转

### 样式优化 (Style)

- **权限抽屉与表单布局**: 优化权限抽屉和模态框表单布局样式，提升视觉一致性

### 工程化 (Chore)

- **国际化翻译补全**: 补充租户系统管理、商品规格等模块的 zh-CN/en-US/ja-JP 翻译
- **Mock 数据本地化**: Mock 数据平台名称和用户昵称本地化为中文
- **LICENSE 更新**: 更新版权信息

### 文档 (Docs)

- **项目文档更新**: 更新 CLAUDE.md 及组件说明，补充 `PermissionTreePanel`、`EditableProTable` 等组件文档

---

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

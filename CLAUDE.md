# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供在此代码库中工作的指导。

## 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器 http://localhost:3000，使用 mock API
npm run build            # 生产环境构建（运行 tsc + vite build）
npm run build:demo       # 构建演示版本
npm run preview          # 预览生产构建
npm run preview:demo     # 构建并预览演示版本
npm run lint             # 运行 ESLint 检查

# 未配置测试命令
```

## 架构概览

### 多平台多租户系统

这是一个双层管理系统，支持**平台级**（管理所有租户）和**租户级**（租户自身业务）管理：

- **平台级**：路由前缀 `/`，布局 `AppLayout`
    - 管理所有租户、系统用户、角色、菜单、消息
    - 平台管理员视角

- **租户级**：路由前缀 `/tenant-admin/:tenantId`，布局 `TenantLayout`
    - 租户特定操作（订单、产品、设置）
    - 租户管理员视角

路由定义在 `src/routes/modules/platform.tsx` 和 `src/routes/modules/tenant.tsx`。

### 两步登录流程

认证系统使用独特的两步流程：

1. **预登录**（`preLogin` API）：用户提交凭证，后端返回可用平台
2. **平台选择**：如果存在多个平台，用户选择一个；如果只有单个平台，自动继续
3. **平台登录**（`loginPlatform` API）：使用选定平台完成登录，接收 token

登录后，用户可以通过 `/login?switch=1` 查询参数切换平台（参见 `src/routes/Guard.tsx:16-22`）。

### 状态管理（Zustand）

三个主要 store，具有不同的持久化策略：

**`useUserStore`**（`src/stores/useUserStore.ts`）：
- 持久化：`token`、`saasName`
- 仅运行时：`userInfo`、`permissions`
- 对认证状态管理至关重要

**`useAppStore`**（`src/stores/useAppStore.ts`）：
- 持久化：所有 UI 设置（主题、布局、标签页、表单偏好、表格偏好等）
- 使用 View Transition API 实现平滑的暗黑模式过渡（参见 `withViewTransition` 包装器）
- 管理多标签页导航状态（`tabs[]`、`activeTabKey`）
- 布局设置：`sideMenuType`（sub/group）控制侧边栏菜单展示模式
- 表单设置：`formDisplayMode`（modal/drawer）、`formColumns`（1/2）、`formSizePreset`（small/medium/large）
- 表格设置：`tableSize`（small/middle/large）、`tableBordered`、`tableStriped`

**`useMessageStore`**（`src/stores/useMessageStore.ts`）：
- 管理消息通知和未读计数

### 请求安全

所有 API 请求（`src/api/request.ts`）自动包含：

- **签名头**：`X-App-Key`、`X-Timestamp`、`X-Nonce`、`X-Sign`（通过 `src/utils/sign.ts` 生成）
- **可选 AES 加密**：由 `VITE_CRYPTO_ENABLED` 环境变量控制（使用 `src/utils/crypto.ts`）
- **Token 认证**：`Authorization` 头中的 Bearer token
- **401 处理**：自动登出并重定向到登录页

### 跨标签页同步

系统使用 `BroadcastChannel`（`src/utils/authChannel.ts`）在浏览器标签页之间同步认证事件：

- `logout` 事件：当用户在一个标签页登出时，所有标签页重定向到登录页
- `switchPlatform` 事件：切换平台时，所有标签页刷新以同步状态

事件监听器通常在布局组件中设置。

### 国际化（i18n）

支持三种语言：`zh-CN`、`en-US`、`ja-JP`

- 文件按命名空间组织在 `src/locales/{locale}/{namespace}.json`
- 命名空间：`common`、`menu`、`login`、`system`、`tenant`、`order`、`product`、`settings`、`message`
- 使用方式：`i18n.t('namespace:key')` 或 `useTranslation()` 的 `t('namespace:key')`
- 语言偏好存储在 `localStorage['app-locale']`
- 自动与 dayjs locale 同步

## 关键约定

### 路径别名

- `@/` → `src/`（在 `tsconfig.json` 和 `vite.config.ts` 中配置）

### 页面模块结构

业务页面的标准结构：

```
pages/ModuleName/
├── index.tsx              # 主页面组件
├── components/            # 页面私有组件
│   ├── ModuleTable.tsx
│   └── index.ts
└── hooks/                 # 页面私有 hooks
    ├── useModule.ts       # 使用 React Query 获取数据
    └── index.ts
```

### 表单配置层级

表单列布局有三个控制级别（优先级从高到低）：

1. **字段级**：通过 `colProps={{ span: 24 }}` 设置单个字段宽度
2. **页面级**：通过 `FormContainer` 的 `formSize` 属性为每个页面固定布局
3. **全局**：通过设置抽屉中的用户偏好（`useAppStore` 中的 `formColumns` 和 `formSizePreset`）

`FormContainer` 组件自动适应用户偏好：
- **表单显示模式**：基于 `formDisplayMode` 的 Modal 或 Drawer
- **表单列数**：基于 `formColumns` 的单列或双列布局
- **表单大小**：基于 `formSizePreset` 的宽度（small/medium/large）

示例：
```tsx
// 遵循全局设置（推荐用于大多数表单）
<FormContainer
  title="新增用户"
  open={open}
  onOpenChange={setOpen}
>
  <ProFormText name="name" label="名称" />
  <ProFormTextArea name="desc" label="描述" colProps={{ span: 24 }} /> {/* 始终全宽 */}
</FormContainer>

// 固定大小（用于需要特定宽度的特殊表单）
<FormContainer
  title="配置权限"
  formSize="large"
  open={open}
  onOpenChange={setOpen}
>
  {/* 复杂表单内容 */}
</FormContainer>
```

### 环境变量

开发环境默认使用 mock：

```bash
VITE_API_BASE_URL=           # 空 = 使用 vite-plugin-mock
VITE_CRYPTO_ENABLED=false    # 启用 API 请求的 AES 加密
VITE_APP_KEY=merchant-admin  # 用于请求签名
VITE_APP_SECRET=dev-secret   # 用于请求签名
```

对于真实 API，将 `VITE_API_BASE_URL` 设置为后端 URL。

### 菜单配置

菜单定义为常量中的静态配置：

- 平台菜单：`src/constants/platformMenu.tsx`
- 租户菜单：`src/constants/tenantMenu.tsx`

菜单项定义 `key`、`label`、`icon`、`path` 和可选的 `children`、`group`。

**菜单分组模式**：
- 当 `sideMenuType` 设置为 `group` 时，菜单项的 `group` 属性用于分组显示
- 分组模式下，菜单项按 `group` 分类展示，提供更清晰的视觉层次
- 经典模式（`sub`）使用传统的子菜单展开方式

### 设置持久化

所有用户偏好通过 Zustand persist 中间件自动保存到 `localStorage['app-settings']`。包括主题、布局模式、侧边栏宽度、标签页行为、表格偏好等。

默认设置从 `src/config/defaultSettings.json` 加载。

**清除缓存功能**：
- 设置抽屉底部提供"清除缓存"按钮
- 清除所有 localStorage 和 sessionStorage 数据
- 自动保留用户设置（`app-settings`）和语言配置（`app-locale`）
- 清除后自动刷新页面以应用更改

## Mock 数据

开发环境通过 `vite-plugin-mock` 启用 mock 服务器。Mock 处理器在 `mock/` 目录（不是 `src/mock/`）：

- 使用 `mockjs` 生成数据
- Mock 文件在 `mock/index.ts` 中导入
- 支持动态路由和 RESTful CRUD 模式

## 重要实现细节

### 路由守卫（`src/routes/Guard.tsx`）

- 将未认证用户重定向到 `/login`
- 允许已认证用户访问 `/login?switch=1`（平台切换）
- 权限检查：空 `permissions[]` = 完全访问（后端兼容性）
- 白名单：`/login`、`/403`、`/404`

### 多标签页管理

标签页由 `useAppStore` 自动管理：

- `addTab()`：添加新标签页，遵守 `maxTabs` 限制（关闭最旧的可关闭标签页）
- `removeTab()`：删除标签页并在需要时调整活动标签页
- `removeOtherTabs()`：可以限定到特定路由前缀（例如，仅关闭平台标签页）
- `removeAllTabs()`：可以保留来自其他后端的标签页（平台 vs 租户）

### 主题过渡

暗黑模式和主题更改使用 View Transition API 实现平滑的视觉过渡：

```ts
document.startViewTransition(() => {
  // 更改主题的状态更新
})
```

这可以防止主题切换期间的刺眼黑/白闪烁（参见 `useAppStore.ts:214-228`）。

### 锁屏功能

用户可以通过 Header 操作锁定屏幕：

- 在模态框中设置密码，启用锁屏覆盖层
- 锁定时显示时钟和用户信息
- 通过密码验证解锁
- 状态：`useAppStore` 中的 `isLocked`、`lockPassword`

### 消息通知

Header 中的 `NotificationBell` 组件：

- 使用 `usePolling` hook 每 30 秒轮询未读计数
- 显示带计数的徽章
- 弹出框显示最近的消息
- 点击项目导航到消息详情并标记为已读
- 消息收件箱页面（`src/pages/Platform/Message/Inbox/index.tsx`）在挂载时刷新未读计数

## 项目结构

### 目录组织

```
src/
├── api/                    # API 请求模块
│   ├── modules/
│   │   ├── platform/      # 平台 API（auth、system、message、tenant、dictionary）
│   │   └── tenant/        # 租户 API（order、product、setting）
│   ├── request.ts         # 带签名和加密的 Axios 实例
│   └── types.ts           # 通用 API 响应类型
├── components/
│   ├── common/            # 可复用业务组件
│   │   ├── FormContainer/ # 智能表单包装器（modal/drawer，带全局设置）
│   │   ├── ProTable/      # 增强的 Ant Design ProTable
│   │   ├── PageContainer/ # 带面包屑的页面包装器
│   │   ├── DictTag/       # 字典驱动的标签显示
│   │   ├── VersionUpdateBar/ # 版本更新通知栏
│   │   ├── HasPermission/ # 基于权限的渲染
│   │   ├── ErrorBoundary/ # 错误边界包装器
│   │   └── PageSkeleton/  # 加载骨架屏
│   └── layout/            # 布局组件
│       ├── AppLayout/     # 平台布局
│       ├── TenantLayout/  # 租户布局
│       ├── BaseLayout/    # 共享基础布局逻辑
│       ├── HeaderActions/ # Header 操作组件（通知、用户菜单等）
│       ├── MultiTabs/     # 标签页导航系统
│       ├── SettingsDrawer/ # 设置面板，带表单/表格偏好
│       └── ThemeProvider/ # 主题配置提供者
├── pages/
│   ├── Platform/          # 平台级页面
│   │   ├── Dashboard/
│   │   ├── System/        # 用户、角色、菜单管理
│   │   ├── Message/       # 收件箱
│   │   └── Tenant/        # 租户管理
│   ├── Tenant/            # 租户级页面
│   │   ├── Dashboard/
│   │   ├── Order/
│   │   ├── Product/
│   │   └── Setting/
│   ├── Login/
│   └── Exception/         # 403、404 页面
├── stores/                # Zustand stores
│   ├── useAppStore.ts     # UI 设置、标签页、表单/表格偏好
│   ├── useUserStore.ts    # 认证状态（token、userInfo、permissions）
│   └── useMessageStore.ts # 消息通知
├── hooks/
│   ├── useCommon.ts       # 分页、搜索参数
│   ├── useDictionary.ts   # 带缓存的字典数据获取
│   ├── useFormModal.ts    # 表单模态框状态管理
│   ├── usePermission.ts   # 权限检查工具
│   ├── usePolling.ts      # 可见性感知轮询
│   ├── useVersionCheck.ts # 版本更新检测
│   └── query/
│       └── keys.ts        # React Query 缓存键工厂
├── services/              # 业务逻辑工具
│   ├── role.service.ts    # 角色树转换和过滤
│   └── menu.service.ts    # 菜单树操作
├── utils/
│   ├── authChannel.ts     # 通过 BroadcastChannel 跨标签页同步
│   ├── crypto.ts          # AES 加密/解密
│   ├── sign.ts            # 请求签名生成
│   ├── storage.ts         # Token 和用户信息存储
│   ├── export.ts          # Excel 导出工具
│   └── format.ts          # 数据格式化助手
├── types/
│   ├── platform/          # 平台域类型
│   └── tenant/            # 租户域类型
├── constants/
│   ├── platformMenu.tsx   # 平台菜单配置（支持分组）
│   ├── tenantMenu.tsx     # 租户菜单配置
│   └── formSize.ts        # 表单大小预设（宽度映射）
├── routes/
│   ├── modules/           # 路由定义
│   │   ├── platform.tsx
│   │   └── tenant.tsx
│   ├── Guard.tsx          # 带认证和权限检查的路由守卫
│   └── index.tsx          # 路由设置
├── locales/               # i18n 翻译
│   ├── zh-CN/
│   ├── en-US/
│   └── ja-JP/
└── config/
    └── defaultSettings.json # 默认 UI 设置
```

### Mock 数据结构

```
mock/
├── index.ts               # Mock 入口点
├── platform/
│   ├── auth.ts           # 登录、登出、用户信息
│   ├── system.ts         # 用户、角色、菜单 CRUD
│   ├── message.ts        # 消息列表、详情、标记已读
│   ├── tenant.ts         # 租户管理
│   └── dictionary.ts     # 字典数据
└── tenant/
    ├── order.ts          # 订单管理
    ├── product.ts        # 产品管理
    └── setting.ts        # 租户设置
```

## 核心组件

### FormContainer

智能表单包装器，适应全局用户偏好：

**属性：**
- `title`：表单标题
- `open`：可见性状态
- `onOpenChange`：状态更改处理器
- `formSize?: 'small' | 'medium' | 'large'`：覆盖全局大小预设
- `width?: number`：自定义宽度（覆盖 formSize）
- `children`：表单字段（ProForm 组件）

**行为：**
- 自动使用 `useAppStore` 中的 `formDisplayMode`（modal 或 drawer）
- 应用 `formColumns` 设置（1 或 2 列），除非被字段级 `colProps` 覆盖
- 使用 `formSizePreset` 作为宽度，除非提供 `formSize` 或 `width` 属性
- 宽度映射定义在 `src/constants/formSize.ts`：
    - Small：520px（modal）、480px（drawer）
    - Medium：720px（modal）、640px（drawer）
    - Large：920px（modal）、800px（drawer）

**示例：**
```tsx
// 遵循全局设置
<FormContainer title="新增用户" open={open} onOpenChange={setOpen}>
  <ProFormText name="name" label="名称" />
  <ProFormTextArea name="desc" label="描述" colProps={{ span: 24 }} />
</FormContainer>

// 复杂表单的固定大尺寸
<FormContainer title="权限配置" formSize="large" open={open} onOpenChange={setOpen}>
  {/* 复杂表单内容 */}
</FormContainer>
```

### ProTable

增强的 Ant Design ProTable，集成功能：

- 通过 `useCommon` hook 自动管理分页状态
- 通过 `useDictionary` 字典驱动列渲染
- 导出到 Excel 功能
- 集成搜索和过滤
- 可配置的表格大小、边框、斑马纹（来自 `useAppStore`）

### DictTag

字典驱动的标签显示组件：

**属性：**
- `dictType: string`：字典类型代码
- `value: string | number`：要显示的值
- `colorMap?: Record<string, string>`：自定义颜色映射

**行为：**
- 自动从 `useDictionary` 获取字典数据
- 将代码值映射到标签文本
- 应用预定义或自定义颜色
- 缓存字典数据 30 分钟

### VersionUpdateBar

版本更新通知栏：

- 使用 `useVersionCheck` hook 检测版本更改
- 在页面顶部显示通知栏
- 提供"刷新"按钮以重新加载应用
- 可以被用户关闭

### HasPermission

基于权限的条件渲染组件：

**属性：**
- `permission: string | string[]`：所需权限代码
- `children: ReactNode`：有权限时渲染的内容

**行为：**
- 检查用户权限数组
- 空权限数组 = 完全访问（后端兼容性）
- 支持单个或多个权限检查

## 自定义 Hooks

### useDictionary

获取和缓存字典数据：

```tsx
const { data: statusDict } = useDictionary('user_status');
```

- 使用 React Query 进行缓存（30 分钟）
- 返回 `{ label, value, color }` 对象数组
- 自动处理加载和错误状态

### usePolling

可见性感知轮询：

```tsx
usePolling(fetchUnreadCount, 30000); // 每 30 秒轮询
```

- 标签页隐藏时暂停轮询
- 标签页可见时恢复轮询
- 自动清理

### useVersionCheck

检测应用版本更新：

```tsx
const { hasUpdate, currentVersion, latestVersion } = useVersionCheck();
```

- 定期检查版本文件
- 检测到新版本时通知用户
- 与 `VersionUpdateBar` 集成

### useFormModal

管理表单模态框状态：

```tsx
const { open, editingId, handleAdd, handleEdit, handleClose } = useFormModal();
```

- 管理打开/关闭状态
- 跟踪编辑 ID（添加 vs 编辑模式）
- 提供便捷的处理器函数

### useCommon

分页和搜索参数管理：

```tsx
const { pagination, searchParams, handleTableChange, handleSearch } = useCommon();
```

- 管理分页状态（当前页、页大小）
- 处理搜索参数
- 与 ProTable 集成

### usePermission

权限检查工具：

```tsx
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

if (hasPermission('system:user:add')) {
  // 显示添加按钮
}
```

- 检查单个或多个权限
- 空权限数组 = 完全访问
- 与 `HasPermission` 组件配合使用

## Services 层

### role.service.ts

角色相关的业务逻辑：

- `convertToTree(roles)`：将扁平角色列表转换为树结构
- `filterRoleTree(tree, searchText)`：按名称过滤角色树
- `getAllRoleIds(tree)`：获取树中的所有角色 ID

### menu.service.ts

菜单相关的业务逻辑：

- `convertToTree(menus)`：将扁平菜单列表转换为树结构
- `filterMenuTree(tree, searchText)`：按名称过滤菜单树
- `sortMenuTree(tree)`：按排序字段排序菜单

## 工具函数

### export.ts

Excel 导出工具：

```tsx
import { exportToExcel } from '@/utils/export';

exportToExcel(data, columns, 'users.xlsx');
```

- 将表格数据导出为 Excel
- 支持列映射和格式化
- 自动处理日期和数字格式

### format.ts

数据格式化助手：

- `formatDate(date, format)`：格式化日期
- `formatCurrency(amount)`：格式化货币
- `formatNumber(num, decimals)`：格式化数字
- `formatFileSize(bytes)`：格式化文件大小

### storage.ts

本地存储工具：

- `getToken()`：获取认证 token
- `setToken(token)`：设置认证 token
- `removeToken()`：删除认证 token
- `getUserInfo()`：获取用户信息
- `setUserInfo(info)`：设置用户信息

## React Query 集成

### 缓存键工厂（`src/hooks/query/keys.ts`）

集中管理 React Query 缓存键：

```tsx
import { queryKeys } from '@/hooks/query/keys';

// 在组件中使用
const { data } = useQuery({
  queryKey: queryKeys.users.list(searchParams),
  queryFn: () => fetchUsers(searchParams)
});

// 使缓存失效
queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
```

**键结构：**
- `queryKeys.users.all`：所有用户查询
- `queryKeys.users.list(params)`：带参数的用户列表
- `queryKeys.users.detail(id)`：单个用户详情
- `queryKeys.dictionary.type(dictType)`：字典数据

### 数据获取模式

标准的 React Query 使用模式：

```tsx
// 在页面 hooks 中
export const useUsers = (params: UserSearchParams) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUserList(params),
    staleTime: 5 * 60 * 1000, // 5 分钟
  });
};

// 在组件中
const { data, isLoading, error } = useUsers(searchParams);
```

## 最佳实践

### 权限检查

- 对 UI 元素使用 `HasPermission` 组件
- 对编程检查使用 `usePermission` hook
- 权限代码遵循模式：`module:resource:action`（例如，`system:user:add`）
- 空权限数组 = 完全访问（后端兼容性）

### 字典使用

- 使用 `useDictionary` hook 获取字典数据
- 使用 `DictTag` 组件显示编码值
- 字典数据缓存 30 分钟
- 常见字典：`user_status`、`order_status`、`product_type` 等

### 错误处理

- API 错误自动显示 toast 通知
- 使用 `ErrorBoundary` 组件捕获 React 错误
- 401 错误触发自动登出和重定向
- 网络错误显示通用错误消息

### 性能优化

- 使用 React Query 进行数据缓存和去重
- 标签页隐藏时暂停轮询（通过 `usePolling`）
- 使用 `React.lazy()` 懒加载路由
- 使用 `useMemo` 记忆化昂贵的计算
- 对搜索输入进行防抖

### 代码组织

- 保持组件小而专注
- 将可复用逻辑提取到自定义 hooks
- 对复杂业务逻辑使用 services 层
- 在 `src/api/modules/` 中集中 API 调用
- 使用 TypeScript 确保类型安全

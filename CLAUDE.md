# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供在此代码库中工作的指导。

## 设计原则

- **优先轻方案**：设计方案或解决问题时，优先选择轻量、简洁的方案，避免过度设计和重方案。
- **优雅的最佳实践**：不要强行实现，应顺应框架和语言的惯用模式，选择优雅、符合最佳实践的解法。

## 常用命令

```bash
npm run dev              # 启动开发服务器 http://localhost:3000，使用 mock API
npm run build            # 生产环境构建（运行 tsc + vite build）
npm run build:demo       # 构建演示版本
npm run preview          # 预览生产构建
npm run preview:demo     # 构建并预览演示版本
npm run lint             # 运行 ESLint 检查
```

## 架构概览

### 多平台多租户系统

双层管理系统：

- **平台级**：路由前缀 `/`，布局 `AppLayout`，管理所有租户、用户、角色、菜单、消息
- **租户级**：路由前缀 `/tenant-admin/:tenantId`，布局 `TenantLayout`，租户特定操作（订单、产品、设置）

路由定义在 `src/routes/modules/platform.tsx` 和 `src/routes/modules/tenant.tsx`。

### 两步登录流程

1. **预登录**（`preLogin` API）：提交凭证，后端返回可用平台
2. **平台选择**：多平台时用户选择，单平台自动继续
3. **平台登录**（`loginPlatform` API）：完成登录，接收 token

已登录用户可通过 `/login?switch=1` 切换平台（参见 `src/routes/Guard.tsx:16-22`）。

### 状态管理（Zustand）

| Store | 文件 | 持久化内容 |
|---|---|---|
| `useUserStore` | `src/stores/useUserStore.ts` | `token`、`saasName`、`permissions`；`userInfo` 仅运行时 |
| `useAppStore` | `src/stores/useAppStore.ts` | 所有 UI 设置（主题、布局、标签页、表单/表格偏好等） |
| `useMessageStore` | `src/stores/useMessageStore.ts` | 消息通知和未读计数 |

`useAppStore` 关键字段：
- `sideMenuType`（sub/group）：侧边栏菜单展示模式
- `formDisplayMode`（modal/drawer）、`formColumns`（1/2）、`formSizePreset`（small/medium/large）
- `tableSize`（small/middle/large）、`tableBordered`、`tableStriped`

### 请求安全

所有 API 请求（`src/api/request.ts`）自动包含：

- **签名头**：`X-App-Key`、`X-Timestamp`、`X-Nonce`、`X-Sign`（通过 `src/utils/sign.ts` 生成）
- **可选 AES 加密**：由 `VITE_CRYPTO_ENABLED` 控制
- **Token 认证**：直接从 localStorage 读取（`src/utils/storage.ts` 的 `getToken()`），确保清空后立即失效
- **401 处理**：自动登出并用 `window.location.replace()` 重定向到登录页

### 跨标签页同步

通过 `BroadcastChannel`（`src/utils/authChannel.ts`）同步：
- `logout`：一个标签页登出，所有标签页重定向登录页
- `switchPlatform`：切换平台时，所有标签页刷新

### 国际化（i18n）

支持 `zh-CN`、`en-US`、`ja-JP`，文件在 `src/locales/{locale}/{namespace}.json`。

命名空间：`common`、`menu`、`login`、`system`、`tenant`、`order`、`product`、`settings`、`message`

使用方式：`i18n.t('namespace:key')` 或 `t('namespace:key')`，语言偏好存储在 `localStorage['app-locale']`。

## 项目结构

```
src/
├── api/                    # API 请求模块
│   ├── modules/
│   │   ├── platform/      # 平台 API（auth、system、message、tenant、dictionary）
│   │   └── tenant/        # 租户 API（order、product、setting）
│   ├── request.ts         # 带签名和加密的 Axios 实例
│   └── types.ts           # 通用 API 响应类型
├── components/
│   ├── common/                 # 可复用业务组件
│   │   ├── FormContainer/      # 智能表单包装器（modal/drawer，带全局设置）
│   │   ├── ProTable/           # 增强的 Ant Design ProTable 和 EditableProTable
│   │   ├── PageContainer/      # 带面包屑的页面包装器
│   │   ├── DictTag/            # 字典驱动的标签显示
│   │   ├── VersionUpdateBar/   # 版本更新通知栏
│   │   ├── HasPermission/      # 基于权限的渲染
│   │   ├── PermissionTreePanel/ # 权限树面板
│   │   ├── ErrorBoundary/      # 错误边界包装器
│   │   └── PageSkeleton/       # 加载骨架屏
│   └── layout/                 # 布局组件
│       ├── AppLayout/          # 平台布局
│       ├── TenantLayout/       # 租户布局
│       ├── BaseLayout/         # 共享基础布局逻辑
│       ├── HeaderActions/      # Header 操作组件
│       ├── MultiTabs/          # 标签页导航系统
│       ├── PageTransitionWrapper/ # 页面切换过渡包装器
│       ├── SettingsDrawer/     # 设置面板
│       └── ThemeProvider/      # 主题配置提供者
├── pages/
│   ├── Platform/          # 平台级页面（Dashboard、System、Message、Tenant）
│   ├── Tenant/            # 租户级页面（Dashboard、Auth、System、Order、Product、Setting）
│   ├── Login/
│   └── Exception/         # 403、404 页面
├── stores/                # Zustand stores
├── hooks/                 # 自定义 hooks
│   └── query/keys.ts      # React Query 缓存键工厂
├── services/              # 业务逻辑（role.service.ts、menu.service.ts）
├── utils/                 # 工具函数（authChannel、crypto、sign、storage、export、format）
├── types/                 # TypeScript 类型（platform/、tenant/）
├── constants/             # 全局常量、UI 常量、菜单配置
├── routes/                # 路由定义和守卫
├── locales/               # i18n 翻译文件
└── config/
    └── defaultSettings.json # 默认 UI 设置
```

```
mock/
├── index.ts / mockProdServer.ts
├── platform/              # auth、system、tenant、message、dictionary
└── tenant/                # auth、dashboard、order、product、setting
```

## 关键约定

### 路径别名

`@/` → `src/`（在 `tsconfig.json` 和 `vite.config.ts` 中配置）

### 页面模块结构

```
pages/ModuleName/
├── index.tsx              # 主页面组件
├── components/            # 页面私有组件
└── hooks/                 # 页面私有 hooks（使用 React Query 获取数据）
```

### 表单：必须使用 FormContainer

所有表单弹窗/抽屉必须使用 `src/components/common/FormContainer`，不得直接使用 `ModalForm` 或 `DrawerForm`。

FormContainer 自动适配全局设置（`formDisplayMode`、`formColumns`、`formSizePreset` 等）。

```tsx
import { FormContainer } from '@/components/common/FormContainer'

// 跟随全局设置（推荐）
<FormContainer title="新增用户" open={open} onOpenChange={setOpen}>
  <ProFormText name="name" label="名称" />
  <ProFormTextArea name="desc" label="描述" colProps={{ span: 24 }} />
</FormContainer>

// 固定大尺寸
<FormContainer title="权限配置" formSize="large" open={open} onOpenChange={setOpen}>
  {/* 复杂内容 */}
</FormContainer>
```

表单列布局优先级（从高到低）：字段级 `colProps` > 页面级 `formSize` > 全局 `formSizePreset`

宽度映射（`src/constants/ui/formSize.ts`）：
- Small：520px（modal）/ 480px（drawer）
- Medium：720px（modal）/ 700px（drawer）
- Large：960px（modal）/ 1000px（drawer）

### Store 订阅规范

多属性订阅必须使用 `useShallow`：

```tsx
import { useShallow } from 'zustand/react/shallow'

// ✅ 多属性
const { tableSize, tableBordered } = useAppStore(useShallow((s) => ({
  tableSize: s.tableSize,
  tableBordered: s.tableBordered,
})))

// ✅ 单属性
const systemLogo = useAppStore((s) => s.systemLogo)

// ❌ 错误：直接解构订阅整个 store
const { tableSize, tableBordered } = useAppStore()
```

### 环境变量

```bash
VITE_API_BASE_URL=           # 空 = 使用 vite-plugin-mock
VITE_CRYPTO_ENABLED=false    # 启用 AES 加密
VITE_APP_KEY=merchant-admin  # 请求签名
VITE_APP_SECRET=dev-secret   # 请求签名
```

新开发者：`cp .env.example .env.local`

### 菜单配置

- 平台菜单：`src/constants/menu/platformMenu.tsx`
- 租户菜单：`src/constants/menu/tenantMenu.tsx`
- `sideMenuType=group` 时，菜单项的 `group` 属性用于分组显示

### 设置持久化

用户偏好通过 Zustand persist 自动保存到 `localStorage['app-settings']`，默认值来自 `src/config/defaultSettings.json`。

设置抽屉底部"清除缓存"按钮会清除所有存储（保留 `app-settings` 和 `app-locale`）并刷新页面。

## Mock 数据

开发环境通过 `vite-plugin-mock` 启用，Mock 文件在 `mock/` 目录。

### Mock 认证

所有需要认证的接口用 `withAuth` 包装：

```ts
import { withAuth } from './auth'

export default [
  {
    url: '/api/admin/system/user/list',
    method: 'POST',
    response: withAuth(({ body, headers }) => {
      return { code: 200, data: { list, total }, msg: 'success' }
    }),
  },
]
```

`withAuth` 验证 `Authorization` header 中的 token，失败返回 `{ code: 401, data: null, msg: '登录已过期' }`。

## 核心组件

### FormContainer

见上方「表单：必须使用 FormContainer」。

### ProTable / EditableProTable

从 `@/components/common/ProTable` 导入，增强能力：
- 自动分页（`useCommon`）、字典列渲染（`useDictionary`）
- Excel 导出（`exportable` 属性）、可拖拽列宽（`tableResizable` 全局设置）
- 全局表格尺寸/边框/斑马纹（来自 `useAppStore`）

### DictTag

```tsx
<DictTag dictType="user_status" value={record.status} />
```

自动获取字典数据（缓存 30 分钟），将代码值映射为标签文本和颜色。

### HasPermission / usePermission

```tsx
// 组件方式
<HasPermission code="system:user:add">
  <Button>新增</Button>
</HasPermission>

// Hook 方式
const { hasPermission } = usePermission()
if (hasPermission('system:user:add')) { ... }
```

权限代码格式：`module:resource:action`，空权限数组 = 完全访问。

### PermissionTreePanel

权限树面板，支持搜索、全选/清空、展开/收起、只读模式。详见 `src/components/common/README.md`。

## 自定义 Hooks

| Hook | 用途 |
|---|---|
| `useCommon` | 分页和搜索参数管理 |
| `useDictionary(type)` | 获取并缓存字典数据（30 分钟） |
| `useFormModal()` | 表单弹窗开关和编辑 ID 管理 |
| `usePermission()` | 权限检查工具 |
| `usePolling(fn, interval)` | 标签页可见性感知轮询 |
| `useVersionCheck()` | 检测应用版本更新 |

### React Query 缓存键

```tsx
import { queryKeys } from '@/hooks/query/keys'

useQuery({ queryKey: queryKeys.users.list(params), queryFn: ... })
queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
```

## Services 层

- `role.service.ts`：`convertToTree`、`filterRoleTree`、`getAllRoleIds`
- `menu.service.ts`：`convertToTree`、`filterMenuTree`、`sortMenuTree`

## 工具函数

### export.ts

```tsx
import { exportToExcel } from '@/utils/export'
exportToExcel(data, columns, 'users.xlsx')
```

支持 Excel/CSV/TXT/HTML/XML，支持表尾汇总（`exportFooter: 'sum' | 'avg' | 'max' | 'min' | 'count' | string | false | (data) => string`）。

`valueType` 为 `digit`/`money`/`percent` 的列默认自动求和，`exportFooter` 配置优先级更高。

### format.ts

`formatDate`、`formatCurrency`、`formatNumber`、`formatFileSize`

### storage.ts

`getToken`、`setToken`、`removeToken`、`getUserInfo`、`setUserInfo`

## 重要实现细节

### 路由守卫（`src/routes/Guard.tsx`）

- 未认证用户重定向到 `/login`
- 已认证用户可访问 `/login?switch=1`（平台切换）
- 空 `permissions[]` = 完全访问
- 白名单：`/login`、`/403`、`/404`

### 多标签页管理

`useAppStore` 管理标签页：`addTab`（遵守 `maxTabs`）、`removeTab`、`removeOtherTabs`（可限定路由前缀）、`removeAllTabs`（可保留其他后端标签页）。

### 主题过渡

使用 View Transition API 实现平滑过渡，防止切换时闪烁（参见 `useAppStore.ts:214-228`）。

### 锁屏功能

Header 操作触发，状态存于 `useAppStore` 的 `isLocked`、`lockPassword`。

### 消息通知

`NotificationBell` 组件通过 `usePolling` 每 30 秒轮询未读计数，消息收件箱页面挂载时刷新计数。

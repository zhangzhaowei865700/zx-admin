# Codex Project Instructions

本文件为 Codex 在此代码库中工作的指导。内容基于 `CLAUDE.md`，但按 Codex 使用场景整理。

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

## 开发环境与配置

- **Node.js**：>= 18（来源于 `README.md`）
- 环境变量模板：`.env.example`
- 环境变量文件：`.env.development`、`.env.production`、`.env.demo`、`.env.test`
- 关键变量（见 `.env.example` 与 `src/api/request.ts`）：
  - `VITE_API_BASE_URL`：API 基础地址；为空时使用 mock 数据
  - `VITE_CRYPTO_ENABLED`：是否启用 AES 加密（`true/false`）
  - `VITE_APP_KEY` / `VITE_APP_SECRET`：请求签名
  - `VITE_BASE_PATH`：部署基础路径

## Mock / 真实 API

- 开发模式使用 `vite-plugin-mock`，mock 目录：`mock/`（配置见 `vite.config.ts`）
- Demo 模式会启动 `mock/mockProdServer`（见 `src/main.tsx`）
- 接入真实后端：设置 `VITE_API_BASE_URL` 为后端地址，并按需开启 `VITE_CRYPTO_ENABLED`

## 系统概览

### 多平台多租户

- **平台级**：路由前缀 `/`，布局 `AppLayout`
- **租户级**：路由前缀 `/tenant-admin/:tenantId`，布局 `TenantLayout`

路由定义：`src/routes/modules/platform.tsx`、`src/routes/modules/tenant.tsx`。

### 两步登录流程

1. `preLogin`：提交凭证，返回可用平台
2. 选择平台（多平台则手选）
3. `loginPlatform`：完成登录并获取 token

平台切换入口：`/login?switch=1`（`src/routes/Guard.tsx:16-22`）。

## 状态管理（Zustand）

- `useUserStore`：
  - 持久化：`token`、`saasName`
  - 运行时：`userInfo`、`permissions`
- `useAppStore`：
  - 持久化全部 UI 偏好（主题、布局、标签页、表单、表格）
  - 主题切换使用 View Transition（`withViewTransition`）
- `useMessageStore`：消息通知和未读计数

**订阅规范**：`useAppStore()` 必须使用 `useShallow` 选择器。

## 请求安全

`src/api/request.ts` 自动附加：

- `X-App-Key`、`X-Timestamp`、`X-Nonce`、`X-Sign`（`src/utils/sign.ts`）
- 可选 AES 加密（`VITE_CRYPTO_ENABLED`，`src/utils/crypto.ts`）
- Bearer token（`Authorization`）
- 401 自动登出并重定向

## 路由守卫与权限

- 入口守卫：`src/routes/Guard.tsx`
- 未登录访问非 `/login` 会跳转登录
- 已登录访问 `/login` 仅在 `?switch=1` 时允许（用于平台切换）
- 权限校验：`permissions` 为空视为全量权限
- 路由权限来源：路由 `handle.permission`（见 `src/routes/modules/*.tsx`）
- 权限模型：统一使用权限码（`module:resource:action`），不再使用路径前缀做权限判断
- 403/404 页面位于 `src/pages/Exception/`

## 国际化（i18n）

- 语言：`zh-CN`、`en-US`、`ja-JP`
- 目录：`src/locales/{locale}/{namespace}.json`
- 命名空间：`common`、`menu`、`login`、`system`、`tenant`、`order`、`product`、`settings`、`message`
- 存储：`localStorage['app-locale']`

## 菜单与设置

- 菜单常量：`src/constants/platformMenu.tsx`、`src/constants/tenantMenu.tsx`
- 侧边栏分组：`sideMenuType = group` 使用 `group` 字段
- 用户偏好：`localStorage['app-settings']`，默认值：`src/config/defaultSettings.json`
- 清缓存按钮保留 `app-settings` 与 `app-locale`
- 菜单与路由当前为“两套静态配置”：改菜单常量不会自动新增可访问页面路由
- 新增菜单若指向“已有页面组件”可仅改配置；若需要“新页面组件”仍需前端发版
- 若要做后端驱动路由，推荐后端下发 `componentKey`，前端用白名单 `componentMap` 映射组件，禁止后端直接下发可执行导入路径

## 项目结构（详细）

```
.
├── .env.*                    # 环境变量（development/production/demo/test/example）
├── AGENTS.md
├── CHANGELOG.md
├── CLAUDE.md
├── CONTRIBUTING*.md
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── docs/
│   └── REACT_QUERY_GUIDE.md
├── mock/
│   ├── index.ts
│   ├── mockProdServer.ts
│   ├── platform/
│   │   ├── auth.ts
│   │   ├── dictionary.ts
│   │   ├── message.ts
│   │   ├── system.ts
│   │   └── tenant.ts
│   └── tenant/
│       ├── dashboard.ts
│       ├── order.ts
│       ├── product.ts
│       └── setting.ts
├── public/
├── src/
│   ├── api/
│   │   ├── request.ts
│   │   └── modules/
│   │       ├── platform/      # 平台端 API
│   │       │   ├── auth.ts
│   │       │   ├── dictionary.ts
│   │       │   ├── message.ts
│   │       │   ├── system.ts
│   │       │   └── tenant.ts
│   │       └── tenant/        # 租户端 API
│   │           ├── dashboard.ts
│   │           ├── order.ts
│   │           ├── product.ts
│   │           └── setting.ts
│   ├── components/
│   │   ├── common/            # 通用组件（含 HasPermission、ProTable 等）
│   │   └── layout/            # 布局相关
│   ├── config/
│   │   └── defaultSettings.json
│   ├── constants/
│   │   ├── menu/
│   │   │   ├── platformMenu.tsx
│   │   │   └── tenantMenu.tsx
│   │   └── ui/
│   │       └── formSize.ts
│   ├── hooks/
│   │   ├── query/
│   │   │   ├── index.ts
│   │   │   └── keys.ts
│   │   ├── useCommon.ts
│   │   ├── useDictionary.ts
│   │   ├── useFormModal.ts
│   │   ├── usePermission.ts
│   │   ├── usePolling.ts
│   │   └── useVersionCheck.ts
│   ├── locales/
│   │   ├── en-US/
│   │   ├── ja-JP/
│   │   └── zh-CN/
│   ├── pages/
│   │   ├── Exception/         # 403/404 pages
│   │   ├── Login/
│   │   ├── Platform/
│   │   │   ├── Dashboard/
│   │   │   ├── Message/
│   │   │   ├── System/
│   │   │   │   ├── Menu/
│   │   │   │   ├── Role/
│   │   │   │   └── User/
│   │   │   └── Tenant/
│   │   └── Tenant/
│   │       ├── Dashboard/
│   │       ├── Order/
│   │       ├── Product/
│   │       └── Setting/
│   ├── routes/
│   │   ├── Guard.tsx
│   │   └── modules/
│   │       ├── platform.tsx
│   │       └── tenant.tsx
│   ├── services/
│   │   ├── menu.service.ts
│   │   └── role.service.ts
│   ├── stores/
│   │   ├── useAppStore.ts
│   │   ├── useMessageStore.ts
│   │   └── useUserStore.ts
│   ├── types/
│   │   ├── platform/
│   │   └── tenant/
│   ├── utils/
│   │   ├── authChannel.ts
│   │   ├── crypto.ts
│   │   ├── export.ts
│   │   ├── format.ts
│   │   ├── sign.ts
│   │   └── storage.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
└── dist/                      # 构建产物（可忽略）
```

## 关键文件与职责

- `vite.config.ts`：Vite 配置、mock 插件、打包拆分、`version.json` 产出
- `src/main.tsx`：应用入口、Router 模式切换（demo 用 HashRouter）
- `src/App.tsx`：应用根组件（Guard 包裹）
- `src/routes/Guard.tsx`：登录与权限守卫
- `src/api/request.ts`：请求封装、签名、加解密、401 处理
- `src/config/defaultSettings.json`：默认 UI 偏好
- `src/constants/menu/*.tsx`：平台/租户菜单常量

## 常见模块入口

- 登录：`src/pages/Login/`
- 平台端：`src/pages/Platform/`（如 `System/`、`Tenant/`、`Dashboard/`）
- 租户端：`src/pages/Tenant/`（如 `Order/`、`Product/`、`Setting/`、`Dashboard/`）

## 核心组件

- `FormContainer`：自动适配 `formDisplayMode`、`formColumns`、`formSizePreset`
- `ProTable`：集成分页、字典、导出、表格偏好
- `DictTag`：字典驱动标签显示
- `VersionUpdateBar`：版本更新提示条
- `HasPermission`：权限渲染控制

## 常用 Hooks

- `useDictionary(dictType)`：字典缓存 30 分钟
- `usePolling(fn, ms)`：可见性感知轮询
- `useVersionCheck()`：版本检测
- `useFormModal()`：表单弹层状态
- `useCommon()`：分页与搜索参数
- `usePermission()`：权限判断

## Services

- `role.service.ts`：角色树转换与过滤
- `menu.service.ts`：菜单树转换、过滤、排序

## 工具函数

- `exportToExcel`（`src/utils/export.ts`）：多格式导出 + 表尾汇总
- `format.ts`：日期/数字/货币/文件大小格式化
- `storage.ts`：token / userInfo 读写

## React Query

缓存键工厂：`src/hooks/query/keys.ts`

- `queryKeys.users.all`
- `queryKeys.users.list(params)`
- `queryKeys.users.detail(id)`
- `queryKeys.dictionary.type(dictType)`

## 开发约定

- 权限代码：`module:resource:action`
- 空权限数组表示全量权限（后端兼容）
- 路由新增/调整时必须同时补充 `handle.permission`，保持与按钮级权限（`HasPermission`）一致
- 复杂逻辑优先放 `services/`
- API 调用集中在 `src/api/modules/`
- 组件尽量小而专注
- 代码规范：遵循 `eslint.config.js`，执行 `npm run lint`

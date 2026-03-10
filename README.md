<p align="center">
  <img src="https://img.shields.io/badge/ZX--Admin-v1.2.0-blue?style=for-the-badge" alt="Version">
  <a href="https://github.com/zhangzhaowei865700/ZX-Admin">
    <img src="https://img.shields.io/github/stars/zhangzhaowei865700/ZX-Admin?style=for-the-badge&logo=github" alt="Stars">
  </a>
  <a href="https://github.com/zhangzhaowei865700/ZX-Admin/network/members">
    <img src="https://img.shields.io/github/forks/zhangzhaowei865700/ZX-Admin?style=for-the-badge&logo=github" alt="Forks">
  </a>
  <a href="https://github.com/zhangzhaowei865700/ZX-Admin/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/zhangzhaowei865700/ZX-Admin?style=for-the-badge" alt="License">
  </a>
</p>

<div align="center">

# 🚀 ZX-Admin

### 多平台多租户企业级管理后台

**为 SaaS 而生 · 开箱即用 · 高度可配置**

<p>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://ant.design"><img src="https://img.shields.io/badge/Ant%20Design-5.21-0170FE?style=flat-square&logo=antdesign&logoColor=white" alt="Ant Design"></a>
  <a href="https://zustand-demo.pmnd.rs/"><img src="https://img.shields.io/badge/Zustand-4.4-443E44?style=flat-square" alt="Zustand"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node"></a>
</p>

[在线演示](https://zhangzhaowei865700.github.io/ZX-Admin/) · [快速开始](#快速开始)

**👤 测试账号：** `admin` / `123456`

中文 | [English](./README.en.md)

</div>

---

<div align="center">

## 💡 核心亮点

</div>

<table>
  <tr>
    <td align="center">
      <h3>🏢</h3>
      <b>双层级多租户</b>
      <p>开源的平台+租户双视角管理系统</p>
    </td>
    <td align="center">
      <h3>🔐</h3>
      <b>企业级安全</b>
      <p>请求签名·AES加密·跨标签同步</p>
    </td>
    <td align="center">
      <h3>⚙️</h3>
      <b>高度可配置</b>
      <p>20+配置项·自动持久化·实时预览</p>
    </td>
    <td align="center">
      <h3>⚡</h3>
      <b>极致性能</b>
      <p>Vite·Zustand·React Query</p>
    </td>
  </tr>
</table>

---

<br>

## 📑 目录导航

<details open>
<summary>点击展开/收起</summary>

- [简介](#-简介)
- [为什么选择 ZX-Admin？](#-为什么选择-zx-admin)
  - [🏢 为 SaaS 而生](#-为-saas-而生)
  - [🔐 企业级安全方案](#-企业级安全方案)
  - [🎨 极致的用户体验](#-极致的用户体验)
  - [⚡ 现代化技术栈](#-现代化技术栈)
  - [⚙️ 高度可配置化](#️-高度可配置化)
  - [📊 对比其他开源后台系统](#-对比其他开源后台系统)
- [界面预览](#-界面预览)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [可用命令](#-可用命令)
- [项目结构](#-项目结构)
- [环境变量](#-环境变量)
- [对接真实后端](#-对接真实后端)
- [部署](#-部署)
- [浏览器支持](#-浏览器支持)
- [演示账号](#-演示账号)
- [常见问题](#-常见问题)
- [新增业务模块全链路指南](#-新增业务模块全链路指南)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

</details>

<br>

---

## 📖 简介

ZX-Admin 是一套**开源的双层级多租户管理后台系统**，基于 **React 18 + TypeScript + Ant Design** 构建。

**核心优势：**
- 🏢 **双层级架构**：平台方和租户方共用一套代码，支持多平台无缝切换
- 🔐 **企业级安全**：内置请求签名、AES 加密、跨标签同步，开箱即用
- ⚙️ **极致可配置**：20+ 配置项自动持久化，无需二次开发即可满足不同场景
- ⚡ **现代技术栈**：Vite + Zustand (1KB) + React Query，比传统方案快 10 倍

<div align="center">

> 💡 **不只是模板，更是完整的 SaaS 解决方案**

</div>

<br>

---

## ✨ 为什么选择 ZX-Admin？

<br>

### 🏢 为 SaaS 而生

<blockquote>
<b>开源的双层级多租户后台系统</b>，平台方和租户方共用一套代码
</blockquote>

```
📦 平台级管理 (/)
   ├─ 管理所有租户
   ├─ 系统用户、角色、菜单
   └─ 消息通知中心

📦 租户级管理 (/tenant-admin/:tenantId)
   ├─ 租户自身业务
   ├─ 订单、商品、设置
   └─ 独立权限体系

🔄 多平台切换 (/login?switch=1)
   └─ 用户可在多个平台间无缝切换
```

**适用场景**：电商平台 · 教育 SaaS · 企业服务平台 · 多租户系统

<br>

### 🔐 企业级安全方案

<blockquote>
开箱即用的安全特性，无需额外配置
</blockquote>

| 安全特性 | 说明 |
|---------|------|
| 🔏 **请求签名机制** | X-Sign + Timestamp + Nonce 防重放攻击 |
| 🔐 **可选 AES 加密** | 保护敏感数据传输（通过环境变量控制） |
| 🔄 **跨标签页同步** | 使用 BroadcastChannel API，一个标签页登出，所有标签页同步退出 |
| 🚨 **401 自动处理** | Token 失效自动跳转登录页，无感知刷新 |

<br>

### 🎨 极致的用户体验

<blockquote>
每个细节都精心打磨
</blockquote>

- ✨ **View Transition API 动画**：丝滑的主题切换，无闪烁
- 📑 **智能多标签管理**：自动关闭最旧标签、支持按路由前缀批量关闭、标签数量限制
- 🔒 **锁屏功能**：临时离开无需退出登录，密码保护
- 📐 **三级表单布局控制**：字段级 > 页面级 > 全局偏好，灵活适配不同场景

<br>

### ⚡ 现代化技术栈

<blockquote>
比传统方案更快、更轻量
</blockquote>

```
🎯 核心技术
React 18 + TypeScript + Vite
Zustand (1KB) + React Query (智能缓存)
Ant Design Pro Components + TailwindCSS
```

**性能对比**

| 对比项 | ZX-Admin | 传统方案 | 提升 |
|-------|---------|---------|------|
| 状态管理体积 | Zustand (1KB) | Redux (重) | **99% ↓** |
| 启动速度 | Vite | Webpack | **10x ↑** |
| HMR 响应 | 毫秒级 | 秒级 | **100x ↑** |
| 数据请求代码 | React Query | 手写 | **90% ↓** |

<br>

### ⚙️ 高度可配置化

<blockquote>
所有配置自动持久化到 localStorage，用户偏好永久保存
</blockquote>

<details>
<summary><b>📋 查看完整配置列表（20+ 配置项）</b></summary>

<br>

#### 🎨 主题与外观
- 主题模式：浅色/深色/跟随系统，支持自定义主题色
- 布局模式：侧边栏布局/顶部菜单/混合布局
- 侧边栏配置：宽度调节、折叠状态、固定/浮动模式
- 内容区域：固定宽度/流式布局、内容区域宽度自定义

#### 🧩 功能组件
- 多标签页：开启/关闭、最大标签数限制、标签持久化、快捷操作（关闭其他/关闭所有）
- 面包屑导航：显示/隐藏、图标显示
- 侧边菜单类型：经典子菜单模式/分组模式，适配不同菜单层级
- 页脚：显示/隐藏、自定义内容
- 水印：开启/关闭、自定义文本

#### 📝 表单与表格
- 表单显示模式：弹窗/抽屉，全局配置
- 表单列数：全局配置 1/2 列布局，支持页面级和字段级覆盖
- 表单尺寸：小/中/大三种预设宽度，适配不同复杂度表单
- 表格密度：紧凑/默认/宽松三种模式
- 分页配置：每页条数、显示总数、快速跳转

#### 🌐 国际化
- 三语言切换：中文/英文/日文，自动同步 dayjs 语言
- 语言偏好记忆：下次访问自动应用

</details>

**配置入口**：点击右上角 ⚙️ 设置图标，打开设置抽屉即可实时调整所有配置

<br>

### 📊 对比其他开源后台系统

<div align="center">

| 特性 | **ZX-Admin** | Ant Design Pro | Vue-Element-Admin | Refine |
|:----:|:------------:|:--------------:|:-----------------:|:------:|
| 多租户架构 | ✅ **双层级** | ❌ | ❌ | ⚠️ 需自行实现 |
| 请求签名 | ✅ **内置** | ❌ | ❌ | ❌ |
| 跨标签同步 | ✅ **BroadcastChannel** | ❌ | ❌ | ❌ |
| 主题动画 | ✅ **View Transition** | ⚠️ 基础切换 | ⚠️ 基础切换 | ⚠️ 基础切换 |
| 可配置化 | ✅ **20+ 配置项** | ⚠️ 部分支持 | ⚠️ 部分支持 | ⚠️ 需自行实现 |
| 配置持久化 | ✅ **自动保存** | ⚠️ 部分支持 | ⚠️ 部分支持 | ❌ |
| 状态管理 | **Zustand (1KB)** | Redux/Umi (重) | Vuex (中) | 自选 |
| 多平台切换 | ✅ | ❌ | ❌ | ❌ |
| 构建工具 | **Vite 5** | Umi/Webpack | Webpack | Vite |

</div>

<br>

---

## 🖼️ 界面预览

<div align="center">

> 📸 **截图待补充**
>
> 克隆项目后运行 `npm run dev` 即可本地预览

</div>

<br>

---

## 🎯 功能特性

<table>
  <tr>
    <td width="50%">

**🏢 多租户架构**
- 平台级和租户级两层管理
- 多平台无缝切换
- 独立权限体系

**🔐 安全特性**
- 请求签名防重放
- AES 加密传输
- 跨标签页同步
- 滑块验证码

**🎨 主题定制**
- 深色/浅色主题
- 平滑过渡动画
- 自定义主题色
- 布局模式切换

    </td>
    <td width="50%">

**📑 多标签页**
- 多标签页导航
- 状态保持
- 智能关闭策略
- 快捷键支持

**🌐 国际化**
- 中文/英文/日文
- 语言偏好记忆
- 动态切换

**🔍 其他特性**
- 菜单搜索 (Ctrl+K)
- Excel 导出（支持多格式、表尾汇总）
- 锁屏功能
- 清除缓存功能
- Mock 数据服务

    </td>
  </tr>
</table>

<br>

---

## 🛠️ 技术栈

<div align="center">

| 类别 | 技术 | 版本 |
|:----:|:-----|:----:|
| 🖥️ **前端框架** | React + TypeScript | 18.2 / 5.3 |
| ⚡ **构建工具** | Vite | 5.0 |
| 🎨 **UI 组件** | Ant Design + ProComponents | 5.21 |
| 📊 **状态管理** | Zustand | 4.4 |
| 🌐 **数据请求** | Axios + TanStack React Query | - |
| 📝 **表单处理** | React Hook Form | - |
| 🛣️ **路由管理** | React Router DOM | 6.x |
| 🌍 **国际化** | react-i18next | - |
| 🎭 **CSS 方案** | TailwindCSS | - |

</div>

<br>

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** / **yarn** / **pnpm**

### 安装步骤

```bash
# 1️⃣ 克隆仓库
git clone https://github.com/zhangzhaowei865700/ZX-Admin.git

# 2️⃣ 进入目录
cd ZX-Admin

# 3️⃣ 安装依赖
npm install

# 4️⃣ 启动开发服务器（默认使用 Mock API）
npm run dev
```

### 访问应用

浏览器访问 👉 [http://localhost:3000](http://localhost:3000)

默认账号：`admin` / `123456`

<br>

---

## 📜 可用命令

<div align="center">

| 命令 | 说明 | 备注 |
|:----:|:-----|:-----|
| `npm run dev` | 启动开发服务器 | 默认端口 3000，带 Mock API |
| `npm run build` | 构建生产版本 | 输出到 `dist/` 目录 |
| `npm run build:demo` | 构建 Demo 版本 | 用于演示环境 |
| `npm run preview` | 预览生产构建 | 需先执行 build |
| `npm run lint` | 运行 ESLint 检查 | 代码质量检查 |

</div>

<br>

---

## 📁 项目结构

<details>
<summary><b>点击展开查看完整目录结构</b></summary>

```
ZX-Admin/
├── mock/                    # 📦 Mock 服务
│   ├── platform/            # 平台侧 Mock 接口
│   ├── tenant/              # 租户侧 Mock 接口
│   ├── index.ts             # Mock 入口
│   └── mockProdServer.ts    # 生产环境 Mock
├── src/
│   ├── api/                 # 🌐 API 请求层
│   │   ├── modules/         # 业务模块 API
│   │   ├── request.ts       # Axios 配置
│   │   └── types.ts         # 类型定义
│   ├── components/          # 🧩 React 组件
│   │   ├── common/          # 通用组件
│   │   └── layout/          # 布局组件
│   ├── constants/           # 📋 常量配置
│   │   ├── index.ts         # 全局常量
│   │   ├── ui/              # UI 相关常量
│   │   └── menu/            # 菜单配置
│   ├── hooks/               # 🪝 自定义 Hooks
│   ├── locales/             # 🌍 国际化翻译文件
│   ├── pages/               # 📄 页面组件
│   ├── routes/              # 🛣️ 路由配置
│   ├── stores/              # 📊 Zustand 状态管理
│   ├── types/               # 📝 TypeScript 类型
│   ├── utils/               # 🔧 工具函数
│   ├── App.tsx              # 根组件
│   └── main.tsx             # 入口文件
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目依赖
```

</details>

<br>

---

## ⚙️ 环境变量

### 开发环境配置

```bash
# .env.development（默认使用 Mock）
VITE_API_BASE_URL=             # 留空使用 Mock 服务，填写真实 API 地址则对接后端
VITE_CRYPTO_ENABLED=false      # 是否开启 AES 加密（生产环境建议 true）
VITE_APP_KEY=merchant-admin    # 请求签名 Key（需与后端一致）
VITE_APP_SECRET=dev-secret     # 请求签名 Secret（生产环境必须修改）
VITE_BASE_PATH=/               # 部署子路径（如 GitHub Pages 用 /ZX-Admin/）
```

### 对接真实后端

创建 `.env.development.local` 文件（不会提交到 git）：

```bash
# .env.development.local
VITE_API_BASE_URL=http://your-backend-url.com  # 后端 API 地址
VITE_CRYPTO_ENABLED=true                        # 启用加密
VITE_APP_KEY=your-app-key                       # 与后端约定的 Key
VITE_APP_SECRET=your-app-secret                 # 与后端约定的 Secret
```

> ⚠️ **安全提示**：
> - 所有请求会自动携带签名头（`X-App-Key`、`X-Timestamp`、`X-Nonce`、`X-Sign`），确保与后端签名算法一致
> - 生产环境务必修改 `VITE_APP_SECRET` 并启用 `VITE_CRYPTO_ENABLED`
> - 签名算法详见 `src/utils/sign.ts`，加密算法详见 `src/utils/crypto.ts`

<br>

---

## 🚢 部署

### 方式一：静态托管（Nginx）

```bash
# 构建生产版本
npm run build

# 将 dist/ 目录部署到 Web 服务器
```

**Nginx 配置示例**（支持 History 路由）：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### 方式二：Docker 部署

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 构建镜像
docker build -t zx-admin .

# 运行容器
docker run -d -p 80:80 zx-admin
```

<br>

---

## 🌐 浏览器支持

<div align="center">

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| :-: | :-: | :-: | :-: |
| 90+ | 88+ | 90+ | 14+ |

</div>

> ⚠️ **现代浏览器要求**：项目使用了 [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) 和 [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)，不支持 IE 浏览器。

<br>

---

## 🔑 演示账号

<div align="center">

| 角色 | 用户名 | 密码 | 权限 |
|:----:|:------:|:----:|:-----|
| 管理员 | `admin` | `123456` | 全部权限 |

</div>

<br>

---

## ❓ 常见问题

<details>
<summary><b>1. 如何切换到真实 API？</b></summary>

<br>

创建 `.env.development.local` 文件并配置后端地址：

```bash
VITE_API_BASE_URL=http://your-backend-url.com
VITE_CRYPTO_ENABLED=true
VITE_APP_KEY=your-app-key
VITE_APP_SECRET=your-app-secret
```

重启开发服务器即可。

</details>

<details>
<summary><b>2. 登录失败怎么办？</b></summary>

<br>

**使用 Mock 模式**：
- 确保 `VITE_API_BASE_URL` 为空
- 使用默认账号：`admin` / `123456`

**对接真实后端**：
- 检查后端 API 地址是否正确
- 确认 `VITE_APP_KEY` 和 `VITE_APP_SECRET` 与后端一致
- 查看浏览器控制台网络请求，检查签名是否匹配
- 确认后端支持跨域（CORS）

</details>

<details>
<summary><b>3. 如何自定义主题色？</b></summary>

<br>

点击右上角设置图标 → 主题设置 → 选择预设主题色或自定义颜色。

所有配置会自动保存到 `localStorage`，刷新页面后保持。

</details>

<details>
<summary><b>4. 如何添加新菜单？</b></summary>

<br>

**平台级菜单**：编辑 `src/constants/menu/platformMenu.tsx`

**租户级菜单**：编辑 `src/constants/menu/tenantMenu.tsx`

菜单配置示例：

```tsx
{
  key: 'my-page',
  label: '我的页面',
  icon: <IconComponent />,
  path: '/my-page',
  children: [] // 可选子菜单
}
```

</details>

<details>
<summary><b>5. 跨域问题如何解决？</b></summary>

<br>

**开发环境**：在 `vite.config.ts` 中配置代理：

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

**生产环境**：需要后端配置 CORS 响应头，或使用 Nginx 反向代理。

</details>

<details>
<summary><b>6. 如何禁用请求签名/加密？</b></summary>

<br>

```bash
# .env.development.local
VITE_CRYPTO_ENABLED=false  # 禁用 AES 加密
```

签名功能无法禁用（安全考虑），如需修改签名逻辑，请编辑 `src/utils/sign.ts`。

</details>

<br>

---

## 🧩 新增业务模块全链路指南

以新增一个「公告管理」模块为例，完整演示从路由到页面的开发流程。

<details>
<summary><b>点击展开查看完整流程</b></summary>

<br>

### 第一步：注册路由

在 `src/routes/modules/platform.tsx` 中添加：

```tsx
{
  path: '/notice',
  element: <NoticePage />,
}
```

---

### 第二步：添加菜单

在 `src/constants/menu/platformMenu.tsx` 中添加：

```tsx
{
  key: 'notice',
  label: '公告管理',
  icon: <NotificationOutlined />,
  path: '/notice',
}
```

---

### 第三步：编写页面组件

新建 `src/pages/Platform/Notice/index.tsx`：

```tsx
// src/pages/Platform/Notice/index.tsx
import { useRef, useState } from 'react'
import { Button, Popconfirm, Space } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-components'
import { ProTable } from '@/components/common/ProTable'
import { PageContainer } from '@/components/common/PageContainer'
import { FormContainer } from '@/components/common/FormContainer'
import { getNoticeList, type Notice } from '@/api/modules/platform/notice'
import { useNoticeMutations } from './hooks/useNotice'

export const NoticePage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [modalOpen, setModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<Notice>()

  const { submit, remove } = useNoticeMutations(actionRef)

  const columns: ProColumns<Notice>[] = [
    { title: 'ID', dataIndex: 'id', width: 60, search: false },
    { title: '标题', dataIndex: 'title' },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: { 1: { text: '已发布', status: 'Success' }, 0: { text: '草稿', status: 'Default' } },
    },
    { title: '创建时间', dataIndex: 'createdAt', search: false },
    {
      title: '操作',
      search: false,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => { setCurrentRecord(record); setModalOpen(true) }}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => remove.mutate(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <PageContainer
      title="公告管理"
      extra={<Button type="primary" onClick={() => { setCurrentRecord(undefined); setModalOpen(true) }}>新增公告</Button>}
    >
      <ProTable<Notice>
        actionRef={actionRef}
        columns={columns}
        request={getNoticeList}
      />

      <FormContainer
        title={currentRecord ? '编辑公告' : '新增公告'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onFinish={async (values) => {
          await submit.mutateAsync({ record: currentRecord, values })
          return true
        }}
        initialValues={currentRecord}
      >
        <ProFormText name="title" label="标题" rules={[{ required: true }]} />
        <ProFormTextArea name="content" label="内容" colProps={{ span: 24 }} />
        <ProFormSelect
          name="status"
          label="状态"
          initialValue={0}
          options={[{ label: '草稿', value: 0 }, { label: '已发布', value: 1 }]}
        />
      </FormContainer>
    </PageContainer>
  )
}
```

---

### 第四步：定义 API

在 `src/api/modules/platform/` 下新建 `notice.ts`：

```typescript
// src/api/modules/platform/notice.ts
import request from '@/api/request'
import type { PageResult, PageParams } from '@/api/types'

export interface Notice {
  id: number
  title: string
  content: string
  status: number
  createdAt: string
}

export interface NoticeParams extends PageParams {
  title?: string
  status?: number
}

export const getNoticeList = (params: NoticeParams) =>
  request<PageResult<Notice>>({ url: '/api/admin/notice/list', method: 'POST', data: params })

export const createNotice = (data: Partial<Notice>) =>
  request({ url: '/api/admin/notice', method: 'POST', data })

export const updateNotice = (id: number, data: Partial<Notice>) =>
  request({ url: `/api/admin/notice/${id}`, method: 'PUT', data })

export const deleteNotice = (id: number) =>
  request({ url: `/api/admin/notice/${id}`, method: 'DELETE' })
```

---

### 第五步：编写业务 Hook（可选）

如果需要封装复用逻辑，新建 `src/pages/Platform/Notice/hooks/useNotice.ts`：

```typescript
// src/pages/Platform/Notice/hooks/useNotice.ts
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import type { RefObject } from 'react'
import { createNotice, updateNotice, deleteNotice, type Notice } from '@/api/modules/platform/notice'

export const useNoticeMutations = (actionRef: RefObject<ActionType | undefined>) => {
  const submit = useMutation({
    mutationFn: ({ record, values }: { record?: Notice; values: Record<string, any> }) =>
      record ? updateNotice(record.id, values) : createNotice(values),
    onSuccess: (_, { record }) => {
      message.success(record ? '更新成功' : '创建成功')
      actionRef.current?.reload()
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteNotice(id),
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
  })

  return { submit, remove }
}
```

---

### 第六步：注册 QueryKey（可选）

如果需要使用 `useQuery` 进行数据缓存，在 `src/hooks/query/keys.ts` 中添加：

```typescript
export const queryKeys = {
  // ...已有的 key
  platform: {
    // ...已有的 key
    notices: (params?: Record<string, any>) => ['platform', 'notices', params] as const,
  },
}
```

---

### 第七步：添加 Mock 数据

在 `mock/platform/` 下新建 `notice.ts`：

```typescript
// mock/platform/notice.ts
import { defineMock } from 'vite-plugin-mock'
import Mock from 'mockjs'

export default defineMock([
  {
    url: '/api/admin/notice/list',
    method: 'POST',
    response: () => ({
      code: 200,
      data: {
        list: Mock.mock({ 'list|10': [{ id: '@id', title: '@ctitle', status: '@integer(0,1)', createdAt: '@datetime' }] }).list,
        total: 100,
      },
    }),
  },
  {
    url: '/api/admin/notice',
    method: 'POST',
    response: () => ({ code: 200, message: '创建成功' }),
  },
  {
    url: /\/api\/admin\/notice\/\d+/,
    method: 'PUT',
    response: () => ({ code: 200, message: '更新成功' }),
  },
  {
    url: /\/api\/admin\/notice\/\d+/,
    method: 'DELETE',
    response: () => ({ code: 200, message: '删除成功' }),
  },
])
```

然后在 `mock/index.ts` 中引入：

```typescript
import './platform/notice'
```

---

### 完成！目录结构如下

```
src/pages/Platform/Notice/
├── index.tsx              # 页面主组件
└── hooks/
    └── useNotice.ts       # 业务 Hook（mutations）
```

**整个流程只需要关注 4-6 个步骤（根据实际需求），无需修改任何框架代码。**

</details>

<br>

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 开发规范

- **代码风格**：遵循 ESLint 规则，运行 `npm run lint` 检查
- **提交规范**：遵循 [Conventional Commits](https://www.conventionalcommits.org/)
  ```
  feat: 新功能
  fix: 修复 Bug
  docs: 文档更新
  style: 代码格式调整
  refactor: 重构代码
  perf: 性能优化
  test: 测试相关
  chore: 构建/工具链相关
  ```
- **命名规范**：
  - 组件文件：PascalCase（如 `UserTable.tsx`）
  - 工具函数：camelCase（如 `formatDate.ts`）
  - 常量文件：camelCase（如 `platformMenu.tsx`）
- **代码审查**：所有 PR 需要至少一位维护者审核通过

详见 [贡献指南](CONTRIBUTING.md)

<br>

---

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

<br>

---

<div align="center">

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=zhangzhaowei865700/ZX-Admin&type=Date)](https://star-history.com/#zhangzhaowei865700/ZX-Admin&Date)

<br>

## 💖 支持项目

如果这个项目对你有帮助，请给个 Star ⭐

<p>
  <a href="https://github.com/zhangzhaowei865700/ZX-Admin/stargazers">
    <img src="https://img.shields.io/github/stars/zhangzhaowei865700/ZX-Admin?style=for-the-badge&logo=github" alt="Stars">
  </a>
  <a href="https://github.com/zhangzhaowei865700/ZX-Admin/network/members">
    <img src="https://img.shields.io/github/forks/zhangzhaowei865700/ZX-Admin?style=for-the-badge&logo=github" alt="Forks">
  </a>
</p>

<br>

---

<sub>Built with ❤️ by <a href="https://github.com/zhangzhaowei865700">@zhangzhaowei865700</a></sub>

<br>

**MIT License © 2024-present**

</div>

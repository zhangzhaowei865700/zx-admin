<p align="center">
  <a href="https://github.com/zhangzhaowei865700/zx-admin">
    <img src="https://img.shields.io/github/stars/zhangzhaowei865700/zx-admin?style=social" alt="Stars">
    <img src="https://img.shields.io/github/forks/zhangzhaowei865700/zx-admin?style=social" alt="Forks">
    <img src="https://img.shields.io/github/license/zhangzhaowei865700/zx-admin" alt="License">
  </a>
</p>

<div align="center">

# zx-admin

多平台多租户企业级管理后台

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.21-0170FE?style=flat-square)](https://ant.design)
[![Zustand](https://img.shields.io/badge/Zustand-4.4-443E44?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js)](https://nodejs.org)

中文 | [English](./README.en.md)

**[贡献指南](CONTRIBUTING.md)** ｜ **[在线演示](https://zhangzhaowei865700.github.io/zx-admin/)**

</div>

---

## 目录导航

- [简介](#简介)
- [界面预览](#界面预览)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [可用命令](#可用命令)
- [项目结构](#项目结构)
- [环境变量](#环境变量)
- [对接真实后端](#对接真实后端)
- [部署](#部署)
- [浏览器支持](#浏览器支持)
- [演示账号](#演示账号)
- [许可证](#许可证)

---

## 简介

zx-admin 是一套基于 React + TypeScript + Ant Design 构建的多平台、多租户企业级管理后台。为 SaaS 平台提供完整的租户隔离和基于角色的权限控制解决方案。

> 一个现代化、功能丰富的管理后台模板，适用于构建 SaaS 应用。

---

## 界面预览

**在线演示：[https://zhangzhaowei865700.github.io/zx-admin/](https://zhangzhaowei865700.github.io/zx-admin/)**

> 截图待补充（克隆项目后运行 `npm run dev` 即可本地预览）

---

## 功能特性

| 功能 | 说明 |
|:----:|:-----|
| 🏢 **多租户** | 平台级和租户级两层管理架构 |
| 🔐 **两步登录** | 预登录 → 平台选择 → 平台登录 |
| 🛡️ **RBAC** | 基于角色的权限，菜单权限 + 按钮级控制 |
| 🌙 **暗黑模式** | 深色/浅色主题，平滑过渡 |
| 📑 **多标签页** | 多标签页导航，状态保持 |
| 🎨 **布局自定义** | 侧边栏、头部、底部、面包屑可配置 |
| 🌐 **国际化** | 中文、英文、日文支持 |
| 🔒 **安全特性** | 请求签名、AES 加密、滑块验证码 |
| 📦 **Mock 数据** | 内置 Mock 服务，快速开发 |
| 📊 **导出** | Excel 导出功能 |
| 🔍 **搜索** | 菜单搜索，支持 Ctrl+K 快捷键 |
| 🖥️ **锁屏** | 密码保护屏幕锁定 |

---

## 技术栈

| 类别 | 技术 |
|:----:|:-----|
| 🖥️ 前端 | React 18 + TypeScript |
| ⚡ 构建 | Vite 5 |
| 🎨 UI | Ant Design 5 + ProComponents |
| 📊 状态 | Zustand |
| 🌐 请求 | Axios + TanStack React Query |
| 📝 表单 | React Hook Form |
| 🛣️ 路由 | React Router DOM 6 |
| 🌍 国际化 | react-i18next |

---

## 快速开始

**环境要求：Node.js >= 18**

```bash
# 检查 Node 版本
node -v

# 克隆仓库
git clone https://github.com/zhangzhaowei865700/zx-admin.git

# 进入目录
cd zx-admin

# 安装依赖
npm install

# 启动开发服务器（默认使用 Mock API）
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)

---

## 可用命令

| 命令 | 说明 |
|:----:|:-----|
| `npm run dev` | 启动开发服务器（带 Mock API） |
| `npm run build` | 构建生产版本 |
| `npm run build:demo` | 构建 Demo 版本 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 运行 ESLint 检查 |

---

## 项目结构

```
zx-admin/
├── mock/                # Mock 服务
│   ├── platform/       # 平台侧 Mock 接口
│   ├── tenant/         # 租户侧 Mock 接口
│   ├── index.ts        # Mock 入口
│   └── mockProdServer.ts
├── src/
│   ├── api/            # API 请求层
│   │   ├── modules/   # 业务模块 API
│   │   ├── request.ts # Axios 配置
│   │   └── types.ts   # 类型定义
│   ├── components/     # React 组件
│   │   ├── common/   # 通用组件
│   │   └── layout/   # 布局组件
│   ├── constants/      # 常量与菜单配置
│   ├── hooks/          # 自定义 Hooks
│   ├── locales/        # 国际化翻译文件
│   ├── pages/          # 页面组件
│   ├── routes/         # 路由配置
│   ├── stores/         # Zustand 状态管理
│   ├── types/          # TypeScript 类型
│   ├── utils/          # 工具函数
│   ├── App.tsx         # 根组件
│   └── main.tsx        # 入口文件
└── ...
```

---

## 环境变量

```bash
# .env.development（默认使用 Mock）
VITE_API_BASE_URL=             # 留空使用 Mock 服务
VITE_CRYPTO_ENABLED=false      # 是否开启 AES 加密
VITE_APP_KEY=merchant-admin    # 请求签名 Key
VITE_APP_SECRET=dev-secret     # 请求签名 Secret
```

---

## 对接真实后端

将 `VITE_API_BASE_URL` 设置为后端服务地址即可切换到真实 API：

```bash
# .env.development.local（本地覆盖，不提交 git）
VITE_API_BASE_URL=http://your-backend-url.com
VITE_CRYPTO_ENABLED=true
VITE_APP_KEY=your-app-key
VITE_APP_SECRET=your-app-secret
```

> 所有请求会自动携带签名头（`X-App-Key`、`X-Timestamp`、`X-Nonce`、`X-Sign`），确保与后端签名算法一致。

---

## 部署

**静态托管（Nginx）**

```bash
# 构建
npm run build

# 将 dist/ 目录部署到 Web 服务器
```

Nginx 参考配置（支持 History 路由）：

```nginx
server {
    listen 80;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Docker**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## 浏览器支持

| 浏览器 | 最低版本 |
|:------:|:--------:|
| Chrome | 111+ |
| Firefox | 117+ |
| Edge | 111+ |
| Safari | 18+ |

> 项目使用了 [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) 和 [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)，不支持 IE。

---

## 演示账号

| 用户名 | 密码 |
|:------:|:----:|
| admin | 123456 |

---

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

<div align="center">

**如果这个项目对你有帮助，请给个 Star ⭐**

[![GitHub stars](https://img.shields.io/github/stars/zhangzhaowei865700/zx-admin?style=flat-square)](https://github.com/zhangzhaowei865700/zx-admin/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/zhangzhaowei865700/zx-admin?style=flat-square)](https://github.com/zhangzhaowei865700/zx-admin/network)

MIT License © 2024-present

</div>

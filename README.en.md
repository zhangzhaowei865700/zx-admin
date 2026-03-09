<p align="center">
  <a href="https://github.com/zhangzhaowei865700/zx-admin">
    <img src="https://img.shields.io/github/stars/zhangzhaowei865700/zx-admin?style=social" alt="Stars">
    <img src="https://img.shields.io/github/forks/zhangzhaowei865700/zx-admin?style=social" alt="Forks">
    <img src="https://img.shields.io/github/license/zhangzhaowei865700/zx-admin" alt="License">
  </a>
</p>

<div align="center">

# zx-admin

Multi-Platform Multi-Tenant Enterprise Management Dashboard

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.21-0170FE?style=flat-square)](https://ant.design)
[![Zustand](https://img.shields.io/badge/Zustand-4.4-443E44?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js)](https://nodejs.org)

[中文](./README.md) | English

**[Contributing](./CONTRIBUTING.en.md)**

</div>

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Connecting to a Real Backend](#connecting-to-a-real-backend)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [Demo Account](#demo-account)
- [License](#license)

---

## Overview

zx-admin is a multi-tenant, multi-platform enterprise management dashboard built with React + TypeScript + Ant Design. It provides a complete solution for SaaS platforms requiring tenant isolation and role-based access control.

> A modern, feature-rich admin template for building SaaS applications.

---

## Screenshots

> Screenshots coming soon. Clone the project and run `npm run dev` to preview locally.

---

## Features

| Feature | Description |
|:-------:|:------------|
| 🏢 **Multi-Tenant** | Platform-level and tenant-level management architecture |
| 🔐 **Two-Step Login** | Pre-login → Platform selection → Platform login |
| 🛡️ **RBAC** | Role-based permissions with menu & button-level control |
| 🌙 **Dark Mode** | Dark/Light theme with smooth transitions |
| 📑 **Multi-Tabs** | Multiple tabs navigation with state preservation |
| 🎨 **Layout Customization** | Sidebar, header, footer, breadcrumbs configurable |
| 🌐 **i18n** | Chinese, English, Japanese support |
| 🔒 **Security** | Request signing, AES encryption, slide captcha |
| 📦 **Mock Data** | Built-in mock server for rapid development |
| 📊 **Export** | Excel export functionality |
| 🔍 **Search** | Menu search with Ctrl+K shortcut |
| 🖥️ **Lock Screen** | Password-protected screen lock |

---

## Tech Stack

| Category | Technology |
|:--------:|:-----------|
| 🖥️ Frontend | React 18 + TypeScript |
| ⚡ Build Tool | Vite 5 |
| 🎨 UI Library | Ant Design 5 + ProComponents |
| 📊 State | Zustand |
| 🌐 HTTP | Axios + TanStack React Query |
| 📝 Forms | React Hook Form |
| 🛣️ Router | React Router DOM 6 |
| 🌍 i18n | react-i18next |

---

## Quick Start

**Requirements: Node.js >= 18**

```bash
# Check Node version
node -v

# Clone the repository
git clone https://github.com/zhangzhaowei865700/zx-admin.git

# Enter directory
cd zx-admin

# Install dependencies
npm install

# Start development server (uses Mock API by default)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|:-------:|:------------|
| `npm run dev` | Start dev server with mock API |
| `npm run build` | Build for production |
| `npm run build:demo` | Build demo version |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

---

## Project Structure

```
zx-admin/
├── mock/                # Mock server
│   ├── platform/       # Platform-side mock APIs
│   ├── tenant/         # Tenant-side mock APIs
│   ├── index.ts        # Mock entry
│   └── mockProdServer.ts
├── src/
│   ├── api/            # API layer
│   │   ├── modules/   # Business module APIs
│   │   ├── request.ts # Axios configuration
│   │   └── types.ts   # Type definitions
│   ├── components/     # React components
│   │   ├── common/   # Common components
│   │   └── layout/   # Layout components
│   ├── constants/      # Constants & menu config
│   ├── hooks/          # Custom hooks
│   ├── locales/        # i18n translation files
│   ├── pages/          # Page components
│   ├── routes/         # Routing configuration
│   ├── stores/         # Zustand state stores
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
└── ...
```

---

## Environment Variables

```bash
# .env.development (using mock by default)
VITE_API_BASE_URL=             # Empty = use Mock server
VITE_CRYPTO_ENABLED=false      # Enable AES encryption
VITE_APP_KEY=merchant-admin    # Request signing key
VITE_APP_SECRET=dev-secret     # Request signing secret
```

---

## Connecting to a Real Backend

Set `VITE_API_BASE_URL` to your backend URL to switch from Mock to a real API:

```bash
# .env.development.local (local override, not committed to git)
VITE_API_BASE_URL=http://your-backend-url.com
VITE_CRYPTO_ENABLED=true
VITE_APP_KEY=your-app-key
VITE_APP_SECRET=your-app-secret
```

> All requests automatically include signature headers (`X-App-Key`, `X-Timestamp`, `X-Nonce`, `X-Sign`). Ensure your backend verifies the same signing algorithm.

---

## Deployment

**Static Hosting (Nginx)**

```bash
# Build
npm run build

# Deploy the dist/ directory to your web server
```

Nginx configuration (with History routing support):

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

## Browser Support

| Browser | Minimum Version |
|:-------:|:--------------:|
| Chrome | 111+ |
| Firefox | 117+ |
| Edge | 111+ |
| Safari | 18+ |

> This project uses the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) and [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel). IE is not supported.

---

## Demo Account

| Username | Password |
|:--------:|:--------:|
| admin | 123456 |

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**If you find this project helpful, please give it a Star ⭐**

[![GitHub stars](https://img.shields.io/github/stars/zhangzhaowei865700/zx-admin?style=flat-square)](https://github.com/zhangzhaowei865700/zx-admin/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/zhangzhaowei865700/zx-admin?style=flat-square)](https://github.com/zhangzhaowei865700/zx-admin/network)

MIT License © 2024-present

</div>

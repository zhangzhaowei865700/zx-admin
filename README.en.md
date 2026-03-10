<p align="center">
  <img src="https://img.shields.io/badge/ZX--Admin-v1.0.0-blue?style=for-the-badge" alt="Version">
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

### Multi-Platform Multi-Tenant Enterprise Management Dashboard

**Built for SaaS · Ready to Use · Highly Configurable**

<p>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://ant.design"><img src="https://img.shields.io/badge/Ant%20Design-5.21-0170FE?style=flat-square&logo=antdesign&logoColor=white" alt="Ant Design"></a>
  <a href="https://zustand-demo.pmnd.rs/"><img src="https://img.shields.io/badge/Zustand-4.4-443E44?style=flat-square" alt="Zustand"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node"></a>
</p>

[Live Demo](https://zhangzhaowei865700.github.io/ZX-Admin/) · [Quick Start](#-quick-start)

**👤 Test Account:** `admin` / `123456`

[中文](./README.md) | English

</div>

---

<div align="center">

## 💡 Core Highlights

</div>

<table>
  <tr>
    <td align="center">
      <h3>🏢</h3>
      <b>Dual-Level Multi-Tenancy</b>
      <p>Open-source platform+tenant dual-perspective management system</p>
    </td>
    <td align="center">
      <h3>🔐</h3>
      <b>Enterprise-Grade Security</b>
      <p>Request signing · AES encryption · Cross-tab sync</p>
    </td>
    <td align="center">
      <h3>⚙️</h3>
      <b>Highly Configurable</b>
      <p>20+ config options · Auto-persist · Real-time preview</p>
    </td>
    <td align="center">
      <h3>⚡</h3>
      <b>Ultimate Performance</b>
      <p>Vite · Zustand · React Query</p>
    </td>
  </tr>
</table>

---

<br>

## 📑 Table of Contents

<details open>
<summary>Click to expand/collapse</summary>

- [Overview](#-overview)
- [Why Choose ZX-Admin?](#-why-choose-zx-admin)
  - [🏢 Built for SaaS](#-built-for-saas)
  - [🔐 Enterprise-Grade Security](#-enterprise-grade-security-solution)
  - [🎨 Ultimate User Experience](#-ultimate-user-experience)
  - [⚡ Modern Tech Stack](#-modern-tech-stack)
  - [⚙️ Highly Configurable](#️-highly-configurable)
  - [📊 Comparison with Other Open-Source Admin Systems](#-comparison-with-other-open-source-admin-systems)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Available Commands](#-available-commands)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Connecting to a Real Backend](#-connecting-to-a-real-backend)
- [Deployment](#-deployment)
- [Browser Support](#-browser-support)
- [Demo Account](#-demo-account)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

</details>

<br>

---

## 📖 Overview

ZX-Admin is an **open-source dual-level multi-tenant admin system**, built with **React 18 + TypeScript + Ant Design**.

**Core Advantages:**
- 🏢 **Dual-Level Architecture**: Platform and tenant sides share the same codebase, supporting seamless multi-platform switching
- 🔐 **Enterprise-Grade Security**: Built-in request signing, AES encryption, cross-tab sync, ready out of the box
- ⚙️ **Highly Configurable**: 20+ auto-persisted config options, no secondary development needed for different scenarios
- ⚡ **Modern Tech Stack**: Vite + Zustand (1KB) + React Query, 10x faster than traditional solutions

<div align="center">

> 💡 **Not just a template, but a complete SaaS solution**

</div>

<br>

---

## ✨ Why Choose ZX-Admin?

<br>

### 🏢 Built for SaaS

<blockquote>
<b>Open-source dual-level multi-tenant admin system</b>, platform and tenant sides share the same codebase
</blockquote>

```
📦 Platform-Level Management (/)
   ├─ Manage all tenants
   ├─ System users, roles, menus
   └─ Message notification center

📦 Tenant-Level Management (/tenant-admin/:tenantId)
   ├─ Tenant's own business
   ├─ Orders, products, settings
   └─ Independent permission system

🔄 Multi-Platform Switching (/login?switch=1)
   └─ Users can seamlessly switch between multiple platforms
```

**Use Cases**: E-commerce platforms · Education SaaS · Enterprise service platforms · Multi-tenant systems

<br>

### 🔐 Enterprise-Grade Security Solution

<blockquote>
Out-of-the-box security features, no additional configuration needed
</blockquote>

| Security Feature | Description |
|---------|------|
| 🔏 **Request Signing** | X-Sign + Timestamp + Nonce prevents replay attacks |
| 🔐 **Optional AES Encryption** | Protects sensitive data transmission (controlled via environment variables) |
| 🔄 **Cross-Tab Sync** | Uses BroadcastChannel API, logout in one tab syncs to all tabs |
| 🚨 **Auto 401 Handling** | Token expiration auto-redirects to login, seamless refresh |

<br>

### 🎨 Ultimate User Experience

<blockquote>
Every detail is carefully polished
</blockquote>

- ✨ **View Transition API Animations**: Smooth theme switching, no flashing
- 📑 **Smart Multi-Tab Management**: Auto-close oldest tabs, batch close by route prefix, tab count limits
- 🔒 **Lock Screen**: Temporarily leave without logging out, password protected
- 📐 **Three-Level Form Layout Control**: Field-level > Page-level > Global preference, flexible for different scenarios

<br>

### ⚡ Modern Tech Stack

<blockquote>
Faster and lighter than traditional solutions
</blockquote>

```
🎯 Core Technologies
React 18 + TypeScript + Vite
Zustand (1KB) + React Query (smart caching)
Ant Design Pro Components + TailwindCSS
```

**Performance Comparison**

| Comparison | ZX-Admin | Traditional | Improvement |
|-------|---------|---------|------|
| State Management Size | Zustand (1KB) | Redux (heavy) | **99% ↓** |
| Startup Speed | Vite | Webpack | **10x ↑** |
| HMR Response | Milliseconds | Seconds | **100x ↑** |
| Data Request Code | React Query | Manual | **90% ↓** |

<br>

### ⚙️ Highly Configurable

<blockquote>
All configurations auto-persist to localStorage, user preferences permanently saved
</blockquote>

<details>
<summary><b>📋 View Complete Configuration List (20+ options)</b></summary>

<br>

#### 🎨 Theme & Appearance
- Theme mode: Light/Dark/Follow system, custom theme colors
- Layout mode: Sidebar layout/Top menu/Mixed layout
- Sidebar config: Width adjustment, collapse state, fixed/floating mode
- Content area: Fixed width/Fluid layout, custom content area width

#### 🧩 Functional Components
- Multi-tabs: Enable/Disable, max tab limit, tab persistence, quick actions (close others/close all)
- Breadcrumb navigation: Show/Hide, icon display
- Footer: Show/Hide, custom content
- Watermark: Enable/Disable, custom text

#### 📝 Forms & Tables
- Form columns: Global config 1/2/3 column layout, supports page-level and field-level override
- Table density: Compact/Default/Comfortable three modes
- Pagination config: Items per page, show total, quick jump

#### 🌐 Internationalization
- Three-language switching: Chinese/English/Japanese, auto-sync dayjs language
- Language preference memory: Auto-apply on next visit

</details>

**Configuration Entry**: Click the ⚙️ settings icon in the top right corner to open the settings drawer and adjust all configurations in real-time

<br>

### 📊 Comparison with Other Open-Source Admin Systems

<div align="center">

| Feature | **ZX-Admin** | Ant Design Pro | Vue-Element-Admin | Refine |
|:----:|:------------:|:--------------:|:-----------------:|:------:|
| Multi-Tenant Architecture | ✅ **Dual-Level** | ❌ | ❌ | ⚠️ DIY Required |
| Request Signing | ✅ **Built-in** | ❌ | ❌ | ❌ |
| Cross-Tab Sync | ✅ **BroadcastChannel** | ❌ | ❌ | ❌ |
| Theme Animations | ✅ **View Transition** | ⚠️ Basic | ⚠️ Basic | ⚠️ Basic |
| Configurability | ✅ **20+ Options** | ⚠️ Partial | ⚠️ Partial | ⚠️ DIY Required |
| Config Persistence | ✅ **Auto-Save** | ⚠️ Partial | ⚠️ Partial | ❌ |
| State Management | **Zustand (1KB)** | Redux/Umi (heavy) | Vuex (medium) | Custom |
| Multi-Platform Switch | ✅ | ❌ | ❌ | ❌ |
| Build Tool | **Vite 5** | Umi/Webpack | Webpack | Vite |

</div>

<br>

---

## 🖼️ Screenshots

<div align="center">

> 📸 **Screenshots to be added**
>
> Clone the project and run `npm run dev` to preview locally

</div>

<br>

---

## 🎯 Features

<table>
  <tr>
    <td width="50%">

**🏢 Multi-Tenant Architecture**
- Platform-level and tenant-level two-tier management
- Seamless multi-platform switching
- Independent permission system

**🔐 Security Features**
- Request signing prevents replay attacks
- AES encrypted transmission
- Cross-tab synchronization
- Slide captcha verification

**🎨 Theme Customization**
- Dark/Light themes
- Smooth transition animations
- Custom theme colors
- Layout mode switching

    </td>
    <td width="50%">

**📑 Multi-Tabs**
- Multi-tab navigation
- State preservation
- Smart close strategy
- Keyboard shortcuts

**🌐 Internationalization**
- Chinese/English/Japanese
- Language preference memory
- Dynamic switching

**🔍 Other Features**
- Menu search (Ctrl+K)
- Excel export
- Lock screen
- Mock data service

    </td>
  </tr>
</table>

<br>

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technology | Version |
|:----:|:-----|:----:|
| 🖥️ **Frontend Framework** | React + TypeScript | 18.2 / 5.3 |
| ⚡ **Build Tool** | Vite | 5.0 |
| 🎨 **UI Components** | Ant Design + ProComponents | 5.21 |
| 📊 **State Management** | Zustand | 4.4 |
| 🌐 **Data Fetching** | Axios + TanStack React Query | - |
| 📝 **Form Handling** | React Hook Form | - |
| 🛣️ **Routing** | React Router DOM | 6.x |
| 🌍 **i18n** | react-i18next | - |
| 🎭 **CSS Solution** | TailwindCSS | - |

</div>

<br>

---

## 🚀 Quick Start

### Requirements

- **Node.js** >= 18.0.0
- **npm** / **yarn** / **pnpm**

### Installation Steps

```bash
# 1️⃣ Clone repository
git clone https://github.com/zhangzhaowei865700/ZX-Admin.git

# 2️⃣ Enter directory
cd ZX-Admin

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start development server (uses Mock API by default)
npm run dev
```

### Access Application

Open browser and visit 👉 [http://localhost:3000](http://localhost:3000)

Default account: `admin` / `123456`

<br>

---

## 📜 Available Commands

<div align="center">

| Command | Description | Notes |
|:----:|:-----|:-----|
| `npm run dev` | Start development server | Default port 3000, with Mock API |
| `npm run build` | Build for production | Output to `dist/` directory |
| `npm run build:demo` | Build demo version | For demo environment |
| `npm run preview` | Preview production build | Must run build first |
| `npm run lint` | Run ESLint checks | Code quality check |

</div>

<br>

---

## 📁 Project Structure

<details>
<summary><b>Click to expand full directory structure</b></summary>

```
ZX-Admin/
├── mock/                    # 📦 Mock Server
│   ├── platform/            # Platform-side mock APIs
│   ├── tenant/              # Tenant-side mock APIs
│   ├── index.ts             # Mock entry
│   └── mockProdServer.ts    # Production mock
├── src/
│   ├── api/                 # 🌐 API layer
│   │   ├── modules/         # Business module APIs
│   │   ├── request.ts       # Axios configuration
│   │   └── types.ts         # Type definitions
│   ├── components/          # 🧩 React components
│   │   ├── common/          # Common components
│   │   └── layout/          # Layout components
│   ├── constants/           # 📋 Constants & menu config
│   ├── hooks/               # 🪝 Custom hooks
│   ├── locales/             # 🌍 i18n translation files
│   ├── pages/               # 📄 Page components
│   ├── routes/              # 🛣️ Routing configuration
│   ├── stores/              # 📊 Zustand state stores
│   ├── types/               # 📝 TypeScript types
│   ├── utils/               # 🔧 Utility functions
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── .env.development         # Development environment variables
├── .env.production          # Production environment variables
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

</details>

<br>

---

## ⚙️ Environment Variables

### Development Configuration

```bash
# .env.development (uses Mock by default)
VITE_API_BASE_URL=             # Empty = use Mock server, fill in real API URL to connect backend
VITE_CRYPTO_ENABLED=false      # Enable AES encryption (recommended true in production)
VITE_APP_KEY=merchant-admin    # Request signing key (must match backend)
VITE_APP_SECRET=dev-secret     # Request signing secret (must change in production)
VITE_BASE_PATH=/               # Deployment sub-path (e.g., /ZX-Admin/ for GitHub Pages)
```

---

## 🔌 Connecting to a Real Backend

Create a `.env.development.local` file (not committed to git):

```bash
# .env.development.local
VITE_API_BASE_URL=http://your-backend-url.com  # Backend API URL
VITE_CRYPTO_ENABLED=true                        # Enable encryption
VITE_APP_KEY=your-app-key                       # Key agreed with backend
VITE_APP_SECRET=your-app-secret                 # Secret agreed with backend
```

> ⚠️ **Security Tips**:
> - All requests automatically include signature headers (`X-App-Key`, `X-Timestamp`, `X-Nonce`, `X-Sign`). Ensure your backend verifies the same signing algorithm
> - Must change `VITE_APP_SECRET` and enable `VITE_CRYPTO_ENABLED` in production
> - Signing algorithm: see `src/utils/sign.ts`, encryption algorithm: see `src/utils/crypto.ts`

<br>

---

## 🚢 Deployment

### Option 1: Static Hosting (Nginx)

```bash
# Build for production
npm run build

# Deploy the dist/ directory to your web server
```

**Nginx Configuration** (with History routing support):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### Option 2: Docker

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
# Build image
docker build -t zx-admin .

# Run container
docker run -d -p 80:80 zx-admin
```

<br>

---

## 🌐 Browser Support

<div align="center">

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| :-: | :-: | :-: | :-: |
| 90+ | 88+ | 90+ | 14+ |

</div>

> ⚠️ **Modern Browser Requirement**: This project uses the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) and [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel). IE is not supported.

<br>

---

## 🔑 Demo Account

<div align="center">

| Role | Username | Password | Permissions |
|:----:|:------:|:----:|:-----|
| Admin | `admin` | `123456` | Full access |

</div>

<br>

---

## ❓ FAQ

<details>
<summary><b>1. How to switch to a real API?</b></summary>

<br>

Create a `.env.development.local` file and configure the backend URL:

```bash
VITE_API_BASE_URL=http://your-backend-url.com
VITE_CRYPTO_ENABLED=true
VITE_APP_KEY=your-app-key
VITE_APP_SECRET=your-app-secret
```

Restart the dev server.

</details>

<details>
<summary><b>2. What if login fails?</b></summary>

<br>

**Using Mock mode**:
- Ensure `VITE_API_BASE_URL` is empty
- Use default account: `admin` / `123456`

**Connecting to real backend**:
- Check if backend API URL is correct
- Verify `VITE_APP_KEY` and `VITE_APP_SECRET` match backend
- Check browser console network requests to verify signature matching
- Ensure backend supports CORS

</details>

<details>
<summary><b>3. How to customize theme colors?</b></summary>

<br>

Click the settings icon in the top right → Theme Settings → Choose preset theme colors or customize.

All configurations are auto-saved to `localStorage` and persist after page refresh.

</details>

<details>
<summary><b>4. How to add new menus?</b></summary>

<br>

**Platform-level menu**: Edit `src/constants/platformMenu.tsx`

**Tenant-level menu**: Edit `src/constants/tenantMenu.tsx`

Menu configuration example:

```tsx
{
  key: 'my-page',
  label: 'My Page',
  icon: <IconComponent />,
  path: '/my-page',
  children: [] // Optional sub-menu
}
```

</details>

<details>
<summary><b>5. How to resolve CORS issues?</b></summary>

<br>

**Development environment**: Configure proxy in `vite.config.ts`:

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

**Production environment**: Backend needs to configure CORS response headers, or use Nginx reverse proxy.

</details>

<details>
<summary><b>6. How to disable request signing/encryption?</b></summary>

<br>

```bash
# .env.development.local
VITE_CRYPTO_ENABLED=false  # Disable AES encryption
```

Signing cannot be disabled (for security). To modify signing logic, edit `src/utils/sign.ts`.

</details>

<br>

---

## 🧩 Adding New Business Module Guide

A complete guide from routing to page implementation, using a "Notice Management" module as an example.

<details>
<summary><b>Click to expand full workflow</b></summary>

<br>

### Step 1: Register Route

Add to `src/routes/modules/platform.tsx`:

```tsx
{
  path: '/notice',
  element: <NoticePage />,
}
```

---

### Step 2: Add Menu

Add to `src/constants/platformMenu.tsx`:

```tsx
{
  key: 'notice',
  label: 'Notice Management',
  icon: <NotificationOutlined />,
  path: '/notice',
}
```

---

### Step 3: Create Page Component

Create `src/pages/Platform/Notice/index.tsx`:

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
    { title: 'Title', dataIndex: 'title' },
    {
      title: 'Status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: { 1: { text: 'Published', status: 'Success' }, 0: { text: 'Draft', status: 'Default' } },
    },
    { title: 'Created At', dataIndex: 'createdAt', search: false },
    {
      title: 'Actions',
      search: false,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => { setCurrentRecord(record); setModalOpen(true) }}>Edit</Button>
          <Popconfirm title="Confirm delete?" onConfirm={() => remove.mutate(record.id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <PageContainer
      title="Notice Management"
      extra={<Button type="primary" onClick={() => { setCurrentRecord(undefined); setModalOpen(true) }}>Add Notice</Button>}
    >
      <ProTable<Notice>
        actionRef={actionRef}
        columns={columns}
        request={getNoticeList}
      />

      <FormContainer
        title={currentRecord ? 'Edit Notice' : 'Add Notice'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onFinish={async (values) => {
          await submit.mutateAsync({ record: currentRecord, values })
          return true
        }}
        initialValues={currentRecord}
      >
        <ProFormText name="title" label="Title" rules={[{ required: true }]} />
        <ProFormTextArea name="content" label="Content" colProps={{ span: 24 }} />
        <ProFormSelect
          name="status"
          label="Status"
          initialValue={0}
          options={[{ label: 'Draft', value: 0 }, { label: 'Published', value: 1 }]}
        />
      </FormContainer>
    </PageContainer>
  )
}
```

---

### Step 4: Define API

Create `src/api/modules/platform/notice.ts`:

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

### Step 5: Create Business Hook (Optional)

If you need to encapsulate reusable logic, create `src/pages/Platform/Notice/hooks/useNotice.ts`:

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
      message.success(record ? 'Updated successfully' : 'Created successfully')
      actionRef.current?.reload()
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteNotice(id),
    onSuccess: () => {
      message.success('Deleted successfully')
      actionRef.current?.reload()
    },
  })

  return { submit, remove }
}
```

---

### Step 6: Register QueryKey (Optional)

If you need to use `useQuery` for data caching, add to `src/hooks/query/keys.ts`:

```typescript
export const queryKeys = {
  // ...existing keys
  platform: {
    // ...existing keys
    notices: (params?: Record<string, any>) => ['platform', 'notices', params] as const,
  },
}
```

---

### Step 7: Add Mock Data

Create `mock/platform/notice.ts`:

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
    response: () => ({ code: 200, message: 'Created successfully' }),
  },
  {
    url: /\/api\/admin\/notice\/\d+/,
    method: 'PUT',
    response: () => ({ code: 200, message: 'Updated successfully' }),
  },
  {
    url: /\/api\/admin\/notice\/\d+/,
    method: 'DELETE',
    response: () => ({ code: 200, message: 'Deleted successfully' }),
  },
])
```

Then import in `mock/index.ts`:

```typescript
import './platform/notice'
```

---

### Done! Directory structure:

```
src/pages/Platform/Notice/
├── index.tsx              # Main page component
└── hooks/
    └── useNotice.ts       # Business Hook (mutations)
```

**The entire process requires only 4-6 steps (depending on your needs), without modifying any framework code.**

</details>

<br>

---

## 🤝 Contributing

We welcome all forms of contribution!

### How to Contribute

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Standards

- **Code Style**: Follow ESLint rules, run `npm run lint` to check
- **Commit Convention**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
  ```
  feat: New feature
  fix: Bug fix
  docs: Documentation update
  style: Code formatting
  refactor: Code refactoring
  perf: Performance optimization
  test: Test related
  chore: Build/toolchain related
  ```
- **Naming Convention**:
  - Component files: PascalCase (e.g., `UserTable.tsx`)
  - Utility functions: camelCase (e.g., `formatDate.ts`)
  - Constant files: camelCase (e.g., `platformMenu.tsx`)
- **Code Review**: All PRs require approval from at least one maintainer

See [Contributing Guide](CONTRIBUTING.en.md) for details

<br>

---

## 📄 License

This project is licensed under the [MIT](LICENSE) License.

<br>

---

<div align="center">

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=zhangzhaowei865700/ZX-Admin&type=Date)](https://star-history.com/#zhangzhaowei865700/ZX-Admin&Date)

<br>

## 💖 Support the Project

If this project has been helpful to you, please give it a Star ⭐

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

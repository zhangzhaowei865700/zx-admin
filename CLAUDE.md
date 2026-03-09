# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000 with mock API
npm run build            # Build for production (runs tsc + vite build)
npm run build:demo       # Build demo version
npm run preview          # Preview production build
npm run preview:demo     # Build and preview demo version
npm run lint             # Run ESLint checks

# No test commands available - tests not configured
```

## Architecture Overview

### Multi-Platform Multi-Tenant System

This is a two-tier admin system supporting both **platform-level** (管理所有租户) and **tenant-level** (租户自身业务) management:

- **Platform Level**: Route prefix `/`, layout `AppLayout`
  - Manages all tenants, system users, roles, menus, messages
  - Platform admin perspective

- **Tenant Level**: Route prefix `/tenant-admin/:tenantId`, layout `TenantLayout`
  - Tenant-specific operations (orders, products, settings)
  - Tenant admin perspective

Routes are defined in `src/routes/modules/platform.tsx` and `src/routes/modules/tenant.tsx`.

### Two-Step Login Flow

The authentication system uses a unique two-step process:

1. **Pre-login** (`preLogin` API): User submits credentials, backend returns available platforms
2. **Platform selection**: If multiple platforms exist, user selects one; if single platform, auto-proceed
3. **Platform login** (`loginPlatform` API): Complete login with selected platform, receive token

After login, users can switch platforms via `/login?switch=1` query parameter (see `src/routes/Guard.tsx:16-22`).

### State Management (Zustand)

Three main stores with different persistence strategies:

**`useUserStore`** (`src/stores/useUserStore.ts`):
- Persists: `token`, `saasName`
- Runtime only: `userInfo`, `permissions`
- Critical for auth state management

**`useAppStore`** (`src/stores/useAppStore.ts`):
- Persists all UI settings (theme, layout, tabs, etc.)
- Uses View Transition API for smooth dark mode transitions (see `withViewTransition` wrapper)
- Manages multi-tab navigation state (`tabs[]`, `activeTabKey`)

**`useMessageStore`** (`src/stores/useMessageStore.ts`):
- Manages message notifications and unread counts

### Request Security

All API requests (`src/api/request.ts`) automatically include:

- **Signature headers**: `X-App-Key`, `X-Timestamp`, `X-Nonce`, `X-Sign` (generated via `src/utils/sign.ts`)
- **Optional AES encryption**: Controlled by `VITE_CRYPTO_ENABLED` env var (uses `src/utils/crypto.ts`)
- **Token authentication**: Bearer token in `Authorization` header
- **401 handling**: Auto-logout and redirect to login

### Cross-Tab Synchronization

The system uses `BroadcastChannel` (`src/utils/authChannel.ts`) to sync authentication events across browser tabs:

- `logout` event: When user logs out in one tab, all tabs redirect to login
- `switchPlatform` event: When switching platforms, all tabs refresh to sync state

Event listeners are typically set up in layout components.

### Internationalization (i18n)

Supports three languages: `zh-CN`, `en-US`, `ja-JP`

- Files organized by namespace in `src/locales/{locale}/{namespace}.json`
- Namespaces: `common`, `menu`, `login`, `system`, `tenant`, `order`, `product`, `settings`, `message`
- Usage: `i18n.t('namespace:key')` or `t('namespace:key')` from `useTranslation()`
- Language preference stored in `localStorage['app-locale']`
- Auto-syncs with dayjs locale

## Key Conventions

### Path Aliases

- `@/` → `src/` (configured in `tsconfig.json` and `vite.config.ts`)

### Page Module Structure

Standard structure for business pages:

```
pages/ModuleName/
├── index.tsx              # Main page component
├── components/            # Page-private components
│   ├── ModuleTable.tsx
│   └── index.ts
└── hooks/                 # Page-private hooks
    ├── useModule.ts       # Data fetching with React Query
    └── index.ts
```

### Form Configuration Hierarchy

Form column layout has three levels of control (priority high to low):

1. **Field-level**: Individual field width via `colProps={{ span: 24 }}`
2. **Page-level**: Fixed layout per page via `gridProps` constant
3. **Global**: User preference via Settings Drawer (`formColumns` in `useAppStore`)

Example:
```tsx
const { formColumns } = useAppStore()
const gridProps = formColumns === 2 ? { grid: true, colProps: { span: 12 } } : {}

<FormContainer {...gridProps}>
  <ProFormText name="name" label="名称" />
  <ProFormTextArea name="desc" label="描述" colProps={{ span: 24 }} /> {/* Always full width */}
</FormContainer>
```

### Environment Variables

Development environment uses mock by default:

```bash
VITE_API_BASE_URL=           # Empty = use vite-plugin-mock
VITE_CRYPTO_ENABLED=false    # Enable AES encryption for API requests
VITE_APP_KEY=merchant-admin  # Used in request signature
VITE_APP_SECRET=dev-secret   # Used in request signature
```

For real API, set `VITE_API_BASE_URL` to backend URL.

### Menu Configuration

Menus are defined as static config in constants:

- Platform menu: `src/constants/platformMenu.tsx`
- Tenant menu: `src/constants/tenantMenu.tsx`

Menu items define `key`, `label`, `icon`, `path`, and optional `children`.

### Settings Persistence

All user preferences are auto-saved to `localStorage['app-settings']` via Zustand persist middleware. Includes theme, layout mode, sidebar width, tab behavior, table preferences, etc.

Default settings loaded from `src/config/defaultSettings.json`.

## Mock Data

Mock server enabled in development via `vite-plugin-mock`. Mock handlers in `mock/` directory (not `src/mock/`):

- Uses `mockjs` for data generation
- Mock files imported in `mock/index.ts`
- Supports dynamic routes and RESTful CRUD patterns

## Important Implementation Details

### Route Guards (`src/routes/Guard.tsx`)

- Redirects unauthenticated users to `/login`
- Allows authenticated users to access `/login?switch=1` (platform switching)
- Permission check: Empty `permissions[]` = full access (backend compatibility)
- Whitelist: `/login`, `/403`, `/404`

### Multi-Tab Management

Tabs automatically managed by `useAppStore`:

- `addTab()`: Adds new tab, respects `maxTabs` limit (closes oldest closable tab)
- `removeTab()`: Removes tab and adjusts active tab if needed
- `removeOtherTabs()`: Can scope to specific route prefix (e.g., only close platform tabs)
- `removeAllTabs()`: Can preserve tabs from other backend (platform vs tenant)

### Theme Transitions

Dark mode and theme changes use View Transition API for smooth visual transitions:

```ts
document.startViewTransition(() => {
  // State update that changes theme
})
```

This prevents the harsh black/white flash during theme switches (see `useAppStore.ts:214-228`).

### Lock Screen Feature

Users can lock the screen via Header action:

- Sets password in modal, enables lock screen overlay
- Shows clock and user info while locked
- Unlocks with password verification
- State: `isLocked`, `lockPassword` in `useAppStore`

### Message Notifications

`NotificationBell` component in Header:

- Polls unread count every 30 seconds
- Shows badge with count
- Popover displays recent messages
- Clicking item navigates to message detail and marks as read


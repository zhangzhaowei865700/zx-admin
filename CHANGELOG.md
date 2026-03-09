# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2024-01-01

### Added

- Initial release
- Multi-tenant architecture with platform-level and tenant-level management
- Two-step login flow (pre-login → platform selection → platform login)
- Role-based permissions with menu and button-level access control
- Dark mode support with View Transition API
- Multi-tab navigation
- Layout customization (sidebar, header, footer, breadcrumbs)
- Internationalization (Chinese, English, Japanese)
- Request signing and optional AES encryption
- Slide captcha for login security
- Built-in mock server for development
- Export functionality for tables
- Lock screen feature
- Menu search (Ctrl+K)
- Fullscreen toggle
- Message notification system

### Tech Stack

- React 18 + TypeScript
- Vite 5
- Ant Design 5 + ProComponents
- Zustand (state management)
- Axios + TanStack React Query
- React Hook Form
- React Router DOM 6
- react-i18next

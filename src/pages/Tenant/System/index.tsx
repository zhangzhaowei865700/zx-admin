import { Outlet } from 'react-router-dom'

export const TenantSystemPage: React.FC = () => {
  return <Outlet />
}

export { TenantUserPage } from './User'
export { TenantRolePage } from './Role'
export { TenantMenuPage } from './Menu'

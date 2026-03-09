import { Outlet } from 'react-router-dom'

export const SystemPage: React.FC = () => {
  return <Outlet />
}

export { UserPage } from './User'
export { RolePage } from './Role'
export { MenuPage } from './Menu'

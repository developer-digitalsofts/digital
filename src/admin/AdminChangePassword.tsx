import { Navigate } from 'react-router-dom'

/** Legacy route — change password lives on Admin Profile. */
export function AdminChangePassword() {
  return <Navigate to="/admin/profile#change-password" replace />
}

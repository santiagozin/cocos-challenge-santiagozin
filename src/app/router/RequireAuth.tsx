import type { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AUTH_STATUS } from '../store/auth/authSlice'
import { useAppSelector } from '../store/hooks'

export function RequireAuth(): ReactElement {
  const status = useAppSelector((state) => state.auth.status)

  if (status !== AUTH_STATUS.authenticated) {
    return <Navigate to="/ingresar" replace />
  }

  return <Outlet />
}

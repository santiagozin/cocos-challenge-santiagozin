import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/app/router/paths'
import { AUTH_STATUS } from '@/app/store/auth/authSlice'
import { useAppSelector } from '@/app/store/hooks'
import { LoginForm } from '../components/loginForm/LoginForm'
import './LoginPage.scss'

export function LoginPage(): ReactElement {
  const status = useAppSelector((state) => state.auth.status)

  if (status === AUTH_STATUS.authenticated) {
    return <Navigate to={ROUTES.instruments} replace />
  }

  return (
    <div className="login">
      <main className="login__main">
        <div className="login__card">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
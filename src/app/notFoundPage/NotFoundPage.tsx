import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { AUTH_STATUS } from '@/app/store/auth/authSlice'
import { useAppSelector } from '@/app/store/hooks'
import './NotFoundPage.scss'

export function NotFoundPage(): ReactElement {
  const isAuthenticated = useAppSelector((state) => state.auth.status === AUTH_STATUS.authenticated)

  return (
    <div className="not-found">
      <header className="not-found__bar">
        <p className="not-found__brand">Cocos</p>
      </header>
      <main className="not-found__main">
        <p className="not-found__code">404</p>
        <h1>No encontramos esta página</h1>
        <p className="not-found__text">La dirección no existe o dejó de estar disponible.</p>
        <Link className="not-found__action" to={isAuthenticated ? '/' : '/ingresar'}>
          {isAuthenticated ? 'Ir a instrumentos' : 'Ingresar'}
        </Link>
      </main>
    </div>
  )
}

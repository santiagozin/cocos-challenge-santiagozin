import { useQueryClient } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppFooter } from '../footer/AppFooter'
import { AppHeader } from '../header/AppHeader'
import { logout } from '../store/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { ROUTES } from '../router/paths'
import './AppLayout.scss'

export function AppLayout(): ReactElement {
  const username = useAppSelector((state) =>
    state.auth.status === 'authenticated' ? state.auth.username : '',
  )
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  function onReloadApp(): void {
    void queryClient.invalidateQueries()
    navigate(ROUTES.instruments)
  }

  function onLogout(): void {
    dispatch(logout())
    queryClient.clear()
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>
      <header className="app-header">
        <AppHeader username={username} onReload={onReloadApp} onLogout={onLogout} />
      </header>
      <main className="app-main" id="contenido-principal" tabIndex={-1}>
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}

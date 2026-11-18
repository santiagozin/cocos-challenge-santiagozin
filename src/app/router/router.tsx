import type { ReactElement } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/app/auth'
import { InstrumentsPage } from '@/features/instruments'
import { PortfolioPage } from '@/features/portfolio'
import { AppLayout } from '../layout/AppLayout'
import { NotFoundPage } from '@/app/notFoundPage/NotFoundPage'
import { RequireAuth } from './RequireAuth'
import { ROUTES } from './paths'

export function AppRouter(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ingresar" element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to={ROUTES.instruments} replace />} />
            <Route path="instruments" element={<InstrumentsPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

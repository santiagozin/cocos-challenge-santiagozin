import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DEMO_USERNAME } from '@/app/auth'
import { login } from '../store/auth/authSlice'
import { createAppStore } from '../store/store'
import { RequireAuth } from './RequireAuth'

function renderGuard(store: ReturnType<typeof createAppStore>): void {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route index element={<p>Privado</p>} />
          </Route>
          <Route path="/ingresar" element={<p>Login</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('RequireAuth', () => {
  it('redirects to the login page without a session', () => {
    renderGuard(createAppStore())

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.queryByText('Privado')).not.toBeInTheDocument()
  })

  it('renders the private route when the session is authenticated', () => {
    const store = createAppStore()
    store.dispatch(login({ username: DEMO_USERNAME }))
    renderGuard(store)

    expect(screen.getByText('Privado')).toBeInTheDocument()
  })
})

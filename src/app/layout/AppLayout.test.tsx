import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DEMO_USERNAME } from '@/app/auth'
import { AUTH_STATUS, login } from '../store/auth/authSlice'
import { createAppStore } from '../store/store'
import { AppLayout } from './AppLayout'

function renderLayout(
  initialEntry = '/',
  store = createAppStore(),
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  }),
): { store: ReturnType<typeof createAppStore>; queryClient: QueryClient } {
  store.dispatch(login({ username: DEMO_USERNAME }))

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<p>Inicio</p>} />
              <Route path="instruments" element={<p>Listado</p>} />
              <Route path="portfolio" element={<p>Tenencias</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>,
  )

  return { store, queryClient }
}

describe('AppLayout', () => {
  it('reloads market data and returns home from the brand logo', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderLayout('/portfolio')
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')

    expect(screen.getByText('Tenencias')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Cocos' }))

    expect(invalidate).toHaveBeenCalledOnce()
    expect(screen.getByText('Listado')).toBeInTheDocument()
  })

  it('renders the site footer with navigation', () => {
    renderLayout('/instruments')

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Enlaces del sitio' })).toBeInTheDocument()
  })

  it('logs out from the user menu and clears cached queries', async () => {
    const user = userEvent.setup()
    const { store, queryClient } = renderLayout()
    const clear = vi.spyOn(queryClient, 'clear')

    await user.click(screen.getByRole('button', { name: 'Menú de usuario' }))
    await user.click(screen.getByRole('menuitem', { name: 'Salir' }))

    expect(store.getState().auth.status).toBe(AUTH_STATUS.anonymous)
    expect(clear).toHaveBeenCalledOnce()
  })
})

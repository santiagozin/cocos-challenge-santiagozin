import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppHeader } from './AppHeader.tsx'

function renderHeader(): ReturnType<typeof render> {
  return render(
    <MemoryRouter>
      <AppHeader username="demo" onReload={vi.fn()} onLogout={vi.fn()} />
    </MemoryRouter>,
  )
}

describe('AppHeader', () => {
  it('keeps the navigation menu collapsed until the hamburger is opened', () => {
    renderHeader()

    const menuButton = screen.getByRole('button', { name: 'Menú de navegación' })

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('navigation', { name: 'Principal' })).not.toHaveClass(
      'app-header__nav--open',
    )
  })

  it('opens and closes the mobile navigation from the hamburger button', async () => {
    const user = userEvent.setup()
    renderHeader()

    const menuButton = screen.getByRole('button', { name: 'Menú de navegación' })

    await user.click(menuButton)

    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: 'Principal' })).toHaveClass(
      'app-header__nav--open',
    )

    await user.click(menuButton)

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the navigation when Escape is pressed', async () => {
    const user = userEvent.setup()
    renderHeader()

    const menuButton = screen.getByRole('button', { name: 'Menú de navegación' })
    await user.click(menuButton)
    await user.keyboard('{Escape}')

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveFocus()
  })

  it('closes the navigation after choosing a destination', async () => {
    const user = userEvent.setup()
    renderHeader()

    await user.click(screen.getByRole('button', { name: 'Menú de navegación' }))
    await user.click(screen.getByRole('link', { name: 'Portfolio' }))

    expect(screen.getByRole('button', { name: 'Menú de navegación' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})

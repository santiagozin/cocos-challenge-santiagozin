import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppUserMenu } from './AppUserMenu'

describe('AppUserMenu', () => {
  it('keeps logout hidden until the user menu is opened', () => {
    render(<AppUserMenu username="demo" onLogout={vi.fn()} />)

    expect(screen.queryByRole('menuitem', { name: 'Salir' })).not.toBeInTheDocument()
  })

  it('shows the username and logout action inside the menu', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()

    render(<AppUserMenu username="demo" onLogout={onLogout} />)

    await user.click(screen.getByRole('button', { name: 'Menú de usuario' }))

    expect(screen.getByText('demo')).toBeInTheDocument()
    await user.click(screen.getByRole('menuitem', { name: 'Salir' }))

    expect(onLogout).toHaveBeenCalledOnce()
  })

  it('closes the menu when Escape is pressed', async () => {
    const user = userEvent.setup()

    render(<AppUserMenu username="demo" onLogout={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Menú de usuario' }))
    expect(screen.getByRole('menu', { name: 'Cuenta' })).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu', { name: 'Cuenta' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Menú de usuario' })).toHaveFocus()
  })
})

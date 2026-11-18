import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Modal open title="Orden" onClose={onClose}>
        <p>Detalle</p>
      </Modal>,
    )

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes when the backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Modal open title="Orden" onClose={onClose}>
        <p>Detalle</p>
      </Modal>,
    )

    await user.click(screen.getByRole('button', { name: 'Cerrar diálogo' }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})
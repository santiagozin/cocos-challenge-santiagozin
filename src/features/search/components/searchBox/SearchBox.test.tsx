import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBox } from './SearchBox'

describe('SearchBox', () => {
  it('lets the user type while the catalog is idle', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<SearchBox value="" onChange={onChange} />)

    await user.type(screen.getByRole('searchbox', { name: 'Buscar por ticker o nombre' }), 'GGAL')

    expect(onChange).toHaveBeenCalled()
    expect(screen.queryByRole('status', { name: 'Buscando' })).not.toBeInTheDocument()
  })

  it('shows moving dots and disables the field while a search is in flight', () => {
    const onChange = vi.fn()

    render(<SearchBox value="GGAL" onChange={onChange} isSearching />)

    expect(screen.getByRole('searchbox', { name: 'Buscar por ticker o nombre' })).toBeDisabled()
    expect(screen.getByRole('status', { name: 'Buscando' })).toBeInTheDocument()
  })
})

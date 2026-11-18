import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ALL_INSTRUMENT_TYPES } from '../../domain/instrumentTypeFilter'
import { InstrumentTypeFilters } from './InstrumentTypeFilters'

describe('InstrumentTypeFilters', () => {
  it('hides the toolbar when there is not enough type variety', () => {
    const { rerender } = render(
      <InstrumentTypeFilters
        types={[]}
        selected={ALL_INSTRUMENT_TYPES}
        onSelect={vi.fn()}
        isLoading={false}
      />,
    )

    expect(screen.queryByRole('toolbar', { name: 'Filtrar por tipo' })).not.toBeInTheDocument()

    rerender(
      <InstrumentTypeFilters
        types={['ACCIONES']}
        selected={ALL_INSTRUMENT_TYPES}
        onSelect={vi.fn()}
        isLoading={false}
      />,
    )

    expect(screen.queryByRole('toolbar', { name: 'Filtrar por tipo' })).not.toBeInTheDocument()
  })

  it('shows a skeleton while types are loading', () => {
    render(
      <InstrumentTypeFilters
        types={[]}
        selected={ALL_INSTRUMENT_TYPES}
        onSelect={vi.fn()}
        isLoading
      />,
    )

    expect(screen.getByRole('status', { name: 'Cargando filtros' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Todos' })).not.toBeInTheDocument()
  })

  it('lets the user pick a type after the catalog loads', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <InstrumentTypeFilters
        types={['ACCIONES', 'MONEDA']}
        selected={ALL_INSTRUMENT_TYPES}
        onSelect={onSelect}
        isLoading={false}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Acciones' }))

    expect(onSelect).toHaveBeenCalledWith('ACCIONES')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PortfolioPage } from './PortfolioPage'

vi.mock('../hooks/usePortfolioPage', () => ({
  usePortfolioPage: vi.fn(),
}))

vi.mock('@/features/orders/hooks/useOrders', () => ({
  orderKeys: { all: ['orders'] as const },
  useOrders: vi.fn(() => ({
    data: [],
    isPending: false,
    isError: false,
    isSuccess: true,
  })),
}))

import { usePortfolioPage } from '../hooks/usePortfolioPage'

describe('PortfolioPage', () => {
  it('shows skeleton while portfolio is loading', () => {
    vi.mocked(usePortfolioPage).mockReturnValue({
      summary: null,
      holdings: [],
      isPending: true,
      isError: false,
      isEmpty: false,
    })

    render(<PortfolioPage />)

    expect(screen.getByLabelText(/cargando resumen de saldos/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cargando posiciones del portfolio/i)).toBeInTheDocument()
    expect(screen.queryByText(/cargando portafolio/i)).not.toBeInTheDocument()
  })
})
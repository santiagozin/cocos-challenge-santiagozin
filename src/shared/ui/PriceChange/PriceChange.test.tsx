import { render, screen } from '@testing-library/react'
import { formatSignedPercent } from '@/shared/lib/format'
import { PriceChange } from './PriceChange'

describe('PriceChange', () => {
  it('shows a plus sign when the percent rises', () => {
    render(<PriceChange amount={100} percent={1.25} />)

    expect(screen.getByText(formatSignedPercent(1.25))).toHaveTextContent('+')
  })

  it('shows a minus sign when the percent falls', () => {
    render(<PriceChange amount={100} percent={-1.25} />)

    expect(screen.getByText(formatSignedPercent(-1.25))).toHaveTextContent(/[-−]/)
  })
})

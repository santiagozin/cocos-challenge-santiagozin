import { describe, expect, it } from 'vitest'
import type { Holding } from './portfolio.types'
import { summarizePortfolio } from './portfolioSummary'

const holdings: readonly Holding[] = [
  {
    instrument_id: 1,
    ticker: 'GGAL',
    quantity: 10,
    last_price: 100,
    close_price: 95,
    avg_cost_price: 90,
  },
]

describe('summarizePortfolio', () => {
  it('aggregates cash, holdings value, patrimony and gain', () => {
    const summary = summarizePortfolio(500, holdings)

    expect(summary.cash).toBe(500)
    expect(summary.holdingsValue).toBe(1000)
    expect(summary.totalPatrimony).toBe(1500)
    expect(summary.totalGain).toBe(100)
  })

  it('ignores zero-quantity rows so gain stays unset with only cash', () => {
    const summary = summarizePortfolio(1_000_000, [
      {
        instrument_id: 99,
        ticker: 'GGAL',
        quantity: 0,
        last_price: 1000,
        close_price: 950,
        avg_cost_price: 800,
      },
    ])

    expect(summary.holdingsValue).toBe(0)
    expect(summary.totalPatrimony).toBe(1_000_000)
    expect(summary.totalGain).toBeNull()
  })
})
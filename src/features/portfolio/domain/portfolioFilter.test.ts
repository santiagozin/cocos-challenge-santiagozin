import { describe, expect, it } from 'vitest'
import type { Holding } from './portfolio.types'
import { filterHoldingsByQuery } from './portfolioFilter'

const sample: readonly Holding[] = [
  {
    instrument_id: 1,
    ticker: 'GGAL',
    quantity: 10,
    last_price: 100,
    close_price: 95,
    avg_cost_price: 90,
  },
  {
    instrument_id: 2,
    ticker: 'YPFD',
    quantity: 5,
    last_price: 200,
    close_price: 198,
    avg_cost_price: 180,
  },
]

describe('filterHoldingsByQuery', () => {
  it('returns all holdings when query is empty', () => {
    expect(filterHoldingsByQuery(sample, '')).toEqual(sample)
    expect(filterHoldingsByQuery(sample, '   ')).toEqual(sample)
  })

  it('filters by ticker substring case-insensitively', () => {
    expect(filterHoldingsByQuery(sample, 'gga')).toHaveLength(1)
    expect(filterHoldingsByQuery(sample, 'gga')[0]?.ticker).toBe('GGAL')
  })
})
import { describe, expect, it } from 'vitest'
import type { Holding } from './portfolio.types'
import { holdingToInstrument } from './holdingToInstrument'

const holding: Holding = {
  instrument_id: 1,
  ticker: 'DYCA',
  quantity: 11,
  last_price: 45.72,
  close_price: 50.07,
  avg_cost_price: 45.72,
}

describe('holdingToInstrument', () => {
  it('maps holding fields to an order instrument', () => {
    expect(holdingToInstrument(holding)).toEqual({
      id: 1,
      ticker: 'DYCA',
      name: 'DYCA',
      type: '',
      last_price: 45.72,
      close_price: 50.07,
    })
  })
})
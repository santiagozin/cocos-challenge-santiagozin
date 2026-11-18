import { describe, expect, it } from 'vitest'
import {
  holdingPortfolioPercent,
  marketValue,
  positionGain,
  totalReturnPercent,
} from './portfolio.calculations'

describe('holdingPortfolioPercent', () => {
  it('returns share of total patrimony', () => {
    expect(holdingPortfolioPercent(2500, 10000)).toBe(25)
  })

  it('returns null when total is zero', () => {
    expect(holdingPortfolioPercent(100, 0)).toBeNull()
  })
})

describe('portfolio spec calculations', () => {
  it('market value uses quantity * last_price', () => {
    expect(marketValue(11, 45.72)).toBeCloseTo(502.92, 2)
  })

  it('gain uses avg cost price in absolute ars', () => {
    expect(positionGain(10, 100, 90)).toBe(100)
  })

  it('return percent uses avg cost price', () => {
    expect(totalReturnPercent(100, 90)).toBeCloseTo(11.111, 2)
  })
})
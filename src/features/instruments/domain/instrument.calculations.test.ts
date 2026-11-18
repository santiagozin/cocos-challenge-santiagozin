import { priceReturnPercent } from './instrument.calculations'

describe('priceReturnPercent', () => {
  it('returns the percent change from the close price', () => {
    expect(priceReturnPercent(110, 100)).toBe(10)
    expect(priceReturnPercent(90, 100)).toBe(-10)
  })

  it('returns null when the close price cannot be used as a divisor', () => {
    expect(priceReturnPercent(110, 0)).toBeNull()
    expect(priceReturnPercent(Number.NaN, 100)).toBeNull()
  })
})

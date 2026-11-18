import {
  maxBuyShares,
  orderNotional,
  orderRejectionMessage,
  uninvestedAmount,
  wholeSharesForAmount,
} from './order.calculations'

describe('wholeSharesForAmount', () => {
  it('returns the maximum whole shares the amount can buy', () => {
    expect(wholeSharesForAmount(100, 45.72)).toBe(2)
    expect(wholeSharesForAmount(45.72, 45.72)).toBe(1)
  })

  it('returns zero when the amount does not cover one share', () => {
    expect(wholeSharesForAmount(10, 45.72)).toBe(0)
  })

  it('returns null when the amount or the price cannot be used', () => {
    expect(wholeSharesForAmount(0, 45.72)).toBeNull()
    expect(wholeSharesForAmount(100, 0)).toBeNull()
  })
})

describe('orderRejectionMessage', () => {
  it('explains a known market rejection', () => {
    expect(orderRejectionMessage('Insufficient cash')).toContain('saldo disponible')
  })

  it('hides an unknown API message', () => {
    expect(orderRejectionMessage('internal stack /etc/passwd')).toBeNull()
    expect(orderRejectionMessage(undefined)).toBeNull()
  })
})

describe('order preview', () => {
  it('prices whole shares and leaves the remainder uninvested', () => {
    expect(orderNotional(2, 45.72)).toBeCloseTo(91.44)
    expect(uninvestedAmount(100, 2, 45.72)).toBeCloseTo(8.56)
  })

  it('returns null when the preview cannot be priced', () => {
    expect(orderNotional(0, 45.72)).toBeNull()
    expect(uninvestedAmount(10, 2, 45.72)).toBeNull()
  })

  it('stays exact on values that confuse binary floats', () => {
    expect(orderNotional(3, 19.99)).toBe(59.97)
    const shares = maxBuyShares(100, 19.99)
    expect(shares).toBe(5)
    expect(uninvestedAmount(100, shares, 19.99)).toBe(0.05)
  })
})

describe('maxBuyShares', () => {
  it('matches wholeSharesForAmount for valid cash', () => {
    const shares = maxBuyShares(100, 45.72)
    expect(shares).toBe(wholeSharesForAmount(100, 45.72))
  })
})

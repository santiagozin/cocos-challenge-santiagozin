import { floorDivideCents, fromArsCents, multiplyQuantityByPriceCents, toArsCents } from './money'

describe('toArsCents', () => {
  it('rounds pesos to the nearest cent', () => {
    expect(toArsCents(45.72)).toBe(4572)
    expect(toArsCents(0.005)).toBe(1)
    expect(toArsCents(0.004)).toBeNull()
  })

  it('rejects invalid amounts', () => {
    expect(toArsCents(0)).toBeNull()
    expect(toArsCents(Number.NaN)).toBeNull()
  })
})

describe('fromArsCents', () => {
  it('converts integer cents back to pesos', () => {
    expect(fromArsCents(4572)).toBe(45.72)
    expect(fromArsCents(10000)).toBe(100)
  })
})

describe('floorDivideCents', () => {
  it('counts whole units without floating-point drift', () => {
    expect(floorDivideCents(10000, 4572)).toBe(2)
    expect(floorDivideCents(4572, 4572)).toBe(1)
    expect(floorDivideCents(1000, 4572)).toBe(0)
  })
})

describe('multiplyQuantityByPriceCents', () => {
  it('prices a whole quantity in cents', () => {
    expect(multiplyQuantityByPriceCents(2, 4572)).toBe(9144)
  })
})
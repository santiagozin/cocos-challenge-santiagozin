import type { Instrument } from './instrument.types'
import { isTradableInstrument } from './instrumentTradability'

const base: Instrument = {
  id: 1,
  ticker: 'DYCA',
  name: 'Dycasa',
  type: 'ACCIONES',
  last_price: 45,
  close_price: 40,
}

describe('isTradableInstrument', () => {
  it('allows common security types', () => {
    expect(isTradableInstrument(base)).toBe(true)
  })

  it('blocks settlement currency rows', () => {
    expect(isTradableInstrument({ ...base, id: 26, ticker: 'ARS', type: 'MONEDA' })).toBe(false)
  })
})
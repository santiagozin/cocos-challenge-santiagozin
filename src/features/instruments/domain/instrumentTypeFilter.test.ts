import type { Instrument } from './instrument.types'
import { collectInstrumentTypes, filterInstrumentsByType } from './instrumentTypeFilter'

const base: Instrument = {
  id: 1,
  ticker: 'DYCA',
  name: 'Dycasa',
  type: 'ACCIONES',
  last_price: 1,
  close_price: 1,
}

describe('instrumentTypeFilter', () => {
  it('collects unique sorted types', () => {
    expect(
      collectInstrumentTypes([base, { ...base, id: 2, type: 'MONEDA' }, { ...base, id: 3 }]),
    ).toEqual(['ACCIONES', 'MONEDA'])
  })

  it('filters by type', () => {
    const list = [base, { ...base, id: 2, type: 'MONEDA', ticker: 'USD' }]
    expect(filterInstrumentsByType(list, 'MONEDA')).toHaveLength(1)
    expect(filterInstrumentsByType(list, 'ALL')).toHaveLength(2)
  })
})
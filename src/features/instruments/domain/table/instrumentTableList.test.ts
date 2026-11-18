import type { Instrument } from '../instrument.types'
import {
  buildTablePaginationItems,
  INSTRUMENTS_TABLE_PAGE_SIZE,
  paginateInstruments,
  sortInstruments,
  toggleInstrumentTableSort,
} from './instrumentTableList'

const a: Instrument = {
  id: 1,
  ticker: 'AAA',
  name: 'Alpha',
  type: 'ACCIONES',
  last_price: 10,
  close_price: 8,
}
const b: Instrument = {
  id: 2,
  ticker: 'BBB',
  name: 'Bravo',
  type: 'ACCIONES',
  last_price: 20,
  close_price: 20,
}

describe('instrumentTableList', () => {
  it('sorts by price descending', () => {
    const sorted = sortInstruments([a, b], { column: 'price', direction: 'desc' })
    expect(sorted.map((item) => item.ticker)).toEqual(['BBB', 'AAA'])
  })

  it('paginates items', () => {
    const list = Array.from({ length: 12 }, (_, index) => ({ ...a, id: index, ticker: `T${index}` }))
    expect(paginateInstruments(list, 2, INSTRUMENTS_TABLE_PAGE_SIZE)).toHaveLength(2)
  })

  it('toggles sort direction on same column', () => {
    const first = toggleInstrumentTableSort({ column: 'asset', direction: 'asc' }, 'asset')
    expect(first.direction).toBe('desc')
  })

  it('lists every pagination page when there are five or fewer', () => {
    expect(buildTablePaginationItems(1, 3)).toEqual([1, 2, 3])
  })

  it('inserts pagination ellipsis for long page counts', () => {
    expect(buildTablePaginationItems(1, 42)).toEqual([1, 2, 'ellipsis', 42])
    expect(buildTablePaginationItems(2, 42)).toEqual([1, 2, 3, 'ellipsis', 42])
  })
})
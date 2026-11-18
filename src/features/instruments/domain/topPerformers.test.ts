import type { Instrument } from './instrument.types'
import { INSTRUMENTS_TOP_WINNERS_LIMIT, pickTopWinners } from './topPerformers'

function instrument(id: number, ticker: string, last: number, close: number): Instrument {
  return {
    id,
    ticker,
    name: ticker,
    type: 'ACCIONES',
    last_price: last,
    close_price: close,
  }
}

describe('pickTopWinners', () => {
  it('returns only positive performers sorted by return', () => {
    const list = [
      instrument(1, 'LOW', 10, 10),
      instrument(2, 'MID', 11, 10),
      instrument(3, 'HIGH', 15, 10),
      instrument(4, 'NEG', 9, 10),
    ]
    expect(pickTopWinners(list, 2)).toEqual([
      { instrument: list[2], returnPercent: 50 },
      { instrument: list[1], returnPercent: 10 },
    ])
  })

  it('respects the default limit', () => {
    const list = Array.from({ length: 8 }, (_, index) =>
      instrument(index, `T${index}`, 10 + index, 10),
    )
    expect(pickTopWinners(list)).toHaveLength(INSTRUMENTS_TOP_WINNERS_LIMIT)
  })
})
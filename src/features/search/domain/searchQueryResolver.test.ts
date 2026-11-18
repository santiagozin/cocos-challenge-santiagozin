import type { Instrument } from '@/features/instruments/domain/instrument.types'
import { resolveTickerCandidates } from './searchQueryResolver'

const sample: Instrument = {
  id: 1,
  ticker: 'DYCA',
  name: 'Dycasa S.A.',
  type: 'ACCIONES',
  last_price: 45.72,
  close_price: 50.07,
}

describe('searchQueryResolver', () => {
  it('resolves tickers from name matches', () => {
    expect(resolveTickerCandidates('dycasa', [sample])).toEqual(['DYCA'])
  })

  it('ranks ticker prefix matches first', () => {
    const list = [
      sample,
      { ...sample, id: 2, ticker: 'TECO2', name: 'Telecom' },
      { ...sample, id: 3, ticker: 'PATA', name: 'Patagonia' },
    ]
    expect(resolveTickerCandidates('te', list)).toEqual(['TECO2'])
  })

  it('respects maxCandidates', () => {
    const list = Array.from({ length: 8 }, (_, index) => ({
      ...sample,
      id: index + 1,
      ticker: `T${index}`,
      name: `Alpha ${index}`,
    }))
    expect(resolveTickerCandidates('alpha', list, { maxCandidates: 2 })).toHaveLength(2)
  })
})
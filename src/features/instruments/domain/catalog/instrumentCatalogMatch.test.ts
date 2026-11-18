import type { Instrument } from '../instrument.types'
import {
  catalogInstrumentMatchesQuery,
  compareInstrumentCatalogRelevance,
  tickerMatchScore,
} from './instrumentCatalogMatch'
import { normalizeSearchQuery } from '@/shared/lib/normalizeSearchQuery'

const sample: Instrument = {
  id: 1,
  ticker: 'DYCA',
  name: 'Dycasa S.A.',
  type: 'ACCIONES',
  last_price: 45.72,
  close_price: 50.07,
}

describe('instrumentCatalogMatch', () => {
  it('matches ticker substring', () => {
    expect(catalogInstrumentMatchesQuery(sample, normalizeSearchQuery('dyc'))).toBe(true)
  })

  it('matches company name substring', () => {
    expect(catalogInstrumentMatchesQuery(sample, normalizeSearchQuery('dycasa'))).toBe(true)
  })

  it('scores exact ticker best', () => {
    expect(tickerMatchScore(sample, 'dyca')).toBe(0)
    expect(tickerMatchScore(sample, 'dyc')).toBe(1)
  })

  it('ranks ticker prefix ahead of name-only matches', () => {
    const telecom = { ...sample, id: 2, ticker: 'TECO2', name: 'Telecom' }
    expect(compareInstrumentCatalogRelevance(telecom, sample, 'te')).toBeLessThan(0)
  })
})
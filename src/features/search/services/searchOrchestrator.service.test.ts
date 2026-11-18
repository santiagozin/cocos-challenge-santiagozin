import type { Instrument } from '@/features/instruments/domain/instrument.types'
import { fetchSearchResults } from './search.service'
import { searchInstrumentsOrchestrated } from './searchOrchestrator.service'

vi.mock('./search.service', () => ({
  fetchSearchResults: vi.fn(),
}))

const instrument: Instrument = {
  id: 1,
  ticker: 'DYCA',
  name: 'Dycasa S.A.',
  type: 'ACCIONES',
  last_price: 45.72,
  close_price: 50.07,
}

const mockFetch = vi.mocked(fetchSearchResults)

describe('searchInstrumentsOrchestrated', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns primary results without fan-out', async () => {
    mockFetch.mockResolvedValueOnce([instrument])

    const results = await searchInstrumentsOrchestrated('dyc', [instrument])

    expect(results).toEqual([instrument])
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith('dyc', undefined)
  })

  it('fans out to ticker candidates when primary is empty', async () => {
    mockFetch.mockResolvedValueOnce([]).mockResolvedValueOnce([instrument])

    const results = await searchInstrumentsOrchestrated('Dycasa', [instrument])

    expect(results).toEqual([instrument])
    expect(mockFetch).toHaveBeenNthCalledWith(1, 'Dycasa', undefined)
    expect(mockFetch).toHaveBeenNthCalledWith(2, 'DYCA', undefined)
  })

  it('returns empty when primary and candidates miss', async () => {
    mockFetch.mockResolvedValue([])

    const results = await searchInstrumentsOrchestrated('zzzz', [instrument])

    expect(results).toEqual([])
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
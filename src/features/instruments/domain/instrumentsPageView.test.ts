import type { UseQueryResult } from '@tanstack/react-query'
import type { Instrument } from './instrument.types'
import { ALL_INSTRUMENT_TYPES } from './instrumentTypeFilter'
import { resolveInstrumentsPageView } from './instrumentsPageView'

const instrument: Instrument = {
  id: 1,
  ticker: 'DYCA',
  name: 'Dycasa S.A.',
  type: 'ACCIONES',
  last_price: 1,
  close_price: 1,
}

function catalogResult(
  partial: Partial<UseQueryResult<readonly Instrument[], Error>>,
): UseQueryResult<readonly Instrument[], Error> {
  return partial as UseQueryResult<readonly Instrument[], Error>
}

describe('resolveInstrumentsPageView', () => {
  it('shows catalog skeleton while loading', () => {
    const view = resolveInstrumentsPageView({
      isSearchMode: false,
      activeFilter: '',
      selectedType: ALL_INSTRUMENT_TYPES,
      instruments: catalogResult({ isPending: true }),
      search: catalogResult({}),
    })
    expect(view).toEqual({ kind: 'skeleton' })
  })

  it('shows search empty message', () => {
    const view = resolveInstrumentsPageView({
      isSearchMode: true,
      activeFilter: 'zz',
      selectedType: ALL_INSTRUMENT_TYPES,
      instruments: catalogResult({ isSuccess: true, data: [instrument] }),
      search: catalogResult({
        isSuccess: true,
        isFetching: false,
        data: [],
      }),
    })
    expect(view).toEqual({
      kind: 'message',
      tone: 'info',
      variant: 'search-empty',
      query: 'zz',
      text: 'Sin resultados para «zz». Probá con el ticker o parte del nombre.',
    })
  })

  it('shows search table with results', () => {
    const view = resolveInstrumentsPageView({
      isSearchMode: true,
      activeFilter: 'dyc',
      selectedType: ALL_INSTRUMENT_TYPES,
      instruments: catalogResult({ isSuccess: true, data: [instrument] }),
      search: catalogResult({ isSuccess: true, data: [instrument] }),
    })
    expect(view).toEqual({ kind: 'table', instruments: [instrument] })
  })
})
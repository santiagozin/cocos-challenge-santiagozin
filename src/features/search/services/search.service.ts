import type { Instrument } from '@/features/instruments/domain/instrument.types'
import { parseInstrumentList } from '@/features/instruments/services/instrument.guard'
import { apiGet } from '@/shared/api/httpClient'
import { TICKER_QUERY_MAX_LENGTH } from '../domain/search.constants'

export function fetchSearchResults(
  query: string,
  signal?: AbortSignal,
): Promise<readonly Instrument[]> {
  const normalized = query.trim()
  if (normalized.length === 0 || normalized.length > TICKER_QUERY_MAX_LENGTH) {
    return Promise.resolve([])
  }

  const params = new URLSearchParams({ query: normalized })
  return apiGet(`/search?${params.toString()}`, parseInstrumentList, signal)
}
import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Instrument } from '@/features/instruments/domain/instrument.types'
import { useInstruments } from '@/features/instruments/hooks/useInstruments'
import { normalizeSearchQuery } from '@/shared/lib/normalizeSearchQuery'
import { SEARCH_QUERY_MAX_LENGTH } from '../domain/search.constants'
import { searchInstrumentsOrchestrated } from '../services/searchOrchestrator.service'

export const orchestratedSearchKeys = {
  all: ['search', 'orchestrated'] as const,
  byQuery: (query: string) => ['search', 'orchestrated', query] as const,
}

export interface InstrumentsSearchViewModel {
  readonly instruments: UseQueryResult<readonly Instrument[], Error>
  readonly search: UseQueryResult<readonly Instrument[], Error>
}

/**
 * Orchestrated search against `/search` using the catalog of `useInstruments` for the fan-out by ticker.
 */
export function useInstrumentsSearch(debouncedQuery: string): InstrumentsSearchViewModel {
  const instruments = useInstruments()
  const normalized = normalizeSearchQuery(debouncedQuery)
  const trimmedQuery = debouncedQuery.trim()

  const search: UseQueryResult<readonly Instrument[], Error> = useQuery<
    readonly Instrument[],
    Error,
    readonly Instrument[]
  >({
    queryKey: orchestratedSearchKeys.byQuery(normalized),
    queryFn: ({ signal }) => {
      const catalog = instruments.data ?? []
      return searchInstrumentsOrchestrated(trimmedQuery, catalog, signal)
    },
    enabled:
      instruments.isSuccess &&
      normalized.length > 0 &&
      trimmedQuery.length <= SEARCH_QUERY_MAX_LENGTH,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })

  return { instruments, search }
}
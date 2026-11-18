import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { Instrument } from '@/features/instruments/domain/instrument.types'
import { TICKER_QUERY_MAX_LENGTH } from '../domain/search.constants'
import { fetchSearchResults } from '../services/search.service'

export const searchKeys = {
  all: ['search'] as const,
  byQuery: (query: string) => ['search', query] as const,
}

export function useSearch(query: string): UseQueryResult<readonly Instrument[], Error> {
  const normalized = query.trim()

  return useQuery({
    queryKey: searchKeys.byQuery(normalized),
    queryFn: ({ signal }) => fetchSearchResults(normalized, signal),
    enabled: normalized.length > 0 && normalized.length <= TICKER_QUERY_MAX_LENGTH,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
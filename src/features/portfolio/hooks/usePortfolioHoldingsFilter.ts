import { useMemo, useState } from 'react'
import { SEARCH_DEBOUNCE_MS } from '@/features/search'
import { normalizeSearchQuery } from '@/shared/lib/normalizeSearchQuery'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { filterHoldingsByQuery } from '../domain/portfolioFilter'
import type { Holding } from '../domain/portfolio.types'

export interface UsePortfolioHoldingsFilterResult {
  readonly query: string
  readonly setQuery: (value: string) => void
  readonly filteredHoldings: readonly Holding[]
  readonly isFilterActive: boolean
  readonly isFilterEmpty: boolean
}

export function usePortfolioHoldingsFilter(
  holdings: readonly Holding[],
): UsePortfolioHoldingsFilterResult {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS)

  const filteredHoldings = useMemo(
    () => filterHoldingsByQuery(holdings, debouncedQuery),
    [debouncedQuery, holdings],
  )

  const isFilterActive = normalizeSearchQuery(debouncedQuery).length > 0
  const isFilterEmpty = isFilterActive && filteredHoldings.length === 0

  return {
    query,
    setQuery,
    filteredHoldings,
    isFilterActive,
    isFilterEmpty,
  }
}
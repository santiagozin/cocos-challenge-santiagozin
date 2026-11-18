import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useInstrumentsSearch } from '@/features/search'
import { normalizeSearchQuery } from '@/shared/lib/normalizeSearchQuery'
import { resolveInstrumentsPageView, type InstrumentsPageView } from '../domain/instrumentsPageView'
import type { InstrumentTypeFilter } from '../domain/instrumentTypeFilter'
import { collectInstrumentTypes } from '../domain/instrumentTypeFilter'
import { instrumentKeys } from './useInstruments'

export interface UseInstrumentsCatalogViewInput {
  readonly appliedQuery: string
  readonly selectedType: InstrumentTypeFilter
}

export interface UseInstrumentsCatalogViewResult {
  readonly searchBusy: boolean
  readonly availableTypes: readonly string[]
  readonly filtersLoading: boolean
  readonly pricesRefreshing: boolean
  readonly view: InstrumentsPageView
  readonly catalogUnavailable: boolean
  readonly retryCatalog: () => void
}

export function useInstrumentsCatalogView({
  appliedQuery,
  selectedType,
}: UseInstrumentsCatalogViewInput): UseInstrumentsCatalogViewResult {
  const queryClient = useQueryClient()
  const activeFilter = normalizeSearchQuery(appliedQuery)
  const isSearchMode = activeFilter.length > 0

  const { instruments, search } = useInstrumentsSearch(appliedQuery)

  const availableTypes = useMemo(
    () => (instruments.isSuccess ? collectInstrumentTypes(instruments.data) : []),
    [instruments.data, instruments.isSuccess],
  )

  const searchBusy = isSearchMode && search.isFetching
  const catalogUnavailable = instruments.isError && !instruments.isPending

  const retryCatalog = useCallback((): void => {
    void queryClient.invalidateQueries({ queryKey: instrumentKeys.all })
  }, [queryClient])

  const view = useMemo(
    () =>
      resolveInstrumentsPageView({
        isSearchMode,
        activeFilter,
        selectedType,
        instruments,
        search,
      }),
    [activeFilter, instruments, isSearchMode, search, selectedType],
  )

  return {
    searchBusy,
    availableTypes,
    filtersLoading: instruments.isPending,
    pricesRefreshing: instruments.isFetching && instruments.isSuccess,
    view,
    catalogUnavailable,
    retryCatalog,
  }
}
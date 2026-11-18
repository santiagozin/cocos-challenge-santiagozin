import type { InstrumentsPageView } from '../domain/instrumentsPageView'
import type { InstrumentTypeFilter } from '../domain/instrumentTypeFilter'
import { useInstrumentSearchParams } from './useInstrumentSearchParams'
import { useInstrumentsCatalogView } from './useInstrumentsCatalogView'

export interface UseInstrumentsPageResult {
  readonly searchQuery: string
  readonly setSearchQuery: (value: string) => void
  readonly searchBusy: boolean
  readonly selectedType: InstrumentTypeFilter
  readonly setSelectedType: (type: InstrumentTypeFilter) => void
  readonly availableTypes: readonly string[]
  readonly filtersLoading: boolean
  readonly pricesRefreshing: boolean
  readonly view: InstrumentsPageView
  readonly catalogUnavailable: boolean
  readonly retryCatalog: () => void
}

export function useInstrumentsPage(): UseInstrumentsPageResult {
  const { searchQuery, setSearchQuery, appliedQuery, selectedType, setSelectedType } =
    useInstrumentSearchParams()
  const catalog = useInstrumentsCatalogView({ appliedQuery, selectedType })

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    ...catalog,
  }
}
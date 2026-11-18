import type { ReactElement } from 'react'
import { SearchBox } from '@/features/search'
import type { InstrumentTypeFilter } from '../../domain/instrumentTypeFilter'
import { InstrumentTypeFilters } from '../instrumentTypeFilters/InstrumentTypeFilters'

export interface InstrumentsToolbarProps {
  readonly searchQuery: string
  readonly onSearchQueryChange: (value: string) => void
  readonly searchBusy: boolean
  readonly selectedType: InstrumentTypeFilter
  readonly onTypeChange: (type: InstrumentTypeFilter) => void
  readonly availableTypes: readonly string[]
  readonly filtersLoading: boolean
  readonly disabled: boolean
}

export function InstrumentsToolbar({
  searchQuery,
  onSearchQueryChange,
  searchBusy,
  selectedType,
  onTypeChange,
  availableTypes,
  filtersLoading,
  disabled,
}: InstrumentsToolbarProps): ReactElement {
  return (
    <div
      className={disabled ? 'instruments__toolbar instruments__toolbar--disabled' : 'instruments__toolbar'}
    >
      <SearchBox
        value={searchQuery}
        onChange={onSearchQueryChange}
        isSearching={searchBusy}
        disabled={disabled}
      />
      <InstrumentTypeFilters
        types={availableTypes}
        selected={selectedType}
        onSelect={onTypeChange}
        isLoading={filtersLoading}
        disabled={disabled}
      />
    </div>
  )
}
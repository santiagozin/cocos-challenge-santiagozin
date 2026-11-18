import type { ReactElement } from 'react'
import {
  ALL_INSTRUMENT_TYPES,
  formatInstrumentTypeLabel,
  type InstrumentTypeFilter,
} from '../../domain/instrumentTypeFilter'
import './InstrumentTypeFilters.scss'

export interface InstrumentTypeFiltersProps {
  readonly types: readonly string[]
  readonly selected: InstrumentTypeFilter
  readonly onSelect: (type: InstrumentTypeFilter) => void
  readonly isLoading: boolean
  readonly disabled?: boolean
}

const FILTER_SKELETON_PILLS = 3

function pillClassName(isActive: boolean): string {
  return isActive
    ? 'instrument-type-filters__pill instrument-type-filters__pill--active'
    : 'instrument-type-filters__pill'
}

function InstrumentTypeFiltersSkeleton(): ReactElement {
  return (
    <div className="instrument-type-filters" role="status" aria-busy="true" aria-label="Cargando filtros">
      <ul className="instrument-type-filters__list">
        {Array.from({ length: FILTER_SKELETON_PILLS }, (_, index) => (
          <li key={index}>
            <span className="instrument-type-filters__pill instrument-type-filters__pill--skeleton" aria-hidden />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function InstrumentTypeFilters({
  types,
  selected,
  onSelect,
  isLoading,
  disabled = false,
}: InstrumentTypeFiltersProps): ReactElement | null {
  if (isLoading) {
    return <InstrumentTypeFiltersSkeleton />
  }

  if (types.length <= 1) {
    return null
  }

  return (
    <div
      className={
        disabled
          ? 'instrument-type-filters instrument-type-filters--disabled'
          : 'instrument-type-filters'
      }
      role="toolbar"
      aria-label="Filtrar por tipo"
      aria-disabled={disabled}
    >
      <ul className="instrument-type-filters__list">
        <li>
          <button
            type="button"
            className={pillClassName(selected === ALL_INSTRUMENT_TYPES)}
            aria-pressed={selected === ALL_INSTRUMENT_TYPES}
            disabled={disabled}
            onClick={() => {
              onSelect(ALL_INSTRUMENT_TYPES)
            }}
          >
            Todos
          </button>
        </li>
        {types.map((type) => (
          <li key={type}>
            <button
              type="button"
              className={pillClassName(selected === type)}
              aria-pressed={selected === type}
              disabled={disabled}
              onClick={() => {
                onSelect(type)
              }}
            >
              {formatInstrumentTypeLabel(type)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

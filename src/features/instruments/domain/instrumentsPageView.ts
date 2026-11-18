import type { UseQueryResult } from '@tanstack/react-query'
import type { Instrument } from './instrument.types'
import {
  ALL_INSTRUMENT_TYPES,
  filterInstrumentsByType,
  formatInstrumentTypeLabel,
  type InstrumentTypeFilter,
} from './instrumentTypeFilter'

export type InstrumentsPageMessageVariant = 'search-empty' | 'catalog-error' | 'default'

export type InstrumentsPageView =
  | { readonly kind: 'skeleton' }
  | {
      readonly kind: 'message'
      readonly tone: 'error' | 'info'
      readonly text: string
      readonly variant?: InstrumentsPageMessageVariant
      readonly query?: string
    }
  | { readonly kind: 'table'; readonly instruments: readonly Instrument[] }

interface ResolveInstrumentsPageViewInput {
  readonly isSearchMode: boolean
  readonly activeFilter: string
  readonly selectedType: InstrumentTypeFilter
  readonly instruments: UseQueryResult<readonly Instrument[], Error>
  readonly search: UseQueryResult<readonly Instrument[], Error>
}

function tableViewOrTypeEmpty(
  instruments: readonly Instrument[],
  selectedType: InstrumentTypeFilter,
): InstrumentsPageView {
  const filtered = filterInstrumentsByType(instruments, selectedType)
  if (filtered.length > 0) {
    return { kind: 'table', instruments: filtered }
  }
  if (selectedType !== ALL_INSTRUMENT_TYPES) {
    return {
      kind: 'message',
      tone: 'info',
      text: `No hay instrumentos de tipo ${formatInstrumentTypeLabel(selectedType)} con los filtros actuales.`,
    }
  }
  return { kind: 'message', tone: 'info', text: 'No hay instrumentos disponibles' }
}

export function resolveInstrumentsPageView(input: ResolveInstrumentsPageViewInput): InstrumentsPageView {
  const { isSearchMode, activeFilter, selectedType, instruments, search } = input

  if (!isSearchMode) {
    if (instruments.isPending) {
      return { kind: 'skeleton' }
    }
    if (instruments.isError) {
      return {
        kind: 'message',
        tone: 'error',
        variant: 'catalog-error',
        text: 'No pudimos cargar el listado de instrumentos. Revisá la conexión e intentá de nuevo.',
      }
    }
    if (instruments.isSuccess && instruments.data.length === 0) {
      return { kind: 'message', tone: 'info', text: 'No hay instrumentos disponibles' }
    }
    if (instruments.isSuccess) {
      return tableViewOrTypeEmpty(instruments.data, selectedType)
    }
    return { kind: 'skeleton' }
  }

  if (search.isLoading) {
    return { kind: 'skeleton' }
  }
  if (search.isError) {
    return { kind: 'message', tone: 'error', text: 'No se pudieron filtrar los resultados' }
  }

  const searchCount = search.data?.length ?? 0
  if (search.isSuccess && !search.isFetching && searchCount === 0) {
    return {
      kind: 'message',
      tone: 'info',
      variant: 'search-empty',
      query: activeFilter,
      text: `Sin resultados para «${activeFilter}». Probá con el ticker o parte del nombre.`,
    }
  }
  if (searchCount > 0) {
    return tableViewOrTypeEmpty(search.data ?? [], selectedType)
  }

  return { kind: 'skeleton' }
}
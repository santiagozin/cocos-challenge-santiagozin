import { SEARCH_QUERY_MAX_LENGTH } from '@/features/search/domain/search.constants'
import { ALL_INSTRUMENT_TYPES, type InstrumentTypeFilter } from './instrumentTypeFilter'

export const INSTRUMENTS_URL_PARAM_QUERY = 'q' as const
export const INSTRUMENTS_URL_PARAM_TYPE = 'tipo' as const

export function readInstrumentsUrlQuery(params: URLSearchParams): string {
  const raw = params.get(INSTRUMENTS_URL_PARAM_QUERY) ?? ''
  return raw.trim().slice(0, SEARCH_QUERY_MAX_LENGTH)
}

export function readInstrumentsUrlType(params: URLSearchParams): InstrumentTypeFilter {
  const raw = params.get(INSTRUMENTS_URL_PARAM_TYPE)?.trim()
  if (!raw) {
    return ALL_INSTRUMENT_TYPES
  }
  return raw
}

export function applyInstrumentsUrlQuery(
  params: URLSearchParams,
  query: string,
): URLSearchParams {
  const next = new URLSearchParams(params)
  const trimmed = query.trim().slice(0, SEARCH_QUERY_MAX_LENGTH)
  if (trimmed) {
    next.set(INSTRUMENTS_URL_PARAM_QUERY, trimmed)
  } else {
    next.delete(INSTRUMENTS_URL_PARAM_QUERY)
  }
  return next
}

export function applyInstrumentsUrlType(
  params: URLSearchParams,
  type: InstrumentTypeFilter,
): URLSearchParams {
  const next = new URLSearchParams(params)
  if (type === ALL_INSTRUMENT_TYPES) {
    next.delete(INSTRUMENTS_URL_PARAM_TYPE)
  } else {
    next.set(INSTRUMENTS_URL_PARAM_TYPE, type)
  }
  return next
}
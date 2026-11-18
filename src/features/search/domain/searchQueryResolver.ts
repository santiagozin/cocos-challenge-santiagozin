import type { Instrument } from '@/features/instruments/domain/instrument.types'
import {
  catalogInstrumentMatchesQuery,
  compareInstrumentCatalogRelevance,
} from '@/features/instruments/domain/catalog'
import { normalizeSearchQuery } from '@/shared/lib/normalizeSearchQuery'
import { SEARCH_MAX_API_FANOUT } from './search.constants'

export interface ResolveTickerCandidatesOptions {
  readonly maxCandidates?: number
}

/**
 * Returns tickers to query in `/search` after an empty primary query.
 * Filters the catalog, ranks by ticker score and deduplicates up to `maxCandidates`.
 */
export function resolveTickerCandidates(
  query: string,
  catalog: readonly Instrument[],
  options: ResolveTickerCandidatesOptions = {},
): readonly string[] {
  const normalized = normalizeSearchQuery(query)
  if (normalized.length === 0) {
    return []
  }

  const maxCandidates = options.maxCandidates ?? SEARCH_MAX_API_FANOUT
  const matched = catalog.filter((instrument) => catalogInstrumentMatchesQuery(instrument, normalized))

  const ranked = [...matched].sort((left, right) =>
    compareInstrumentCatalogRelevance(left, right, normalized),
  )

  const tickers: string[] = []
  const seen = new Set<string>()
  for (const instrument of ranked) {
    if (seen.has(instrument.ticker)) {
      continue
    }
    seen.add(instrument.ticker)
    tickers.push(instrument.ticker)
    if (tickers.length >= maxCandidates) {
      break
    }
  }

  return tickers
}
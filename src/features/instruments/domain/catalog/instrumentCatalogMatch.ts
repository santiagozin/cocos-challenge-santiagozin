import { SEARCH_TEXT_LOCALE } from '@/shared/lib/normalizeSearchQuery'
import type { Instrument } from '../instrument.types'

function comparableTicker(instrument: Instrument): string {
  return instrument.ticker.toLocaleLowerCase(SEARCH_TEXT_LOCALE)
}

function comparableName(instrument: Instrument): string {
  return instrument.name.toLocaleLowerCase(SEARCH_TEXT_LOCALE)
}

// TODO: Filtering should be done on the backend to avoid client-side filtering.

/**
 * Whether a local catalog instrument might match the query text,
 * so tickers can be derived when `/search` does not match by name.
 */
export function catalogInstrumentMatchesQuery(instrument: Instrument, normalizedQuery: string): boolean {
  const ticker = comparableTicker(instrument)
  const name = comparableName(instrument)

  if (ticker.includes(normalizedQuery) || name.includes(normalizedQuery)) {
    return true
  }

  const nameWords = name.split(/[\s./-]+/).filter((word) => word.length > 0)
  return nameWords.some((word) => word.startsWith(normalizedQuery))
}

/**
 * Ticker priority relative to the query (lower = better).
 * 0 exact, 1 prefix, 2 substring, 3 name-only catalog match.
 */
export function tickerMatchScore(instrument: Instrument, normalizedQuery: string): number {
  const ticker = comparableTicker(instrument)
  if (ticker === normalizedQuery) {
    return 0
  }
  if (ticker.startsWith(normalizedQuery)) {
    return 1
  }
  if (ticker.includes(normalizedQuery)) {
    return 2
  }
  return 3
}

/** Compares two instruments by ticker relevance; ties break alphabetically. */
export function compareInstrumentCatalogRelevance(
  left: Instrument,
  right: Instrument,
  normalizedQuery: string,
): number {
  const scoreDelta = tickerMatchScore(left, normalizedQuery) - tickerMatchScore(right, normalizedQuery)
  if (scoreDelta !== 0) {
    return scoreDelta
  }
  return left.ticker.localeCompare(right.ticker, SEARCH_TEXT_LOCALE)
}

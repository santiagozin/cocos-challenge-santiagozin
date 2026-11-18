import { normalizeSearchQuery } from '@/shared/lib/normalizeSearchQuery'
import type { Holding } from './portfolio.types'

export function filterHoldingsByQuery(
  holdings: readonly Holding[],
  query: string,
): readonly Holding[] {
  const filter = normalizeSearchQuery(query)
  if (filter.length === 0) {
    return holdings
  }

  return holdings.filter((holding) => holding.ticker.toLocaleLowerCase('es-AR').includes(filter))
}
import type { Holding } from './portfolio.types'

export function isActiveHolding(holding: Holding): boolean {
  return Number.isFinite(holding.quantity) && holding.quantity > 0
}

export function activeHoldings(holdings: readonly Holding[]): readonly Holding[] {
  return holdings.filter(isActiveHolding)
}
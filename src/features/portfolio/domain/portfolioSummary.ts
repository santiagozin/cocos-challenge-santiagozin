import { marketValue, positionGain } from './portfolio.calculations'
import { activeHoldings } from './portfolioHoldings'
import type { Holding } from './portfolio.types'

export interface PortfolioSummary {
  readonly cash: number
  readonly holdingsValue: number
  readonly totalPatrimony: number
  readonly totalGain: number | null
}

export function summarizePortfolio(cash: number, holdings: readonly Holding[]): PortfolioSummary {
  let holdingsValue = 0
  let totalGain = 0
  let gainCount = 0

  for (const holding of activeHoldings(holdings)) {
    const value = marketValue(holding.quantity, holding.last_price)
    if (value !== null) {
      holdingsValue += value
    }

    const gain = positionGain(holding.quantity, holding.last_price, holding.avg_cost_price)
    if (gain !== null) {
      totalGain += gain
      gainCount += 1
    }
  }

  return {
    cash,
    holdingsValue,
    totalPatrimony: cash + holdingsValue,
    totalGain: gainCount > 0 ? totalGain : null,
  }
}
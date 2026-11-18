/** Position market value: `quantity * last_price`. */
export function marketValue(quantity: number, lastPrice: number): number | null {
  if (!Number.isFinite(quantity) || !Number.isFinite(lastPrice)) {
    return null
  }

  return quantity * lastPrice
}

/** Position gain: `(last_price - avg_cost_price) * quantity`. */
export function positionGain(
  quantity: number,
  lastPrice: number,
  avgCostPrice: number,
): number | null {
  if (!Number.isFinite(quantity) || !Number.isFinite(lastPrice) || !Number.isFinite(avgCostPrice)) {
    return null
  }

  return (lastPrice - avgCostPrice) * quantity
}

/** Total return: `((last_price - avg_cost_price) / avg_cost_price) * 100`. */
export function totalReturnPercent(lastPrice: number, avgCostPrice: number): number | null {
  if (!Number.isFinite(lastPrice) || !Number.isFinite(avgCostPrice) || avgCostPrice === 0) {
    return null
  }

  return ((lastPrice - avgCostPrice) / avgCostPrice) * 100
}

export function holdingPortfolioPercent(holdingValue: number | null, totalPatrimony: number): number | null {
  if (holdingValue === null || !Number.isFinite(totalPatrimony) || totalPatrimony <= 0) {
    return null
  }

  return (holdingValue / totalPatrimony) * 100
}

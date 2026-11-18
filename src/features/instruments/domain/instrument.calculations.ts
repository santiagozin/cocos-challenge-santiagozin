export function priceReturnPercent(lastPrice: number, closePrice: number): number | null {
  if (!Number.isFinite(lastPrice) || !Number.isFinite(closePrice) || closePrice === 0) {
    return null
  }

  return ((lastPrice - closePrice) / closePrice) * 100
}

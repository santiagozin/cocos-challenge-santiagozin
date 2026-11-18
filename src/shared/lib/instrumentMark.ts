
export function instrumentMark(ticker: string): string {
  const trimmed = ticker.trim()
  return trimmed.length > 0 ? trimmed.slice(0, 1).toUpperCase() : '?'
}
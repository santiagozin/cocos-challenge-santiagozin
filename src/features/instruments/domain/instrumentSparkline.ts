const DEFAULT_POINTS = 7

export interface SparklineLayout {
  readonly width: number
  readonly height: number
  readonly padding: number
}

export const SPARKLINE_LAYOUT: SparklineLayout = {
  width: 56,
  height: 22,
  padding: 2,
}

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43_758.5453
  return value - Math.floor(value)
}

function sampleSeries(closePrice: number, lastPrice: number, pointCount: number, seed: number): number[] {
  const values = new Array<number>(pointCount)
  values[0] = closePrice
  values[pointCount - 1] = lastPrice

  const swing = Math.max(Math.abs(lastPrice - closePrice) * 0.22, closePrice * 0.004)

  for (let index = 1; index < pointCount - 1; index += 1) {
    const progress = index / (pointCount - 1)
    const baseline = closePrice + (lastPrice - closePrice) * progress
    const wobble = (pseudoRandom(seed + index * 17) * 2 - 1) * swing
    values[index] = baseline + wobble
  }

  return values
}

export function buildSparklinePath(
  closePrice: number,
  lastPrice: number,
  seed = 0,
  pointCount = DEFAULT_POINTS,
  layout: SparklineLayout = SPARKLINE_LAYOUT,
): string | null {
  if (!Number.isFinite(closePrice) || !Number.isFinite(lastPrice) || closePrice <= 0 || lastPrice <= 0) {
    return null
  }

  const values = sampleSeries(closePrice, lastPrice, pointCount, seed)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const innerWidth = layout.width - layout.padding * 2
  const innerHeight = layout.height - layout.padding * 2

  const segments: string[] = []

  for (const [index, value] of values.entries()) {
    const x = layout.padding + (index / (values.length - 1)) * innerWidth
    const normalized = (value - min) / span
    const y = layout.padding + (1 - normalized) * innerHeight
    segments.push(`${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return segments.join(' ')
}
import { buildSparklinePath } from './instrumentSparkline'

describe('buildSparklinePath', () => {
  it('returns null when prices are invalid', () => {
    expect(buildSparklinePath(0, 10, 1)).toBeNull()
    expect(buildSparklinePath(Number.NaN, 10, 1)).toBeNull()
  })

  it('is deterministic for the same inputs', () => {
    const first = buildSparklinePath(100, 110, 42)
    const second = buildSparklinePath(100, 110, 42)
    expect(first).toBe(second)
  })

  it('ends higher on the path when last price is above close', () => {
    const path = buildSparklinePath(100, 120, 5)
    expect(path).not.toBeNull()
    const matches = path?.match(/L\s+[\d.]+\s+([\d.]+)/g) ?? []
    const lastY = Number(matches.at(-1)?.split(/\s+/).at(-1))
    const firstY = Number(path?.match(/M\s+[\d.]+\s+([\d.]+)/)?.[1])
    expect(lastY).toBeLessThan(firstY)
  })
})
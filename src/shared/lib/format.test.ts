import { formatArs, formatSignedArs, formatSignedPercent, parseArsInput } from './format'

describe('formatArs', () => {
  it('formats pesos with es-AR grouping', () => {
    expect(formatArs(1234.5).replace(/\s/g, '')).toContain('1.234,50')
    expect(formatArs(1234.5)).toContain('$')
  })
})

describe('parseArsInput', () => {
  it('parses plain decimals and formatted pesos', () => {
    expect(parseArsInput('1234.5')).toBe(1234.5)
    expect(parseArsInput('$ 999.497,08')).toBe(999497.08)
    expect(parseArsInput('999497,08')).toBe(999497.08)
  })

  it('returns null for empty or invalid values', () => {
    expect(parseArsInput('')).toBeNull()
    expect(parseArsInput('abc')).toBeNull()
    expect(parseArsInput('0')).toBeNull()
  })
})

describe('formatSignedArs', () => {
  it('shows a plus sign when the amount is a gain', () => {
    expect(formatSignedArs(20)).toContain('+')
    expect(formatSignedArs(20).replace(/\s/g, '')).toContain('20,00')
  })

  it('shows a minus sign when the amount is a loss', () => {
    expect(formatSignedArs(-20)).toMatch(/[-−]/)
    expect(formatSignedArs(-20).replace(/\s/g, '')).toContain('20,00')
  })
})

describe('formatSignedPercent', () => {
  it('shows a plus sign when the value rises', () => {
    expect(formatSignedPercent(1.5)).toContain('+')
    expect(formatSignedPercent(1.5)).toContain('1,50')
    expect(formatSignedPercent(1.5)).toContain('%')
  })

  it('shows a minus sign when the value falls', () => {
    expect(formatSignedPercent(-2)).toMatch(/[-−]/)
    expect(formatSignedPercent(-2)).toContain('2,00')
  })

  it('omits the sign when the value is zero', () => {
    expect(formatSignedPercent(0)).toContain('0,00')
    expect(formatSignedPercent(0)).not.toMatch(/[+\-−]/)
  })
})

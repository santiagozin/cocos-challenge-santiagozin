import { normalizeSearchQuery } from './normalizeSearchQuery'

describe('normalizeSearchQuery', () => {
  it('normalizes whitespace and casing', () => {
    expect(normalizeSearchQuery('  Dycasa   ')).toBe('dycasa')
  })
})
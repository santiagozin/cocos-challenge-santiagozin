import { describe, expect, it } from 'vitest'
import { instrumentMark } from './instrumentMark'

describe('instrumentMark', () => {
  it('returns the first letter uppercased', () => {
    expect(instrumentMark('dyca')).toBe('D')
  })
})
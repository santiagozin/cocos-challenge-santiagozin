import { readInstrumentsPollMs } from './env'

describe('readInstrumentsPollMs', () => {
  it('defaults to 10 seconds', () => {
    expect(readInstrumentsPollMs(undefined)).toBe(10_000)
    expect(readInstrumentsPollMs('')).toBe(10_000)
  })

  it('accepts a configured interval of at least one second', () => {
    expect(readInstrumentsPollMs('5000')).toBe(5_000)
  })

  it('falls back when the value is not a usable interval', () => {
    expect(readInstrumentsPollMs('0')).toBe(10_000)
    expect(readInstrumentsPollMs('rapido')).toBe(10_000)
  })
})
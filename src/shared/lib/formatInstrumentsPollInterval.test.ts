import { formatInstrumentsPollInterval } from './formatInstrumentsPollInterval'

describe('formatInstrumentsPollInterval', () => {
  it('formats sub-minute intervals in seconds', () => {
    expect(formatInstrumentsPollInterval(1_000)).toBe('1 segundo')
    expect(formatInstrumentsPollInterval(10_000)).toBe('10 segundos')
  })

  it('formats whole-minute intervals', () => {
    expect(formatInstrumentsPollInterval(60_000)).toBe('1 minuto')
    expect(formatInstrumentsPollInterval(120_000)).toBe('2 minutos')
  })
})
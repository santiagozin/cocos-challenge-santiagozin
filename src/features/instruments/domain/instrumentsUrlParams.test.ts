import { describe, expect, it } from 'vitest'
import { ALL_INSTRUMENT_TYPES } from './instrumentTypeFilter'
import {
  INSTRUMENTS_URL_PARAM_QUERY,
  INSTRUMENTS_URL_PARAM_TYPE,
  applyInstrumentsUrlQuery,
  applyInstrumentsUrlType,
  readInstrumentsUrlQuery,
  readInstrumentsUrlType,
} from './instrumentsUrlParams'

describe('instrumentsUrlParams', () => {
  it('reads empty query and default type', () => {
    const params = new URLSearchParams()
    expect(readInstrumentsUrlQuery(params)).toBe('')
    expect(readInstrumentsUrlType(params)).toBe(ALL_INSTRUMENT_TYPES)
  })

  it('reads query and type from the URL', () => {
    const params = new URLSearchParams({
      [INSTRUMENTS_URL_PARAM_QUERY]: '  GGAL  ',
      [INSTRUMENTS_URL_PARAM_TYPE]: 'ACCIONES',
    })
    expect(readInstrumentsUrlQuery(params)).toBe('GGAL')
    expect(readInstrumentsUrlType(params)).toBe('ACCIONES')
  })

  it('applies query and removes it when empty', () => {
    const withQuery = applyInstrumentsUrlQuery(new URLSearchParams(), 'Peso')
    expect(withQuery.get(INSTRUMENTS_URL_PARAM_QUERY)).toBe('Peso')

    const cleared = applyInstrumentsUrlQuery(withQuery, '   ')
    expect(cleared.has(INSTRUMENTS_URL_PARAM_QUERY)).toBe(false)
  })

  it('applies type and removes it for ALL', () => {
    const withType = applyInstrumentsUrlType(new URLSearchParams(), 'MONEDA')
    expect(withType.get(INSTRUMENTS_URL_PARAM_TYPE)).toBe('MONEDA')

    const cleared = applyInstrumentsUrlType(withType, ALL_INSTRUMENT_TYPES)
    expect(cleared.has(INSTRUMENTS_URL_PARAM_TYPE)).toBe(false)
  })
})
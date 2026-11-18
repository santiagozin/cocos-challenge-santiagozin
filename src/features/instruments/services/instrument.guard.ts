import { ApiError } from '@/shared/api/apiError'
import { isRecord, readFiniteNumber, readString } from '@/shared/api/guards'
import type { Instrument } from '../domain/instrument.types'

function isInstrument(value: unknown): value is Instrument {
  if (!isRecord(value)) {
    return false
  }

  return (
    readFiniteNumber(value, 'id') !== undefined &&
    readString(value, 'ticker') !== undefined &&
    readString(value, 'name') !== undefined &&
    readString(value, 'type') !== undefined &&
    readFiniteNumber(value, 'last_price') !== undefined &&
    readFiniteNumber(value, 'close_price') !== undefined
  )
}

export function parseInstrumentList(value: unknown): readonly Instrument[] {
  if (!Array.isArray(value) || !value.every(isInstrument)) {
    throw new ApiError(0)
  }

  return value
}

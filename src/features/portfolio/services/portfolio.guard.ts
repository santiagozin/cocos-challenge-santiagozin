import { ApiError } from '@/shared/api/apiError'
import { isRecord, readFiniteNumber, readString } from '@/shared/api/guards'
import type { Holding, Portfolio } from '../domain/portfolio.types'

function isHolding(value: unknown): value is Holding {
  if (!isRecord(value)) {
    return false
  }

  return (
    readFiniteNumber(value, 'instrument_id') !== undefined &&
    readString(value, 'ticker') !== undefined &&
    readFiniteNumber(value, 'quantity') !== undefined &&
    readFiniteNumber(value, 'last_price') !== undefined &&
    readFiniteNumber(value, 'close_price') !== undefined &&
    readFiniteNumber(value, 'avg_cost_price') !== undefined
  )
}

export function parsePortfolio(value: unknown): Portfolio {
  if (!isRecord(value) || !Array.isArray(value.holdings)) {
    throw new ApiError(0)
  }

  const cash = readFiniteNumber(value, 'cash')
  if (cash === undefined || !value.holdings.every(isHolding)) {
    throw new ApiError(0)
  }

  return {
    cash,
    holdings: value.holdings,
  }
}

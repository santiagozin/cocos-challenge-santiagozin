import type { Instrument } from '../instrument.types'
import { priceReturnPercent } from '../instrument.calculations'

export const INSTRUMENTS_TABLE_PAGE_SIZE = 10

export type InstrumentSortColumn = 'asset' | 'price' | 'change'
export type InstrumentSortDirection = 'asc' | 'desc'

export interface InstrumentTableSort {
  readonly column: InstrumentSortColumn
  readonly direction: InstrumentSortDirection
}

function compareNullableNumber(
  left: number | null,
  right: number | null,
  direction: InstrumentSortDirection,
): number {
  if (left === null && right === null) {
    return 0
  }
  if (left === null) {
    return 1
  }
  if (right === null) {
    return -1
  }
  const delta = left - right
  return direction === 'asc' ? delta : -delta
}

export function sortInstruments(
  instruments: readonly Instrument[],
  sort: InstrumentTableSort,
): readonly Instrument[] {
  const copy = [...instruments]
  const { column, direction } = sort
  const sign = direction === 'asc' ? 1 : -1

  copy.sort((left, right) => {
    switch (column) {
      case 'asset': {
        const byTicker = left.ticker.localeCompare(right.ticker, 'es-AR', { sensitivity: 'base' })
        if (byTicker !== 0) {
          return byTicker * sign
        }
        return left.name.localeCompare(right.name, 'es-AR', { sensitivity: 'base' }) * sign
      }
      case 'price':
        return (left.last_price - right.last_price) * sign
      case 'change':
        return compareNullableNumber(
          priceReturnPercent(left.last_price, left.close_price),
          priceReturnPercent(right.last_price, right.close_price),
          direction,
        )
      default:
        return 0
    }
  })

  return copy
}

export function getTablePageCount(itemCount: number, pageSize: number): number {
  if (itemCount <= 0) {
    return 1
  }
  return Math.ceil(itemCount / pageSize)
}

export function paginateInstruments(
  instruments: readonly Instrument[],
  page: number,
  pageSize: number,
): readonly Instrument[] {
  const pageCount = getTablePageCount(instruments.length, pageSize)
  const safePage = Math.min(Math.max(page, 1), pageCount)
  const start = (safePage - 1) * pageSize
  return instruments.slice(start, start + pageSize)
}

export function toggleInstrumentTableSort(
  current: InstrumentTableSort,
  column: InstrumentSortColumn,
): InstrumentTableSort {
  if (current.column === column) {
    return { column, direction: current.direction === 'asc' ? 'desc' : 'asc' }
  }
  return { column, direction: column === 'price' || column === 'change' ? 'desc' : 'asc' }
}

export type TablePaginationItem = number | 'ellipsis'

export function buildTablePaginationItems(page: number, pageCount: number): readonly TablePaginationItem[] {
  if (pageCount <= 1) {
    return [1]
  }
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const candidates = new Set<number>([1, pageCount, page, page - 1, page + 1])
  const pages = [...candidates].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b)

  const items: TablePaginationItem[] = []
  for (let index = 0; index < pages.length; index += 1) {
    const current = pages[index]
    if (current === undefined) {
      continue
    }
    const previous = pages[index - 1]
    if (index > 0 && previous !== undefined && current - previous > 1) {
      items.push('ellipsis')
    }
    items.push(current)
  }

  return items
}
import { parseOrderList, parseOrderResponse } from './order.guard'

describe('parseOrderResponse', () => {
  it('parses a valid order response', () => {
    expect(parseOrderResponse({ id: 1, status: 'PENDING' })).toEqual({ id: 1, status: 'PENDING' })
  })
})

describe('parseOrderList', () => {
  it('parses orders from the API', () => {
    const parsed = parseOrderList([
      {
        id: 10,
        instrument_id: 2,
        side: 'SELL',
        type: 'LIMIT',
        quantity: 3,
        price: 12.5,
        status: 'PENDING',
        created_at: '2026-11-10T17:48:29.611Z',
      },
    ])

    expect(parsed).toEqual([
      {
        id: 10,
        instrument_id: 2,
        side: 'SELL',
        type: 'LIMIT',
        quantity: 3,
        price: 12.5,
        status: 'PENDING',
        created_at: '2026-11-10T17:48:29.611Z',
      },
    ])
  })
})
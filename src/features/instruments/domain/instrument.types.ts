export interface Instrument {
  readonly id: number
  readonly ticker: string
  readonly name: string
  readonly type: string
  readonly last_price: number
  readonly close_price: number
}

export interface Holding {
  readonly instrument_id: number
  readonly ticker: string
  readonly quantity: number
  readonly last_price: number
  readonly close_price: number
  readonly avg_cost_price: number
}

export interface Portfolio {
  readonly cash: number
  readonly holdings: readonly Holding[]
}

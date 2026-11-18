import type { UseMutationResult } from '@tanstack/react-query'
import type { SubmitEvent } from 'react'
import type { OrderRequest, OrderResponse, OrderSide, OrderType } from '../domain/order.types'

export type QuantityMode = 'shares' | 'amount'

export type OrderInvalidField = 'shares' | 'amount' | 'limitPrice'

export interface OrderFormDraft {
  readonly side: OrderSide
  readonly setSide: (side: OrderSide) => void
  readonly orderType: OrderType
  readonly setOrderType: (orderType: OrderType) => void
  readonly mode: QuantityMode
  readonly setMode: (mode: QuantityMode) => void
  readonly shares: string
  readonly amount: string
  readonly limitPrice: string
}

export interface OrderFormValidation {
  readonly formError: string | null
  readonly invalidField: OrderInvalidField | null
}

export interface OrderFormPreview {
  readonly quantity: number | null
  readonly notional: number | null
  readonly remainder: number | null
}

export interface OrderFormLimits {
  readonly maxShares: number
  readonly maxAmount: number
  readonly sliderSharesMax: number
  readonly sliderAmountMax: number
  readonly sliderSharesValue: number
  readonly sliderAmountValue: number
  readonly canUseAvailable: boolean
}

export interface OrderFormPortfolioContext {
  readonly holdingQuantity: number
  readonly cash: number
  readonly portfolioReady: boolean
}

export interface OrderFormWarnings {
  readonly exceedsCash: boolean
  readonly exceedsPosition: boolean
  readonly rejection: string | null
}

export interface OrderFormSuccessOutcome {
  readonly status: 'FILLED' | 'PENDING'
  readonly orderId: number
}

export interface OrderFormMutation {
  readonly order: UseMutationResult<OrderResponse, Error, OrderRequest>
  readonly successOutcome: OrderFormSuccessOutcome | null
}

export interface OrderFormActions {
  readonly applyAvailable: () => void
  readonly formatAmountField: () => void
  readonly onSharesChange: (raw: string) => void
  readonly onAmountChange: (raw: string) => void
  readonly onLimitPriceChange: (raw: string) => void
  readonly onSliderChange: (next: number) => void
  readonly onSubmit: (event: SubmitEvent<HTMLFormElement>) => void
}

export interface OrderFormViewModel {
  readonly draft: OrderFormDraft
  readonly validation: OrderFormValidation
  readonly preview: OrderFormPreview
  readonly limits: OrderFormLimits
  readonly portfolio: OrderFormPortfolioContext
  readonly warnings: OrderFormWarnings
  readonly mutation: OrderFormMutation
  readonly actions: OrderFormActions
}
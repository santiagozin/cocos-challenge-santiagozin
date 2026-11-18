import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState, type SubmitEvent } from 'react'
import type { Instrument } from '@/features/instruments/domain/instrument.types'
import { portfolioKeys, usePortfolio } from '@/features/portfolio/hooks/usePortfolio'
import { ApiError } from '@/shared/api/apiError'
import { formatArs, parseArsInput } from '@/shared/lib/format'
import {
  orderNotional,
  orderRejectionMessage,
  uninvestedAmount,
  wholeSharesForAmount,
} from '../domain/order.calculations'
import {
  buildOrderRequest,
  computeMaxAmount,
  computeMaxShares,
  readPositiveDecimal,
  readWholeQuantity,
} from '../domain/orderFormModel'
import type { OrderRequest, OrderSide, OrderType } from '../domain/order.types'
import type { OrderFormViewModel, OrderInvalidField, QuantityMode } from '../types/orderForm.types'
import { useCreateOrder } from './useCreateOrder'
import { orderKeys } from './useOrders'


export function useOrderForm(instrument: Instrument): OrderFormViewModel {
  const queryClient = useQueryClient()
  const portfolio = usePortfolio()
  const order = useCreateOrder()

  const [side, setSide] = useState<OrderSide>('BUY')
  const [orderType, setOrderType] = useState<OrderType>('MARKET')
  const [mode, setMode] = useState<QuantityMode>('shares')
  const [shares, setShares] = useState('')
  const [amount, setAmount] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [invalidField, setInvalidField] = useState<OrderInvalidField | null>(null)

  function clearFormFeedback(): void {
    setFormError(null)
    setInvalidField(null)
  }

  function failValidation(message: string, field: OrderInvalidField | null): void {
    setFormError(message)
    setInvalidField(field)
  }

  // Amount ARS input
  const parsedAmount = parseArsInput(amount)
  // limit price input
  const parsedLimit = readPositiveDecimal(limitPrice)
  // Whole shares that fit the cash at the last price (floor, in domain).
  const sharesFromAmount =
    parsedAmount === null ? null : wholeSharesForAmount(parsedAmount, instrument.last_price)
  // Quantity to send in the request: shares from input or shares from amount.
  const quantity = mode === 'shares' ? readWholeQuantity(shares) : sharesFromAmount
  // Pricing price: last price (MARKET) or parsed limit price (LIMIT).
  const pricingPrice = orderType === 'LIMIT' ? parsedLimit : instrument.last_price
  // Estimated notional: quantity * pricing price.
  const notional =
    quantity === null || pricingPrice === null ? null : orderNotional(quantity, pricingPrice)
  // Remainder: cash - notional.
  const remainder =
    mode === 'amount' && parsedAmount !== null && quantity !== null
      ? uninvestedAmount(parsedAmount, quantity, instrument.last_price)
      : null
  const holding = portfolio.data?.holdings.find((item) => item.instrument_id === instrument.id)
  const holdingQuantity = holding?.quantity ?? 0
  const cash = portfolio.data?.cash ?? 0

  // Maximum shares and amount that can be traded
  const { maxShares, maxAmount } = useMemo(
    () => ({
      maxShares: computeMaxShares(side, cash, holdingQuantity, instrument.last_price),
      maxAmount: computeMaxAmount(side, cash, holdingQuantity, instrument.last_price),
    }),
    [side, cash, holdingQuantity, instrument.last_price],
  )

  const sliderSharesMax = Math.max(maxShares, 1)
  const sliderAmountMax = Math.max(maxAmount, 1)
  const sliderSharesValue = Math.min(readWholeQuantity(shares) ?? 0, sliderSharesMax)
  const sliderAmountValue = Math.min(parsedAmount ?? 0, sliderAmountMax)

  // Alerts 
  const exceedsCash =
    side === 'BUY' &&
    notional !== null &&
    portfolio.data !== undefined &&
    notional > portfolio.data.cash
  const exceedsPosition = side === 'SELL' && quantity !== null && quantity > holdingQuantity
  const rejection =
    order.error instanceof ApiError ? orderRejectionMessage(order.error.detail) : null

  const canUseAvailable = mode === 'shares' ? maxShares >= 1 : maxAmount >= instrument.last_price

  // Inputs, slider and "use max" changes
  function applyAvailable(): void {
    if (mode === 'shares') {
      setShares(String(maxShares))
      return
    }

    setAmount(formatArs(maxAmount))
  }

  function formatAmountField(): void {
    const parsed = parseArsInput(amount)
    if (parsed === null) {
      return
    }

    setAmount(formatArs(parsed))
  }

  function onFieldEdit(field: OrderInvalidField): (raw: string) => void {
    return (raw: string) => {
      if (field === 'shares') {
        setShares(raw.replace(/\D/g, ''))
      } else if (field === 'amount') {
        setAmount(raw)
      } else {
        setLimitPrice(raw)
      }
      if (formError !== null || invalidField !== null) {
        clearFormFeedback()
      }
    }
  }

  function onSliderChange(next: number): void {
    if (mode === 'shares') {
      setShares(next === 0 ? '' : String(Math.round(next)))
      return
    }

    setAmount(formatArs(next))
  }

  // Validation before sending
  function validateAndBuildRequest(): OrderRequest | null {
    if (!portfolio.isSuccess) {
      failValidation('Esperá a que carguen tus saldos para operar', null)
      return null
    }

    if (maxShares < 1) {
      failValidation(
        side === 'BUY'
          ? 'No tenés saldo disponible para comprar'
          : 'No tenés activos disponibles para vender',
        null,
      )
      return null
    }

    if (mode === 'shares' && shares.trim() === '') {
      failValidation('Completá la cantidad de acciones', 'shares')
      return null
    }

    if (mode === 'amount' && amount.trim() === '') {
      failValidation('Completá el monto en pesos', 'amount')
      return null
    }

    if (quantity === null || quantity < 1) {
      failValidation(
        mode === 'shares'
          ? 'Ingresá una cantidad entera de acciones'
          : 'El monto no alcanza para una acción',
        mode === 'shares' ? 'shares' : 'amount',
      )
      return null
    }

    if (orderType === 'LIMIT') {
      if (limitPrice.trim() === '') {
        failValidation('Completá el precio límite en pesos', 'limitPrice')
        return null
      }

      if (parsedLimit === null) {
        failValidation('Ingresá un precio válido en pesos', 'limitPrice')
        return null
      }
    }

    const request = buildOrderRequest({
      instrumentId: instrument.id,
      side,
      orderType,
      quantity,
      limitPrice,
    })
    if (request === null) {
      failValidation('Revisá los datos de la orden', orderType === 'LIMIT' ? 'limitPrice' : null)
      return null
    }

    return request
  }

  // POST to the API and invalidate portfolio + orders in React Query
  function onSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault()
    const request = validateAndBuildRequest()
    if (request === null) {
      return
    }

    clearFormFeedback()
    order.mutate(request, {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
        void queryClient.invalidateQueries({ queryKey: orderKeys.all })
      },
    })
  }

  // If the order is FILLED or PENDING, OrderForm no shows the form anymore, only the result screen
  const successOutcome =
    order.isSuccess && (order.data.status === 'FILLED' || order.data.status === 'PENDING')
      ? { status: order.data.status, orderId: order.data.id }
      : null

  return {
    draft: {
      side,
      setSide,
      orderType,
      setOrderType,
      mode,
      setMode,
      shares,
      amount,
      limitPrice,
    },
    validation: {
      formError,
      invalidField,
    },
    preview: {
      quantity,
      notional,
      remainder,
    },
    limits: {
      maxShares,
      maxAmount,
      sliderSharesMax,
      sliderAmountMax,
      sliderSharesValue,
      sliderAmountValue,
      canUseAvailable,
    },
    portfolio: {
      holdingQuantity,
      cash,
      portfolioReady: portfolio.isSuccess,
    },
    warnings: {
      exceedsCash,
      exceedsPosition,
      rejection,
    },
    mutation: {
      order,
      successOutcome,
    },
    actions: {
      applyAvailable,
      formatAmountField,
      onSharesChange: onFieldEdit('shares'),
      onAmountChange: onFieldEdit('amount'),
      onLimitPriceChange: onFieldEdit('limitPrice'),
      onSliderChange,
      onSubmit,
    },
  }
}

export type { OrderFormViewModel } from '../types/orderForm.types'
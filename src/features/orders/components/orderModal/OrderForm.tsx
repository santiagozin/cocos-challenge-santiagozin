import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactElement } from 'react'
import type { Instrument } from '@/features/instruments/domain/instrument.types'
import { useOrderForm } from '@/features/orders/hooks/useOrderForm'
import { faSpinner } from '@/shared/icons'
import { formatArs } from '@/shared/lib/format'
import { instrumentMark } from '@/shared/lib/instrumentMark'
import { Badge, Button, SegmentedControl, TextField } from '@/shared/ui'
import { classNames } from '@/shared/ui/classNames'
import { ArgentinaFlagIcon } from './ArgentinaFlagIcon'
import { OrderOutcome } from './OrderOutcome'
import {
  MODE_OPTIONS,
  ORDER_STATUS_BADGE_LABEL,
  ORDER_STATUS_TONE,
  SIDE_OPTIONS,
  TYPE_OPTIONS,
} from './orderModal.constants'
import { orderStatusDetail } from './orderStatusDetail'

interface OrderFormProps {
  readonly instrument: Instrument
  readonly onClose: () => void
}

export function OrderForm({ instrument, onClose }: OrderFormProps): ReactElement {
  const { actions, draft, limits, mutation, portfolio, preview, validation, warnings } =
    useOrderForm(instrument)

  if (mutation.successOutcome !== null) {
    return (
      <OrderOutcome
        status={mutation.successOutcome.status}
        orderType={draft.orderType}
        orderId={mutation.successOutcome.orderId}
        onClose={onClose}
      />
    )
  }

  return (
    <form className="order-modal" onSubmit={actions.onSubmit} noValidate>
      <div className="order-modal__side" role="group" aria-label="Operación">
        {SIDE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={classNames(
              'order-modal__side-tab',
              option.value === 'BUY' ? 'order-modal__side-tab--buy' : 'order-modal__side-tab--sell',
              draft.side === option.value ? 'order-modal__side-tab--active' : undefined,
            )}
            aria-pressed={draft.side === option.value}
            onClick={() => {
              draft.setSide(option.value)
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="order-modal__main">
        <section className="order-modal__asset" aria-label="Activo">
          <div className="order-modal__asset-top">
            <div className="order-modal__instrument">
              <span className="order-modal__mark" aria-hidden>
                {instrumentMark(instrument.ticker)}
              </span>
              <div className="order-modal__instrument-copy">
                <p className="order-modal__name">{instrument.name}</p>
                <p className="order-modal__ticker">{instrument.ticker}</p>
              </div>
            </div>
            <span className="order-modal__ars">
              <ArgentinaFlagIcon />
              Pesos (ARS)
            </span>
          </div>
          <p className="order-modal__price">{formatArs(instrument.last_price)}</p>
          {portfolio.portfolioReady ? (
            <p className="order-modal__meta">Último precio</p>
          ) : (
            <p className="order-modal__meta">Último precio en pesos argentinos</p>
          )}
        </section>

        <section className="order-modal__section" aria-labelledby={`order-type-${instrument.id}`}>
          <h3 className="order-modal__section-title" id={`order-type-${instrument.id}`}>
            Tipo y modo
          </h3>
          <SegmentedControl
            label="Tipo de orden"
            value={draft.orderType}
            options={TYPE_OPTIONS}
            onChange={draft.setOrderType}
          />
          <p className="order-modal__hint">
            {draft.orderType === 'MARKET'
              ? 'Se ejecuta al enviar o el mercado la rechaza.'
              : 'Queda pendiente hasta alcanzar el precio límite.'}
          </p>
          <SegmentedControl
            label="Cómo ingresar la orden"
            value={draft.mode}
            options={MODE_OPTIONS}
            onChange={draft.setMode}
          />
        </section>

        <div className="order-modal__amount-block">
          {draft.mode === 'shares' ? (
            <TextField
              id={`order-shares-${instrument.id}`}
              label="Cantidad de acciones"
              inputMode="numeric"
              invalid={validation.invalidField === 'shares'}
              value={draft.shares}
              onChange={(event) => {
                actions.onSharesChange(event.target.value)
              }}
            />
          ) : (
            <TextField
              id={`order-amount-${instrument.id}`}
              label="Monto en pesos"
              inputMode="decimal"
              inputClassName="order-modal__amount-input"
              invalid={validation.invalidField === 'amount'}
              value={draft.amount}
              onChange={(event) => {
                actions.onAmountChange(event.target.value)
              }}
              onBlur={actions.formatAmountField}
            />
          )}

          <div className="order-modal__range">
            <div className="order-modal__range-label">
              <span>{draft.mode === 'shares' ? 'Ajustar cantidad' : 'Ajustar monto'}</span>
              <span>
                {draft.mode === 'shares'
                  ? `${limits.sliderSharesValue} / ${limits.maxShares} acciones`
                  : `${formatArs(limits.sliderAmountValue)} / ${formatArs(limits.maxAmount)}`}
              </span>
            </div>
            <input
              className="order-modal__range-input"
              type="range"
              min={0}
              max={draft.mode === 'shares' ? limits.sliderSharesMax : limits.sliderAmountMax}
              step={draft.mode === 'shares' ? 1 : 0.01}
              value={draft.mode === 'shares' ? limits.sliderSharesValue : limits.sliderAmountValue}
              disabled={
                draft.mode === 'shares' ? limits.maxShares < 1 : limits.maxAmount < instrument.last_price
              }
              aria-valuemin={0}
              aria-valuemax={draft.mode === 'shares' ? limits.maxShares : limits.maxAmount}
              aria-valuenow={draft.mode === 'shares' ? limits.sliderSharesValue : limits.sliderAmountValue}
              onChange={(event) => {
                actions.onSliderChange(Number(event.target.value))
              }}
            />
            {portfolio.portfolioReady ? (
              <p className="order-modal__balance">
                {draft.mode === 'shares'
                  ? draft.side === 'SELL' && portfolio.holdingQuantity > 0
                    ? `Disponible: ${limits.maxShares} activos`
                    : draft.side === 'BUY'
                      ? `Podés comprar hasta ${limits.maxShares} activos con ${formatArs(portfolio.cash)}`
                      : 'Sin acciones disponibles para vender'
                  : draft.side === 'BUY'
                    ? `Saldo disponible: ${formatArs(portfolio.cash)}`
                    : `Disponible para vender: hasta ${formatArs(limits.maxAmount)} (${portfolio.holdingQuantity} acciones)`}
              </p>
            ) : null}
            <button
              type="button"
              className="order-modal__quick"
              disabled={!limits.canUseAvailable}
              onClick={actions.applyAvailable}
            >
              Usar max
            </button>
          </div>
        </div>

        {draft.orderType === 'LIMIT' ? (
          <TextField
            id={`order-price-${instrument.id}`}
            label="Precio límite en pesos"
            inputMode="decimal"
            invalid={validation.invalidField === 'limitPrice'}
            value={draft.limitPrice}
            onChange={(event) => {
              actions.onLimitPriceChange(event.target.value)
            }}
          />
        ) : null}

        {preview.quantity !== null && preview.quantity >= 1 ? (
          <dl className="order-modal__summary">
            <div>
              <dt>Cantidad de activos a recibir</dt>
              <dd>{preview.quantity}</dd>
            </div>
            {preview.notional !== null ? (
              <div>
                <dt>{draft.orderType === 'LIMIT' ? 'Estimado al límite' : 'Estimado'}</dt>
                <dd>{formatArs(preview.notional)}</dd>
              </div>
            ) : null}
            {preview.remainder !== null && preview.remainder > 0 ? (
              <div>
                <dt>Sin invertir</dt>
                <dd>{formatArs(preview.remainder)}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {warnings.exceedsCash ? (
          <p className="order-modal__warning">
            El estimado supera el saldo disponible. El mercado puede rechazar la orden.
          </p>
        ) : null}
        {warnings.exceedsPosition ? (
          <p className="order-modal__warning">
            La cantidad supera tu posición. El mercado puede rechazar la orden.
          </p>
        ) : null}
        {warnings.rejection !== null ? (
          <div className="order-modal__result">
            <Badge tone="negative">Rechazada</Badge>
            <p>{warnings.rejection}</p>
          </div>
        ) : null}
        {mutation.order.isError && warnings.rejection === null ? (
          <p className="order-modal__error">No se pudo enviar la orden</p>
        ) : null}
        {mutation.order.isSuccess && mutation.order.data.status === 'REJECTED' ? (
          <div className="order-modal__result">
            <Badge tone={ORDER_STATUS_TONE.REJECTED}>{ORDER_STATUS_BADGE_LABEL.REJECTED}</Badge>
            <p>{orderStatusDetail(mutation.order.data.status, draft.orderType)}</p>
            <p className="order-modal__outcome-id">Orden {mutation.order.data.id}</p>
          </div>
        ) : null}
      </div>

      <footer className="order-modal__footer">
        {validation.formError !== null ? (
          <p className="order-modal__form-alert" role="alert">
            {validation.formError}
          </p>
        ) : null}
        <Button
          className={classNames(
            'order-modal__submit',
            draft.side === 'SELL' ? 'order-modal__submit--sell' : undefined,
          )}
          type="submit"
          disabled={mutation.order.isPending}
          aria-busy={mutation.order.isPending}
        >
          {mutation.order.isPending ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="order-modal__submit-spinner" aria-hidden />
              Procesando
            </>
          ) : draft.side === 'BUY' ? (
            'Comprar'
          ) : (
            'Vender'
          )}
        </Button>
      </footer>
    </form>
  )
}
import type { ReactElement } from 'react'

export function OrderSuccessCheck(): ReactElement {
  return (
    <span className="order-modal__check" aria-hidden>
      <svg className="order-modal__check-svg" viewBox="0 0 52 52">
        <circle className="order-modal__check-circle" cx="26" cy="26" r="23" />
        <path className="order-modal__check-mark" d="M15 27.5 22.5 35 37.5 18.5" />
      </svg>
    </span>
  )
}
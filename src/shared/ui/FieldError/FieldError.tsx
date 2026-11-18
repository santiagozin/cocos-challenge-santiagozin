import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactElement } from 'react'
import { faCircleInfo } from '@/shared/icons'
import './FieldError.scss'

interface FieldErrorProps {
  readonly id: string
  readonly message: string
}

export function FieldError({ id, message }: FieldErrorProps): ReactElement {
  return (
    <p id={id} className="field-error" role="alert">
      <FontAwesomeIcon className="field-error__icon" icon={faCircleInfo} aria-hidden />
      <span className="field-error__message">{message}</span>
    </p>
  )
}
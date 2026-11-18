import type { InputHTMLAttributes, ReactElement } from 'react'
import { classNames } from '../classNames'
import { FieldError } from '../FieldError/FieldError'
import './TextField.scss'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> {
  readonly id: string
  readonly label: string
  readonly error?: string
  readonly invalid?: boolean
  readonly inputClassName?: string
}

export function TextField({
  id,
  label,
  error,
  invalid = false,
  inputClassName,
  ...rest
}: TextFieldProps): ReactElement {
  const hasMessage = error !== undefined && error.length > 0
  const hasError = invalid || hasMessage
  const errorId = `${id}-error`

  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        {...rest}
        id={id}
        className={classNames('text-field__input', inputClassName)}
        aria-invalid={hasError}
        {...(hasMessage ? { 'aria-describedby': errorId } : {})}
      />
      {hasMessage ? <FieldError id={errorId} message={error} /> : null}
    </div>
  )
}

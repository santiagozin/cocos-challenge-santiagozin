import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, type InputHTMLAttributes, type ReactElement } from 'react'
import { faEye, faEyeSlash } from '@/shared/icons'
import { FieldError } from '../FieldError/FieldError'
import './PasswordField.scss'

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'type'> {
  readonly id: string
  readonly label: string
  readonly error?: string
}

export function PasswordField({
  id,
  label,
  error,
  ...rest
}: PasswordFieldProps): ReactElement {
  const [visible, setVisible] = useState(false)
  const hasError = error !== undefined && error.length > 0
  const errorId = `${id}-error`

  return (
    <div className="password-field">
      <label className="password-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="password-field__control">
        <input
          {...rest}
          id={id}
          type={visible ? 'text' : 'password'}
          className="password-field__input"
          aria-invalid={hasError}
          {...(hasError ? { 'aria-describedby': errorId } : {})}
        />
        <button
          type="button"
          className="password-field__toggle"
          aria-pressed={visible}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          onClick={() => {
            setVisible((current) => !current)
          }}
        >
          <FontAwesomeIcon
            className="password-field__icon"
            icon={visible ? faEyeSlash : faEye}
            aria-hidden
          />
        </button>
      </div>
      {hasError ? <FieldError id={errorId} message={error} /> : null}
    </div>
  )
}
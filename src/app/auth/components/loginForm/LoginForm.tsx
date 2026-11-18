import { useLayoutEffect, useRef, useState, type ReactElement, type SubmitEvent } from 'react'
import { Button, PasswordField, TextField } from '@/shared/ui'
import { classNames } from '@/shared/ui/classNames'
import { useLoginForm } from '../../hooks/useLoginForm'
import { LoginDemoBanner } from '../loginDemoBanner/LoginDemoBanner'
import { LoginLogo } from '../loginLogo/LoginLogo'
import { LoginSuccessView } from '../loginSuccessView/LoginSuccessView'
import './LoginForm.scss'

const EMAIL_MAX_LENGTH = 254
const PASSWORD_MAX_LENGTH = 128

export function LoginForm(): ReactElement {
  const formRef = useRef<HTMLFormElement>(null)
  const [stageMinHeight, setStageMinHeight] = useState<number | undefined>(undefined)
  const {
    email,
    password,
    canSubmit,
    flowPhase,
    onFieldChange,
    onFieldBlur,
    onSubmit,
    ...fieldErrors
  } = useLoginForm()

  const isTransitioning = flowPhase !== 'form'

  useLayoutEffect(() => {
    if (isTransitioning) {
      return
    }

    const formElement = formRef.current
    if (formElement === null) {
      return
    }

    const nextHeight = formElement.offsetHeight
    if (nextHeight > 0) {
      setStageMinHeight(nextHeight)
    }
  }, [isTransitioning, email, password, fieldErrors.emailError, fieldErrors.passwordError])

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault()
    onSubmit()
  }

  const stageStyle =
    stageMinHeight !== undefined ? ({ minHeight: `${String(stageMinHeight)}px` } as const) : undefined

  return (
    <div className="login__stage" style={stageStyle}>
      <form
        ref={formRef}
        className={classNames(
          'login__panel',
          'login__scene',
          'login__scene--form',
          isTransitioning ? 'login__scene--form-out' : 'login__scene--form-active',
        )}
        noValidate
        onSubmit={handleSubmit}
        aria-hidden={isTransitioning}
      >
        <LoginLogo />
        <h1 className="login__title">Ingresá a tu cuenta</h1>
        <LoginDemoBanner />
        <TextField
          id="login-email"
          label="Mail"
          placeholder="user@mail.com"
          type="email"
          autoComplete="email"
          value={email}
          maxLength={EMAIL_MAX_LENGTH}
          required
          spellCheck={false}
          inputMode="email"
          {...(fieldErrors.emailError !== undefined ? { error: fieldErrors.emailError } : {})}
          onChange={(event) => {
            onFieldChange('email', event.target.value)
          }}
          onBlur={() => {
            onFieldBlur('email')
          }}
        />
        <PasswordField
          id="login-password"
          label="Contraseña"
          placeholder="Ingresá tu contraseña"
          autoComplete="current-password"
          value={password}
          minLength={6}
          maxLength={PASSWORD_MAX_LENGTH}
          required
          {...(fieldErrors.passwordError !== undefined ? { error: fieldErrors.passwordError } : {})}
          onChange={(event) => {
            onFieldChange('password', event.target.value)
          }}
          onBlur={() => {
            onFieldBlur('password')
          }}
        />
        <Button className="login__submit" type="submit" disabled={!canSubmit}>
          Continuar
        </Button>
      </form>
      {isTransitioning ? (
        <div className="login__scene login__scene--success login__scene--success-in">
          <LoginSuccessView phase={flowPhase} />
        </div>
      ) : null}
    </div>
  )
}
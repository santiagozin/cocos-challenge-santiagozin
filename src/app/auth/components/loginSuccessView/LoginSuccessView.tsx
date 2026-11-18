import type { ReactElement } from 'react'
import type { LoginSuccessPhase } from '../../types/loginForm.types'
import { LoginLogo } from '../loginLogo/LoginLogo'
import './LoginSuccessView.scss'

interface LoginSuccessViewProps {
  readonly phase: LoginSuccessPhase
}

export function LoginSuccessView({ phase }: LoginSuccessViewProps): ReactElement {
  return (
    <div
      className="login-success"
      aria-live="polite"
      aria-busy={phase === 'loading'}
      aria-label={phase === 'loading' ? 'Ingresando' : undefined}
    >
      <div key={phase} className="login-success__step">
        {phase === 'loading' ? (
          <span className="login-success__spinner" aria-hidden="true" />
        ) : (
          <>
            <LoginLogo />
            <p className="login-success__message">¡Bienvenido nuevamente!</p>
          </>
        )}
      </div>
    </div>
  )
}
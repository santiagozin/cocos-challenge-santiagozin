import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactElement } from 'react'
import { faCircleInfo } from '@/shared/icons'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../../domain/demoCredentials'
import './LoginDemoBanner.scss'

export function LoginDemoBanner(): ReactElement {
  return (
    <div className="login-demo-banner" role="note">
      <FontAwesomeIcon
        className="login-demo-banner__icon"
        icon={faCircleInfo}
        aria-hidden
      />
      <div className="login-demo-banner__content">
        <p className="login-demo-banner__title">Credenciales de demo</p>
        <p className="login-demo-banner__credentials">
          <span className="login-demo-banner__pair">
            <span className="login-demo-banner__label">Email:</span>{' '}
            <strong className="login-demo-banner__credential">{DEMO_EMAIL}</strong>
          </span>
          <span className="login-demo-banner__divider" aria-hidden="true">
            |
          </span>
          <span className="login-demo-banner__pair">
            <span className="login-demo-banner__label">Contraseña:</span>{' '}
            <strong className="login-demo-banner__credential">{DEMO_PASSWORD}</strong>
          </span>
        </p>
      </div>
    </div>
  )
}
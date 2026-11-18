import type { ReactElement } from 'react'
import logoSrc from '@/assets/logo.png'
import './LoginLogo.scss'

export function LoginLogo(): ReactElement {
  return (
    <div className="login-logo">
      <img
        className="login-logo__mark"
        src={logoSrc}
        width={72}
        height={72}
        alt=""
        decoding="async"
      />
      <span className="login-logo__text">
        <span className="login-logo__name">Cocos</span>
        <span className="login-logo__tag">Challenge | Frontend</span>
      </span>
    </div>
  )
}
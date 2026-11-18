import type { ButtonHTMLAttributes, ReactElement, Ref } from 'react'
import { classNames } from '../classNames'
import './Button.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant
  readonly ref?: Ref<HTMLButtonElement>
}

export function Button({
  variant = 'primary',
  type = 'button',
  className,
  children,
  ref,
  ...rest
}: ButtonProps): ReactElement {
  return (
    <button
      ref={ref}
      type={type}
      className={classNames('button', `button--${variant}`, className)}
      {...rest}
    >
      {children}
    </button>
  )
}

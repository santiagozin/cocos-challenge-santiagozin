const EMAIL_MAX_LENGTH = 254
const PASSWORD_MIN_LENGTH = 6
const PASSWORD_MAX_LENGTH = 128

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface LoginFieldErrors {
  readonly email?: string
  readonly password?: string
}

export function validateLoginEmail(email: string): string | undefined {
  const trimmedEmail = email.trim()

  if (trimmedEmail.length === 0) {
    return 'Ingresá un email válido'
  }
  if (trimmedEmail.length > EMAIL_MAX_LENGTH) {
    return `El email no puede superar ${String(EMAIL_MAX_LENGTH)} caracteres`
  }
  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return 'Ingresá un email con formato completo'
  }

  return undefined
}

export function validateLoginPassword(password: string): string | undefined {
  if (password.length === 0) {
    return 'Ingresá tu contraseña'
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${String(PASSWORD_MIN_LENGTH)} caracteres`
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `La contraseña no puede superar ${String(PASSWORD_MAX_LENGTH)} caracteres`
  }

  return undefined
}

export function hasLoginFieldErrors(errors: LoginFieldErrors): boolean {
  return errors.email !== undefined || errors.password !== undefined
}

export function validateLoginFields(email: string, password: string): LoginFieldErrors {
  const emailError = validateLoginEmail(email)
  const passwordError = validateLoginPassword(password)

  return {
    ...(emailError !== undefined ? { email: emailError } : {}),
    ...(passwordError !== undefined ? { password: passwordError } : {}),
  }
}

/** @deprecated Usar validateLoginEmail */
export function validateLoginUsername(username: string): string | undefined {
  return validateLoginEmail(username)
}
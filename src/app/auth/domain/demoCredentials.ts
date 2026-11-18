/** User shown in session after demo login. */
export const DEMO_USERNAME = 'demo'
export const DEMO_EMAIL = 'demo@cocos.capital'
export const DEMO_PASSWORD = 'cocos-demo'

export function authenticateLogin(email: string, password: string): string | null {
  const normalizedEmail = email.trim().toLowerCase()
  if (normalizedEmail !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return null
  }

  return DEMO_USERNAME
}

/** @deprecated Use authenticateLogin */
export function sessionUsername(email: string, password: string): string | null {
  return authenticateLogin(email, password)
}
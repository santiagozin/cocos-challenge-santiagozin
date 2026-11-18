import { AUTH_STATUS, type AuthState } from './authSlice'

const AUTH_SESSION_KEY = 'cocos.auth.session'

interface StoredAuthSession {
  readonly username: string
}

function isStoredAuthSession(value: unknown): value is StoredAuthSession {
  return (
    typeof value === 'object' &&
    value !== null &&
    'username' in value &&
    typeof (value as StoredAuthSession).username === 'string' &&
    (value as StoredAuthSession).username.length > 0
  )
}

export function readStoredAuth(): AuthState | undefined {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY)
    if (raw === null) {
      return undefined
    }

    const parsed: unknown = JSON.parse(raw)
    if (!isStoredAuthSession(parsed)) {
      sessionStorage.removeItem(AUTH_SESSION_KEY)
      return undefined
    }

    return {
      status: AUTH_STATUS.authenticated,
      username: parsed.username,
    }
  } catch {
    sessionStorage.removeItem(AUTH_SESSION_KEY)
    return undefined
  }
}

export function writeStoredAuth(username: string): void {
  const payload: StoredAuthSession = { username }
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(payload))
}

export function clearStoredAuth(): void {
  sessionStorage.removeItem(AUTH_SESSION_KEY)
}
import type { Middleware } from '@reduxjs/toolkit'
import { AUTH_STATUS, login, logout } from './authSlice'
import { clearStoredAuth, writeStoredAuth } from './authSessionStorage'

export const authPersistMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)

  if (login.match(action)) {
    const auth = store.getState().auth
    if (auth.status === AUTH_STATUS.authenticated) {
      writeStoredAuth(auth.username)
    }
  }

  if (logout.match(action)) {
    clearStoredAuth()
  }

  return result
}
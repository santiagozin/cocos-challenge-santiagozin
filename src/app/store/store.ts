import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './auth/authSlice'
import { authPersistMiddleware } from './auth/authPersistMiddleware'
import { readStoredAuth } from './auth/authSessionStorage'

export function createAppStore() {
  const persistedAuth = readStoredAuth()

  return configureStore({
    reducer: {
      auth: authReducer,
    },
    ...(persistedAuth !== undefined
      ? { preloadedState: { auth: persistedAuth } }
      : {}),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authPersistMiddleware),
  })
}

export const store = createAppStore()

export type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const AUTH_STATUS = {
  anonymous: 'anonymous',
  authenticated: 'authenticated',
} as const

export interface AnonymousAuthState {
  readonly status: typeof AUTH_STATUS.anonymous
}

export interface AuthenticatedAuthState {
  readonly status: typeof AUTH_STATUS.authenticated
  readonly username: string
}

export type AuthState = AnonymousAuthState | AuthenticatedAuthState

export interface LoginPayload {
  readonly username: string
}

const initialState = {
  status: AUTH_STATUS.anonymous,
} as AuthState

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(_state, action: PayloadAction<LoginPayload>): AuthState {
      return {
        status: AUTH_STATUS.authenticated,
        username: action.payload.username,
      }
    },
    logout(): AuthState {
      return { status: AUTH_STATUS.anonymous }
    },
  },
})

export const { login, logout } = authSlice.actions
export const authReducer = authSlice.reducer

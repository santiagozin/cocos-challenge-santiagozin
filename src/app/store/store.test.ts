import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_USERNAME, sessionUsername } from '@/app/auth'
import { clearStoredAuth } from './auth/authSessionStorage'
import { AUTH_STATUS, login, logout } from './auth/authSlice'
import { createAppStore } from './store'

describe('auth store', () => {
  afterEach(() => {
    clearStoredAuth()
  })

  it('starts anonymous', () => {
    const store = createAppStore()

    expect(store.getState().auth.status).toBe(AUTH_STATUS.anonymous)
  })

  it('authenticates the demo user when the credentials match', () => {
    const store = createAppStore()
    const username = sessionUsername(DEMO_EMAIL, DEMO_PASSWORD)
    if (username === null) {
      throw new Error('Expected demo credentials to match')
    }

    store.dispatch(login({ username }))

    expect(store.getState().auth).toEqual({
      status: AUTH_STATUS.authenticated,
      username: DEMO_USERNAME,
    })
  })

  it('stays anonymous when the credentials do not match', () => {
    const store = createAppStore()
    const username = sessionUsername(DEMO_EMAIL, 'incorrecta')
    if (username !== null) {
      store.dispatch(login({ username }))
    }

    expect(store.getState().auth.status).toBe(AUTH_STATUS.anonymous)
  })

  it('returns to anonymous on logout', () => {
    const store = createAppStore()
    store.dispatch(login({ username: DEMO_USERNAME }))

    store.dispatch(logout())

    expect(store.getState().auth.status).toBe(AUTH_STATUS.anonymous)
  })
})

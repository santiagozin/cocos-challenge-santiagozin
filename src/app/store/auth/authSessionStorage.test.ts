import { AUTH_STATUS, login } from './authSlice'
import { clearStoredAuth, readStoredAuth, writeStoredAuth } from './authSessionStorage'
import { createAppStore } from '../store'

describe('authSessionStorage', () => {
  afterEach(() => {
    clearStoredAuth()
  })

  it('restores the session when createAppStore runs after login', () => {
    const store = createAppStore()
    store.dispatch(login({ username: 'demo' }))

    const restored = readStoredAuth()
    expect(restored).toEqual({
      status: AUTH_STATUS.authenticated,
      username: 'demo',
    })

    const nextStore = createAppStore()
    expect(nextStore.getState().auth).toEqual({
      status: AUTH_STATUS.authenticated,
      username: 'demo',
    })
  })

  it('clears invalid stored payloads', () => {
    sessionStorage.setItem('cocos.auth.session', '{"oops":true}')
    expect(readStoredAuth()).toBeUndefined()
    expect(sessionStorage.getItem('cocos.auth.session')).toBeNull()
  })

  it('writeStoredAuth and clearStoredAuth manage sessionStorage', () => {
    writeStoredAuth('demo')
    const stored = readStoredAuth()
    expect(stored?.status).toBe(AUTH_STATUS.authenticated)
    if (stored?.status === AUTH_STATUS.authenticated) {
      expect(stored.username).toBe('demo')
    }
    clearStoredAuth()
    expect(readStoredAuth()).toBeUndefined()
  })
})
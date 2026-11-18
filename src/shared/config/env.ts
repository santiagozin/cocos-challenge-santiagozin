const ALLOWED_API_ORIGIN = 'https://dummy-api-topaz.vercel.app'
const BUG_LEVELS = ['off', 'easy', 'medium', 'hard'] as const

export type BugLevel = (typeof BUG_LEVELS)[number]

const DEFAULT_INSTRUMENTS_POLL_MS = 10_000
const MIN_INSTRUMENTS_POLL_MS = 1_000

export interface AppEnv {
  readonly apiBaseUrl: string
  readonly candidateId: string
  readonly enableBugs: BugLevel
  readonly requestTimeoutMs: number
  readonly instrumentsPollMs: number
}

const REQUEST_TIMEOUT_MS = 5_000

function isBugLevel(value: string): value is BugLevel {
  return (BUG_LEVELS as readonly string[]).includes(value)
}

function readApiBaseUrl(value: string | undefined): string {
  if (value === undefined || value.length === 0) {
    return ALLOWED_API_ORIGIN
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error('Invalid config: VITE_API_BASE_URL')
  }

  if (url.origin !== ALLOWED_API_ORIGIN || url.protocol !== 'https:') {
    throw new Error('Invalid config: VITE_API_BASE_URL')
  }

  return url.origin
}

function readBugLevel(value: string | undefined): BugLevel {
  if (value !== undefined && isBugLevel(value)) {
    return value
  }

  return 'off'
}

export function readInstrumentsPollMs(value: string | undefined): number {
  if (value === undefined || value.trim().length === 0) {
    return DEFAULT_INSTRUMENTS_POLL_MS
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < MIN_INSTRUMENTS_POLL_MS) {
    return DEFAULT_INSTRUMENTS_POLL_MS
  }

  return parsed
}

export function readEnv(): AppEnv {
  return {
    apiBaseUrl: readApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
    candidateId: import.meta.env.VITE_CANDIDATE_ID?.trim() ?? '',
    enableBugs: readBugLevel(import.meta.env.VITE_ENABLE_BUGS),
    requestTimeoutMs: REQUEST_TIMEOUT_MS,
    instrumentsPollMs: readInstrumentsPollMs(import.meta.env.VITE_INSTRUMENTS_POLL_MS),
  }
}

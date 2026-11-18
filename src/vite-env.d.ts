export {}

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string
    readonly VITE_CANDIDATE_ID?: string
    readonly VITE_ENABLE_BUGS?: string
    readonly VITE_INSTRUMENTS_POLL_MS?: string
  }
}

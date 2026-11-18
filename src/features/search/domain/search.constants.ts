/** Max length for API `GET /search?query=` (ticker-oriented). */
export const TICKER_QUERY_MAX_LENGTH = 32

/** Max length for the instruments list filter input (names can be long). */
export const SEARCH_QUERY_MAX_LENGTH = 64

export const SEARCH_DEBOUNCE_MS = 300

/** Max parallel `/search` calls after the primary query returns empty. */
export const SEARCH_MAX_API_FANOUT = 5
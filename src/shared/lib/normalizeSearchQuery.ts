/** Locale used to compare search text in the app. */
export const SEARCH_TEXT_LOCALE = 'es-AR'

/** Prepare the search text: without borders, a space between words and lowercase. */
export function normalizeSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ').toLocaleLowerCase(SEARCH_TEXT_LOCALE)
}
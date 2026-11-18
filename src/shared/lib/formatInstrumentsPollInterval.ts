const MS_PER_SECOND = 1_000
const MS_PER_MINUTE = 60_000

export function formatInstrumentsPollInterval(pollMs: number): string {
  if (pollMs >= MS_PER_MINUTE && pollMs % MS_PER_MINUTE === 0) {
    const minutes = pollMs / MS_PER_MINUTE
    return minutes === 1 ? '1 minuto' : `${minutes} minutos`
  }

  const seconds = Math.max(1, Math.round(pollMs / MS_PER_SECOND))
  return seconds === 1 ? '1 segundo' : `${seconds} segundos`
}
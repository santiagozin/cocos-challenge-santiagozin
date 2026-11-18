export function classNames(...names: Array<string | undefined>): string {
  return names.filter((name) => name !== undefined && name.length > 0).join(' ')
}

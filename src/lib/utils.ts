export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function humanizeCanonLocation(value: string) {
  return value
    .split('-')
    .map((segment) =>
      segment
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (m) => m.toUpperCase()),
    )
    .join(' · ')
}
/**
 * Parse display dates like "12 Aug 2026" into Date (local).
 */
export function parseDisplayDate(value: string): Date | null {
  const trimmed = value.trim().replace(/\u00a0|\u202f/g, ' ');
  if (!trimmed) {
    return null;
  }

  const match = /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/.exec(trimmed);
  if (match) {
    const months: Record<string, number> = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const day = Number.parseInt(match[1], 10);
    const month = months[match[2]];
    const year = Number.parseInt(match[3], 10);

    if (month != null && !Number.isNaN(day) && !Number.isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed);
  }

  return null;
}

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Deterministic display date — always parseable by `parseDisplayDate`. */
export function formatDisplayDate(date: Date): string {
  return `${date.getDate()} ${MONTH_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

export function toIsoDate(date: Date): string {
  return date.toISOString();
}

/** Local calendar date as `YYYY-MM-DD` (for native / web date inputs). */
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

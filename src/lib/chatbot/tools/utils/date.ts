/**
 * Parse date string in DD-MM-YYYY or YYYY-MM-DD format.
 * Returns null if invalid.
 */
export function parseDate(s: string): Date | null {
  const raw = s.trim();
  const parts = raw.split("-");
  if (parts.length !== 3) return null;
  let day: number, month: number, year: number;
  const a = parseInt(parts[0], 10);
  const b = parseInt(parts[1], 10);
  const c = parseInt(parts[2], 10);
  if (parts[0].length === 4) {
    year = a;
    month = b - 1;
    day = c;
  } else {
    day = a;
    month = b - 1;
    year = c;
  }
  if (
    day < 1 ||
    day > 31 ||
    month < 0 ||
    month > 11 ||
    year < 2000 ||
    year > 2100
  )
    return null;
  const d = new Date(year, month, day);
  if (isNaN(d.getTime())) return null;
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month ||
    d.getDate() !== day
  )
    return null;
  return d;
}

export function toUTCStartOfDay(d: Date): Date {
  return new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      0,
      0,
      0,
      0,
    ),
  );
}

export function toUTCEndOfDay(d: Date): Date {
  return new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      23,
      59,
      59,
      999,
    ),
  );
}

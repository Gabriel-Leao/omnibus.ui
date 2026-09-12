/**
 * Native `<input type="date">` shows its own locale-formatted placeholder
 * ("dd/mm/yyyy", blank day/month/year boxes, ...) — that comes from the
 * browser's own UI locale, not from this page's language or its `lang`
 * attribute, so it can't be made to say "aaaa" when the app is in
 * Portuguese. A plain masked text field sidesteps that: the placeholder is
 * just copy from the translation dictionary like everything else on the
 * page, and the format follows the app's language instead of the browser's.
 */
export type DateOrder = 'dmy' | 'mdy';

/**
 * Formats raw keystrokes into a `dd/mm/aaaa`- or `mm/dd/yyyy`-shaped string
 * as the user types: keeps digits only, caps at 8 of them, and inserts the
 * separating slashes. `order` only changes where the slashes land — the
 * digit grouping is the same either way.
 */
export function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Parses a fully-typed masked value into an ISO `yyyy-MM-dd` string (what
 * `LocalDate birthDate` on the API expects, and what `isAtLeastAge` already
 * takes). Returns `null` for anything incomplete or not a real calendar
 * date, rather than guessing.
 */
export function parseDateInputToIso(display: string, order: DateOrder): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(display);
  if (!match) {
    return null;
  }

  const [, first, second, year] = match;
  const day = order === 'dmy' ? first : second;
  const month = order === 'dmy' ? second : first;

  const iso = `${year}-${month}-${day}`;
  const parsed = new Date(iso);
  const isRealCalendarDate =
    !Number.isNaN(parsed.getTime()) &&
    parsed.getUTCFullYear() === Number(year) &&
    parsed.getUTCMonth() + 1 === Number(month) &&
    parsed.getUTCDate() === Number(day);

  return isRealCalendarDate ? iso : null;
}

const TR_TIMEZONE = 'Europe/Istanbul';
const TR_LOCALE = 'tr-TR';

function toDate(input: Date | string | number | null | undefined): Date | null {
  if (input === null || input === undefined || input === '') return null;
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatTRDate(input: Date | string | number | null | undefined): string {
  const d = toDate(input);
  if (!d) return '';
  return new Intl.DateTimeFormat(TR_LOCALE, {
    timeZone: TR_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatTRDateShort(input: Date | string | number | null | undefined): string {
  const d = toDate(input);
  if (!d) return '';
  return new Intl.DateTimeFormat(TR_LOCALE, {
    timeZone: TR_TIMEZONE,
    day: 'numeric',
    month: 'short',
  }).format(d);
}

export function formatTRDateNumeric(input: Date | string | number | null | undefined): string {
  const d = toDate(input);
  if (!d) return '';
  return new Intl.DateTimeFormat(TR_LOCALE, {
    timeZone: TR_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatTRTime(input: Date | string | number | null | undefined): string {
  const d = toDate(input);
  if (!d) return '';
  return new Intl.DateTimeFormat(TR_LOCALE, {
    timeZone: TR_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatTRDateTime(input: Date | string | number | null | undefined): string {
  const d = toDate(input);
  if (!d) return '';
  return new Intl.DateTimeFormat(TR_LOCALE, {
    timeZone: TR_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatTRDateTimeNumeric(input: Date | string | number | null | undefined): string {
  const d = toDate(input);
  if (!d) return '';
  return new Intl.DateTimeFormat(TR_LOCALE, {
    timeZone: TR_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

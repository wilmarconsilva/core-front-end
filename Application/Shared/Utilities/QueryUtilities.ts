import { toApiDateTime } from './DateTimeUtilities';

/** Garante que uma data nunca chegue à API no formato local do `toString()` do JavaScript. */
function serializeQueryValue(value: unknown): string {
  return value instanceof Date ? toApiDateTime(value) : String(value);
}

/** Serializes a filter object into a URL query string, skipping null/undefined/empty values. */
export function buildQueryParams(obj: unknown): string {
  if (!obj || typeof obj !== 'object') return '';
  return Object.entries(obj as Record<string, unknown>)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(serializeQueryValue(v))}`)
    .join('&');
}

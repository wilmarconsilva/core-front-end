/** Serializes a filter object into a URL query string, skipping null/undefined/empty values. */
export function buildQueryParams(obj: unknown): string {
  if (!obj || typeof obj !== 'object') return '';
  return Object.entries(obj as Record<string, unknown>)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

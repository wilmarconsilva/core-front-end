/** Formats a numeric value as BRL currency (ex.: "R$ 1.234,56"). */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Formats an ISO date-time as pt-BR date and time; returns '' when absent or invalid. */
export function formatDateTime(value?: string | null): string {
  if (!value) return '';

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('pt-BR');
}

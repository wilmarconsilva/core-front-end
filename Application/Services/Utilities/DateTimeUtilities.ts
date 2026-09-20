/**
 * Adapter entre as datas manipuladas na aplicação e o formato aceito pela API.
 *
 * A API persiste datas em colunas PostgreSQL `timestamp with time zone`, que exigem
 * um instante absoluto: uma data sem fuso chega ao backend como `DateTimeKind.Unspecified`
 * e é rejeitada pelo driver. Por isso toda data que sai daqui é convertida para
 * ISO 8601 em UTC (ex.: `2026-09-19T03:00:00.000Z`) — o único formato que resulta em
 * `Kind=Utc` tanto no model binding de query string quanto na desserialização do corpo.
 *
 * As datas digitadas pelo usuário representam um dia no fuso local do dispositivo.
 * A conversão preserva esse significado transformando o dia local no instante
 * correspondente em UTC.
 */

/** Formato emitido pelo `<input type="date">` da web. */
const ISO_DAY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Formato digitado manualmente nas plataformas nativas (dd/mm/aaaa). */
const BRAZILIAN_DAY_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const START_OF_DAY = [0, 0, 0, 0] as const;
const END_OF_DAY = [23, 59, 59, 999] as const;

type DayParts = { year: number; month: number; day: number };
type TimeParts = readonly [hours: number, minutes: number, seconds: number, milliseconds: number];

function parseDayParts(value: string): DayParts | undefined {
  const isoDay = ISO_DAY_PATTERN.exec(value);
  if (isoDay) return { year: Number(isoDay[1]), month: Number(isoDay[2]), day: Number(isoDay[3]) };

  const brazilianDay = BRAZILIAN_DAY_PATTERN.exec(value);
  if (brazilianDay) return { year: Number(brazilianDay[3]), month: Number(brazilianDay[2]), day: Number(brazilianDay[1]) };

  return undefined;
}

/**
 * O construtor de `Date` normaliza valores fora de faixa (31/02 vira 03/03), o que
 * silenciosamente pesquisaria um período diferente do informado. Comparar o resultado
 * com a entrada é a forma de distinguir uma data real de uma digitação inválida.
 */
function toLocalDate(parts: DayParts, time: TimeParts): Date | undefined {
  const [hours, minutes, seconds, milliseconds] = time;
  const date = new Date(parts.year, parts.month - 1, parts.day, hours, minutes, seconds, milliseconds);

  const wasNormalized = date.getFullYear() !== parts.year ||
                        date.getMonth() !== parts.month - 1 ||
                        date.getDate() !== parts.day;

  return wasNormalized ? undefined : date;
}

function toDayBoundary(value: string | undefined, time: TimeParts): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const parts = parseDayParts(trimmed);
  if (!parts) return toApiDateTime(trimmed);

  const date = toLocalDate(parts, time);

  return date ? date.toISOString() : trimmed;
}

/**
 * Converte um instante para ISO 8601 em UTC.
 *
 * Valores que não representam uma data são devolvidos intactos, para que a validação
 * continue sendo responsabilidade da API em vez de virar um filtro silenciosamente
 * descartado ou alterado.
 */
export function toApiDateTime(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

/** Início do dia informado (00:00:00.000 no fuso local) em ISO 8601 UTC. */
export function toApiDayStart(value?: string): string | undefined {
  return toDayBoundary(value, START_OF_DAY);
}

/** Fim do dia informado (23:59:59.999 no fuso local) em ISO 8601 UTC. */
export function toApiDayEnd(value?: string): string | undefined {
  return toDayBoundary(value, END_OF_DAY);
}

/** Milissegundos desde a época; `undefined` quando o valor não é uma data válida. */
export function toTimestamp(value?: string): number | undefined {
  if (!value) return undefined;

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? undefined : timestamp;
}

// =====================================================================
// Regla global de fechas de IKK Solutions.
//
// La base guarda todo en UTC (y en Railway/Vercel el servidor corre en UTC),
// pero el operador lee y captura en hora de México. Si formateamos con la zona
// del navegador o del servidor, las horas se ven corridas y las fechas "saltan"
// de día.
//
// Regla:
//   • SALIDA (mostrar): siempre en la zona de la región (México), sin importar
//     dónde corra el navegador.
//   • ENTRADA (guardar): lo capturado se interpreta como hora de México y se
//     convierte al instante UTC correcto.
//   • FECHAS SIN HORA (vencimientos, cortes): calendario puro en UTC para que
//     nunca se corran un día.
//
// Usa SIEMPRE estos helpers. Nunca `new Date(x).toLocaleDateString()` suelto
// ni `toISOString().split("T")[0]`.
//
// Mismo criterio que mdoc/frontend/src/lib/datetime.ts y
// tickomium/frontend/src/utils/timezone.ts.
// =====================================================================

import { es } from "date-fns/locale";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

/** Zona horaria de la región. Único lugar donde se define. */
export const APP_TIME_ZONE = "America/Mexico_City";

type DateInput = Date | string | number | null | undefined;

/** Lo que se muestra cuando no hay dato. */
export const EMPTY_DATE = "—";

function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// ---------------------------------------------------------------------
// SALIDA — instantes guardados en UTC → hora de México
// ---------------------------------------------------------------------

/** Fecha y hora: "4 jul 2026, 14:30". */
export function formatDateTime(value: DateInput): string {
  const d = toDate(value);
  return d
    ? formatInTimeZone(d, APP_TIME_ZONE, "d MMM yyyy, HH:mm", { locale: es })
    : EMPTY_DATE;
}

/** Sólo fecha: "4 jul 2026". */
export function formatDate(value: DateInput): string {
  const d = toDate(value);
  return d
    ? formatInTimeZone(d, APP_TIME_ZONE, "d MMM yyyy", { locale: es })
    : EMPTY_DATE;
}

/** Fecha larga: "4 de julio de 2026". */
export function formatDateLong(value: DateInput): string {
  const d = toDate(value);
  return d
    ? formatInTimeZone(d, APP_TIME_ZONE, "d 'de' MMMM 'de' yyyy", { locale: es })
    : EMPTY_DATE;
}

/** Sólo hora: "14:30". */
export function formatTime(value: DateInput): string {
  const d = toDate(value);
  return d
    ? formatInTimeZone(d, APP_TIME_ZONE, "HH:mm", { locale: es })
    : EMPTY_DATE;
}

/** Fecha de calendario pura (sin hora), leída en UTC: "14 may 1990". */
export function formatDateOnly(value: DateInput): string {
  const d = toDate(value);
  return d ? formatInTimeZone(d, "UTC", "d MMM yyyy", { locale: es }) : EMPTY_DATE;
}

// ---------------------------------------------------------------------
// SALIDA — tiempo relativo, para listas de actividad
// ---------------------------------------------------------------------

/** "hace 5 minutos", "hace 2 horas", "ayer"… y fecha corta a partir de 7 días. */
export function formatRelative(value: DateInput): string {
  const d = toDate(value);
  if (!d) return EMPTY_DATE;

  const diffMs = Date.now() - d.getTime();
  const future = diffMs < 0;
  const abs = Math.abs(diffMs);

  const minutes = Math.floor(abs / 60_000);
  const hours = Math.floor(abs / 3_600_000);
  const days = Math.floor(abs / 86_400_000);

  if (minutes < 1) return "hace un momento";
  if (minutes < 60) {
    const t = `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    return future ? `en ${t}` : `hace ${t}`;
  }
  if (hours < 24) {
    const t = `${hours} ${hours === 1 ? "hora" : "horas"}`;
    return future ? `en ${t}` : `hace ${t}`;
  }
  if (days < 7) {
    if (days === 1) return future ? "mañana" : "ayer";
    const t = `${days} días`;
    return future ? `en ${t}` : `hace ${t}`;
  }
  return formatDate(d);
}

/**
 * Días completos que faltan para una fecha (negativo si ya pasó), contados
 * sobre el calendario de México.
 */
export function daysUntil(value: DateInput): number | null {
  const d = toDate(value);
  if (!d) return null;

  const target = formatInTimeZone(d, APP_TIME_ZONE, "yyyy-MM-dd");
  const today = formatInTimeZone(new Date(), APP_TIME_ZONE, "yyyy-MM-dd");

  const diff =
    new Date(`${target}T00:00:00Z`).getTime() -
    new Date(`${today}T00:00:00Z`).getTime();

  return Math.round(diff / 86_400_000);
}

/** Texto humano de vencimiento: "vence en 12 días" / "venció hace 3 días". */
export function formatExpiry(value: DateInput): string {
  const days = daysUntil(value);
  if (days === null) return EMPTY_DATE;
  if (days === 0) return "vence hoy";
  if (days === 1) return "vence mañana";
  if (days === -1) return "venció ayer";
  return days > 0 ? `vence en ${days} días` : `venció hace ${Math.abs(days)} días`;
}

// ---------------------------------------------------------------------
// ENTRADA — lo capturado se interpreta como hora de México → UTC
// ---------------------------------------------------------------------

/** Valor "YYYY-MM-DD" para un <input type="date"> a partir de una fecha guardada. */
export function toDateInputValue(value: DateInput): string {
  const d = toDate(value);
  return d ? formatInTimeZone(d, APP_TIME_ZONE, "yyyy-MM-dd") : "";
}

/** Fecha SIN hora de un <input type="date"> → ISO UTC a medianoche. */
export function dateOnlyInputToISO(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Fecha ("YYYY-MM-DD") + hora ("HH:mm") capturadas en México → ISO UTC. */
export function mxDateTimeToISO(dateStr: string, timeStr: string): string | null {
  if (!dateStr || !timeStr) return null;
  const seconds = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  const utc = fromZonedTime(`${dateStr}T${seconds}`, APP_TIME_ZONE);
  return Number.isNaN(utc.getTime()) ? null : utc.toISOString();
}

/** El instante actual como reloj de pared de México (para comparaciones). */
export function nowInMx(): Date {
  return toZonedTime(new Date(), APP_TIME_ZONE);
}

/** Sello de tiempo para nombres de archivo exportados: "2026-08-01_1432". */
export function fileStamp(): string {
  return formatInTimeZone(new Date(), APP_TIME_ZONE, "yyyy-MM-dd_HHmm");
}

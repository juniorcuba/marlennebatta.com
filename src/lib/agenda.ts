/*
 * Días y horas que se pueden pedir. Lo usan el formulario (para pintarlos) y el
 * servidor (para validarlos): así los dos siempre coinciden.
 *
 * Todo se calcula en la zona horaria de la agenda, NO en la del navegador: si
 * no, alguien en España o en México vería días distintos a los que el servidor
 * acepta. Las fechas se manejan como texto "AAAA-MM-DD" y la aritmética de días
 * se hace en UTC, que no tiene cambios de horario que desplacen un día.
 */

/** Horario de la agenda: "lunes a viernes, 8:00 a.m. – 4:00 p.m. hora del Este". PENDIENTE confirmarlo. */
export const ZONA_AGENDA = "America/New_York";
const HORA_INICIO = 8; // primera sesión 8:00
const HORA_FIN = 16; // la última empieza a las 15:30 y termina a las 16:00
const MINUTOS_SESION = 30;

/** Cuántos días hábiles se ofrecen, a partir del siguiente día hábil. */
export const DIAS_VISIBLES = 9;

/**
 * Días sin agenda (festivos, vacaciones), "AAAA-MM-DD". Se saltan y se ofrece
 * el siguiente día hábil, así que la lista siempre tiene DIAS_VISIBLES días.
 * PENDIENTE: pedirle a la clienta sus días no laborables.
 */
export const DIAS_BLOQUEADOS: readonly string[] = [];

const SEMANA = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

export type Dia = { valor: string; semana: string; fecha: string };
export type Hora = { valor: string; etiqueta: string };

export const HORAS: readonly Hora[] = (() => {
  const horas: Hora[] = [];
  for (let min = HORA_INICIO * 60; min < HORA_FIN * 60; min += MINUTOS_SESION) {
    const h = Math.floor(min / 60);
    const m = String(min % 60).padStart(2, "0");
    const h12 = h > 12 ? h - 12 : h;
    horas.push({ valor: `${String(h).padStart(2, "0")}:${m}`, etiqueta: `${h12}:${m} ${h < 12 ? "A.M." : "P.M."}` });
  }
  return horas;
})();

const FORMATO_ISO = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONA_AGENDA,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Fecha de hoy ("AAAA-MM-DD") en la zona de la agenda. */
export function hoyEnAgenda(ahora: Date = new Date()): string {
  return FORMATO_ISO.format(ahora);
}

const aUtc = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d));
};
const deUtc = (f: Date) => f.toISOString().slice(0, 10);

/** Próximos días hábiles con agenda, empezando mañana (en hora de la agenda). */
export function diasDisponibles(ahora: Date = new Date()): Dia[] {
  const f = aUtc(hoyEnAgenda(ahora));
  const dias: Dia[] = [];
  // Tope de vueltas por si alguien bloquea meses enteros: nunca un bucle infinito.
  for (let vueltas = 0; dias.length < DIAS_VISIBLES && vueltas < 366; vueltas++) {
    f.setUTCDate(f.getUTCDate() + 1);
    const dow = f.getUTCDay();
    const valor = deUtc(f);
    if (dow === 0 || dow === 6 || DIAS_BLOQUEADOS.includes(valor)) continue;
    dias.push({ valor, semana: SEMANA[dow], fecha: `${f.getUTCDate()} ${MESES[f.getUTCMonth()]}` });
  }
  return dias;
}

export function esDiaDisponible(valor: string, ahora: Date = new Date()): boolean {
  return diasDisponibles(ahora).some((d) => d.valor === valor);
}

export function esHoraValida(valor: string): boolean {
  return HORAS.some((h) => h.valor === valor);
}

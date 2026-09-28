import "server-only";

/*
 * Límite de envíos por IP y memoria de claves de idempotencia.
 *
 * Viven en la memoria del proceso: suficiente con UNA instancia (el plan actual
 * de Render). Si algún día hay varias instancias o reinicios frecuentes, esto
 * debe pasar a un almacén compartido (Redis, la base de datos…), o cada
 * instancia llevará su propia cuenta.
 */

type Ventana = { inicio: number; cuenta: number };
const ventanas = new Map<string, Ventana>();

export const LIMITE_ENVIOS = 5;
export const VENTANA_MS = 10 * 60 * 1000;

/** Devuelve los segundos a esperar si la IP se pasó del límite, o 0 si puede seguir. */
export function limitarPorIp(ip: string, ahora = Date.now()): number {
  const v = ventanas.get(ip);
  if (!v || ahora - v.inicio > VENTANA_MS) {
    ventanas.set(ip, { inicio: ahora, cuenta: 1 });
    podar(ahora);
    return 0;
  }
  v.cuenta++;
  return v.cuenta > LIMITE_ENVIOS ? Math.ceil((v.inicio + VENTANA_MS - ahora) / 1000) : 0;
}

function podar(ahora: number) {
  if (ventanas.size < 5000) return;
  for (const [ip, v] of ventanas) if (ahora - v.inicio > VENTANA_MS) ventanas.delete(ip);
}

/*
 * Idempotencia: el navegador manda una clave única por intento de envío. Si la
 * misma clave vuelve a llegar (doble clic, reintento por red lenta), se
 * devuelve la respuesta ya dada y NO se vuelve a entregar la solicitud.
 */
type Guardada = { expira: number; estado: number; cuerpo: unknown };
const respuestas = new Map<string, Guardada>();
const TTL_IDEMPOTENCIA = 24 * 60 * 60 * 1000;
export const CLAVE_VALIDA = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function respuestaPrevia(clave: string, ahora = Date.now()): Guardada | undefined {
  const r = respuestas.get(clave);
  if (r && r.expira > ahora) return r;
  if (r) respuestas.delete(clave);
}

export function recordarRespuesta(clave: string, estado: number, cuerpo: unknown, ahora = Date.now()) {
  respuestas.set(clave, { expira: ahora + TTL_IDEMPOTENCIA, estado, cuerpo });
  if (respuestas.size > 5000) for (const [k, r] of respuestas) if (r.expira <= ahora) respuestas.delete(k);
}

/*
 * Claves en curso: si llega la misma clave mientras la primera petición aún se
 * está entregando (doble clic muy rápido), la segunda se rechaza en vez de
 * entregar dos veces.
 */
const enCurso = new Set<string>();
export function reservarClave(clave: string): boolean {
  if (enCurso.has(clave)) return false;
  enCurso.add(clave);
  return true;
}
export function liberarClave(clave: string) {
  enCurso.delete(clave);
}

/** Solo para los tests. */
export function _reiniciar() {
  ventanas.clear();
  respuestas.clear();
  enCurso.clear();
}

/** Oculta datos personales en los logs: "rob***@g***.com", "******4567". */
export const enmascarar = {
  correo: (c: string) => c.replace(/^(.{0,3}).*@(.).*(\.[^.]+)$/, "$1***@$2***$3"),
  telefono: (t: string) => t.replace(/\d(?=\d{4})/g, "*"),
};

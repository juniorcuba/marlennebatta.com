import { sitio } from "@/lib/sitio";
import { validarSolicitud } from "@/lib/solicitud";
import { entregarSolicitud } from "@/lib/servidor/entrega";
import {
  CLAVE_VALIDA,
  enmascarar,
  liberarClave,
  limitarPorIp,
  recordarRespuesta,
  reservarClave,
  respuestaPrevia,
} from "@/lib/servidor/proteccion";

/*
 * POST /api/solicitud — recibe la solicitud de sesión del formulario.
 *
 * Capas, en este orden (lo barato primero):
 *  1. Origen: solo se acepta desde el propio sitio (anti CSRF).
 *  2. Límite por IP: 5 envíos cada 10 min.
 *  3. Formato: JSON, máx. 4 KB, solo los campos conocidos.
 *  4. Idempotencia: la misma clave nunca se entrega dos veces.
 *  5. Trampa para bots: el campo oculto "sitio_web" debe llegar vacío.
 *  6. Validación completa con las mismas reglas que el formulario (lib/solicitud).
 *  7. Entrega (lib/servidor/entrega).
 *
 * Nada de lo recibido se interpreta como HTML ni se concatena en consultas:
 * se valida por lista blanca y viaja como JSON.
 */

const MAX_BYTES = 4096;
const PERMITIDOS = new Set(["dia", "hora", "nombre", "empresa", "correo", "telefono", "sitio_web"]);

const json = (estado: number, cuerpo: unknown, extra: Record<string, string> = {}) =>
  Response.json(cuerpo, { status: estado, headers: { "Cache-Control": "no-store", ...extra } });

function origenPermitido(request: Request) {
  const origen = request.headers.get("origin");
  if (!origen) return false;
  let host: string;
  try {
    host = new URL(origen).host;
  } catch {
    return false;
  }
  const propios = [request.headers.get("x-forwarded-host"), request.headers.get("host"), new URL(sitio.url).host];
  return propios.some((p) => p && p.split(",")[0].trim() === host);
}

function ipDe(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "desconocida";
}

export async function POST(request: Request) {
  if (!origenPermitido(request)) return json(403, { error: "origen" });

  const espera = limitarPorIp(ipDe(request));
  if (espera) return json(429, { error: "demasiados_intentos" }, { "Retry-After": String(espera) });

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    return json(415, { error: "formato" });

  const clave = request.headers.get("idempotency-key") ?? "";
  if (!CLAVE_VALIDA.test(clave)) return json(400, { error: "clave" });
  const previa = respuestaPrevia(clave);
  if (previa) return json(previa.estado, previa.cuerpo);

  const texto = await request.text();
  if (new TextEncoder().encode(texto).length > MAX_BYTES) return json(413, { error: "tamano" });

  let cuerpo: unknown;
  try {
    cuerpo = JSON.parse(texto);
  } catch {
    return json(400, { error: "formato" });
  }
  if (!cuerpo || typeof cuerpo !== "object" || Array.isArray(cuerpo)) return json(400, { error: "formato" });
  if (Object.keys(cuerpo).some((k) => !PERMITIDOS.has(k))) return json(400, { error: "campos" });

  // Bot: rellenó el campo invisible. Se le responde como si todo fuera bien
  // (para que no aprenda a esquivarlo), pero no se entrega nada.
  const trampa = (cuerpo as Record<string, unknown>).sitio_web;
  if (trampa !== undefined && trampa !== "") {
    recordarRespuesta(clave, 200, { ok: true });
    return json(200, { ok: true });
  }

  const resultado = validarSolicitud(cuerpo);
  if (!resultado.ok) return json(422, { error: "validacion", errores: resultado.errores });

  if (!reservarClave(clave)) return json(409, { error: "en_curso" });
  let entrega;
  try {
    entrega = await entregarSolicitud(resultado.datos, clave);
    if (entrega.ok) recordarRespuesta(clave, 200, { ok: true });
  } finally {
    liberarClave(clave);
  }
  const d = resultado.datos;
  console.info(
    `[solicitud] ${entrega.ok ? "entregada" : entrega.motivo} ${d.dia} ${d.hora} ${enmascarar.correo(d.correo)} ${enmascarar.telefono(d.telefono)}`,
  );

  if (entrega.ok) return json(200, { ok: true });
  // Los fallos NO se memorizan: con la misma clave el usuario puede reintentar.
  return json(entrega.motivo === "no_configurado" ? 503 : 502, { error: entrega.motivo });
}

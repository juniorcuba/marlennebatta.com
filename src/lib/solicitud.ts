import { esDiaDisponible, esHoraValida } from "./agenda";

/*
 * Reglas del formulario de agenda. Las mismas funciones corren en el navegador
 * (para avisar al momento) y en el servidor (que es el que manda: nunca se
 * confía en lo que llega del navegador, se vuelve a validar todo).
 *
 * Enfoque de lista blanca: cada campo dice qué caracteres SÍ acepta. Todo lo
 * demás (<, >, comillas dobles, llaves, barras, caracteres de control…) se
 * rechaza, así que no hay forma de colar HTML, scripts ni fragmentos de SQL.
 */

export const CAMPOS = ["dia", "hora", "nombre", "empresa", "correo", "telefono"] as const;
export type Campo = (typeof CAMPOS)[number];
export type Solicitud = Record<Campo, string>;
export type Errores = Partial<Record<Campo, string>>;

export const LIMITES = {
  nombre: { min: 3, max: 80 },
  empresa: { max: 100 },
  correo: { max: 254 },
  telefono: { min: 8, max: 12 },
} as const;

// Letras de cualquier idioma (con tildes y ñ) separadas por espacio, apóstrofo,
// guion o punto: "María José O'Neil", "Ana-Lucía", "J. Pérez".
const NOMBRE = /^[\p{L}\p{M}]+(?:[ '’.-]{1,2}[\p{L}\p{M}]+)*\.?$/u;
// Lo que se admite al teclear (se quita todo lo demás al vuelo).
const NOMBRE_TECLEO = /[^\p{L}\p{M} '’.-]/gu;
// Empresa: además, números y & , ( ) — "Grupo 3M & Asoc., S.A. (MX)".
const EMPRESA = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} &.,'’()-]*$/u;
const EMPRESA_TECLEO = /[^\p{L}\p{M}\p{N} &.,'’()-]/gu;
// Correo: parte local con los caracteres que admite el estándar (sin comillas),
// dominio con etiquetas de letras/números/guion y un TLD de letras.
const CORREO =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;
const CONTROL = /[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF]/;

/* ---------- limpieza al teclear (solo comodidad; el servidor revalida) ---------- */

export const limpiar = {
  nombre: (v: string) => v.replace(NOMBRE_TECLEO, "").replace(/\s{2,}/g, " ").slice(0, LIMITES.nombre.max),
  empresa: (v: string) => v.replace(EMPRESA_TECLEO, "").replace(/\s{2,}/g, " ").slice(0, LIMITES.empresa.max),
  correo: (v: string) => v.replace(/\s/g, "").slice(0, LIMITES.correo.max),
  telefono: (v: string) => v.replace(/\D/g, "").slice(0, LIMITES.telefono.max),
};

/* ---------- normalización + validación ---------- */

/** Deja el texto en forma canónica: Unicode NFC, sin espacios de sobra. */
function normalizar(v: string) {
  return v.normalize("NFC").trim().replace(/\s+/g, " ");
}

export function validarCampo(campo: Campo, bruto: string, ahora: Date = new Date()): string | undefined {
  if (CONTROL.test(bruto)) return "Contiene caracteres no permitidos.";
  const v = normalizar(bruto);
  switch (campo) {
    case "dia":
      if (!v) return "Elige un día.";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || !esDiaDisponible(v, ahora))
        return "Ese día ya no está disponible. Elige otro.";
      return;
    case "hora":
      if (!esHoraValida(v)) return "Elige una hora de la lista.";
      return;
    case "nombre":
      if (!v) return "Escribe tu nombre.";
      if (v.length < LIMITES.nombre.min) return "Escribe tu nombre completo.";
      if (v.length > LIMITES.nombre.max) return `Máximo ${LIMITES.nombre.max} caracteres.`;
      if (!NOMBRE.test(v)) return "Usa solo letras, espacios, apóstrofo, guion o punto.";
      return;
    case "empresa":
      if (!v) return; // opcional
      if (v.length > LIMITES.empresa.max) return `Máximo ${LIMITES.empresa.max} caracteres.`;
      if (!EMPRESA.test(v)) return "Usa solo letras, números, espacios y . , & ( ) - '";
      return;
    case "correo": {
      const c = v.toLowerCase();
      if (!c) return "Escribe tu correo.";
      if (c.length > LIMITES.correo.max || c.split("@")[0].length > 64 || !CORREO.test(c))
        return "Revisa el correo: por ejemplo nombre@empresa.com";
      return;
    }
    case "telefono":
      if (!v) return "Escribe tu WhatsApp o teléfono.";
      if (!/^\d+$/.test(v)) return "Solo números, sin espacios ni signos.";
      if (v.length < LIMITES.telefono.min || v.length > LIMITES.telefono.max)
        return `Entre ${LIMITES.telefono.min} y ${LIMITES.telefono.max} dígitos (con lada si es de otro país).`;
      return;
  }
}

export type Resultado = { ok: true; datos: Solicitud } | { ok: false; errores: Errores };

/**
 * Valida una solicitud completa. Acepta `unknown` a propósito: en el servidor
 * llega JSON de cualquiera y aquí se comprueba el tipo de cada campo.
 */
export function validarSolicitud(entrada: unknown, ahora: Date = new Date()): Resultado {
  const errores: Errores = {};
  const datos = {} as Solicitud;
  const obj = (entrada && typeof entrada === "object" ? entrada : {}) as Record<string, unknown>;
  for (const campo of CAMPOS) {
    const bruto = obj[campo] ?? "";
    if (typeof bruto !== "string" || bruto.length > 500) {
      errores[campo] = "Valor no válido.";
      continue;
    }
    const error = validarCampo(campo, bruto, ahora);
    if (error) errores[campo] = error;
    else datos[campo] = campo === "correo" ? normalizar(bruto).toLowerCase() : normalizar(bruto);
  }
  return Object.keys(errores).length ? { ok: false, errores } : { ok: true, datos };
}

/** Para cuando los datos se inserten en un correo HTML: nunca meterlos sin escapar. */
export function escaparHtml(v: string) {
  return v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

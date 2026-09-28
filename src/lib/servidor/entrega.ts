import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { HORAS, ZONA_AGENDA } from "@/lib/agenda";
import { sitio } from "@/lib/sitio";
import { escaparHtml, type Solicitud } from "@/lib/solicitud";

/*
 * A dónde va una solicitud válida. Todo se configura con variables de entorno
 * (panel de Render); nunca con valores en el código.
 *
 * 1) Correo (preferido). El dominio marlenebatta.com tiene el correo en GoDaddy,
 *    cuyo SMTP es smtpout.secureserver.net:465 (SSL).
 *      SMTP_HOST        smtpout.secureserver.net
 *      SMTP_PUERTO      465
 *      SMTP_USUARIO     el buzón que envía, p. ej. mb@marlenebatta.com
 *      SMTP_CONTRASENA  su contraseña (solo en Render, nunca en el repo)
 *      CORREO_DESTINO   quién recibe las solicitudes (por defecto sitio.correo)
 *
 * 2) Webhook (alternativa, p. ej. n8n), si no hay SMTP:
 *      SOLICITUD_WEBHOOK_URL / SOLICITUD_WEBHOOK_SECRETO
 *
 * Sin ninguno configurado responde "no_configurado" y el formulario lo dice
 * claramente: no se finge un éxito que haría perder solicitudes reales.
 */

export type ResultadoEntrega = { ok: true } | { ok: false; motivo: "no_configurado" | "fallo_destino" };

export async function entregarSolicitud(datos: Solicitud, clave: string): Promise<ResultadoEntrega> {
  if (process.env.SMTP_HOST && process.env.SMTP_USUARIO && process.env.SMTP_CONTRASENA) return porCorreo(datos, clave);
  if (process.env.SOLICITUD_WEBHOOK_URL) return porWebhook(datos, clave);
  return { ok: false, motivo: "no_configurado" };
}

/* ---------- correo ---------- */

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function fechaLarga(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  const f = new Date(Date.UTC(a, m - 1, d));
  return `${SEMANA[f.getUTCDay()]} ${d} de ${MESES[m - 1]} de ${a}`;
}

export function componerCorreo(datos: Solicitud) {
  const hora = HORAS.find((h) => h.valor === datos.hora)?.etiqueta ?? datos.hora;
  const cuando = `${fechaLarga(datos.dia)}, ${hora} (hora del Este)`;
  const filas: [string, string][] = [
    ["Cuándo", cuando],
    ["Nombre", datos.nombre],
    ["Empresa", datos.empresa || "—"],
    ["Correo", datos.correo],
    ["WhatsApp / teléfono", datos.telefono],
  ];
  const texto = `Nueva solicitud de sesión estratégica desde ${sitio.url}\n\n${filas.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nResponde a este correo para escribirle directamente.`;
  // Todo lo que viene del formulario pasa por escaparHtml: aunque ya se validó,
  // en el HTML del correo nunca se inserta texto del usuario sin escapar.
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:560px">
<h2 style="color:#005188;font-weight:normal">Nueva solicitud de sesión estratégica</h2>
<table cellpadding="6" style="border-collapse:collapse;font-size:15px">
${filas.map(([k, v]) => `<tr><td style="color:#555;padding-right:16px">${k}</td><td><strong>${escaparHtml(v)}</strong></td></tr>`).join("\n")}
</table>
<p style="font-size:13px;color:#555">Responde a este correo para escribirle directamente. Enviado desde el formulario de ${escaparHtml(sitio.url)}.</p>
</div>`;
  return {
    asunto: `Nueva solicitud: ${datos.nombre} — ${fechaLarga(datos.dia)}, ${hora}`,
    texto,
    html,
  };
}

let transporte: Transporter | undefined;
function smtp() {
  const puerto = Number(process.env.SMTP_PUERTO ?? 465);
  transporte ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: puerto,
    secure: puerto === 465,
    auth: { user: process.env.SMTP_USUARIO, pass: process.env.SMTP_CONTRASENA },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
  return transporte;
}

async function porCorreo(datos: Solicitud, clave: string): Promise<ResultadoEntrega> {
  const { asunto, texto, html } = componerCorreo(datos);
  try {
    await smtp().sendMail({
      from: { name: "Web Marlene Batta", address: process.env.SMTP_USUARIO! },
      to: process.env.CORREO_DESTINO || sitio.correo,
      replyTo: { name: datos.nombre, address: datos.correo },
      subject: asunto,
      text: texto,
      html,
      // Id estable por envío: si algo se reintenta, los clientes de correo lo agrupan como el mismo mensaje.
      messageId: `<${clave}@marlenebatta.com>`,
      headers: { "X-Solicitud-Zona": ZONA_AGENDA },
    });
    return { ok: true };
  } catch (e) {
    // Solo el tipo de error: nunca credenciales ni datos del formulario en el log.
    console.error(`[solicitud] fallo SMTP: ${(e as { code?: string }).code ?? "desconocido"}`);
    return { ok: false, motivo: "fallo_destino" };
  }
}

/* ---------- webhook ---------- */

async function porWebhook(datos: Solicitud, clave: string): Promise<ResultadoEntrega> {
  try {
    const r = await fetch(process.env.SOLICITUD_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // El receptor debe deduplicar por esta clave: garantiza un solo correo/evento por envío.
        "Idempotency-Key": clave,
        ...(process.env.SOLICITUD_WEBHOOK_SECRETO ? { "X-Webhook-Secret": process.env.SOLICITUD_WEBHOOK_SECRETO } : {}),
      },
      body: JSON.stringify({ ...datos, zona: ZONA_AGENDA, recibida: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    return r.ok ? { ok: true } : { ok: false, motivo: "fallo_destino" };
  } catch {
    return { ok: false, motivo: "fallo_destino" };
  }
}

/** Solo para los tests. */
export function _reiniciarTransporte() {
  transporte = undefined;
}

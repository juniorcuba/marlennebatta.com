import "server-only";
import type { Solicitud } from "@/lib/solicitud";

/*
 * A dónde va una solicitud válida. Hoy: un webhook (p. ej. un flujo de n8n que
 * mande el correo a Marlene y cree el evento en su calendario). Se configura
 * con variables de entorno; nunca con valores en el código.
 *
 *   SOLICITUD_WEBHOOK_URL     https://… (obligatoria para activar la agenda)
 *   SOLICITUD_WEBHOOK_SECRETO se manda en la cabecera X-Webhook-Secret para que
 *                             el receptor rechace lo que no venga de aquí
 *
 * Sin URL configurada la entrega responde "no_configurado" y el formulario lo
 * dice claramente: no se finge un éxito que haría perder solicitudes reales.
 */

export type ResultadoEntrega = { ok: true } | { ok: false; motivo: "no_configurado" | "fallo_destino" };

export async function entregarSolicitud(datos: Solicitud, clave: string): Promise<ResultadoEntrega> {
  const url = process.env.SOLICITUD_WEBHOOK_URL;
  if (!url) return { ok: false, motivo: "no_configurado" };

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // El receptor debe deduplicar por esta clave: garantiza un solo correo/evento por envío.
        "Idempotency-Key": clave,
        ...(process.env.SOLICITUD_WEBHOOK_SECRETO ? { "X-Webhook-Secret": process.env.SOLICITUD_WEBHOOK_SECRETO } : {}),
      },
      body: JSON.stringify({ ...datos, zona: "America/New_York", recibida: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    return r.ok ? { ok: true } : { ok: false, motivo: "fallo_destino" };
  } catch {
    return { ok: false, motivo: "fallo_destino" };
  }
}

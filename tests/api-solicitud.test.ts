import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/solicitud/route";
import { _reiniciar } from "@/lib/servidor/proteccion";
import { diasDisponibles } from "@/lib/agenda";

const HOST = "marlenebatta.onrender.com";
let n = 0;

function datos() {
  return {
    dia: diasDisponibles()[0].valor,
    hora: "10:00",
    nombre: "Ana Pérez",
    empresa: "",
    correo: "ana@empresa.com",
    telefono: "5512345678",
  };
}

function peticion(
  cuerpo: unknown,
  { origen = `https://${HOST}`, clave = crypto.randomUUID(), ip = `10.0.0.${++n}`, tipo = "application/json" } = {},
) {
  const headers: Record<string, string> = { host: HOST, "content-type": tipo, "x-forwarded-for": ip };
  if (origen) headers.origin = origen;
  if (clave) headers["idempotency-key"] = clave;
  return new Request(`https://${HOST}/api/solicitud`, {
    method: "POST",
    headers,
    body: typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo),
  });
}

beforeEach(() => {
  _reiniciar();
  vi.stubEnv("SOLICITUD_WEBHOOK_URL", "https://hooks.ejemplo.com/agenda");
  vi.stubEnv("SOLICITUD_WEBHOOK_SECRETO", "secreto-de-prueba");
  vi.spyOn(console, "info").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const webhookOk = () => vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));

describe("POST /api/solicitud", () => {
  it("entrega una solicitud válida al webhook, con secreto y clave de idempotencia", async () => {
    const fetchMock = webhookOk();
    const clave = crypto.randomUUID();
    const r = await POST(peticion(datos(), { clave }));
    expect(r.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    const h = init!.headers as Record<string, string>;
    expect(h["X-Webhook-Secret"]).toBe("secreto-de-prueba");
    expect(h["Idempotency-Key"]).toBe(clave);
  });

  it("no guarda datos personales completos en los logs", async () => {
    webhookOk();
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    await POST(peticion(datos()));
    const linea = String(log.mock.calls[0][0]);
    expect(linea).not.toContain("ana@empresa.com");
    expect(linea).not.toContain("5512345678");
  });

  it("la misma clave no se entrega dos veces (doble clic / reintento)", async () => {
    const fetchMock = webhookOk();
    const clave = crypto.randomUUID();
    const a = await POST(peticion(datos(), { clave }));
    const b = await POST(peticion(datos(), { clave }));
    expect([a.status, b.status]).toEqual([200, 200]);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("dos envíos simultáneos con la misma clave: solo uno llega al destino", async () => {
    let soltar!: () => void;
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(
      () => new Promise((res) => (soltar = () => res(new Response("ok")))),
    );
    const clave = crypto.randomUUID();
    const primero = POST(peticion(datos(), { clave }));
    await new Promise((r) => setTimeout(r, 10));
    const segundo = await POST(peticion(datos(), { clave }));
    soltar();
    expect((await primero).status).toBe(200);
    expect(segundo.status).toBe(409);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("rechaza peticiones desde otro sitio o sin origen (CSRF)", async () => {
    expect((await POST(peticion(datos(), { origen: "https://sitio-malo.com" }))).status).toBe(403);
    expect((await POST(peticion(datos(), { origen: "" }))).status).toBe(403);
  });

  it("limita a 5 envíos cada 10 minutos por IP", async () => {
    webhookOk();
    const estados = [];
    for (let i = 0; i < 6; i++) estados.push((await POST(peticion(datos(), { ip: "1.2.3.4" }))).status);
    expect(estados.slice(0, 5).every((s) => s === 200)).toBe(true);
    expect(estados[5]).toBe(429);
  });

  it("rechaza formatos inválidos, cuerpos enormes y campos de más", async () => {
    expect((await POST(peticion("nombre=Ana", { tipo: "application/x-www-form-urlencoded" }))).status).toBe(415);
    expect((await POST(peticion("{roto"))).status).toBe(400);
    expect((await POST(peticion([datos()]))).status).toBe(400);
    expect((await POST(peticion({ ...datos(), admin: true }))).status).toBe(400);
    expect((await POST(peticion({ ...datos(), nombre: "a".repeat(5000) }))).status).toBe(413);
    expect((await POST(peticion(datos(), { clave: "no-es-uuid" }))).status).toBe(400);
  });

  it("devuelve los errores de validación por campo", async () => {
    const fetchMock = webhookOk();
    const r = await POST(peticion({ ...datos(), nombre: "<script>", telefono: "12ab" }));
    expect(r.status).toBe(422);
    const cuerpo = await r.json();
    expect(Object.keys(cuerpo.errores).sort()).toEqual(["nombre", "telefono"]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("bot que rellena la trampa: responde 200 pero no entrega nada", async () => {
    const fetchMock = webhookOk();
    const r = await POST(peticion({ ...datos(), sitio_web: "https://spam.com" }));
    expect(r.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sin destino configurado responde 503 (no finge éxito)", async () => {
    vi.stubEnv("SOLICITUD_WEBHOOK_URL", "");
    const r = await POST(peticion(datos()));
    expect(r.status).toBe(503);
  });

  it("si el destino falla responde 502 y permite reintentar con la misma clave", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response("x", { status: 500 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    const clave = crypto.randomUUID();
    expect((await POST(peticion(datos(), { clave }))).status).toBe(502);
    expect((await POST(peticion(datos(), { clave }))).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

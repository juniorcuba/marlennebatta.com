import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn();
const createTransport = vi.fn(() => ({ sendMail }));
vi.mock("nodemailer", () => ({ default: { createTransport } }));

const { entregarSolicitud, componerCorreo, _reiniciarTransporte } = await import("@/lib/servidor/entrega");

const DATOS = {
  dia: "2026-10-02",
  hora: "10:30",
  nombre: "Ana Pérez",
  empresa: "Acme & Co.",
  correo: "ana@empresa.com",
  telefono: "5512345678",
};

beforeEach(() => {
  _reiniciarTransporte();
  sendMail.mockReset().mockResolvedValue({ messageId: "x" });
  createTransport.mockClear();
  vi.stubEnv("SMTP_HOST", "smtpout.secureserver.net");
  vi.stubEnv("SMTP_PUERTO", "465");
  vi.stubEnv("SMTP_USUARIO", "mb@marlenebatta.com");
  vi.stubEnv("SMTP_CONTRASENA", "no-es-real");
  vi.stubEnv("CORREO_DESTINO", "");
  vi.stubEnv("SOLICITUD_WEBHOOK_URL", "");
});
afterEach(() => vi.unstubAllEnvs());

describe("entrega por correo", () => {
  it("manda el correo al buzón, con reply-to del cliente y Message-ID por clave", async () => {
    const r = await entregarSolicitud(DATOS, "11111111-1111-4111-8111-111111111111");
    expect(r).toEqual({ ok: true });
    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({ host: "smtpout.secureserver.net", port: 465, secure: true }));
    const m = sendMail.mock.calls[0][0];
    expect(m.to).toBe("mb@marlenebatta.com");
    expect(m.from.address).toBe("mb@marlenebatta.com");
    expect(m.replyTo).toEqual({ name: "Ana Pérez", address: "ana@empresa.com" });
    expect(m.messageId).toBe("<11111111-1111-4111-8111-111111111111@marlenebatta.com>");
    expect(m.subject).toContain("viernes 2 de octubre de 2026");
    expect(m.text).toContain("10:30 A.M. (hora del Este)");
  });

  it("CORREO_DESTINO permite mandarlo a otro buzón", async () => {
    vi.stubEnv("CORREO_DESTINO", "agenda@marlenebatta.com");
    await entregarSolicitud(DATOS, "k");
    expect(sendMail.mock.calls[0][0].to).toBe("agenda@marlenebatta.com");
  });

  it("si el SMTP falla responde fallo_destino (el formulario deja reintentar)", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    sendMail.mockRejectedValue(Object.assign(new Error("auth"), { code: "EAUTH" }));
    expect(await entregarSolicitud(DATOS, "k")).toEqual({ ok: false, motivo: "fallo_destino" });
  });

  it("sin SMTP ni webhook: no_configurado", async () => {
    vi.stubEnv("SMTP_HOST", "");
    expect(await entregarSolicitud(DATOS, "k")).toEqual({ ok: false, motivo: "no_configurado" });
  });

  it("el HTML del correo escapa todo lo que viene del formulario", () => {
    const { html } = componerCorreo({ ...DATOS, empresa: `<b onclick="x">Acme</b>` });
    expect(html).not.toContain("<b onclick");
    expect(html).toContain("&lt;b onclick=&quot;x&quot;&gt;Acme&lt;/b&gt;");
    expect(html).toContain("Acme"); // y el & de "Acme & Co." no rompe nada
  });
});

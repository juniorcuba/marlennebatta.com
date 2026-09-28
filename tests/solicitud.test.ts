import { describe, expect, it } from "vitest";
import { escaparHtml, limpiar, validarCampo, validarSolicitud } from "@/lib/solicitud";

const AHORA = new Date("2026-10-01T16:00:00Z"); // jue 1 oct, 12:00 ET
const BUENA = {
  dia: "2026-10-02",
  hora: "09:30",
  nombre: "María José O'Neil-Pérez",
  empresa: "Grupo 3M & Asoc., S.A. (MX)",
  correo: "Maria.Jose+ventas@Empresa.com.mx",
  telefono: "5215512345678".slice(0, 12),
};

const err = (campo: Parameters<typeof validarCampo>[0], v: string) => validarCampo(campo, v, AHORA);

describe("validarSolicitud", () => {
  it("acepta una solicitud correcta y la normaliza", () => {
    const r = validarSolicitud(BUENA, AHORA);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.datos.correo).toBe("maria.jose+ventas@empresa.com.mx");
  });

  it("empresa es opcional", () => {
    expect(validarSolicitud({ ...BUENA, empresa: "" }, AHORA).ok).toBe(true);
  });

  it("rechaza tipos raros y valores enormes (JSON manipulado)", () => {
    const r = validarSolicitud({ ...BUENA, nombre: ["Ana"], telefono: 5512345678, correo: "a".repeat(600) }, AHORA);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errores).sort()).toEqual(["correo", "nombre", "telefono"]);
    expect(validarSolicitud(null, AHORA).ok).toBe(false);
    expect(validarSolicitud("texto", AHORA).ok).toBe(false);
  });
});

describe("nombre", () => {
  it.each(["Ana", "José Ángel Núñez", "Jean-Luc Picard", "D'Angelo", "J. Pérez", "Zoë Løvik"])("acepta %s", (v) => {
    expect(err("nombre", v)).toBeUndefined();
  });
  it.each([
    "<script>alert(1)</script>",
    "Robert'); DROP TABLE clientes;--",
    "Ana123",
    "Ana @ Pérez",
    "{{7*7}}",
    "Ana\u0000",
    "Ana\u202Eetrás",
    "A",
    "a".repeat(81),
  ])("rechaza %s", (v) => {
    expect(err("nombre", v)).toBeTruthy();
  });
  it("al teclear quita números y símbolos", () => {
    expect(limpiar.nombre("Ana<b>123 Pé$rez")).toBe("Anab Pérez");
  });
});

describe("empresa", () => {
  it.each(["<img src=x onerror=alert(1)>", "Acme; DELETE FROM", 'Acme "SA"', "Acme/../etc"])("rechaza %s", (v) => {
    expect(err("empresa", v)).toBeTruthy();
  });
});

describe("correo", () => {
  it.each(["ana@empresa.com", "ana.perez+tag@sub.dominio.mx", "a_b-c@x-y.io"])("acepta %s", (v) => {
    expect(err("correo", v)).toBeUndefined();
  });
  it.each([
    "ana",
    "ana@",
    "@empresa.com",
    "ana@empresa",
    "ana..perez@empresa.com",
    "ana@-empresa.com",
    "ana@empresa.c",
    "ana perez@empresa.com",
    '"<script>"@empresa.com',
    "ana@empresa.com\r\nBcc: todos@spam.com",
    `${"a".repeat(65)}@empresa.com`,
  ])("rechaza %s", (v) => {
    expect(err("correo", v)).toBeTruthy();
  });
});

describe("teléfono", () => {
  it("acepta entre 8 y 12 dígitos", () => {
    expect(err("telefono", "55123456")).toBeUndefined();
    expect(err("telefono", "521551234567")).toBeUndefined();
  });
  it.each(["1234567", "5215512345678", "+525512345678", "55 1234 5678", "55-1234-5678", "5512345678a", "٥٥١٢٣٤٥٦٧٨"])(
    "rechaza %s",
    (v) => {
      expect(err("telefono", v)).toBeTruthy();
    },
  );
  it("al teclear deja solo dígitos y corta en 12", () => {
    expect(limpiar.telefono("+52 (55) 1234-5678 99")).toBe("525512345678");
  });
});

describe("día y hora", () => {
  it("rechaza días que no están en la agenda y horas fuera de la lista", () => {
    expect(err("dia", "2026-10-01")).toBeTruthy(); // hoy
    expect(err("dia", "2026-10-03")).toBeTruthy(); // sábado
    expect(err("dia", "2026/10/02")).toBeTruthy();
    expect(err("hora", "07:00")).toBeTruthy();
  });
});

describe("escaparHtml", () => {
  it("neutraliza HTML para cuando se use en correos", () => {
    expect(escaparHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });
});

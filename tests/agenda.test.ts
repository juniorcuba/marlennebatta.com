import { describe, expect, it } from "vitest";
import { DIAS_VISIBLES, HORAS, diasDisponibles, esDiaDisponible, esHoraValida, hoyEnAgenda } from "@/lib/agenda";

// Instantes fijos: los tests no dependen del día en que se ejecutan.
const JUEVES_MEDIODIA_ET = new Date("2026-10-01T16:00:00Z"); // jue 1 oct, 12:00 ET

describe("agenda", () => {
  it("ofrece siempre DIAS_VISIBLES días hábiles, empezando mañana", () => {
    const dias = diasDisponibles(JUEVES_MEDIODIA_ET);
    expect(dias).toHaveLength(DIAS_VISIBLES);
    expect(dias[0]).toMatchObject({ valor: "2026-10-02", semana: "VIE", fecha: "2 OCT" });
    expect(dias[1].valor).toBe("2026-10-05"); // salta sábado y domingo
    expect(dias.every((d) => !["SAB", "DOM"].includes(d.semana))).toBe(true);
  });

  it("calcula 'hoy' en hora del Este, no en la del navegador ni en UTC", () => {
    // 02:30 UTC del viernes = 22:30 ET del jueves → en la agenda sigue siendo jueves
    const noche = new Date("2026-10-02T02:30:00Z");
    expect(hoyEnAgenda(noche)).toBe("2026-10-01");
    expect(diasDisponibles(noche)[0].valor).toBe("2026-10-02");
  });

  it("sigue funcionando en el futuro: cambio de mes, de año y de horario de verano", () => {
    expect(diasDisponibles(new Date("2026-12-31T17:00:00Z"))[0].valor).toBe("2027-01-01");
    // 1 nov 2026: fin del horario de verano en EUA
    const dias = diasDisponibles(new Date("2026-10-30T16:00:00Z")).map((d) => d.valor);
    expect(dias.slice(0, 3)).toEqual(["2026-11-02", "2026-11-03", "2026-11-04"]);
    expect(diasDisponibles(new Date("2031-06-15T16:00:00Z"))).toHaveLength(DIAS_VISIBLES);
  });

  it("rechaza días fuera de la ventana: hoy, pasados, fines de semana y lejanos", () => {
    expect(esDiaDisponible("2026-10-02", JUEVES_MEDIODIA_ET)).toBe(true);
    expect(esDiaDisponible("2026-10-01", JUEVES_MEDIODIA_ET)).toBe(false); // hoy
    expect(esDiaDisponible("2026-09-15", JUEVES_MEDIODIA_ET)).toBe(false); // pasado
    expect(esDiaDisponible("2026-10-03", JUEVES_MEDIODIA_ET)).toBe(false); // sábado
    expect(esDiaDisponible("2026-12-15", JUEVES_MEDIODIA_ET)).toBe(false); // demasiado lejos
  });

  it("solo acepta horas de la lista (8:00 a 15:30, cada 30 min)", () => {
    expect(HORAS[0].valor).toBe("08:00");
    expect(HORAS.at(-1)?.valor).toBe("15:30");
    expect(esHoraValida("10:30")).toBe(true);
    expect(esHoraValida("10:15")).toBe(false);
    expect(esHoraValida("16:00")).toBe(false);
    expect(esHoraValida("08:00; DROP TABLE")).toBe(false);
  });
});

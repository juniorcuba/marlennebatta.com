"use client";

import { useMemo, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Icono } from "@/components/ui/icono";
import { sitio } from "@/lib/sitio";
import { DIAS_VISIBLES, HORAS, diasDisponibles, hoyEnAgenda } from "@/lib/agenda";
import { LIMITES, limpiar, validarCampo, validarSolicitud, type Campo, type Errores, type Solicitud } from "@/lib/solicitud";

/*
 * Selector de día/hora + datos de contacto.
 *
 * Validación en dos capas con las MISMAS reglas (lib/solicitud): aquí para
 * avisar al momento, y en /api/solicitud, que vuelve a validar todo y es la que
 * decide. Los días se calculan en hora de la agenda (ET) y se recalculan solos
 * si la página se queda abierta de un día para otro.
 *
 * PENDIENTE: overlay de confirmación del diseño (nodos 597:28 / 651:1455); hoy
 * la confirmación es un aviso dentro de la propia caja.
 */

// El "hoy" de la agenda solo se conoce en el navegador: el HTML estático sale
// con casillas vacías del mismo tamaño y se rellenan al hidratar. Se vuelve a
// leer al volver a la pestaña y cada minuto: una página abierta desde ayer se actualiza.
const suscribir = (aviso: () => void) => {
  window.addEventListener("focus", aviso);
  document.addEventListener("visibilitychange", aviso);
  const t = window.setInterval(aviso, 60_000);
  return () => {
    window.removeEventListener("focus", aviso);
    document.removeEventListener("visibilitychange", aviso);
    window.clearInterval(t);
  };
};
const leerHoy = () => hoyEnAgenda();

const VACIO: Solicitud = { dia: "", hora: HORAS[0].valor, nombre: "", empresa: "", correo: "", telefono: "" };
const ORDEN_FOCO: Campo[] = ["dia", "hora", "nombre", "empresa", "telefono", "correo"];

type Estado =
  | { tipo: "editando" }
  | { tipo: "enviando" }
  | { tipo: "enviada"; resumen: string; correo: string }
  | { tipo: "fallo"; mensaje: ReactNode };

function mensajeDeError(estado: number): ReactNode {
  if (estado === 429) return "Has hecho varios intentos seguidos. Espera unos minutos y vuelve a intentarlo.";
  if (estado === 503)
    return (
      <>
        La agenda en línea todavía no está activa. Escríbenos a{" "}
        <a className="underline" href={`mailto:${sitio.correo}`}>
          {sitio.correo}
        </a>{" "}
        y te respondemos para agendar.
      </>
    );
  return "No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.";
}

type Props = { encabezado: ReactNode; foto: ReactNode };

export function Reserva({ encabezado, foto }: Props) {
  const hoy = useSyncExternalStore(suscribir, leerHoy, () => null);
  // `hoy` es la dependencia a propósito: cuando cambia la fecha se recalculan los días.
  const dias = useMemo(() => (hoy ? diasDisponibles() : null), [hoy]);
  const [valores, setValores] = useState<Solicitud>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<Estado>({ tipo: "editando" });
  const trampa = useRef<HTMLInputElement>(null);
  const clave = useRef<string | null>(null);
  const formulario = useRef<HTMLFormElement>(null);

  // Si el día elegido deja de estar disponible (cambió la fecha), cuenta como no elegido.
  const diaElegido = dias?.some((d) => d.valor === valores.dia) ? valores.dia : "";

  function cambiar(campo: Campo, bruto: string) {
    const v = campo in limpiar ? limpiar[campo as keyof typeof limpiar](bruto) : bruto;
    setValores((prev) => ({ ...prev, [campo]: v }));
    // Si el campo tenía error, se revalida al escribir para quitarlo en cuanto esté bien.
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: validarCampo(campo, v) }));
    if (estado.tipo === "fallo") setEstado({ tipo: "editando" });
    clave.current = null; // datos distintos = envío distinto
  }

  function revisar(campo: Campo) {
    if (!valores[campo] && campo !== "empresa") return; // no regañar por un campo que aún no se tocó
    setErrores((e) => ({ ...e, [campo]: validarCampo(campo, valores[campo]) }));
  }

  function enfocarPrimerError(errs: Errores) {
    const primero = ORDEN_FOCO.find((c) => errs[c]);
    if (primero) formulario.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado.tipo === "enviando") return;

    const r = validarSolicitud({ ...valores, dia: diaElegido });
    if (!r.ok) {
      setErrores(r.errores);
      enfocarPrimerError(r.errores);
      return;
    }
    setErrores({});
    setEstado({ tipo: "enviando" });
    // Misma clave en los reintentos de este mismo envío: el servidor nunca lo entrega dos veces.
    clave.current ??= crypto.randomUUID();

    try {
      const resp = await fetch("/api/solicitud", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": clave.current },
        body: JSON.stringify({ ...r.datos, sitio_web: trampa.current?.value ?? "" }),
      });
      const cuerpo = (await resp.json().catch(() => ({}))) as { errores?: Errores };

      if (resp.ok) {
        const dia = dias?.find((d) => d.valor === r.datos.dia);
        const hora = HORAS.find((h) => h.valor === r.datos.hora);
        setEstado({
          tipo: "enviada",
          resumen: `${dia ? `${dia.semana} ${dia.fecha}` : r.datos.dia}, ${hora?.etiqueta ?? r.datos.hora} (hora del Este)`,
          correo: r.datos.correo,
        });
        setValores(VACIO);
        clave.current = null;
        return;
      }
      if (resp.status === 422 && cuerpo.errores) {
        setErrores(cuerpo.errores);
        enfocarPrimerError(cuerpo.errores);
        setEstado({ tipo: "editando" });
        return;
      }
      if (resp.status === 409) return; // el primer envío sigue en curso
      setEstado({ tipo: "fallo", mensaje: mensajeDeError(resp.status) });
    } catch {
      setEstado({ tipo: "fallo", mensaje: mensajeDeError(0) });
    }
  }

  if (estado.tipo === "enviada") {
    return (
      <div className="grid gap-[30px] md:gap-10 xl:grid-cols-[492px_1fr] xl:gap-[54px]">
        <div className="-mx-[31px] md:hidden xl:mx-0 xl:block">{foto}</div>
        <div role="status" className="xl:pt-[23px]">
          {encabezado}
          <div className="mt-8 bg-white px-6 py-7 text-tinta">
            <p className="font-display text-2xl leading-[1.1] text-azul">¡Solicitud recibida!</p>
            <p className="mt-3 text-[15px] leading-[1.4] md:text-base">
              Sesión estratégica: <strong>{estado.resumen}</strong>. Te escribiremos a{" "}
              <strong className="break-all">{estado.correo}</strong> para confirmarla.
            </p>
            <button
              type="button"
              onClick={() => setEstado({ tipo: "editando" })}
              className="mt-5 text-[15px] text-azul underline underline-offset-4 hover:no-underline"
            >
              Enviar otra solicitud
            </button>
          </div>
        </div>
      </div>
    );
  }

  const enviando = estado.tipo === "enviando";

  return (
    <form ref={formulario} method="post" noValidate onSubmit={enviar} aria-labelledby="contacto-titulo" aria-busy={enviando}>
      {/* Trampa para bots: invisible para personas y lectores de pantalla. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          No rellenar
          <input ref={trampa} type="text" name="sitio_web" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="grid gap-[30px] md:gap-10 xl:grid-cols-[492px_1fr] xl:gap-[54px]">
        {/* Móvil: la foto va a sangre arriba de la caja; en tablet se omite. */}
        <div className="-mx-[31px] md:hidden xl:mx-0 xl:block">{foto}</div>
        <div className="xl:pt-[23px]">
          {encabezado}

          <fieldset className="mt-[19px] md:mt-8 xl:mt-4" aria-describedby={errores.dia ? "error-dia" : undefined}>
            <legend className="text-[15px] leading-[1.36] text-[#121212] md:text-base">Elige un día</legend>
            <div className="mt-[18px] grid max-w-[329px] grid-cols-4 gap-x-[23px] gap-y-4 max-[359px]:grid-cols-3 max-[359px]:gap-x-3 sm:max-w-[404px] sm:grid-cols-5 sm:gap-x-2 sm:gap-y-[18px] xl:gap-x-[13px]">
              {(dias ?? Array.from({ length: DIAS_VISIBLES }, () => null)).map((d, i) =>
                d ? (
                  <label key={d.valor} className="group relative cursor-pointer">
                    <input
                      type="radio"
                      name="dia"
                      value={d.valor}
                      checked={diaElegido === d.valor}
                      onChange={() => {
                        cambiar("dia", d.valor);
                        setErrores((e) => ({ ...e, dia: undefined }));
                      }}
                      className="peer sr-only"
                    />
                    <span className="flex h-[68px] flex-col items-center justify-center bg-carbon text-center transition-colors group-hover:bg-black peer-checked:bg-azul peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-azul">
                      <span className="text-sm leading-[1.36] text-cielo">{d.semana}</span>
                      <span className="text-[15px] leading-[1.36] whitespace-nowrap text-white sm:text-base">
                        {d.fecha}
                      </span>
                    </span>
                  </label>
                ) : (
                  <span key={i} aria-hidden className="h-[68px] bg-carbon/80" />
                ),
              )}
            </div>
            <MensajeError id="error-dia" texto={errores.dia} />
          </fieldset>

          <label className="relative mt-[18px] flex h-12 w-[233px] items-center bg-white md:mt-7 xl:mt-[37px]">
            <span className="sr-only">Elige una hora (hora del Este, ET)</span>
            <Icono nombre="f-reloj" ancho={22} alto={22} className="pointer-events-none absolute left-[11px]" />
            <select
              name="hora"
              value={valores.hora}
              onChange={(e) => cambiar("hora", e.target.value)}
              aria-invalid={errores.hora ? true : undefined}
              aria-describedby={errores.hora ? "error-hora" : undefined}
              className="h-full w-full cursor-pointer appearance-none bg-transparent pr-[65px] pl-[58px] text-[15px] text-black md:text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul"
            >
              {HORAS.map((h) => (
                <option key={h.valor} value={h.valor}>
                  {h.etiqueta}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 grid w-[65px] place-items-center bg-tinta">
              <svg width="16" height="14" viewBox="0 0 16 14" fill="#fff">
                <path d="M8 14 0 0h16z" />
              </svg>
            </span>
          </label>
          <MensajeError id="error-hora" texto={errores.hora} />
          <p className="mt-[17px] text-xs leading-[1.36] text-black md:mt-5">*Completa el formulario para confirmar la solicitud.</p>
        </div>
      </div>

      <div className="mt-[25px] grid gap-[25px] md:mt-10 md:grid-cols-2 md:gap-5 xl:mt-[41px] xl:gap-x-[29px] xl:gap-y-[30px]">
        <Campo
          campo="nombre"
          icono={{ nombre: "f-nombre", ancho: 19, alto: 22 }}
          etiqueta="Nombre completo"
          marcador="Nombre Completo*"
          autoComplete="name"
          maxLength={LIMITES.nombre.max}
          valor={valores.nombre}
          error={errores.nombre}
          onCambio={cambiar}
          onSalir={revisar}
        />
        <Campo
          campo="empresa"
          icono={{ nombre: "f-empresa", ancho: 19, alto: 19 }}
          etiqueta="Empresa (opcional)"
          marcador="Empresa (opcional)"
          autoComplete="organization"
          maxLength={LIMITES.empresa.max}
          valor={valores.empresa}
          error={errores.empresa}
          onCambio={cambiar}
          onSalir={revisar}
        />
        <Campo
          campo="correo"
          icono={{ nombre: "f-correo", ancho: 23, alto: 15 }}
          etiqueta="Correo electrónico"
          marcador="Correo Electrónico*"
          type="email"
          autoComplete="email"
          maxLength={LIMITES.correo.max}
          valor={valores.correo}
          error={errores.correo}
          onCambio={cambiar}
          onSalir={revisar}
          className="max-md:order-4"
        />
        <Campo
          campo="telefono"
          icono={{ nombre: "f-telefono", ancho: 21, alto: 20 }}
          etiqueta="WhatsApp o teléfono, solo números"
          marcador="WhatsApp / Teléfono*"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={LIMITES.telefono.max}
          valor={valores.telefono}
          error={errores.telefono}
          onCambio={cambiar}
          onSalir={revisar}
          className="max-md:order-3"
        />
      </div>

      {estado.tipo === "fallo" && (
        <p role="alert" className="mt-6 bg-white px-4 py-3 text-[15px] leading-[1.4] text-tinta">
          {estado.mensaje}
        </p>
      )}

      <div className="mt-[26px] flex justify-center md:mt-7">
        <button
          type="submit"
          disabled={enviando}
          className="h-16 w-full max-w-[264px] bg-azul text-[15px] text-white transition-colors hover:bg-[#003f6b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azul disabled:cursor-wait disabled:opacity-70 md:h-[59px] md:text-base"
        >
          {enviando ? "Enviando…" : "Confirmar solicitud"}
        </button>
      </div>
    </form>
  );
}

function MensajeError({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={id} className="mt-2 text-[13px] leading-[1.3] font-bold text-[#6b0015]">
      {texto}
    </p>
  );
}

type CampoProps = {
  campo: Exclude<Campo, "dia" | "hora">;
  icono: { nombre: string; ancho: number; alto: number };
  etiqueta: string;
  marcador: string;
  type?: "text" | "email" | "tel";
  inputMode?: "text" | "email" | "numeric";
  autoComplete: string;
  maxLength: number;
  valor: string;
  error?: string;
  onCambio: (campo: Campo, valor: string) => void;
  onSalir: (campo: Campo) => void;
  className?: string;
};

function Campo({ campo, icono, etiqueta, marcador, type = "text", inputMode, autoComplete, maxLength, valor, error, onCambio, onSalir, className = "" }: CampoProps) {
  const idError = `error-${campo}`;
  return (
    <div className={className}>
      <label className="relative flex h-12 items-center bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-azul">
        <span className="sr-only">{etiqueta}</span>
        <span className="pointer-events-none absolute left-[15px] grid w-6 place-items-center md:left-[13px]">
          <Icono {...icono} />
        </span>
        <input
          name={campo}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={marcador}
          maxLength={maxLength}
          value={valor}
          onChange={(e) => onCambio(campo, e.target.value)}
          onBlur={() => onSalir(campo)}
          aria-required={campo !== "empresa"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? idError : undefined}
          spellCheck={false}
          className="h-full w-full bg-transparent pr-4 pl-[58px] text-[15px] text-black outline-none placeholder:text-black md:pl-[49px] md:text-base"
        />
      </label>
      <MensajeError id={idError} texto={error} />
    </div>
  );
}

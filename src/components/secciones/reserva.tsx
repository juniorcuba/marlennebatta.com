"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Icono } from "@/components/ui/icono";

/*
 * Selector de día/hora + datos de contacto.
 *
 * PENDIENTE (fase de funcionalidades): disponibilidad real, envío al backend
 * con idempotencia, correo de confirmación y el overlay de confirmación del
 * diseño (nodo 597:28). Hoy el formulario valida y no envía nada.
 */

const DIAS_VISIBLES = 9;
const SEMANA = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

/*
 * Horario tomado de una versión anterior del diseño (nodo 418:477): "lunes a
 * viernes, 8:00 a.m. – 4:00 p.m. hora del Este (ET)", sesiones de 30 min.
 * PENDIENTE confirmarlo con la clienta.
 */
const HORAS = Array.from({ length: 16 }, (_, i) => {
  const h = 8 + Math.floor(i / 2);
  const m = i % 2 ? "30" : "00";
  const h12 = h > 12 ? h - 12 : h;
  return { valor: `${String(h).padStart(2, "0")}:${m}`, etiqueta: `${h12}:${m} ${h < 12 ? "A.M." : "P.M."}` };
});

const isoLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function proximosDiasHabiles(hoyIso: string) {
  const d = new Date(`${hoyIso}T12:00:00`);
  const dias: { valor: string; semana: string; fecha: string }[] = [];
  while (dias.length < DIAS_VISIBLES) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    dias.push({
      valor: isoLocal(d),
      semana: SEMANA[dow],
      fecha: `${d.getDate()} ${MESES[d.getMonth()]}`,
    });
  }
  return dias;
}

// La fecha solo se conoce en el navegador: el HTML estático sale con casillas
// vacías del mismo tamaño y se rellenan al hidratar, sin salto de maqueta.
const suscribir = () => () => {};
const hoyLocal = () => isoLocal(new Date());

type Props = { encabezado: ReactNode; foto: ReactNode };

export function Reserva({ encabezado, foto }: Props) {
  const hoy = useSyncExternalStore(suscribir, hoyLocal, () => null);
  const dias = useMemo(() => (hoy ? proximosDiasHabiles(hoy) : null), [hoy]);
  const [dia, setDia] = useState<string | null>(null);

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // PENDIENTE: enviar al backend. No se simula éxito para no engañar a nadie.
  }

  return (
    <form onSubmit={enviar} aria-labelledby="contacto-titulo">
      <div className="grid gap-[30px] md:gap-10 xl:grid-cols-[492px_1fr] xl:gap-[54px]">
        {/* Móvil: la foto va a sangre arriba de la caja; en tablet se omite. */}
        <div className="-mx-[31px] md:hidden xl:mx-0 xl:block">{foto}</div>
        <div className="xl:pt-[23px]">
          {encabezado}

          <fieldset className="mt-[19px] md:mt-8 xl:mt-4">
            <legend className="text-[15px] leading-[1.36] text-[#121212] md:text-base">Elige un día</legend>
            <div className="mt-[18px] grid max-w-[329px] grid-cols-4 gap-x-[23px] gap-y-4 max-[359px]:grid-cols-3 max-[359px]:gap-x-3 sm:max-w-[404px] sm:grid-cols-5 sm:gap-x-2 sm:gap-y-[18px] xl:gap-x-[13px]">
              {(dias ?? Array.from({ length: DIAS_VISIBLES }, () => null)).map((d, i) =>
                d ? (
                  <label key={d.valor} className="group relative cursor-pointer">
                    <input
                      type="radio"
                      name="dia"
                      value={d.valor}
                      required
                      checked={dia === d.valor}
                      onChange={() => setDia(d.valor)}
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
          </fieldset>

          <label className="relative mt-[18px] flex h-12 w-[233px] items-center bg-white md:mt-7 xl:mt-[37px]">
            <span className="sr-only">Elige una hora (hora del Este, ET)</span>
            <Icono nombre="f-reloj" ancho={22} alto={22} className="pointer-events-none absolute left-[11px]" />
            <select
              name="hora"
              required
              defaultValue={HORAS[0].valor}
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
          <p className="mt-[17px] text-xs md:mt-5 leading-[1.36] text-black">*Completa el formulario para confirmar la solicitud.</p>
        </div>
      </div>

      <div className="mt-[25px] grid gap-[25px] md:mt-10 md:grid-cols-2 md:gap-5 xl:mt-[41px] xl:gap-x-[29px] xl:gap-y-[30px]">
        <Campo icono={{ nombre: "f-nombre", ancho: 19, alto: 22 }} etiqueta="Nombre completo" marcador="Nombre Completo*" name="nombre" autoComplete="name" required />
        <Campo icono={{ nombre: "f-empresa", ancho: 19, alto: 19 }} etiqueta="Empresa (opcional)" marcador="Empresa (opcional)" name="empresa" autoComplete="organization" />
        <Campo icono={{ nombre: "f-correo", ancho: 23, alto: 15 }} etiqueta="Correo electrónico" marcador="Correo Electrónico*" name="correo" type="email" autoComplete="email" required className="max-md:order-4" />
        <Campo icono={{ nombre: "f-telefono", ancho: 21, alto: 20 }} etiqueta="WhatsApp o teléfono" marcador="WhatsApp / Teléfono*" name="telefono" type="tel" autoComplete="tel" required className="max-md:order-3" />
      </div>

      <div className="mt-[26px] flex justify-center md:mt-7">
        <button
          type="submit"
          className="h-16 w-full max-w-[264px] bg-azul text-[15px] text-white md:h-[59px] md:text-base transition-colors hover:bg-[#003f6b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azul"
        >
          Confirmar solicitud
        </button>
      </div>
    </form>
  );
}

type CampoProps = {
  icono: { nombre: string; ancho: number; alto: number };
  etiqueta: string;
  marcador: string;
  name: string;
  type?: "text" | "email" | "tel";
  autoComplete: string;
  required?: boolean;
  className?: string;
};

function Campo({ icono, etiqueta, marcador, name, type = "text", autoComplete, required, className = "" }: CampoProps) {
  return (
    <label className={`relative flex h-12 items-center bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-azul ${className}`}>
      <span className="sr-only">{etiqueta}</span>
      <span className="pointer-events-none absolute left-[15px] grid w-6 place-items-center md:left-[13px]">
        <Icono {...icono} />
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={marcador}
        maxLength={type === "email" ? 254 : 120}
        className="h-full w-full bg-transparent pr-4 pl-[58px] text-[15px] text-black outline-none md:pl-[49px] md:text-base placeholder:text-black"
      />
    </label>
  );
}

import { sitio } from "@/lib/sitio";
import { Icono } from "./icono";

/** LinkedIn, Instagram y correo. `claro` = versión del pie (#88a8d4). */
export function Redes({ claro = false, className = "" }: { claro?: boolean; className?: string }) {
  const s = claro ? "-claro" : "";
  const enlaces = [
    { href: sitio.redes.linkedin, icono: `linkedin${s}`, etiqueta: "LinkedIn de Marlene Batta", externo: true },
    { href: sitio.redes.instagram, icono: `instagram${s}`, etiqueta: "Instagram de Marlene Batta", externo: true },
    { href: `mailto:${sitio.correo}`, icono: `correo${s}`, etiqueta: "Escribir un correo a Marlene Batta", externo: false },
  ];
  return (
    <ul className={`flex items-center gap-[13px] ${className}`}>
      {enlaces.map((e) => (
        <li key={e.icono}>
          <a
            href={e.href}
            aria-label={e.etiqueta}
            className="block rounded-full transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            {...(e.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Icono nombre={e.icono} ancho={34} alto={34} className="size-[34px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}

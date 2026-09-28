import { sitio } from "@/lib/sitio";
import { Icono } from "./icono";

/*
 * LinkedIn e Instagram. `claro` = versión del pie (#88a8d4). El diseño traía
 * además un icono de correo; la clienta pidió dejar solo estas dos redes (el
 * correo sigue escrito en el pie).
 */
export function Redes({ claro = false, className = "" }: { claro?: boolean; className?: string }) {
  const s = claro ? "-claro" : "";
  const enlaces = [
    { href: sitio.redes.linkedin, icono: `linkedin${s}`, etiqueta: "LinkedIn de Marlene Batta (se abre en otra pestaña)" },
    { href: sitio.redes.instagram, icono: `instagram${s}`, etiqueta: "Instagram de Marlene Batta (se abre en otra pestaña)" },
  ];
  return (
    <ul className={`flex items-center gap-[13px] ${className}`}>
      {enlaces.map((e) => (
        <li key={e.icono}>
          <a
            href={e.href}
            aria-label={e.etiqueta}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-full transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          >
            <Icono nombre={e.icono} ancho={34} alto={34} className="size-[34px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}

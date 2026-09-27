import { anclas } from "@/lib/sitio";
import { Icono } from "./icono";

/** CTA "Agenda una llamada" (cabecera y hero). Lleva al formulario de contacto. */
export function BotonAgenda({ grande = false, className = "" }: { grande?: boolean; className?: string }) {
  return (
    <a
      href={`#${anclas.contacto}`}
      className={`inline-flex items-center justify-center bg-azul text-white transition-colors hover:bg-[#003f6b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azul ${
        grande
          ? "h-16 gap-4 px-6 text-lg xl:h-[79px] xl:gap-[22px] xl:text-xl"
          : "h-11 gap-2.5 px-3.5 text-[15px] sm:h-[58px] sm:gap-[13px] sm:px-5 sm:text-base"
      } ${className}`}
    >
      <Icono
        nombre="calendario"
        ancho={36}
        alto={37}
        className={grande ? "size-8 xl:h-[37px] xl:w-9" : "size-6 sm:h-[37px] sm:w-9"}
      />
      {grande ? (
        "Agenda una llamada"
      ) : (
        <>
          <span className="sm:hidden">Agendar</span>
          <span className="hidden sm:inline">Agenda una llamada</span>
        </>
      )}
    </a>
  );
}

import { anclas } from "@/lib/sitio";
import { Icono } from "./icono";

/** CTA "Agenda una llamada" (cabecera y hero). Lleva al formulario de contacto. */
export function BotonAgenda({ grande = false, className = "" }: { grande?: boolean; className?: string }) {
  return (
    <a
      href={`#${anclas.contacto}`}
      className={`inline-flex items-center justify-center bg-azul text-white transition-colors hover:bg-[#003f6b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azul ${
        grande
          ? "h-16 gap-7 px-6 text-base sm:gap-4 sm:text-lg xl:h-[79px] xl:gap-[22px] xl:text-xl"
          : "h-[58px] gap-[11px] px-[15px] text-left text-sm leading-[1.07] sm:gap-[13px] sm:px-5 sm:text-base sm:leading-normal"
      } ${className}`}
    >
      <Icono
        nombre="calendario"
        ancho={36}
        alto={37}
        className={grande ? "h-[33px] w-8 xl:h-[37px] xl:w-9" : "h-[27px] w-[26px] max-[359px]:hidden sm:h-[37px] sm:w-9"}
      />
      {grande ? (
        "Agenda una llamada"
      ) : (
        <>
          <span className="whitespace-nowrap sm:hidden">
            Agenda
            <br />
            una llamada
          </span>
          <span className="hidden sm:inline">Agenda una llamada</span>
        </>
      )}
    </a>
  );
}

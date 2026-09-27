import Image from "next/image";
import { anclas } from "@/lib/sitio";
import { BotonAgenda } from "@/components/ui/boton-agenda";
import { Redes } from "@/components/ui/redes";

/** Nodo 583:5. Fija arriba; blanco al 90 % con línea #ddd. */
export function Cabecera() {
  return (
    <header className="sticky top-0 z-50 border-b border-borde bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 xl:h-[119px] xl:pr-[44px] xl:pl-[max(1px,calc(2.5rem_-_(100vw_-_1280px)/16))]">
        <a href={`#${anclas.inicio}`} aria-label="Marlene Batta, Sales & Business Coach — inicio" className="shrink-0">
          <Image
            src="/icons/logo.svg"
            width={208}
            height={75}
            alt=""
            unoptimized
            preload
            className="h-auto w-[140px] sm:w-[170px] xl:w-[208px]"
          />
        </a>
        <div className="flex items-center gap-[38px]">
          <BotonAgenda />
          <Redes className="hidden md:flex" />
        </div>
      </div>
    </header>
  );
}

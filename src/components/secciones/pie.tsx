import Image from "next/image";
import { sitio } from "@/lib/sitio";
import { Redes } from "@/components/ui/redes";

/*
 * Rectangle 89 (y 5427–5743). Negro con un degradado a #88a8d4 que solo asoma
 * en el último 20 %: en el borde inferior llega a ~#384658.
 */
export function Pie() {
  return (
    <footer className="bg-[linear-gradient(to_bottom,#000_79.6%,#384658)] text-white">
      <div className="mx-auto grid max-w-[1420px] items-end gap-10 px-5 pt-16 pb-14 text-center sm:px-8 md:grid-cols-[1fr_auto_1fr] md:text-left xl:min-h-[316px] xl:items-center xl:pt-6 xl:pb-0">
        <div className="order-3 text-[15px] leading-[1.36] md:order-1 md:self-end xl:self-auto xl:pt-[62px]">
          {/* PENDIENTE: aviso de privacidad (obligatorio al recoger datos personales). */}
          <p className="text-bruma">Política de privacidad</p>
          <p className="mt-3">© 2026 {sitio.nombre} — Business Growth Consultant</p>
        </div>
        <Image
          src="/icons/logo-blanco.svg"
          width={254}
          height={91}
          alt="Marlene Batta, Sales & Business Coach"
          unoptimized
          className="order-1 mx-auto h-auto w-[200px] md:order-2 md:w-[254px] xl:mt-[30px]"
        />
        <div className="order-2 flex flex-col items-center gap-4 md:order-3 md:items-end md:self-end xl:self-auto xl:pt-[62px]">
          <Redes claro />
          <a href={`mailto:${sitio.correo}`} className="text-[15px] leading-[1.36] hover:underline">
            {sitio.correo}
          </a>
        </div>
      </div>
    </footer>
  );
}

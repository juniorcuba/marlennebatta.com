import Image from "next/image";
import { anclas } from "@/lib/sitio";
import { TituloSeccion } from "@/components/ui/titulo-seccion";
import { Reserva } from "./reserva";

/*
 * "Hablemos de tu negocio…" (y 4381–5427). Caja #88a8d4 de 1223 × 900 con la
 * esquina inferior derecha redondeada (133) y la foto con la suya (195).
 */
export function Contacto() {
  return (
    <section id={anclas.contacto} aria-labelledby="contacto-titulo" className="py-14 xl:pt-[75px] xl:pb-[71px]">
      <div className="contenedor">
        <div className="mx-auto max-w-[720px] rounded-br-[clamp(4rem,7vw,133px)] bg-bruma px-5 pt-10 pb-12 sm:px-10 xl:max-w-[1223px] xl:pt-[59px] xl:pr-[78px] xl:pb-[45px] xl:pl-[76px]">
          <Reserva
            encabezado={
              <>
                <TituloSeccion id="contacto-titulo" resaltado="Hablemos de tu negocio," className="xl:max-w-[471px]">
                  tu equipo y tus próximos resultados.
                </TituloSeccion>
                <p className="mt-6 max-w-[460px] font-grotesk text-base leading-[1.19] text-tinta xl:mt-[27px]">
                  Una conversación estratégica puede ser el primer paso para transformar tu crecimiento.{" "}
                  <span className="text-azul">Sesión estratégica sin costo</span>
                </p>
              </>
            }
            foto={
              <Image
                src="/images/contacto.webp"
                alt="Sesión de consultoría comercial con un cliente"
                width={1172}
                height={1264}
                sizes="(min-width: 1280px) 492px, 100vw"
                className="hidden h-auto w-full rounded-br-[195px] xl:block"
              />
            }
          />
        </div>
      </div>
    </section>
  );
}

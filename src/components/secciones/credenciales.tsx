import Image from "next/image";
import { anclas } from "@/lib/sitio";
import { Icono } from "@/components/ui/icono";

/*
 * Rectangle 45 (y 900–1294). El fondo es el render compuesto del nodo: foto en
 * blanco y negro al 56 % + dos degradados #1d1d1d que oscurecen la izquierda.
 */
export function Credenciales() {
  return (
    <section
      id={anclas.credenciales}
      aria-labelledby="credenciales-titulo"
      className="relative isolate overflow-hidden bg-carbon text-white"
    >
      <Image
        src="/images/credenciales-bg.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-[70%_center] opacity-40 md:opacity-100"
      />
      <div className="contenedor py-14 md:py-0 md:min-h-[clamp(20rem,20.5vw,24.625rem)] md:flex md:items-center">
        <div className="max-w-[483px] md:ml-[7.5%]">
          <h2 id="credenciales-titulo" className="font-display text-[clamp(1.875rem,1.2rem+1.4vw,2.5rem)] leading-[0.89]">
            Credenciales y estrategia
          </h2>
          <Icono
            nombre="tec-monterrey"
            ancho={227}
            alt="Tecnológico de Monterrey"
            alto={61}
            className="mt-10 h-auto w-[190px] md:mt-[81px] md:ml-[21px] md:w-[227px]"
          />
          <p className="mt-6 max-w-[447px] font-grotesk text-base leading-[1.19] md:mt-[38px] md:ml-[18px]">
            Certificada en Strategic Sales Leader y Coaching Empresarial · Tec de Monterrey
          </p>
        </div>
      </div>
    </section>
  );
}

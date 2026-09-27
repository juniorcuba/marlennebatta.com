import { anclas } from "@/lib/sitio";
import { Icono } from "@/components/ui/icono";
import { ImagenAdaptable } from "@/components/ui/imagen-adaptable";

/*
 * Credenciales. Escritorio: Rectangle 45 (y 900–1294), foto en blanco y negro
 * al 56 % + dos degradados #1d1d1d que oscurecen la izquierda. Móvil: 640:534
 * (407 × 513), texto centrado arriba y la foto asomando por abajo. Los fondos son
 * los renders compuestos de cada nodo.
 */
export function Credenciales() {
  return (
    <section
      id={anclas.credenciales}
      aria-labelledby="credenciales-titulo"
      className="relative isolate overflow-hidden bg-carbon text-white"
    >
      <ImagenAdaptable
        alt=""
        movil={{ src: "/images/credenciales-movil.webp", width: 814, height: 1026, sizes: "100vw" }}
        escritorio={{ src: "/images/credenciales-bg.webp", width: 2880, height: 591, sizes: "100vw" }}
        className="absolute inset-0 -z-10 size-full object-cover object-bottom xl:object-[70%_center]"
      />
      <div className="contenedor min-h-[513px] pt-[35px] pb-10 text-center xl:flex xl:min-h-[clamp(20rem,20.5vw,24.625rem)] xl:items-center xl:py-0 xl:text-left">
        <div className="mx-auto max-w-[300px] xl:mx-0 xl:ml-[7.5%] xl:max-w-[483px]">
          <h2
            id="credenciales-titulo"
            className="mx-auto max-w-[207px] font-display text-[clamp(1.5rem,1.235rem+1.054vw,2.5rem)] leading-[1.08] xl:max-w-none xl:leading-[0.89]"
          >
            Credenciales y estrategia
          </h2>
          <Icono
            nombre="tec-monterrey"
            ancho={227}
            alt="Tecnológico de Monterrey"
            alto={61}
            className="mx-auto mt-[22px] h-auto w-[163px] xl:mx-0 xl:mt-[81px] xl:ml-[21px] xl:w-[227px]"
          />
          <p className="mx-auto mt-[34px] max-w-[272px] text-left font-grotesk text-sm leading-[1.19] xl:mx-0 xl:mt-[38px] xl:ml-[18px] xl:max-w-[447px] xl:text-base">
            Certificada en Strategic Sales Leader y Coaching Empresarial · Tec de Monterrey
          </p>
        </div>
      </div>
    </section>
  );
}

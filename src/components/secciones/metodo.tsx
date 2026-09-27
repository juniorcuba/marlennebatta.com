import Image from "next/image";
import { anclas } from "@/lib/sitio";
import { Icono } from "@/components/ui/icono";
import { TituloSeccion } from "@/components/ui/titulo-seccion";

/*
 * "Cómo trabajo contigo". Escritorio (y 3025–3830): fondo = render del nodo
 * 612:408, foto con un velo blanco que se abre desde arriba a la izquierda.
 * Móvil (651:744, 402 × 1489): fondo blanco y la foto solo en los últimos
 * 476 px, con las tarjetas montadas 203 px sobre ella.
 */
const pasos = [
  {
    titulo: "Diagnóstico",
    texto: "Analizo tu negocio, equipo, procesos y resultados para identificar fortalezas, oportunidades y brechas.",
    icono: { nombre: "diagnostico", ancho: 56, alto: 56 },
  },
  {
    titulo: "Estrategia",
    texto: "Diseñamos juntos un plan comercial y de liderazgo alineado a tus objetivos y a tu realidad.",
    icono: { nombre: "estrategia", ancho: 62, alto: 63 },
  },
  {
    titulo: "Acompañamiento",
    texto:
      "Implemento contigo el plan con herramientas prácticas, seguimiento y ajustes para generar resultados sostenibles.",
    icono: { nombre: "acompanamiento", ancho: 67, alto: 59 },
  },
] as const;

export function Metodo() {
  return (
    <section
      id={anclas.metodo}
      aria-labelledby="metodo-titulo"
      className="relative isolate overflow-hidden pt-[34px] pb-[calc(118.5vw-203px)] md:py-14 xl:min-h-[805px] xl:pt-[83px] xl:pb-[66px]"
    >
      <Image
        src="/images/metodo-bg.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 hidden object-cover object-[78%_center] opacity-30 md:block xl:opacity-100"
      />
      <Image
        src="/images/metodo-movil.webp"
        alt=""
        width={804}
        height={953}
        sizes="100vw"
        className="absolute bottom-0 left-0 -z-10 h-auto w-full md:hidden"
      />
      <div className="contenedor">
        <TituloSeccion id="metodo-titulo" resaltado="Cómo trabajo" interlineado="leading-[0.89]" className="mx-auto max-w-[190px] text-center sm:max-w-none">
          contigo
        </TituloSeccion>
        <ol className="mx-auto mt-[18px] grid max-w-[325px] gap-[25px] md:mt-12 md:max-w-[360px] md:gap-6 lg:max-w-[1040px] lg:grid-cols-3 xl:mx-0 xl:mt-[73px] xl:max-w-[1047px] xl:gap-[36px] 2xl:-ml-6">
          {pasos.map((p, i) => (
            <li
              key={p.titulo}
              className="hoja flex min-h-[348px] flex-col bg-cielo px-[27px] pt-[18px] pb-7 shadow-tarjeta md:px-8 md:pt-12 md:pb-10 xl:min-h-[539px] xl:px-[30px] xl:pt-[94px]"
            >
              <span
                aria-hidden
                className="grid size-[67px] place-items-center rounded-full bg-carbon font-display text-[32px] leading-none text-white md:text-[40px]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-[17px] grid size-[92px] place-items-center rounded-full bg-crema md:mt-8 md:size-[109px] xl:mt-[37px] [&_img]:max-h-[49px] [&_img]:w-auto md:[&_img]:max-h-none">
                <Icono {...p.icono} />
              </span>
              <h3 className="mt-[17px] font-display text-xl leading-[1.05] text-black uppercase md:mt-6 md:text-2xl xl:mt-[22px]">
                <span className="sr-only">Paso {i + 1}: </span>
                {p.titulo}
              </h3>
              <p className="mt-[21px] max-w-[259px] text-[15px] leading-[1.36] text-black md:mt-6 md:max-w-[250px] md:text-base xl:mt-[37px]">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import Image from "next/image";
import { anclas } from "@/lib/sitio";
import { Icono } from "@/components/ui/icono";
import { TituloSeccion } from "@/components/ui/titulo-seccion";

/*
 * "Cómo trabajo contigo" (y 3025–3830). Fondo = render del nodo 612:408: foto
 * con un velo blanco que se abre desde arriba a la izquierda.
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
      className="relative isolate overflow-hidden py-14 xl:min-h-[805px] xl:pt-[83px] xl:pb-[66px]"
    >
      <Image
        src="/images/metodo-bg.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-[78%_center] opacity-30 xl:opacity-100"
      />
      <div className="contenedor">
        <TituloSeccion id="metodo-titulo" resaltado="Cómo trabajo" className="text-center">
          contigo
        </TituloSeccion>
        <ol className="mx-auto mt-12 grid max-w-[400px] gap-6 md:max-w-[1040px] md:grid-cols-3 xl:mx-0 xl:mt-[73px] xl:max-w-[1047px] xl:gap-[36px] 2xl:-ml-6">
          {pasos.map((p, i) => (
            <li
              key={p.titulo}
              className="hoja flex flex-col bg-cielo px-8 pt-12 pb-10 shadow-tarjeta xl:min-h-[539px] xl:px-[30px] xl:pt-[94px]"
            >
              <span
                aria-hidden
                className="grid size-[67px] place-items-center rounded-full bg-carbon font-display text-[40px] leading-none text-white"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-8 grid size-[109px] place-items-center rounded-full bg-crema xl:mt-[37px]">
                <Icono {...p.icono} />
              </span>
              <h3 className="mt-6 font-display text-2xl leading-[1.05] text-black uppercase xl:mt-[22px]">
                <span className="sr-only">Paso {i + 1}: </span>
                {p.titulo}
              </h3>
              <p className="mt-6 max-w-[250px] text-base leading-[1.36] text-black xl:mt-[37px]">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

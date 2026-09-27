import Image from "next/image";
import { anclas } from "@/lib/sitio";
import { Icono } from "@/components/ui/icono";
import { TituloSeccion } from "@/components/ui/titulo-seccion";

/* "Cuando trabajamos juntos, logras:" (y 2073–3025, fondo #c4dbfa). */
const logros = [
  { titulo: "Claridad\nComercial", texto: "Estrategias alineadas que guían al equipo.", icono: { nombre: "claridad", ancho: 51, alto: 57 } },
  { titulo: "Liderazgo\nmás Sólido", texto: "Líderes que inspiran, deciden y ejecutan.", icono: { nombre: "liderazgo", ancho: 41, alto: 54 } },
  { titulo: "Equipos\nAlineados", texto: "Roles claros, objetivos compartidos.", icono: { nombre: "alineados", ancho: 55, alto: 36 } },
  { titulo: "Mejor\nComunicación", texto: "Conversaciones que generan confianza.", icono: { nombre: "comunicacion", ancho: 51, alto: 44 } },
  { titulo: "Seguimiento\nConsistente", texto: "Disciplina y hábitos que impulsan resultados.", icono: { nombre: "seguimiento", ancho: 55, alto: 55 } },
  { titulo: "Resultados\nMedibles", texto: "Crecimiento sostenible y predecible.", icono: { nombre: "medibles", ancho: 49, alto: 50 } },
] as const;

export function Logros() {
  return (
    <section id={anclas.resultados} aria-labelledby="logros-titulo" className="bg-cielo py-14 xl:pt-[76px] xl:pb-[110px]">
      <div className="contenedor">
        <div className="hoja mx-auto flex max-w-[760px] flex-col overflow-hidden bg-crema shadow-tarjeta xl:max-w-[1545px] xl:flex-row">
          <Image
            src="/images/marlene-trabajando.webp"
            alt="Marlene Batta trabajando en su escritorio"
            width={1254}
            height={1532}
            sizes="(min-width: 1280px) 40vw, (min-width: 800px) 760px, 100vw"
            className="aspect-[4/3] w-full object-cover object-[center_25%] xl:aspect-auto xl:w-[40.6%] xl:shrink-0"
          />
          <div className="px-6 py-10 sm:px-12 xl:flex-1 xl:pt-[88px] xl:pr-10 xl:pb-12 xl:pl-[75px]">
            <TituloSeccion id="logros-titulo" resaltado="Cuando trabajamos juntos," interlineado="leading-[1.07]" className="max-w-[471px]">
              logras:
            </TituloSeccion>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:mt-[50px] xl:grid-cols-[223px_241px_1fr] xl:gap-x-0 xl:gap-y-[7px]">
              {logros.map((l) => (
                <li key={l.titulo} className="xl:min-h-[245px]">
                  <span className="grid size-[86px] place-items-center rounded-full border-2 border-azul bg-crema">
                    <Icono {...l.icono} />
                  </span>
                  <h3 className="mt-4 text-base leading-[1.36] font-bold whitespace-pre-line text-azul xl:mt-[16px]">
                    {l.titulo}
                  </h3>
                  <p className="mt-4 max-w-[166px] text-base leading-[1.36] text-tinta xl:mt-[17px]">{l.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

import { anclas } from "@/lib/sitio";
import { Icono } from "@/components/ui/icono";
import { ImagenAdaptable } from "@/components/ui/imagen-adaptable";
import { TituloSeccion } from "@/components/ui/titulo-seccion";

/*
 * "Cuando trabajamos juntos, logras:" (escritorio y 2073–3025; móvil y 3488–4886,
 * foto a sangre de 402 × 481 y la tarjeta crema debajo, sin márgenes).
 */
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
    <section id={anclas.resultados} aria-labelledby="logros-titulo" className="bg-cielo pb-[42px] md:py-14 xl:pt-[76px] xl:pb-[110px]">
      <div className="contenedor max-md:px-0">
        <div className="mx-auto flex flex-col overflow-hidden bg-crema shadow-tarjeta md:hoja md:max-w-[760px] xl:max-w-[1545px] xl:flex-row">
          <ImagenAdaptable
            alt="Marlene Batta trabajando en su escritorio"
            movil={{ src: "/images/marlene-trabajando-movil.webp", width: 804, height: 962, sizes: "(min-width: 768px) 760px, 100vw" }}
            escritorio={{ src: "/images/marlene-trabajando.webp", width: 1254, height: 1532, sizes: "40vw" }}
            className="aspect-[402/481] w-full object-cover md:aspect-[4/3] md:object-[center_30%] xl:aspect-auto xl:w-[40.6%] xl:shrink-0"
          />
          <div className="pt-[41px] pr-5 pb-16 pl-[37px] sm:px-12 sm:py-10 xl:flex-1 xl:pt-[88px] xl:pr-10 xl:pb-12 xl:pl-[75px]">
            <TituloSeccion id="logros-titulo" resaltado="Cuando trabajamos juntos," interlineado="leading-[1.07]" className="ml-7 max-w-[271px] sm:ml-0 xl:max-w-[471px]">
              logras:
            </TituloSeccion>
            <ul className="mt-[39px] grid grid-cols-[179px_1fr] gap-y-[27px] max-[379px]:grid-cols-2 sm:mt-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 xl:mt-[50px] xl:grid-cols-[223px_241px_1fr] xl:gap-x-0 xl:gap-y-[7px]">
              {logros.map((l) => (
                <li key={l.titulo} className="xl:min-h-[245px]">
                  <span className="grid size-[75px] place-items-center rounded-full border-2 border-azul bg-crema xl:size-[86px] [&_img]:max-h-[48px] [&_img]:w-auto xl:[&_img]:max-h-none">
                    <Icono {...l.icono} />
                  </span>
                  <h3 className="mt-[17px] text-base leading-[1.36] font-bold whitespace-pre-line text-azul xl:mt-[16px]">
                    {l.titulo}
                  </h3>
                  <p className="mt-[11px] max-w-[166px] text-[15px] leading-[1.36] text-tinta sm:mt-4 sm:text-base xl:mt-[17px]">{l.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

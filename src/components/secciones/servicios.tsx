import Image from "next/image";
import { anclas } from "@/lib/sitio";
import { Icono } from "@/components/ui/icono";
import { TituloSeccion } from "@/components/ui/titulo-seccion";

/*
 * "¿En qué puedo ayudarte?" (y 1294–2067). Tarjetas de 372 × 506 con la foto
 * fundida en #c4dbfa (LINEAR_BURN al 70 % + degradado). La imagen es la mitad
 * superior del render de cada tarjeta, ya con el fundido hecho.
 */
const servicios = [
  {
    titulo: "Consultoría\nComercial",
    texto:
      "Diseño e implementación de estrategias comerciales que alinean tu propuesta de valor con las necesidades del mercado y generan crecimiento predecible.",
    imagen: "servicio-consultoria",
    icono: { nombre: "consultoria", ancho: 50, alto: 45 },
  },
  {
    titulo: "Coaching Ejecutivo\ny de Liderazgo",
    texto:
      "Acompaño a líderes y gerentes a fortalecer su liderazgo, tomar mejores decisiones y comunicar con claridad para movilizar a sus equipos.",
    imagen: "servicio-coaching",
    icono: { nombre: "coaching", ancho: 52, alto: 52 },
  },
  {
    titulo: "Desarrollo\nde Equipos",
    texto:
      "Elevo el desempeño comercial y habilidades clave de tu equipo con metodologías prácticas, experiencias de aprendizaje y acompañamiento continuo.",
    imagen: "servicio-equipos",
    icono: { nombre: "equipos", ancho: 55, alto: 55 },
  },
  {
    titulo: "Optimización de Procesos y Seguimiento",
    texto:
      "Estructuro procesos comerciales claros, tableros de control y rutinas de seguimiento que aseguran foco, disciplina y resultados medibles.",
    imagen: "servicio-procesos",
    icono: { nombre: "procesos", ancho: 51, alto: 51 },
  },
] as const;

export function Servicios() {
  return (
    <section id={anclas.servicios} aria-labelledby="servicios-titulo" className="pt-7 pb-8 md:py-16 xl:pt-[104px] xl:pb-[64px]">
      <div className="contenedor">
        <TituloSeccion id="servicios-titulo" resaltado="¿En qué puedo" className="mx-auto max-w-[182px] text-center sm:max-w-none">
          ayudarte?
        </TituloSeccion>
        <ul className="mx-auto mt-7 grid max-w-[372px] gap-[17px] md:mt-12 md:max-w-[800px] md:gap-6 md:grid-cols-2 xl:mt-[57px] xl:max-w-none xl:grid-cols-4 xl:gap-[23px]">
          {servicios.map((s) => (
            <li key={s.titulo} className="hoja flex flex-col overflow-hidden bg-cielo shadow-tarjeta">
              {/* En el móvil (640:565) la foto se funde antes: franja de 200 px. */}
              <div className="relative h-[200px] overflow-hidden md:h-auto">
                <Image
                  src={`/images/${s.imagen}.webp`}
                  alt=""
                  width={744}
                  height={520}
                  sizes="(min-width: 1280px) 24vw, (min-width: 768px) 400px, 100vw"
                  className="aspect-[744/520] w-full object-cover object-top"
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-[70px] bg-linear-to-b from-cielo/0 to-cielo md:hidden" />
              </div>
              <div className="flex flex-1 flex-col pt-[3px] pb-[33px] md:pt-2 md:pb-10 xl:pb-[43px]">
                <h3 className="flex items-center gap-[26px] pr-[4%] pl-[33px] font-display text-xl leading-[1.1] text-azul md:gap-[5%] md:pl-[10%] md:text-2xl xl:whitespace-pre-line">
                  <Icono {...s.icono} className="h-auto w-[50px] shrink-0" />
                  {s.titulo}
                </h3>
                <p className="relative mt-5 pr-[28px] pl-[28px] text-[15px] leading-[1.36] text-tinta md:pr-[16%] md:pl-[14.5%] md:text-base">{s.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

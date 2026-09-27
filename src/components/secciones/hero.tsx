import { anclas } from "@/lib/sitio";
import { BotonAgenda } from "@/components/ui/boton-agenda";
import { Icono } from "@/components/ui/icono";
import { ImagenAdaptable } from "@/components/ui/imagen-adaptable";

/*
 * Hero (y 120–900 del lienzo de escritorio; y 117–1269 del móvil). Por debajo
 * de xl se apila como en el artboard móvil: texto, botones y la franja de foto.
 */
export function Hero() {
  return (
    <section id={anclas.inicio} aria-labelledby="hero-titulo" className="relative overflow-hidden">
      <div className="contenedor grid xl:grid-cols-[758fr_799fr]">
        {/* Texto (va primero en el DOM: es lo que importa para SEO y lectores) */}
        <div className="relative z-10 pt-[35px] sm:pt-14 xl:order-2 xl:pt-[96px] xl:pb-16">
          <div className="mx-auto max-w-[640px] xl:mx-0 xl:max-w-none">
            <h1
              id="hero-titulo"
              className="font-display text-[clamp(2.25rem,1rem+3vw,4rem)] leading-[0.99] text-black"
            >
              <span className="text-azul">Estructuro equipos, desarrollo líderes y convierto</span> estrategia
              en resultados sostenibles.
            </h1>
            <p className="mt-[17px] max-w-[322px] font-grotesk text-[15px] leading-[1.19] text-tinta sm:max-w-[684px] sm:text-base xl:mt-7 xl:pl-1">
              Consultoría comercial, capacitación de equipos de venta y coaching para líderes de empresas, call
              centers y negocios de servicios que quieren convertir más oportunidades en clientes.
            </p>
            <div className="mt-[34px] flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:gap-4 xl:mt-[46px] xl:gap-[39px]">
              <BotonAgenda grande className="w-full max-w-[302px] sm:w-auto xl:w-[calc(50%-20px)] xl:px-3" />
              <a
                href={`#${anclas.metodo}`}
                className="inline-flex h-16 w-full max-w-[302px] items-center justify-center gap-7 border-2 border-azul px-6 text-base text-azul transition-colors hover:bg-azul/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azul sm:w-auto sm:gap-4 sm:text-lg xl:h-[79px] xl:w-[calc(50%-20px)] xl:gap-[16px] xl:px-3 xl:text-xl"
              >
                <Icono nombre="enfoque" ancho={45} alto={46} className="h-9 w-[35px] xl:h-[46px] xl:w-[45px]" />
                Conoce mi enfoque
              </a>
            </div>
            <p className="mx-auto mt-[23px] flex max-w-[336px] items-center gap-[25px] font-grotesk text-sm leading-[1.19] text-tinta sm:mx-0 sm:mt-8 sm:max-w-none sm:text-base xl:mt-[35px] xl:gap-[27px] xl:pl-1">
              <Icono nombre="estrategia-humana" ancho={39} alto={44} className="h-[44px] w-[39px] shrink-0" />
              Enfoque estratégico — acompañamiento humano = resultados reales
            </p>
          </div>
        </div>

        {/*
          Foto, círculo y cita. En móvil (artboard 639:29) es una franja a sangre de
          402 × 555 con la cita montada sobre el borde inferior; en xl, la caja de
          758 × 780 del escritorio. Todo va en % de la caja.
        */}
        <div className="relative -mx-5 mt-9 sm:-mx-6 md:mx-auto md:mt-12 md:w-full md:max-w-[520px] xl:order-1 xl:mt-0 xl:max-w-none">
          <div className="relative aspect-[402/555] overflow-hidden xl:aspect-[758/780] xl:overflow-visible">
            <div
              aria-hidden
              className="absolute top-[4.3%] left-[-114.7%] aspect-[723/743] w-[179.9%] rounded-full bg-perla xl:top-[22.4%] xl:left-[-95.4%] xl:aspect-square xl:w-[137.9%]"
            />
            <ImagenAdaptable
              alt="Marlene Batta, consultora comercial y coach de ventas"
              quality={85}
              prioritaria
              movil={{ src: "/images/marlene-hero-movil.webp", width: 806, height: 1136, sizes: "(min-width: 768px) 520px, 100vw" }}
              escritorio={{ src: "/images/marlene-hero.webp", width: 1148, height: 1138, sizes: "(min-width: 1605px) 778px, 50vw" }}
              className="absolute top-[-2.5%] left-0 h-auto w-[100.2%] max-w-none xl:top-[1.5%] xl:left-[4.1%] xl:w-[102.6%]"
            />
            <Cita className="absolute bottom-0 left-[4.7%] w-[92.8%] xl:left-[0.66%] xl:w-[49.2%]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/*
 * Rectangle 90 + textos de la cita. Móvil: 373 × 248 (nodo 639:412), escritorio:
 * 373 × 342 (462:39). Todo se mide en unidades del propio contenedor (cqw = 1 %
 * de su ancho), así se ve idéntica a cualquier tamaño: 20 px de texto en 373 de
 * ancho = 5.36cqw. El degradado es el del nodo: blanco al 94 % que se desvanece
 * hacia la esquina superior derecha.
 */
function Cita({ className = "" }: { className?: string }) {
  return (
    <figure
      className={`@container aspect-[373/248] rounded-tr-[16.9%_25.4%] bg-[linear-gradient(188deg,rgb(255_255_255/0)_-26.7%,rgb(255_255_255/0.94)_27.1%)] font-sans text-azul italic xl:aspect-[373/342] xl:rounded-tr-[16.9%_18.4%] ${className}`}
    >
      <span
        aria-hidden
        className="absolute top-[4.3cqw] left-[4cqw] font-display text-[34cqw] leading-[0.89] text-bruma not-italic xl:top-[4cqw] xl:left-[3.5cqw]"
      >
        “
      </span>
      <blockquote className="absolute top-[19.3cqw] left-[18cqw] w-[66.5cqw] text-[4.29cqw] leading-[1.36] xl:top-[16.6cqw] xl:text-[5.36cqw]">
        <p>Las ventas no se tratan de presionar, se tratan de generar valor y confianza.</p>
      </blockquote>
      <span
        aria-hidden
        className="absolute top-[12.6cqw] left-[80.2cqw] rotate-180 font-display text-[34cqw] leading-[0.89] text-bruma not-italic xl:top-[22.3cqw] xl:left-[79.9cqw]"
      >
        “
      </span>
      <figcaption className="absolute top-[42.6cqw] right-[9.1cqw] text-right leading-[1.36] xl:top-[59.8cqw]">
        <span className="block text-[4.29cqw] font-bold xl:text-[5.36cqw]">— Marlene Batta,</span>
        <span className="block text-[3.49cqw] text-black xl:text-[4.02cqw]">Sales &amp; Business Coach</span>
      </figcaption>
    </figure>
  );
}

import Image from "next/image";
import { anclas } from "@/lib/sitio";
import { BotonAgenda } from "@/components/ui/boton-agenda";
import { Icono } from "@/components/ui/icono";

/*
 * Hero (y 120–900 del lienzo). A partir de xl la columna de la foto es una caja
 * de 758 × 780 (x 190–948) y todo lo de dentro se coloca en % de esa caja, así
 * que escala igual a 1280 que a 1920. Por debajo se apila: texto, foto y cita.
 */
export function Hero() {
  return (
    <section id={anclas.inicio} aria-labelledby="hero-titulo" className="relative overflow-hidden">
      <div className="contenedor grid xl:grid-cols-[758fr_799fr]">
        {/* Texto (va primero en el DOM: es lo que importa para SEO y lectores) */}
        <div className="relative z-10 pt-10 sm:pt-14 xl:order-2 xl:pt-[96px] xl:pb-16">
          <div className="mx-auto max-w-[640px] xl:mx-0 xl:max-w-none">
            <h1
              id="hero-titulo"
              className="font-display text-[clamp(2.125rem,1rem+3vw,4rem)] leading-[0.99] text-black"
            >
              <span className="text-azul">Estructuro equipos, desarrollo líderes y convierto</span> estrategia
              en resultados sostenibles.
            </h1>
            <p className="mt-6 max-w-[684px] font-grotesk text-base leading-[1.19] text-tinta xl:mt-7 xl:pl-1">
              Consultoría comercial, capacitación de equipos de venta y coaching para líderes de empresas, call
              centers y negocios de servicios que quieren convertir más oportunidades en clientes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 xl:mt-[46px] xl:gap-[39px]">
              <BotonAgenda grande className="xl:w-[calc(50%-20px)] xl:max-w-[302px] xl:px-3" />
              <a
                href={`#${anclas.metodo}`}
                className="inline-flex h-16 items-center justify-center gap-4 border-2 border-azul px-6 text-lg text-azul transition-colors hover:bg-azul/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azul xl:h-[79px] xl:w-[calc(50%-20px)] xl:max-w-[302px] xl:gap-[16px] xl:px-3 xl:text-xl"
              >
                <Icono nombre="enfoque" ancho={45} alto={46} className="size-9 xl:h-[46px] xl:w-[45px]" />
                Conoce mi enfoque
              </a>
            </div>
            <p className="mt-8 flex items-center gap-[27px] font-grotesk text-base leading-[1.19] text-tinta xl:mt-[35px] xl:pl-1">
              <Icono nombre="estrategia-humana" ancho={39} alto={44} className="h-[44px] w-[39px] shrink-0" />
              Enfoque estratégico — acompañamiento humano = resultados reales
            </p>
          </div>
        </div>

        {/* Foto, círculo y cita */}
        <div className="relative mx-auto mt-10 w-full max-w-[640px] xl:order-1 xl:mt-0 xl:max-w-none">
          <div className="relative aspect-[758/780]">
            {/* Ellipse 24: círculo de 1045 con centro fuera del lienzo */}
            <div
              aria-hidden
              className="absolute top-[22.4%] left-[-95.4%] aspect-square w-[137.9%] rounded-full bg-perla"
            />
            <Image
              src="/images/marlene-hero.webp"
              alt="Marlene Batta, consultora comercial y coach de ventas"
              width={1148}
              height={1138}
              quality={85}
              preload
              fetchPriority="high"
              sizes="(min-width: 1588px) 778px, (min-width: 1280px) 50vw, (min-width: 680px) 660px, 100vw"
              className="absolute top-[1.5%] left-[4.1%] h-auto w-[102.6%] max-w-none"
            />
            <Cita className="absolute bottom-0 left-[0.66%] hidden w-[49.2%] xl:block" />
          </div>
          <Cita className="relative w-full max-w-[373px] xl:hidden" />
        </div>
      </div>
    </section>
  );
}

/*
 * Rectangle 90 (373 × 342) + textos 462:155/156/187/188. Todo se mide en
 * unidades del propio contenedor (cqw = 1 % de su ancho), así la cita se ve
 * idéntica a 373 px o a 250: 20 px de texto = 20/373 = 5.36cqw.
 * El degradado es el del nodo pasado a CSS: blanco al 94 % que se desvanece
 * hacia la esquina superior derecha.
 */
function Cita({ className = "" }: { className?: string }) {
  return (
    <figure
      className={`@container aspect-[373/342] rounded-tr-[16.9cqw] bg-[linear-gradient(188deg,rgb(255_255_255/0)_-26.7%,rgb(255_255_255/0.94)_27.1%)] font-sans text-azul italic ${className}`}
    >
      <span
        aria-hidden
        className="absolute top-[4cqw] left-[3.5cqw] font-display text-[34cqw] leading-[0.89] text-bruma not-italic"
      >
        “
      </span>
      <blockquote className="absolute top-[16.6cqw] left-[18cqw] w-[66.5cqw] text-[5.36cqw] leading-[1.36]">
        <p>Las ventas no se tratan de presionar, se tratan de generar valor y confianza.</p>
      </blockquote>
      <span
        aria-hidden
        className="absolute top-[22.3cqw] left-[79.9cqw] rotate-180 font-display text-[34cqw] leading-[0.89] text-bruma not-italic"
      >
        “
      </span>
      <figcaption className="absolute top-[59.8cqw] right-[9.1cqw] text-right leading-[1.36]">
        <span className="block text-[5.36cqw] font-bold">— Marlene Batta,</span>
        <span className="block text-[4.02cqw] text-black">Sales &amp; Business Coach</span>
      </figcaption>
    </figure>
  );
}

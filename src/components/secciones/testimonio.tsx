import { anclas } from "@/lib/sitio";

/* Testimonio + cifras (escritorio y 3830–4381; móvil 651:851, cifras apiladas). */
const cifras = [
  { valor: "32%", etiqueta: ["Crecimiento", "en ventas"] },
  { valor: "55%", etiqueta: ["Productividad", "del equipo"] },
] as const;

export function Testimonio() {
  return (
    <section
      id={anclas.testimonios}
      aria-label="Testimonio y resultados"
      className="bg-carbon pt-[50px] pb-[66px] text-center md:py-16 xl:pt-[86px] xl:pb-[91px]"
    >
      <div className="contenedor">
        <figure className="mx-auto max-w-[1021px]">
          <blockquote className="font-display text-[min(8.96vw,2.25rem)] leading-[0.89] sm:text-[clamp(2.25rem,2rem+0.5vw,2.5rem)] text-white">
            <p>
              <span className="text-bruma">“Trabajar con Marlene transformó la forma en que lideramos y vendemos.</span>{" "}
              Nos dio claridad, enfoque y herramientas prácticas que impactaron tanto nuestros resultados como la
              cultura del equipo.”
            </p>
          </blockquote>
          <figcaption className="mt-6 text-[15px] leading-[1.36] text-white md:mt-5 md:text-base">Carolina R. — Directora Comercial</figcaption>
        </figure>
        <dl className="mt-[45px] flex flex-col items-center gap-[39px] text-cielo sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-[clamp(3rem,11vw,11.5rem)] md:mt-12 xl:mt-[43px]">
          {cifras.map((c) => (
            <div key={c.valor} className="flex flex-col-reverse items-center">
              <dt className="mt-1 font-display text-[clamp(1.5rem,1.37rem+0.527vw,2rem)] leading-[0.89]">
                {c.etiqueta[0]}
                <br />
                {c.etiqueta[1]}
              </dt>
              <dd className="font-display text-[clamp(4rem,3.7rem+1.186vw,5.125rem)] leading-[1.05]">{c.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

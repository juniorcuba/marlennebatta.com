import { anclas } from "@/lib/sitio";

/* Testimonio + cifras (y 3830–4381, fondo #1d1d1d). */
const cifras = [
  { valor: "32%", etiqueta: ["Crecimiento", "en ventas"] },
  { valor: "55%", etiqueta: ["Productividad", "del equipo"] },
] as const;

export function Testimonio() {
  return (
    <section
      id={anclas.testimonios}
      aria-label="Testimonio y resultados"
      className="bg-carbon py-16 text-center xl:pt-[86px] xl:pb-[91px]"
    >
      <div className="contenedor">
        <figure className="mx-auto max-w-[1021px]">
          <blockquote className="font-display text-[clamp(1.5rem,0.95rem+1.5vw,2.5rem)] leading-[0.89] text-white">
            <p>
              <span className="text-bruma">“Trabajar con Marlene transformó la forma en que lideramos y vendemos.</span>{" "}
              Nos dio claridad, enfoque y herramientas prácticas que impactaron tanto nuestros resultados como la
              cultura del equipo.”
            </p>
          </blockquote>
          <figcaption className="mt-5 text-base leading-[1.36] text-white">Carolina R. — Directora Comercial</figcaption>
        </figure>
        <dl className="mt-12 flex flex-wrap justify-center gap-x-[clamp(3rem,11vw,11.5rem)] gap-y-10 text-cielo xl:mt-[43px]">
          {cifras.map((c) => (
            <div key={c.valor} className="flex flex-col-reverse items-center">
              <dt className="mt-1 font-display text-[clamp(1.5rem,1.1rem+1vw,2rem)] leading-[0.89]">
                {c.etiqueta[0]}
                <br />
                {c.etiqueta[1]}
              </dt>
              <dd className="font-display text-[clamp(3.5rem,2.5rem+2.4vw,5.125rem)] leading-[1.05]">{c.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

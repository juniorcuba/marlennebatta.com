import { jsonLd } from "@/lib/json-ld";
import { Cabecera } from "@/components/secciones/cabecera";
import { Hero } from "@/components/secciones/hero";
import { Credenciales } from "@/components/secciones/credenciales";
import { Servicios } from "@/components/secciones/servicios";
import { Logros } from "@/components/secciones/logros";
import { Metodo } from "@/components/secciones/metodo";
import { Testimonio } from "@/components/secciones/testimonio";
import { Contacto } from "@/components/secciones/contacto";
import { Pie } from "@/components/secciones/pie";

export default function Inicio() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-azul focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Cabecera />
      <main id="contenido">
        <Hero />
        <Credenciales />
        <Servicios />
        <Logros />
        <Metodo />
        <Testimonio />
        <Contacto />
      </main>
      <Pie />
      <script
        type="application/ld+json"
        // JSON propio y estático; se escapa "<" para que nada pueda cerrar el <script>.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
      />
    </>
  );
}

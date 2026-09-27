import { sitio } from "./sitio";

const servicios = [
  "Consultoría Comercial",
  "Coaching Ejecutivo y de Liderazgo",
  "Desarrollo de Equipos",
  "Optimización de Procesos y Seguimiento",
];

/** Datos estructurados (schema.org) para buscadores: persona + servicio profesional. */
export function jsonLd() {
  const persona = `${sitio.url}/#persona`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": persona,
        name: sitio.nombre,
        jobTitle: sitio.cargo,
        email: `mailto:${sitio.correo}`,
        url: sitio.url,
        image: `${sitio.url}/images/marlene-hero.webp`,
        sameAs: [sitio.redes.linkedin, sitio.redes.instagram],
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          name: "Strategic Sales Leader y Coaching Empresarial",
          recognizedBy: { "@type": "CollegeOrUniversity", name: "Tecnológico de Monterrey" },
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${sitio.url}/#servicio`,
        name: `${sitio.nombre} — Consultoría comercial y coaching`,
        description: sitio.descripcion,
        url: sitio.url,
        email: sitio.correo,
        image: `${sitio.url}/opengraph-image.jpg`,
        founder: { "@id": persona },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios",
          itemListElement: servicios.map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, provider: { "@id": persona } },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${sitio.url}/#web`,
        url: sitio.url,
        name: sitio.nombre,
        inLanguage: "es",
        publisher: { "@id": persona },
      },
    ],
  };
}

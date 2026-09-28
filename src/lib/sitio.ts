/**
 * Datos del sitio en un solo lugar: los usan el SEO (metadata, JSON-LD,
 * sitemap) y la maqueta. Lo marcado como PENDIENTE está sin confirmar con la
 * clienta; no publicar sin revisarlo.
 */
export const sitio = {
  // PENDIENTE: dominio definitivo. Se toma del correo del diseño.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://marlenebatta.com").replace(/\/$/, ""),
  nombre: "Marlene Batta",
  cargo: "Sales & Business Coach",
  titulo: "Marlene Batta | Consultoría comercial y coaching de ventas y liderazgo",
  descripcion:
    "Consultoría comercial, capacitación de equipos de venta y coaching para líderes de empresas, call centers y negocios de servicios que quieren convertir más oportunidades en clientes.",
  correo: "mb@marlenebatta.com",
  // Confirmadas por la clienta el 2026-09-27 (sin los parámetros de rastreo del enlace compartido).
  redes: {
    linkedin: "https://www.linkedin.com/in/marlene-batta",
    instagram: "https://www.instagram.com/marlenebatta",
  },
  locale: "es_MX",
  /*
   * Sin indexar salvo que se pida lo contrario de forma explícita: un
   * despliegue que olvide la variable queda fuera de Google (fallo seguro
   * mientras el sitio es una vista previa).
   */
  indexable: process.env.NEXT_PUBLIC_NOINDEX === "false",
} as const;

export const anclas = {
  inicio: "inicio",
  credenciales: "credenciales",
  servicios: "servicios",
  resultados: "resultados",
  metodo: "metodo",
  testimonios: "testimonios",
  contacto: "contacto",
} as const;

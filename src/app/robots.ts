import type { MetadataRoute } from "next";
import { sitio } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: sitio.indexable ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${sitio.url}/sitemap.xml`,
    host: sitio.url,
  };
}

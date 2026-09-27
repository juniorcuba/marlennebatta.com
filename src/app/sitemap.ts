import type { MetadataRoute } from "next";
import { sitio } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: sitio.url, changeFrequency: "monthly", priority: 1 }];
}

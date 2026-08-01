import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Sólo el sitio público. Las rutas del panel y de acceso quedan fuera a
// propósito (ver robots.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}

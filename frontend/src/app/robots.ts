import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// A propósito NO se listan la ruta de acceso ni /panel: robots.txt es público
// y un Disallow funciona como letrero de "aquí está la entrada". Esas páginas
// llevan `noindex, nofollow` en su layout, así que los buscadores tampoco las
// indexan, y /panel responde 404 sin sesión.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

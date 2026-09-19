// proxy.ts (antes middleware.ts: la convención cambió en Next 16)
//
// Bloquea TODO /panel/* si no hay cookie de sesión.
// Devuelve 404 silencioso (no 401) para NO revelar la existencia del panel
// a curiosos. Esto es una regla dura del proyecto.

import { NextResponse, type NextRequest } from "next/server";

// El nombre lleva prefijo para no chocar con la sesión de Tickomium cuando el
// panel vive en un subdominio del mismo dominio raíz (ver backend/src/config/cookies.ts).
const ACCESS_COOKIE = "ikk_access";

export function proxy(request: NextRequest): NextResponse {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    // 404 explícito y vacío. Para un visitante normal el panel "no existe".
    // No usamos rewrite() porque queremos status 404 sin servir contenido del panel.
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Captura sólo rutas privadas. Login / forgot / reset NO se interceptan.
  matcher: ["/panel/:path*"],
};

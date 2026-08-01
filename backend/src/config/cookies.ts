// Nombres y opciones de las cookies de sesión de IKK.
//
// Los nombres llevan prefijo `ikk_` a propósito: en producción el panel vive en
// un subdominio de tickomium.com y la cookie se emite con COOKIE_DOMAIN
// `.tickomium.com` para que el middleware del frontend pueda verla. Si usáramos
// `accessToken` / `refreshToken` (los nombres de Tickomium) las dos sesiones
// colisionarían en el navegador.

import type { CookieOptions } from "express";

export const ACCESS_COOKIE = "ikk_access";
export const REFRESH_COOKIE = "ikk_refresh";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
const isLocal = !isProduction && !isDevelopment;
const cookieDomain = process.env.COOKIE_DOMAIN?.trim();

// LOCAL:      sameSite "lax", secure false          → http://localhost
// PROD dom:   sameSite "lax", secure true, domain   → app y api bajo el mismo dominio raíz
// PROD s/dom: sameSite "none", secure true          → app y api en dominios distintos
export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isDevelopment || isProduction,
  sameSite: isLocal ? "lax" : cookieDomain ? "lax" : "none",
  path: "/",
  ...(cookieDomain && { domain: cookieDomain }),
};

export const ACCESS_TOKEN_MAX_AGE = 2 * 60 * 60 * 1000; // 2h

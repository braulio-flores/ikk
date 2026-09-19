// Rutas de acceso al panel.
//
// Viven bajo un prefijo propio y poco obvio en lugar de /login: los bots que
// barren internet prueban /login, /admin, /manage… y así ni encuentran el
// formulario. No es la protección real (esa son bcrypt, el rate-limit y el 404
// del panel), sólo quita ruido. Por lo mismo NO se listan en robots.txt.
//
// Si se cambia el prefijo, actualizar también RESET_PATH en
// backend/src/services/email.service.ts (la liga que llega por correo).

export const ACCESS_PATH = "/ikk-ops";
export const FORGOT_PATH = "/ikk-ops/recuperar";
export const RESET_PATH = "/ikk-ops/restablecer";

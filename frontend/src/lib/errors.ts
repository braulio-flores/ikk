// Un solo lugar para convertir un error de red en un mensaje que el operador
// pueda leer. Nunca mostramos err.message crudo ni stacks.

import { AxiosError } from "axios";

export function apiErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error. Inténtalo de nuevo."
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (error.code === "ECONNABORTED") {
      return "El servicio tardó demasiado en responder.";
    }
    if (!error.response) {
      return "No se pudo contactar al servicio. Revisa que esté en línea.";
    }
    if (error.response.status === 403) {
      return "Tu rol no permite esta acción.";
    }
    if (error.response.status === 502 || error.response.status === 503) {
      return "El producto no está disponible en este momento.";
    }
  }
  return fallback;
}

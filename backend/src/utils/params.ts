// Express 5 tipa `req.params[x]` como `string | string[]`. Este helper lo
// normaliza a un string no vacío y falla con un mensaje apto para el usuario.

import type { Request } from "express";
import { BadRequestError } from "./HttpError";

export function requireParam(req: Request, key: string): string {
  const raw = (req.params as Record<string, string | string[] | undefined>)[key];
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (typeof value !== "string" || value.trim() === "") {
    throw new BadRequestError("Falta el identificador del recurso");
  }

  return value;
}

export function optionalParam(req: Request, key: string): string | undefined {
  const raw = (req.params as Record<string, string | string[] | undefined>)[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { HttpError } from "../utils/HttpError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const errObj = err as { message?: string; stack?: string; status?: number; code?: string; meta?: unknown };

  // Log conciso
  console.error("[ERROR]", {
    message: errObj.message,
    path: req.originalUrl,
    method: req.method,
    code: errObj.code,
    status: errObj.status,
  });

  // 1) HttpError personalizado
  if (err instanceof HttpError) {
    res.status(err.status).json(err.toJSON());
    return;
  }

  // 2) Errores conocidos de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const fields = (err.meta?.target as string[] | undefined) ?? [];
      const fieldName = fields[fields.length - 1] ?? "campo";
      res.status(400).json({
        message: `El ${fieldName} ya está en uso y no puede repetirse`,
        code: "P2002",
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ message: "Registro no encontrado", code: "P2025" });
      return;
    }
    if (err.code === "P2003") {
      res.status(400).json({
        message: "Referencia inválida a otro registro",
        code: "P2003",
      });
      return;
    }
    res.status(400).json({
      message: "Error en la operación de base de datos",
      code: err.code,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      message: "Datos inválidos proporcionados",
      code: "VALIDATION_ERROR",
    });
    return;
  }

  // 3) Legacy throw { status, message }
  if (errObj.status && errObj.message) {
    res.status(errObj.status).json({ message: errObj.message });
    return;
  }

  res.status(500).json({ message: "Error interno del servidor" });
};

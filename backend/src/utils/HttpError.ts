/**
 * HttpError personalizado con status code y mensaje.
 */
export class HttpError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly detail?: string;

  constructor(status: number, message: string, code?: string, detail?: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.detail = detail;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      message: this.message,
      ...(this.code && { code: this.code }),
      ...(this.detail && { detail: this.detail }),
    };
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, detail?: string) {
    super(400, message, "BAD_REQUEST", detail);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "No autenticado") {
    super(401, message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = "Acceso denegado") {
    super(403, message, "FORBIDDEN");
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Recurso no encontrado") {
    super(404, message, "NOT_FOUND");
  }
}

export class ConflictError extends HttpError {
  constructor(message: string, detail?: string) {
    super(409, message, "CONFLICT", detail);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = "Error interno del servidor") {
    super(500, message, "INTERNAL_SERVER_ERROR");
  }
}

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { hashToken } from "../utils/hash";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../utils/HttpError";
import { sendPasswordResetEmail } from "../services/email.service";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  COOKIE_OPTIONS,
  ACCESS_TOKEN_MAX_AGE,
} from "../config/cookies";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS);
if (!Number.isFinite(REFRESH_TOKEN_DAYS) || REFRESH_TOKEN_DAYS <= 0) {
  throw new Error(
    "REFRESH_TOKEN_DAYS debe estar configurado en .env y ser un número positivo"
  );
}

function refreshExpiresAt(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
}

// =========================================================================
//   POST /ikk/auth/login
// =========================================================================
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    throw new BadRequestError("email y password son requeridos");
  }

  const operator = await prisma.operator.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!operator || !operator.isActive) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  const ok = await bcrypt.compare(password, operator.passwordHash);
  if (!ok) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  const payload = { id: operator.id, email: operator.email, role: operator.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: operator.id });

  await prisma.refreshToken.create({
    data: {
      operatorId: operator.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshExpiresAt(),
    },
  });

  res
    .cookie(ACCESS_COOKIE, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    })
    .cookie(REFRESH_COOKIE, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    })
    .json({
      operator: {
        id: operator.id,
        name: operator.name,
        email: operator.email,
        role: operator.role,
      },
    });
};

// =========================================================================
//   POST /ikk/auth/refresh
// =========================================================================
export const refresh = async (req: Request, res: Response): Promise<void> => {
  const cookies = req.cookies as Record<string, string> | undefined;
  const refreshToken = cookies?.[REFRESH_COOKIE];

  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token requerido");
  }

  // Verificar firma
  let decoded: { id?: string };
  try {
    decoded = verifyRefreshToken(refreshToken) as { id?: string };
  } catch {
    throw new UnauthorizedError("Refresh token inválido");
  }

  if (!decoded.id) {
    throw new UnauthorizedError("Refresh token inválido");
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findFirst({
    where: { tokenHash, operatorId: decoded.id },
  });

  if (!stored) {
    // No existe → posible robo, revocá toda la cadena
    await prisma.refreshToken.updateMany({
      where: { operatorId: decoded.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw new UnauthorizedError("Refresh token inválido");
  }

  if (stored.revokedAt) {
    // Token ya revocado usado de nuevo → posible robo
    await prisma.refreshToken.updateMany({
      where: { operatorId: decoded.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw new UnauthorizedError("Refresh token revocado");
  }

  if (stored.expiresAt.getTime() < Date.now()) {
    throw new UnauthorizedError("Refresh token expirado");
  }

  const operator = await prisma.operator.findUnique({
    where: { id: decoded.id },
  });
  if (!operator || !operator.isActive) {
    throw new UnauthorizedError("Operador inválido");
  }

  // Rotación: revocar viejo y emitir nuevo
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const newRefresh = signRefreshToken({ id: operator.id });
  await prisma.refreshToken.create({
    data: {
      operatorId: operator.id,
      tokenHash: hashToken(newRefresh),
      expiresAt: refreshExpiresAt(),
    },
  });

  const newAccess = signAccessToken({
    id: operator.id,
    email: operator.email,
    role: operator.role,
  });

  res
    .cookie(ACCESS_COOKIE, newAccess, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    })
    .cookie(REFRESH_COOKIE, newRefresh, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    })
    .json({ ok: true });
};

// =========================================================================
//   POST /ikk/auth/logout
// =========================================================================
export const logout = async (req: Request, res: Response): Promise<void> => {
  const cookies = req.cookies as Record<string, string> | undefined;
  const refreshToken = cookies?.[REFRESH_COOKIE];

  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await prisma.refreshToken
      .updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      })
      .catch(() => undefined);
  }

  res
    .clearCookie(ACCESS_COOKIE, { ...COOKIE_OPTIONS, maxAge: undefined })
    .clearCookie(REFRESH_COOKIE, { ...COOKIE_OPTIONS, maxAge: undefined })
    .json({ ok: true });
};

// =========================================================================
//   GET /ikk/auth/me
// =========================================================================
export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError();
  }

  const operator = await prisma.operator.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!operator || !operator.isActive) {
    throw new UnauthorizedError("Operador inválido");
  }

  res.json({ operator });
};

// =========================================================================
//   POST /ikk/auth/forgot-password
// =========================================================================
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body as { email?: string };

  if (!email) {
    throw new BadRequestError("email es requerido");
  }

  const operator = await prisma.operator.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  // Respondemos siempre 200 (no revelar existencia)
  if (!operator) {
    res.json({ ok: true });
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashToken(rawToken),
      operatorId: operator.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
    },
  });

  sendPasswordResetEmail(operator.email, rawToken, operator.name).catch((err) => {
    console.error("[AUTH] Error enviando email de reset:", err);
  });

  res.json({ ok: true });
};

// =========================================================================
//   POST /ikk/auth/reset-password
// =========================================================================
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, password } = req.body as {
    token?: string;
    password?: string;
  };

  if (!token || !password) {
    throw new BadRequestError("token y password son requeridos");
  }

  if (password.length < 8) {
    throw new BadRequestError("La contraseña debe tener al menos 8 caracteres");
  }

  const stored = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!stored || stored.used || stored.expiresAt.getTime() < Date.now()) {
    throw new NotFoundError("Token inválido o expirado");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await prisma.$transaction([
    prisma.operator.update({
      where: { id: stored.operatorId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: stored.id },
      data: { used: true },
    }),
    prisma.refreshToken.updateMany({
      where: { operatorId: stored.operatorId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  res.json({ ok: true });
};

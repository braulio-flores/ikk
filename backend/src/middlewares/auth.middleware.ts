import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_COOKIE } from "../config/cookies";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = (req.cookies as Record<string, string> | undefined)?.[
    ACCESS_COOKIE
  ];

  if (!token) {
    res.status(401).json({ message: "Token requerido" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "access_secret"
    ) as TokenPayload;
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ message: "Token inválido o expirado" });
    return;
  }
};

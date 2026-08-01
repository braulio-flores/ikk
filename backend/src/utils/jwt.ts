import { sign, verify, JwtPayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRY as string | undefined;
const REFRESH_EXP = process.env.REFRESH_TOKEN_EXPIRY as string | undefined;

if (!ACCESS_SECRET || !REFRESH_SECRET || !ACCESS_EXP || !REFRESH_EXP) {
  throw new Error(
    "JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRY y REFRESH_TOKEN_EXPIRY deben estar configurados en las variables de entorno"
  );
}

export function signAccessToken(payload: object): string {
  return sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP as unknown as number });
}

export function verifyAccessToken(token: string): JwtPayload | string {
  return verify(token, ACCESS_SECRET);
}

export function signRefreshToken(payload: object): string {
  return sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP as unknown as number });
}

export function verifyRefreshToken(token: string): JwtPayload | string {
  return verify(token, REFRESH_SECRET);
}

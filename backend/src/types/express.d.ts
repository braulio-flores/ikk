import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      role: "SUPER_ADMIN" | "ADMIN" | "VIEWER" | string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};

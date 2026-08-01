import { Request, Response, NextFunction } from "express";

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role;
    if (!role) {
      res.status(401).json({ message: "Token requerido" });
      return;
    }

    if (!roles.includes(role)) {
      res.status(403).json({ message: "No tienes permisos para esta acción" });
      return;
    }
    next();
  };
};

export const requireSuperAdmin = requireRole("SUPER_ADMIN");
export const requireAdmin = requireRole("SUPER_ADMIN", "ADMIN");
export const requireAnyOperator = requireRole("SUPER_ADMIN", "ADMIN", "VIEWER");

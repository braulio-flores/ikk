import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Límite agresivo sobre las rutas que aceptan credenciales o disparan correos.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    message: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
  },
});

router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", verifyToken, me);

router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;

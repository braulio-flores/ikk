import { Router } from "express";
import rateLimit from "express-rate-limit";
import { submit, list, update } from "../controllers/contact.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

const router = Router();

// El formulario público es la única ruta abierta de IKK que escribe en la BD:
// va con un límite agresivo por IP.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Demasiados envíos. Intenta de nuevo en unos minutos." },
});

router.post("/", contactLimiter, submit);

// Bandeja de prospectos dentro del panel.
router.get("/leads", verifyToken, requireAdmin, list);
router.patch("/leads/:id", verifyToken, requireAdmin, update);

export default router;

import { Router } from "express";
import { stats, inbox } from "../controllers/overview.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

const router = Router();
router.use(verifyToken, requireAdmin);

router.get("/stats", stats);
router.get("/inbox", inbox);

export default router;

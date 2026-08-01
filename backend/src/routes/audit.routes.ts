import { Router } from "express";
import { list } from "../controllers/audit.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

const router = Router();
router.use(verifyToken, requireAdmin);

router.get("/", list);

export default router;

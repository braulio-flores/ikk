import { Router } from "express";
import {
  list,
  create,
  update,
  remove,
} from "../controllers/operators.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireSuperAdmin } from "../middlewares/role.middleware";

const router = Router();

router.use(verifyToken, requireSuperAdmin);

router.get("/", list);
router.post("/", create);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;

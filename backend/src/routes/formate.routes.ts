import { Router } from "express";
import {
  listTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  listUsersByTenant,
  attachUserToTenant,
  getTenantConfig,
  updateTenantConfig,
} from "../controllers/formate.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

const router = Router();
router.use(verifyToken, requireAdmin);

router.get("/tenants", listTenants);
router.post("/tenants", createTenant);
router.patch("/tenants/:id", updateTenant);
router.delete("/tenants/:id", deleteTenant);

router.get("/tenants/:id/users", listUsersByTenant);
router.post("/tenants/:id/users", attachUserToTenant);

router.get("/tenants/:id/config", getTenantConfig);
router.patch("/tenants/:id/config", updateTenantConfig);

export default router;

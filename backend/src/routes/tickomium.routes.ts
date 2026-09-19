import { Router } from "express";
import {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  updateCompanyStatus,
  extendSubscription,
  rejectCompanyRequest,
  addCompanyUser,
  removeCompanyUser,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  listPlans,
  createPlan,
  updatePlan,
  deletePlan,
  validatePayment,
  sendNotification,
  listPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/tickomium.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

const router = Router();
router.use(verifyToken, requireAdmin);

// Companies
router.get("/companies", listCompanies);
router.get("/companies/:id", getCompany);
router.post("/companies", createCompany);
router.patch("/companies/:id", updateCompany);
router.patch("/companies/:id/status", updateCompanyStatus);
router.patch("/companies/:id/extend-subscription", extendSubscription);
router.post("/companies/:id/reject", rejectCompanyRequest);
router.post("/companies/:id/users", addCompanyUser);
router.delete("/companies/:id/users/:userId", removeCompanyUser);

// Users
router.get("/users", listUsers);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Plans
router.get("/plans", listPlans);
router.post("/plans", createPlan);
router.patch("/plans/:id", updatePlan);
router.delete("/plans/:id", deletePlan);
router.post("/plans/companies/:companyId/validate-payment", validatePayment);

// Permissions (catálogo global de permisos)
router.get("/permissions", listPermissions);
router.post("/permissions", createPermission);
router.patch("/permissions/:id", updatePermission);
router.delete("/permissions/:id", deletePermission);

// Notifications
router.post("/notifications", sendNotification);

export default router;

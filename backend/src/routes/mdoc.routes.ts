import { Router } from "express";
import {
  listClinics,
  createClinic,
  updateClinic,
  suspendClinic,
  listDoctors,
  createDoctor,
  updateDoctor,
  listAccessLogs,
} from "../controllers/mdoc.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";

const router = Router();
router.use(verifyToken, requireAdmin);

router.get("/clinics", listClinics);
router.post("/clinics", createClinic);
router.patch("/clinics/:id", updateClinic);
router.patch("/clinics/:id/suspend", suspendClinic);

router.get("/doctors", listDoctors);
router.post("/doctors", createDoctor);
router.patch("/doctors/:id", updateDoctor);

router.get("/audit/access-logs", listAccessLogs);

export default router;

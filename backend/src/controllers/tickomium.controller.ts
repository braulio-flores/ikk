import { Request, Response } from "express";
import { tickomiumClient } from "../services/product-clients";
import { writeAudit } from "../services/audit.service";
import { BadRequestError } from "../utils/HttpError";
import { requireParam, optionalParam } from "../utils/params";

// =========================================================================
//   COMPANIES
// =========================================================================
export const listCompanies = async (req: Request, res: Response): Promise<void> => {
  const data = await tickomiumClient.listCompanies(
    req.query as Record<string, unknown>
  );
  res.json(data);
};

export const getCompany = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.getCompany(id);
  res.json(data);
};

export const createCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.body as { name?: string };
  if (!name?.trim()) throw new BadRequestError("El nombre de la empresa es requerido");

  const data = await tickomiumClient.createCompany(req.body);

  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "company.create",
    targetId: (data as { id?: string })?.id ?? null,
    payload: req.body as Record<string, unknown>,
  });

  res.status(201).json(data);
};

export const updateCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.updateCompany(id, req.body);

  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "company.update",
    targetId: id,
    payload: req.body as Record<string, unknown>,
  });

  res.json(data);
};

export const updateCompanyStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const { status } = req.body as { status?: string };
  if (!status) throw new BadRequestError("status requerido");

  const data = await tickomiumClient.updateCompanyStatus(id, { status });

  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "company.updateStatus",
    targetId: id,
    payload: { status },
  });

  res.json(data);
};

export const extendSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  // Tickomium extiende la suscripción por meses completos.
  const { months = 1 } = req.body as { months?: number };
  if (!Number.isInteger(months) || months <= 0) {
    throw new BadRequestError("La cantidad de meses debe ser un entero positivo");
  }

  const data = await tickomiumClient.extendSubscription(id, { months });

  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "company.extendSubscription",
    targetId: id,
    payload: { months },
  });

  res.json(data);
};

export const rejectCompanyRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const { reason } = (req.body ?? {}) as { reason?: unknown };
  if (reason !== undefined && typeof reason !== "string") {
    throw new BadRequestError("El motivo debe ser texto");
  }
  const cleanReason = reason?.trim() ?? "";
  if (cleanReason.length > 500) {
    throw new BadRequestError("El motivo no puede pasar de 500 caracteres");
  }

  const data = await tickomiumClient.rejectCompanyRequest(id, {
    reason: cleanReason || undefined,
  });

  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "company.rejectRequest",
    targetId: id,
    payload: {
      company: data.name,
      requestedBy: data.requestedBy ? memberName(data.requestedBy) : "Sin solicitante",
      reason: data.statusReason ?? "Sin motivo",
    },
  });

  res.json(data);
};

export const activateCompanyRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.activateCompanyRequest(id);

  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "company.activate",
    targetId: id,
    payload: {},
  });

  res.json(data);
};

export const deleteCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.deleteCompany(id);

  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "company.delete",
    targetId: id,
    payload: {},
  });

  res.json(data);
};

/** TEMPORAL: ver comentario en tickomium.client.ts. Quitar junto con el botón. */
export const repairAdminRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.repairAdminRole(id);

  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "company.repairAdminRole",
    targetId: id,
    payload: { repaired: data.repaired },
  });

  res.json(data);
};

export const addCompanyUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const { userId, companyRoleId, role } = req.body as {
    userId?: string;
    companyRoleId?: string | null;
    role?: string;
  };
  if (!userId) throw new BadRequestError("Elige a la persona que quieres agregar");
  if (role !== undefined && role !== "ADMIN" && role !== "EMPLOYEE") {
    throw new BadRequestError("Tipo de acceso inválido");
  }

  const data = await tickomiumClient.addCompanyUser(id, {
    userId,
    companyRoleId: companyRoleId || null,
    role,
  });

  // La bitácora del panel muestra los textos, no los identificadores.
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "company.addUser",
    targetId: id,
    payload: {
      userId,
      companyRoleId: data.companyRoleId,
      user: memberName(data.user),
      companyRole: data.companyRole?.name ?? "Sin rol",
    },
  });

  res.status(201).json(data);
};

export const removeCompanyUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const userId = requireParam(req, "userId");

  const data = await tickomiumClient.removeCompanyUser(id, userId);

  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "company.removeUser",
    targetId: id,
    payload: { userId, user: memberName(data.user) },
  });

  res.json(data);
};

function memberName(user: { firstName: string; lastName: string | null; email: string }): string {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
}

// =========================================================================
//   USERS
// =========================================================================
export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const data = await tickomiumClient.listUsers(req.query as Record<string, unknown>);
  res.json(data);
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const data = await tickomiumClient.createUser(req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "user.create",
    payload: req.body as Record<string, unknown>,
  });
  res.status(201).json(data);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.updateUser(id, req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "user.update",
    targetId: id,
    payload: req.body as Record<string, unknown>,
  });
  res.json(data);
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.deleteUser(id);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "user.delete",
    targetId: id,
    payload: {},
  });
  res.json(data);
};

// =========================================================================
//   PLANS
// =========================================================================
export const listPlans = async (_req: Request, res: Response): Promise<void> => {
  const data = await tickomiumClient.listPlans();
  res.json(data);
};

export const createPlan = async (req: Request, res: Response): Promise<void> => {
  const data = await tickomiumClient.createPlan(req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "plan.create",
    payload: req.body as Record<string, unknown>,
  });
  res.status(201).json(data);
};

export const updatePlan = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.updatePlan(id, req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "plan.update",
    targetId: id,
    payload: req.body as Record<string, unknown>,
  });
  res.json(data);
};

export const deletePlan = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.deletePlan(id);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "plan.delete",
    targetId: id,
    payload: {},
  });
  res.json(data);
};

// =========================================================================
//   PAYMENTS
// =========================================================================
export const validatePayment = async (req: Request, res: Response): Promise<void> => {
  const companyId = optionalParam(req, "companyId") ?? (req.body as { companyId?: string }).companyId;
  if (!companyId) throw new BadRequestError("companyId requerido");
  const data = await tickomiumClient.validatePayment(companyId);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "payment.validate",
    targetId: companyId,
    payload: {},
  });
  res.json(data);
};

// =========================================================================
//   NOTIFICATIONS
// =========================================================================
export const sendNotification = async (req: Request, res: Response): Promise<void> => {
  const data = await tickomiumClient.sendAdminNotification(req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "notification.send",
    payload: req.body as Record<string, unknown>,
  });
  res.status(201).json(data);
};

// =========================================================================
//   PERMISSIONS (catálogo global)
// =========================================================================
export const listPermissions = async (req: Request, res: Response): Promise<void> => {
  const data = await tickomiumClient.listPermissions(req.query as Record<string, unknown>);
  res.json(data);
};

export const createPermission = async (req: Request, res: Response): Promise<void> => {
  const data = await tickomiumClient.createPermission(req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "permission.create",
    payload: req.body as Record<string, unknown>,
  });
  res.status(201).json(data);
};

export const updatePermission = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.updatePermission(id, req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "permission.update",
    targetId: id,
    payload: req.body as Record<string, unknown>,
  });
  res.json(data);
};

export const deletePermission = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await tickomiumClient.deletePermission(id);
  await writeAudit({
    operatorId: req.user?.id,
    product: "TICKOMIUM",
    action: "permission.delete",
    targetId: id,
    payload: {},
  });
  res.json(data);
};

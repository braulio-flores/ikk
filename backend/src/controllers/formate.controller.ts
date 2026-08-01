import { Request, Response } from "express";
import { formateClient } from "../services/product-clients";
import { writeAudit } from "../services/audit.service";
import { BadRequestError } from "../utils/HttpError";
import { requireParam, optionalParam } from "../utils/params";

export const listTenants = async (req: Request, res: Response): Promise<void> => {
  const data = await formateClient.listTenants(req.query as Record<string, unknown>);
  res.json(data);
};

export const createTenant = async (req: Request, res: Response): Promise<void> => {
  const data = await formateClient.createTenant(req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "FORMATE",
    action: "tenant.create",
    payload: req.body as Record<string, unknown>,
  });
  res.status(201).json(data);
};

export const updateTenant = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await formateClient.updateTenant(id, req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "FORMATE",
    action: "tenant.update",
    targetId: id,
    payload: req.body as Record<string, unknown>,
  });
  res.json(data);
};

export const deleteTenant = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await formateClient.deleteTenant(id);
  await writeAudit({
    operatorId: req.user?.id,
    product: "FORMATE",
    action: "tenant.delete",
    targetId: id,
    payload: {},
  });
  res.json(data);
};

export const listUsersByTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await formateClient.listUsersByTenant(id);
  res.json(data);
};

export const attachUserToTenant = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await formateClient.attachUserToTenant(id, req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "FORMATE",
    action: "tenant.attachUser",
    targetId: id,
    payload: req.body as Record<string, unknown>,
  });
  res.status(201).json(data);
};

export const getTenantConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await formateClient.getTenantConfig(id);
  res.json(data);
};

export const updateTenantConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await formateClient.updateTenantConfig(id, req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "FORMATE",
    action: "tenant.updateConfig",
    targetId: id,
    payload: req.body as Record<string, unknown>,
  });
  res.json(data);
};

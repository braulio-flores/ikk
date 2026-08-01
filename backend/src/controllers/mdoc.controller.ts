import { Request, Response } from "express";
import { mdocClient } from "../services/product-clients";
import { writeAudit } from "../services/audit.service";
import { BadRequestError } from "../utils/HttpError";
import { requireParam, optionalParam } from "../utils/params";

// CLINICS
export const listClinics = async (req: Request, res: Response): Promise<void> => {
  const data = await mdocClient.listClinics(req.query as Record<string, unknown>);
  res.json(data);
};

export const createClinic = async (req: Request, res: Response): Promise<void> => {
  const data = await mdocClient.createClinic(req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "MDOC",
    action: "clinic.create",
    payload: req.body as Record<string, unknown>,
  });
  res.status(201).json(data);
};

export const updateClinic = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await mdocClient.updateClinic(id, req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "MDOC",
    action: "clinic.update",
    targetId: id,
    payload: req.body as Record<string, unknown>,
  });
  res.json(data);
};

export const suspendClinic = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await mdocClient.suspendClinic(id, req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "MDOC",
    action: "clinic.suspend",
    targetId: id,
    payload: req.body as Record<string, unknown>,
  });
  res.json(data);
};

// DOCTORS
export const listDoctors = async (req: Request, res: Response): Promise<void> => {
  const data = await mdocClient.listDoctors(req.query as Record<string, unknown>);
  res.json(data);
};

export const createDoctor = async (req: Request, res: Response): Promise<void> => {
  const data = await mdocClient.createDoctor(req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "MDOC",
    action: "doctor.create",
    targetId: (data as { id?: string })?.id ?? null,
    payload: req.body as Record<string, unknown>,
  });
  res.status(201).json(data);
};

export const updateDoctor = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");
  const data = await mdocClient.updateDoctor(id, req.body);
  await writeAudit({
    operatorId: req.user?.id,
    product: "MDOC",
    action: "doctor.update",
    targetId: id,
    payload: req.body as Record<string, unknown>,
  });
  res.json(data);
};

// AUDIT
export const listAccessLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data = await mdocClient.listAccessLogs(
    req.query as Record<string, unknown>
  );
  res.json(data);
};

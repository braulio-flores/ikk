import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient, OperatorRole } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../utils/HttpError";
import { requireParam, optionalParam } from "../utils/params";
import { writeAudit } from "../services/audit.service";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

function parseRole(role: unknown): OperatorRole {
  const allowed: OperatorRole[] = ["SUPER_ADMIN", "ADMIN", "VIEWER"];
  if (typeof role !== "string" || !allowed.includes(role as OperatorRole)) {
    throw new BadRequestError("role inválido");
  }
  return role as OperatorRole;
}

// Todos los listados de IKK responden con la misma forma que los hijos:
// { items, total, page, limit }. El panel depende de ese contrato.
export const list = async (req: Request, res: Response): Promise<void> => {
  const { search } = req.query as Record<string, string | undefined>;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const items = await prisma.operator.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  res.json({ items, total: items.length, page: 1, limit: items.length });
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };

  if (!name || !email || !password) {
    throw new BadRequestError("name, email y password son requeridos");
  }
  if (password.length < 8) {
    throw new BadRequestError("La contraseña debe tener al menos 8 caracteres");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const op = await prisma.operator.create({
    data: {
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: parseRole(role ?? "ADMIN"),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  await writeAudit({
    operatorId: req.user?.id,
    product: "IKK",
    action: "operator.create",
    targetId: op.id,
    payload: { name, email, role: op.role },
  });

  res.status(201).json({ operator: op });
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");

  const { name, role, isActive, password } = req.body as {
    name?: string;
    role?: string;
    isActive?: boolean;
    password?: string;
  };

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (role !== undefined) data.role = parseRole(role);
  if (isActive !== undefined) data.isActive = isActive;
  if (password !== undefined) {
    if (password.length < 8)
      throw new BadRequestError("La contraseña debe tener al menos 8 caracteres");
    data.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  const op = await prisma.operator
    .update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })
    .catch(() => null);

  if (!op) throw new NotFoundError("Operador no encontrado");

  await writeAudit({
    operatorId: req.user?.id,
    product: "IKK",
    action: "operator.update",
    targetId: id,
    payload: { changes: Object.keys(data) },
  });

  res.json({ operator: op });
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");

  if (req.user?.id === id) {
    throw new BadRequestError("No puedes eliminar tu propio operador");
  }

  await prisma.operator.delete({ where: { id } }).catch(() => {
    throw new NotFoundError("Operador no encontrado");
  });

  await writeAudit({
    operatorId: req.user?.id,
    product: "IKK",
    action: "operator.delete",
    targetId: id,
    payload: {},
  });

  res.json({ ok: true });
};

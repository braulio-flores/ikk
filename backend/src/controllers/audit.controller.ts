import { Request, Response } from "express";
import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

export const list = async (req: Request, res: Response): Promise<void> => {
  const {
    product,
    action,
    operatorId,
    page = "1",
    limit = "50",
  } = req.query as Record<string, string | undefined>;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(200, Math.max(1, Number(limit)));

  const where: Record<string, unknown> = {};
  if (product) where.product = product as Product;
  if (action) where.action = { contains: action, mode: "insensitive" };
  if (operatorId) where.operatorId = operatorId;

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limitNum,
      skip: (pageNum - 1) * limitNum,
      include: {
        operator: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  res.json({ items, total, page: pageNum, limit: limitNum });
};

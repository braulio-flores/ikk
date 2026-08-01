import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

export interface WriteAuditInput {
  operatorId?: string | null;
  product: Product;
  action: string;
  targetId?: string | null;
  payload: Record<string, unknown>;
}

export async function writeAudit(input: WriteAuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        operatorId: input.operatorId ?? null,
        product: input.product,
        action: input.action,
        targetId: input.targetId ?? null,
        payload: input.payload as unknown as object,
      },
    });
  } catch (err: unknown) {
    console.error("[AUDIT] Error escribiendo log:", err);
  }
}

import { Request, Response } from "express";
import {
  tickomiumClient,
  formateClient,
  mdocClient,
} from "../services/product-clients";
import type { InboxItem } from "../services/product-clients/tickomium.client";

interface KPI {
  product: "TICKOMIUM" | "FORMATE" | "MDOC";
  ok: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export const stats = async (_req: Request, res: Response): Promise<void> => {
  const results = await Promise.allSettled([
    tickomiumClient.listCompanies({ page: 1, limit: 1 }),
    formateClient.listTenants({ page: 1, limit: 1 }),
    mdocClient.listClinics({ page: 1, limit: 1 }),
  ]);

  const kpis: KPI[] = results.map((r, i): KPI => {
    const product = (["TICKOMIUM", "FORMATE", "MDOC"] as const)[i];
    if (r.status === "fulfilled") {
      return { product, ok: true, data: r.value as Record<string, unknown> };
    }
    return {
      product,
      ok: false,
      error: r.reason instanceof Error ? r.reason.message : "Error desconocido",
    };
  });

  res.json({ kpis });
};

// =========================================================================
//   GET /overview/inbox
//   Feed agregado de eventos accionables para el operador master.
//   Tolerante a caídas: si un hijo está offline, su sección viene vacía.
// =========================================================================
interface ProductBucket {
  product: "TICKOMIUM" | "FORMATE" | "MDOC";
  ok: boolean;
  total: number;
  items: InboxItem[];
  error?: string;
}

export const inbox = async (_req: Request, res: Response): Promise<void> => {
  const results = await Promise.allSettled([
    tickomiumClient.getInbox(),
    formateClient.getInbox(),
    mdocClient.getInbox(),
  ]);

  const products = ["TICKOMIUM", "FORMATE", "MDOC"] as const;

  const buckets: ProductBucket[] = results.map((r, i): ProductBucket => {
    const product = products[i];
    if (r.status === "fulfilled") {
      const data = r.value as { items?: InboxItem[]; total?: number };
      const items = data.items ?? [];
      return {
        product,
        ok: true,
        total: data.total ?? items.length,
        items,
      };
    }
    return {
      product,
      ok: false,
      total: 0,
      items: [],
      error:
        r.reason instanceof Error ? r.reason.message : "Error desconocido",
    };
  });

  // Aplanar todos los items, ordenar por createdAt DESC.
  const allItems = buckets
    .flatMap((b) => b.items)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const total = buckets.reduce((acc, b) => acc + b.total, 0);

  res.json({
    items: allItems,
    total,
    byProduct: buckets.map((b) => ({
      product: b.product,
      ok: b.ok,
      total: b.total,
      ...(b.error && { error: b.error }),
    })),
  });
};

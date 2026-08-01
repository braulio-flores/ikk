"use client";

import { useState } from "react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { Select } from "@/components/ui/field";
import { useResourceList } from "@/hooks/use-resource";
import { formatDateTime, formatRelative } from "@/lib/datetime";
import { auditAction, productName } from "@/lib/labels";
import type { AuditLogEntry } from "@/lib/types";

const PRODUCTS = [
  { value: "IKK", label: "IKK" },
  { value: "TICKOMIUM", label: "Tickomium" },
  { value: "FORMATE", label: "Formate" },
  { value: "MDOC", label: "mDoc" },
];

export default function AuditLogPage() {
  const [product, setProduct] = useState("");

  const list = useResourceList<AuditLogEntry>("/audit", {
    limit: 50,
    params: { product },
  });

  const columns: Column<AuditLogEntry>[] = [
    {
      key: "createdAt",
      label: "Cuándo",
      render: (row) => (
        <div className="whitespace-nowrap">
          <div className="font-mono text-[12px]">{formatDateTime(row.createdAt)}</div>
          <div className="text-[11px] text-[var(--ikk-fg-dim)]">
            {formatRelative(row.createdAt)}
          </div>
        </div>
      ),
      csv: (row) => formatDateTime(row.createdAt),
    },
    {
      key: "action",
      label: "Acción",
      render: (row) => <span className="font-medium">{auditAction(row.action)}</span>,
      csv: (row) => auditAction(row.action),
    },
    {
      key: "product",
      label: "Producto",
      render: (row) => productName(row.product),
      csv: (row) => productName(row.product),
    },
    {
      key: "operator",
      label: "Operador",
      render: (row) => row.operator?.name ?? "Operador eliminado",
      csv: (row) => row.operator?.name ?? "",
    },
    {
      key: "payload",
      label: "Detalle",
      hideOnMobile: true,
      render: (row) => (
        <span className="text-[13px] text-[var(--ikk-fg-muted)]">
          {describePayload(row.payload)}
        </span>
      ),
      csv: (row) => describePayload(row.payload),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Configuración"
        title="Bitácora"
        description="Toda acción administrativa queda registrada: quién la hizo, sobre qué producto y cuándo."
      />

      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(row) => row.id}
        isLoading={list.isLoading}
        error={list.error}
        emptyMessage="Todavía no se registran acciones."
        filters={
          <Select
            aria-label="Filtrar por producto"
            className="h-9 w-auto"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Todos los productos"
            options={PRODUCTS}
          />
        }
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName="bitacora-ikk"
      />
    </>
  );
}

/** Resumen legible del payload, sin volcar JSON ni identificadores. */
function describePayload(payload: Record<string, unknown> | undefined): string {
  if (!payload || typeof payload !== "object") return "—";

  const changes = payload.changes;
  if (Array.isArray(changes) && changes.length) {
    return `Campos modificados: ${changes.length}`;
  }

  const readable = Object.entries(payload)
    .filter(
      ([key, value]) =>
        !key.toLowerCase().includes("id") &&
        !key.toLowerCase().includes("password") &&
        (typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean")
    )
    .slice(0, 2)
    .map(([, value]) => String(value));

  return readable.length ? readable.join(" · ") : "—";
}

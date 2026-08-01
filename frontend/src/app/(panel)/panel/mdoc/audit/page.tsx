"use client";

// Bitácora de accesos a historia clínica de mDoc. Es información sensible:
// se muestra quién entró, a qué expediente y cuándo, sin exponer identificadores.

import { useState } from "react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { Select } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useResourceList } from "@/hooks/use-resource";
import { formatDateTime, formatRelative } from "@/lib/datetime";
import { fullName, humanize } from "@/lib/labels";

interface AccessLog {
  id: string;
  accessType: string;
  context?: string | null;
  accessedAt: string;
  patient?: {
    firstName: string;
    lastName: string;
    clinic?: { name: string } | null;
  } | null;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  } | null;
}

interface Clinic {
  id: string;
  name: string;
}

const ACCESS_TYPES: Record<string, string> = {
  VIEW: "Consultó",
  UPDATE: "Modificó",
  PRINT: "Imprimió",
  EXPORT: "Exportó",
};

export default function MdocAuditPage() {
  const [clinicId, setClinicId] = useState("");
  const [dateFrom, setDateFrom] = useState("");

  const clinics = useResourceList<Clinic>("/mdoc/clinics", { limit: 200 });
  const list = useResourceList<AccessLog>("/mdoc/audit/access-logs", {
    limit: 50,
    params: {
      clinicId,
      dateFrom: dateFrom ? `${dateFrom}T00:00:00.000Z` : undefined,
    },
  });

  const columns: Column<AccessLog>[] = [
    {
      key: "accessedAt",
      label: "Cuándo",
      render: (row) => (
        <div className="whitespace-nowrap">
          <div className="font-mono text-[12px]">
            {formatDateTime(row.accessedAt)}
          </div>
          <div className="text-[11px] text-[var(--ikk-fg-dim)]">
            {formatRelative(row.accessedAt)}
          </div>
        </div>
      ),
      csv: (row) => formatDateTime(row.accessedAt),
    },
    {
      key: "user",
      label: "Quién",
      render: (row) => (row.user ? fullName(row.user) : "Usuario dado de baja"),
      csv: (row) => (row.user ? fullName(row.user) : ""),
    },
    {
      key: "accessType",
      label: "Acción",
      render: (row) => ACCESS_TYPES[row.accessType] ?? humanize(row.accessType),
      csv: (row) => ACCESS_TYPES[row.accessType] ?? row.accessType,
    },
    {
      key: "patient",
      label: "Expediente",
      render: (row) =>
        row.patient ? `${row.patient.firstName} ${row.patient.lastName}` : "—",
      csv: (row) =>
        row.patient ? `${row.patient.firstName} ${row.patient.lastName}` : "",
    },
    {
      key: "clinic",
      label: "Clínica",
      hideOnMobile: true,
      render: (row) => row.patient?.clinic?.name ?? "—",
      csv: (row) => row.patient?.clinic?.name ?? "",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="mDoc · Auditoría"
        title="Accesos a historia clínica"
        description="Registro inmutable de cada consulta a un expediente. No se puede editar ni borrar."
      />

      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(row) => row.id}
        isLoading={list.isLoading}
        error={list.error}
        emptyMessage="No hay accesos registrados con estos filtros."
        filters={
          <>
            <Select
              aria-label="Filtrar por clínica"
              className="h-9 w-auto"
              value={clinicId}
              onChange={(e) => setClinicId(e.target.value)}
              placeholder="Todas las clínicas"
              options={clinics.items.map((c) => ({ value: c.id, label: c.name }))}
            />
            <Input
              type="date"
              aria-label="Desde"
              className="h-9 w-auto"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </>
        }
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName="accesos-historia-clinica"
      />
    </>
  );
}

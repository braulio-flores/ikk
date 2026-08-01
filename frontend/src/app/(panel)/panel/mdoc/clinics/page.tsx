"use client";

import { useState } from "react";
import { Pencil, Plus, PauseCircle } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Field, Textarea } from "@/components/ui/field";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { formatDate } from "@/lib/datetime";
import { activeState } from "@/lib/labels";

interface Clinic {
  id: string;
  name: string;
  slug?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt?: string;
}

const ENDPOINT = "/mdoc/clinics";

export default function MdocClinicsPage() {
  const { canWrite } = useSession();
  const [editing, setEditing] = useState<Clinic | "new" | null>(null);
  const [suspending, setSuspending] = useState<Clinic | null>(null);

  const list = useResourceList<Clinic>(ENDPOINT, { limit: 25 });

  const columns: Column<Clinic>[] = [
    {
      key: "name",
      label: "Clínica",
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium">{row.name}</div>
          {row.email && (
            <div className="truncate text-[13px] text-[var(--ikk-fg-muted)]">
              {row.email}
            </div>
          )}
        </div>
      ),
      csv: (row) => row.name,
    },
    {
      key: "phone",
      label: "Teléfono",
      render: (row) => row.phone ?? "—",
    },
    {
      key: "isActive",
      label: "Estado",
      render: (row) => {
        const s = activeState(row.isActive);
        return (
          <Badge variant={s.tone}>{row.isActive ? "Operando" : "Suspendida"}</Badge>
        );
      },
      csv: (row) => (row.isActive ? "Operando" : "Suspendida"),
    },
    {
      key: "createdAt",
      label: "Alta",
      hideOnMobile: true,
      render: (row) => (
        <span className="whitespace-nowrap font-mono text-[12px] text-[var(--ikk-fg-muted)]">
          {formatDate(row.createdAt)}
        </span>
      ),
      csv: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="mDoc"
        title="Clínicas"
        description="Consultorios y clínicas dadas de alta en mDoc."
        actions={
          canWrite && (
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus className="h-4 w-4" /> Nueva clínica
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(row) => row.id}
        isLoading={list.isLoading}
        error={list.error}
        emptyMessage="No hay clínicas registradas."
        search={list.search}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Buscar clínica…"
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName="clinicas-mdoc"
        actions={(row) =>
          canWrite ? (
            <>
              <Button size="sm" variant="ghost" title="Editar" onClick={() => setEditing(row)}>
                <Pencil className="h-4 w-4" />
              </Button>
              {row.isActive && (
                <Button
                  size="sm"
                  variant="ghost"
                  title="Suspender"
                  onClick={() => setSuspending(row)}
                >
                  <PauseCircle className="h-4 w-4 text-[var(--ikk-warn)]" />
                </Button>
              )}
            </>
          ) : null
        }
      />

      {editing && (
        <ClinicForm
          clinic={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {suspending && (
        <SuspendForm clinic={suspending} onClose={() => setSuspending(null)} />
      )}
    </>
  );
}

function ClinicForm({
  clinic,
  onClose,
}: {
  clinic: Clinic | null;
  onClose: () => void;
}) {
  const isNew = clinic === null;
  const save = useResourceMutation(
    ENDPOINT,
    isNew ? "post" : "patch",
    isNew ? "Clínica creada." : "Clínica actualizada."
  );

  const [form, setForm] = useState({
    name: clinic?.name ?? "",
    email: clinic?.email ?? "",
    phone: clinic?.phone ?? "",
    address: clinic?.address ?? "",
  });

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Nueva clínica" : "Editar clínica"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={save.isPending || !form.name.trim()}
            onClick={() =>
              save.mutate(
                {
                  path: isNew ? ENDPOINT : `${ENDPOINT}/${clinic.id}`,
                  body: {
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase() || undefined,
                    phone: form.phone.trim() || undefined,
                    address: form.address.trim() || undefined,
                  },
                },
                { onSuccess: onClose }
              )
            }
          >
            {save.isPending ? "Guardando…" : isNew ? "Crear clínica" : "Guardar"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Nombre">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Clínica Santa Fe"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Correo">
            <Input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Teléfono">
            <Input
              value={form.phone ?? ""}
              inputMode="tel"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Dirección">
          <Textarea
            rows={2}
            value={form.address ?? ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </Field>
      </div>
    </Modal>
  );
}

function SuspendForm({
  clinic,
  onClose,
}: {
  clinic: Clinic;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const suspend = useResourceMutation(ENDPOINT, "patch", "Clínica suspendida.");

  return (
    <Modal
      open
      onClose={onClose}
      title="Suspender clínica"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            disabled={suspend.isPending || reason.trim().length < 5}
            onClick={() =>
              suspend.mutate(
                {
                  path: `${ENDPOINT}/${clinic.id}/suspend`,
                  body: { reason: reason.trim() },
                },
                { onSuccess: onClose }
              )
            }
          >
            {suspend.isPending ? "Suspendiendo…" : "Suspender"}
          </Button>
        </>
      }
    >
      <p className="mb-3 text-2xl font-semibold tracking-tight">{clinic.name}</p>
      <p className="mb-4 text-sm leading-relaxed text-[var(--ikk-fg-muted)]">
        Los doctores de esta clínica dejarán de operar en mDoc. La información
        clínica se conserva intacta y la clínica puede reactivarse editándola.
      </p>
      <Field label="Motivo" hint="Queda registrado en la bitácora de IKK.">
        <Textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Falta de pago, cierre temporal, solicitud del titular…"
        />
      </Field>
    </Modal>
  );
}

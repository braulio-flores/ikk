"use client";

import { useState } from "react";
import { CalendarPlus, CheckCircle2, Pencil, Plus, Shuffle } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field, Select } from "@/components/ui/field";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { formatDate, formatExpiry } from "@/lib/datetime";
import { COMPANY_STATUS_OPTIONS, companyStatus } from "@/lib/labels";

interface Company {
  id: string;
  name: string;
  subname?: string | null;
  rfc?: string | null;
  email?: string | null;
  phone?: string | null;
  status: string;
  plan?: { name?: string } | null;
  planExpiresAt?: string | null;
  createdAt: string;
}

const ENDPOINT = "/tickomium/companies";

export default function CompaniesPage() {
  const { canWrite } = useSession();
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<Company | "new" | null>(null);
  const [changingStatus, setChangingStatus] = useState<Company | null>(null);
  const [extending, setExtending] = useState<Company | null>(null);
  const [validating, setValidating] = useState<Company | null>(null);

  const list = useResourceList<Company>(ENDPOINT, {
    limit: 25,
    params: { status },
  });

  const validatePayment = useResourceMutation(
    ENDPOINT,
    "post",
    "Pago validado. La empresa quedó activa."
  );

  const columns: Column<Company>[] = [
    {
      key: "name",
      label: "Empresa",
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium">{row.name}</div>
          {row.rfc && (
            <div className="font-mono text-[11px] uppercase text-[var(--ikk-fg-dim)]">
              {row.rfc}
            </div>
          )}
        </div>
      ),
      csv: (row) => row.name,
    },
    {
      key: "status",
      label: "Estado",
      render: (row) => {
        const s = companyStatus(row.status);
        return <Badge variant={s.tone}>{s.label}</Badge>;
      },
      csv: (row) => companyStatus(row.status).label,
    },
    {
      key: "plan",
      label: "Plan",
      render: (row) => row.plan?.name ?? "Sin plan",
      csv: (row) => row.plan?.name ?? "Sin plan",
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
    {
      key: "planExpiresAt",
      label: "Vigencia",
      render: (row) =>
        row.planExpiresAt ? (
          <div className="whitespace-nowrap">
            <div className="font-mono text-[12px] text-[var(--ikk-fg-muted)]">
              {formatDate(row.planExpiresAt)}
            </div>
            <div className="text-[11px] text-[var(--ikk-fg-dim)]">
              {formatExpiry(row.planExpiresAt)}
            </div>
          </div>
        ) : (
          "—"
        ),
      csv: (row) => (row.planExpiresAt ? formatDate(row.planExpiresAt) : ""),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Tickomium"
        title="Empresas"
        description="Alta, estado, plan y vigencia de las empresas del punto de venta."
        actions={
          canWrite && (
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus className="h-4 w-4" /> Nueva empresa
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
        emptyMessage="No hay empresas que coincidan con la búsqueda."
        search={list.search}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Buscar por nombre, RFC o correo…"
        filters={
          <Select
            aria-label="Filtrar por estado"
            className="h-9 w-auto"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Todos los estados"
            options={COMPANY_STATUS_OPTIONS}
          />
        }
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName="empresas-tickomium"
        actions={(row) =>
          canWrite ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                title="Editar datos"
                onClick={() => setEditing(row)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title="Cambiar estado"
                onClick={() => setChangingStatus(row)}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title="Extender suscripción"
                onClick={() => setExtending(row)}
              >
                <CalendarPlus className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title="Validar pago"
                onClick={() => setValidating(row)}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </>
          ) : null
        }
      />

      {editing && (
        <CompanyForm
          company={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      {changingStatus && (
        <StatusForm
          company={changingStatus}
          onClose={() => setChangingStatus(null)}
        />
      )}

      {extending && (
        <ExtendForm company={extending} onClose={() => setExtending(null)} />
      )}

      <ConfirmDialog
        open={Boolean(validating)}
        onClose={() => setValidating(null)}
        loading={validatePayment.isPending}
        title="Validar pago"
        highlight={validating?.name}
        consequence="La empresa pasa a estado activo y su vigencia se extiende un mes desde el vencimiento actual. Hazlo sólo cuando el pago esté confirmado."
        confirmLabel="Confirmar pago"
        onConfirm={() =>
          validating &&
          validatePayment.mutate(
            { path: `/tickomium/plans/companies/${validating.id}/validate-payment` },
            { onSuccess: () => setValidating(null) }
          )
        }
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Alta / edición
// ---------------------------------------------------------------------------
function CompanyForm({
  company,
  onClose,
}: {
  company: Company | null;
  onClose: () => void;
}) {
  const isNew = company === null;
  const save = useResourceMutation(
    ENDPOINT,
    isNew ? "post" : "patch",
    isNew ? "Empresa creada." : "Empresa actualizada."
  );

  const [form, setForm] = useState({
    name: company?.name ?? "",
    subname: company?.subname ?? "",
    rfc: company?.rfc ?? "",
    email: company?.email ?? "",
    phone: company?.phone ?? "",
  });

  function submit() {
    if (!form.name.trim()) return;
    save.mutate(
      {
        path: isNew ? ENDPOINT : `${ENDPOINT}/${company.id}`,
        body: {
          name: form.name.trim(),
          subname: form.subname.trim() || undefined,
          rfc: form.rfc.trim().toUpperCase() || undefined,
          email: form.email.trim().toLowerCase() || undefined,
          phone: form.phone.trim() || undefined,
        },
      },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Nueva empresa" : "Editar empresa"}
      description={
        isNew
          ? "Se crea directamente en Tickomium con estado activo."
          : "Los cambios se aplican en Tickomium y quedan registrados en la bitácora."
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={save.isPending || !form.name.trim()}>
            {save.isPending ? "Guardando…" : isNew ? "Crear empresa" : "Guardar"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Nombre comercial">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Abarrotes La Esquina"
          />
        </Field>
        <Field label="Razón social" hint="Opcional.">
          <Input
            value={form.subname}
            onChange={(e) => setForm({ ...form, subname: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="RFC">
            <Input
              value={form.rfc}
              onChange={(e) => setForm({ ...form, rfc: e.target.value })}
              placeholder="XAXX010101000"
            />
          </Field>
          <Field label="Teléfono">
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              inputMode="tel"
            />
          </Field>
        </div>
        <Field label="Correo de contacto">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Cambio de estado
// ---------------------------------------------------------------------------
function StatusForm({
  company,
  onClose,
}: {
  company: Company;
  onClose: () => void;
}) {
  const [status, setStatus] = useState(company.status);
  const save = useResourceMutation(ENDPOINT, "patch", "Estado actualizado.");
  const target = companyStatus(status);

  return (
    <Modal
      open
      onClose={onClose}
      title="Cambiar estado"
      description={company.name}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() =>
              save.mutate(
                { path: `${ENDPOINT}/${company.id}/status`, body: { status } },
                { onSuccess: onClose }
              )
            }
            disabled={save.isPending || status === company.status}
          >
            {save.isPending ? "Aplicando…" : "Aplicar"}
          </Button>
        </>
      }
    >
      <Field
        label="Nuevo estado"
        hint="Suspender o bloquear corta el acceso de todos los usuarios de la empresa."
      >
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={COMPANY_STATUS_OPTIONS}
        />
      </Field>
      <p className="mt-4 text-sm text-[var(--ikk-fg-muted)]">
        Pasará de <strong>{companyStatus(company.status).label}</strong> a{" "}
        <strong>{target.label}</strong>.
      </p>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Extender suscripción
// ---------------------------------------------------------------------------
function ExtendForm({
  company,
  onClose,
}: {
  company: Company;
  onClose: () => void;
}) {
  const [months, setMonths] = useState(1);
  const save = useResourceMutation(ENDPOINT, "patch", "Suscripción extendida.");

  return (
    <Modal
      open
      onClose={onClose}
      title="Extender suscripción"
      description={company.name}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() =>
              save.mutate(
                {
                  path: `${ENDPOINT}/${company.id}/extend-subscription`,
                  body: { months },
                },
                { onSuccess: onClose }
              )
            }
            disabled={save.isPending || months < 1}
          >
            {save.isPending ? "Aplicando…" : `Extender ${months} mes(es)`}
          </Button>
        </>
      }
    >
      <Field label="Meses a agregar">
        <Select
          value={String(months)}
          onChange={(e) => setMonths(Number(e.target.value))}
          options={[1, 2, 3, 6, 12].map((m) => ({
            value: String(m),
            label: m === 1 ? "1 mes" : `${m} meses`,
          }))}
        />
      </Field>
      <p className="mt-4 text-sm text-[var(--ikk-fg-muted)]">
        Vigencia actual:{" "}
        <strong>
          {company.planExpiresAt ? formatDate(company.planExpiresAt) : "sin definir"}
        </strong>
        . Los meses se suman a partir de esa fecha.
      </p>
    </Modal>
  );
}

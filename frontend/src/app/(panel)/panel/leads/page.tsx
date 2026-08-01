"use client";

// Prospectos que llegan del formulario público. Es la única bandeja de IKK
// con datos propios: acá se les da seguimiento.

import { useState } from "react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Select, Textarea } from "@/components/ui/field";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { formatDateTime, formatRelative } from "@/lib/datetime";
import { LEAD_STATUSES, leadStatus } from "@/lib/labels";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

const ENDPOINT = "/contact/leads";

export default function LeadsPage() {
  const { canWrite } = useSession();
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);

  const list = useResourceList<Lead>(ENDPOINT, {
    limit: 25,
    params: { status },
  });

  const columns: Column<Lead>[] = [
    {
      key: "name",
      label: "Contacto",
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium">{row.name}</div>
          <div className="truncate text-[13px] text-[var(--ikk-fg-muted)]">
            {row.email}
          </div>
        </div>
      ),
      csv: (row) => `${row.name} <${row.email}>`,
    },
    {
      key: "company",
      label: "Empresa",
      render: (row) => row.company ?? "—",
    },
    {
      key: "message",
      label: "Mensaje",
      hideOnMobile: true,
      render: (row) => (
        <p className="line-clamp-2 max-w-md text-[13px] text-[var(--ikk-fg-muted)]">
          {row.message}
        </p>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (row) => {
        const s = leadStatus(row.status);
        return <Badge variant={s.tone}>{s.label}</Badge>;
      },
      csv: (row) => leadStatus(row.status).label,
    },
    {
      key: "createdAt",
      label: "Recibido",
      render: (row) => (
        <span
          className="whitespace-nowrap font-mono text-[12px] text-[var(--ikk-fg-muted)]"
          title={formatDateTime(row.createdAt)}
        >
          {formatRelative(row.createdAt)}
        </span>
      ),
      csv: (row) => formatDateTime(row.createdAt),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="IKK"
        title="Prospectos"
        description="Contactos recibidos desde la web. Cada uno queda guardado aunque falle el aviso por correo."
      />

      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(row) => row.id}
        isLoading={list.isLoading}
        error={list.error}
        emptyMessage="Todavía no llegaron contactos desde la web."
        search={list.search}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Buscar por nombre, correo o empresa…"
        filters={
          <Select
            aria-label="Filtrar por estado"
            className="h-9 w-auto"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Todos los estados"
            options={LEAD_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
          />
        }
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName="prospectos-ikk"
        actions={(row) => (
          <Button size="sm" variant="secondary" onClick={() => setSelected(row)}>
            {canWrite ? "Atender" : "Ver"}
          </Button>
        )}
      />

      {selected && (
        <LeadDetail
          lead={selected}
          canWrite={canWrite}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function LeadDetail({
  lead,
  canWrite,
  onClose,
}: {
  lead: Lead;
  canWrite: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");

  const save = useResourceMutation(
    ["/contact/leads", "leads-new-count"],
    "patch",
    "Prospecto actualizado."
  );

  return (
    <Modal
      open
      onClose={onClose}
      title={lead.name}
      description={`Recibido el ${formatDateTime(lead.createdAt)}`}
      footer={
        canWrite ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            <Button
              disabled={save.isPending}
              onClick={() =>
                save.mutate(
                  { path: `/contact/leads/${lead.id}`, body: { status, notes } },
                  { onSuccess: onClose }
                )
              }
            >
              {save.isPending ? "Guardando…" : "Guardar"}
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        )
      }
    >
      <div className="space-y-4">
        <dl className="space-y-2 text-sm">
          <Row label="Correo">
            <a
              href={`mailto:${lead.email}`}
              className="text-[var(--ikk-accent)] underline-offset-4 hover:underline"
            >
              {lead.email}
            </a>
          </Row>
          {lead.company && <Row label="Empresa">{lead.company}</Row>}
          {lead.phone && (
            <Row label="Teléfono">
              <a
                href={`tel:${lead.phone}`}
                className="text-[var(--ikk-accent)] underline-offset-4 hover:underline"
              >
                {lead.phone}
              </a>
            </Row>
          )}
        </dl>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-[var(--ikk-fg-muted)]">
            Mensaje
          </p>
          <p className="whitespace-pre-wrap rounded-[var(--ikk-r-md)] border border-[var(--ikk-line-soft)] bg-[var(--ikk-bg-elev)] p-3 text-sm leading-relaxed">
            {lead.message}
          </p>
        </div>

        <Field label="Estado">
          <Select
            value={status}
            disabled={!canWrite}
            onChange={(e) => setStatus(e.target.value)}
            options={LEAD_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
          />
        </Field>

        <Field label="Notas internas" hint="Sólo las ven los operadores de IKK.">
          <Textarea
            value={notes}
            disabled={!canWrite}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Qué se habló, próximos pasos, presupuesto enviado…"
          />
        </Field>
      </div>
    </Modal>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[var(--ikk-fg-muted)]">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field, Switch } from "@/components/ui/field";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { activeState } from "@/lib/labels";

interface Plan {
  id: string;
  name: string;
  price: number;
  paymentUrl?: string | null;
  isActive: boolean;
}

const ENDPOINT = "/tickomium/plans";

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export default function TickomiumPlansPage() {
  const { canWrite } = useSession();
  const [editing, setEditing] = useState<Plan | "new" | null>(null);
  const [removing, setRemoving] = useState<Plan | null>(null);

  const list = useResourceList<Plan>(ENDPOINT, { limit: 25 });
  const remove = useResourceMutation(ENDPOINT, "delete", "Plan eliminado.");

  const columns: Column<Plan>[] = [
    { key: "name", label: "Plan", render: (row) => <span className="font-medium">{row.name}</span> },
    {
      key: "price",
      label: "Precio mensual",
      render: (row) => money.format(Number(row.price ?? 0)),
      csv: (row) => String(row.price ?? 0),
    },
    {
      key: "isActive",
      label: "Disponibilidad",
      render: (row) => {
        const s = activeState(row.isActive);
        return <Badge variant={s.tone}>{s.label}</Badge>;
      },
      csv: (row) => activeState(row.isActive).label,
    },
    {
      key: "paymentUrl",
      label: "Liga de pago",
      hideOnMobile: true,
      render: (row) =>
        row.paymentUrl ? (
          <a
            href={row.paymentUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] text-[var(--ikk-accent)] underline-offset-4 hover:underline"
          >
            Abrir
          </a>
        ) : (
          "—"
        ),
      csv: (row) => row.paymentUrl ?? "",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Tickomium"
        title="Planes"
        description="Catálogo comercial que ven las empresas al contratar o renovar."
        actions={
          canWrite && (
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus className="h-4 w-4" /> Nuevo plan
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
        emptyMessage="Todavía no hay planes configurados."
        search={list.search}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Buscar plan…"
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName="planes-tickomium"
        actions={(row) =>
          canWrite ? (
            <>
              <Button size="sm" variant="ghost" title="Editar" onClick={() => setEditing(row)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" title="Eliminar" onClick={() => setRemoving(row)}>
                <Trash2 className="h-4 w-4 text-[var(--ikk-danger)]" />
              </Button>
            </>
          ) : null
        }
      />

      {editing && (
        <PlanForm plan={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        loading={remove.isPending}
        tone="danger"
        title="Eliminar plan"
        highlight={removing?.name}
        consequence="El plan deja de ofrecerse. Las empresas que ya lo tienen conservan su vigencia, pero no podrán renovarlo."
        confirmLabel="Eliminar"
        onConfirm={() =>
          removing &&
          remove.mutate(
            { path: `${ENDPOINT}/${removing.id}` },
            { onSuccess: () => setRemoving(null) }
          )
        }
      />
    </>
  );
}

function PlanForm({ plan, onClose }: { plan: Plan | null; onClose: () => void }) {
  const isNew = plan === null;
  const save = useResourceMutation(
    ENDPOINT,
    isNew ? "post" : "patch",
    isNew ? "Plan creado." : "Plan actualizado."
  );

  const [form, setForm] = useState({
    name: plan?.name ?? "",
    price: plan ? String(plan.price) : "",
    paymentUrl: plan?.paymentUrl ?? "",
    isActive: plan?.isActive ?? true,
  });

  const price = Number(form.price);
  const invalid = !form.name.trim() || !Number.isFinite(price) || price < 0;

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Nuevo plan" : "Editar plan"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={save.isPending || invalid}
            onClick={() =>
              save.mutate(
                {
                  path: isNew ? ENDPOINT : `${ENDPOINT}/${plan.id}`,
                  body: {
                    name: form.name.trim(),
                    price,
                    paymentUrl: form.paymentUrl.trim() || undefined,
                    isActive: form.isActive,
                  },
                },
                { onSuccess: onClose }
              )
            }
          >
            {save.isPending ? "Guardando…" : isNew ? "Crear plan" : "Guardar"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Nombre">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Plan Negocio"
          />
        </Field>
        <Field label="Precio mensual (MXN)">
          <Input
            value={form.price}
            inputMode="decimal"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="499"
          />
        </Field>
        <Field label="Liga de pago" hint="Opcional. Se muestra a la empresa al renovar.">
          <Input
            value={form.paymentUrl ?? ""}
            onChange={(e) => setForm({ ...form, paymentUrl: e.target.value })}
            placeholder="https://…"
          />
        </Field>
        <Switch
          checked={form.isActive}
          onChange={(next) => setForm({ ...form, isActive: next })}
          label="Disponible para contratar"
        />
      </div>
    </Modal>
  );
}

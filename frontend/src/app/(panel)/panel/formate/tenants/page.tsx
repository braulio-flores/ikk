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
import { Field, Switch, Textarea } from "@/components/ui/field";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { formatDate } from "@/lib/datetime";
import { activeState } from "@/lib/labels";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt?: string;
}

const ENDPOINT = "/formate/tenants";

export default function FormateTenantsPage() {
  const { canWrite } = useSession();
  const [editing, setEditing] = useState<Tenant | "new" | null>(null);
  const [removing, setRemoving] = useState<Tenant | null>(null);

  const list = useResourceList<Tenant>(ENDPOINT, { limit: 25 });
  const remove = useResourceMutation(ENDPOINT, "delete", "Tenant eliminado.");

  const columns: Column<Tenant>[] = [
    {
      key: "name",
      label: "Local",
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium">{row.name}</div>
          <div className="font-mono text-[11px] text-[var(--ikk-fg-dim)]">
            {row.slug}
          </div>
        </div>
      ),
      csv: (row) => row.name,
    },
    {
      key: "address",
      label: "Dirección",
      hideOnMobile: true,
      render: (row) => row.address ?? "—",
    },
    {
      key: "isActive",
      label: "Estado",
      render: (row) => {
        const s = activeState(row.isActive);
        return <Badge variant={s.tone}>{s.label}</Badge>;
      },
      csv: (row) => activeState(row.isActive).label,
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
        eyebrow="Formate"
        title="Tenants"
        description="Locales y restaurantes que operan sobre Formate. Sus usuarios y su configuración se administran en las otras dos pestañas."
        actions={
          canWrite && (
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus className="h-4 w-4" /> Nuevo tenant
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
        emptyMessage="No hay tenants registrados."
        search={list.search}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Buscar por nombre…"
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName="tenants-formate"
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
        <TenantForm
          tenant={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        loading={remove.isPending}
        tone="danger"
        title="Eliminar tenant"
        highlight={removing?.name}
        consequence="El local deja de operar en Formate y sus usuarios pierden el acceso."
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

function TenantForm({
  tenant,
  onClose,
}: {
  tenant: Tenant | null;
  onClose: () => void;
}) {
  const isNew = tenant === null;
  const save = useResourceMutation(
    ENDPOINT,
    isNew ? "post" : "patch",
    isNew ? "Tenant creado." : "Tenant actualizado."
  );

  const [form, setForm] = useState({
    name: tenant?.name ?? "",
    slug: tenant?.slug ?? "",
    description: tenant?.description ?? "",
    address: tenant?.address ?? "",
    ownerEmail: "",
    isActive: tenant?.isActive ?? true,
  });

  const slugInvalid =
    form.slug.trim() !== "" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim());
  const invalid = form.name.trim().length < 2 || slugInvalid;

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Nuevo tenant" : "Editar tenant"}
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
                  path: isNew ? ENDPOINT : `${ENDPOINT}/${tenant.id}`,
                  body: {
                    name: form.name.trim(),
                    ...(form.slug.trim() && { slug: form.slug.trim() }),
                    description: form.description.trim() || undefined,
                    address: form.address.trim() || undefined,
                    ...(isNew &&
                      form.ownerEmail.trim() && {
                        ownerEmail: form.ownerEmail.trim().toLowerCase(),
                      }),
                    isActive: form.isActive,
                  },
                },
                { onSuccess: onClose }
              )
            }
          >
            {save.isPending ? "Guardando…" : isNew ? "Crear tenant" : "Guardar"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Nombre del local">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Taquería El Güero"
          />
        </Field>
        <Field
          label="Identificador en la URL"
          hint="Minúsculas, números y guiones. Si lo dejas vacío se genera del nombre."
          error={slugInvalid ? "Sólo minúsculas, números y guiones." : undefined}
        >
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="taqueria-el-guero"
            className="font-mono"
          />
        </Field>
        <Field label="Dirección">
          <Input
            value={form.address ?? ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </Field>
        <Field label="Descripción">
          <Textarea
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        {isNew && (
          <Field
            label="Correo del dueño"
            hint="Opcional: si ya existe una cuenta con ese correo, queda vinculada como dueña."
          >
            <Input
              type="email"
              value={form.ownerEmail}
              onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
            />
          </Field>
        )}
        <Switch
          checked={form.isActive}
          onChange={(next) => setForm({ ...form, isActive: next })}
          label="Local operando"
        />
      </div>
    </Modal>
  );
}

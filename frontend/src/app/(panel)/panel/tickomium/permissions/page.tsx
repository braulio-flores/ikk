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
import { Field, Select, Textarea } from "@/components/ui/field";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { humanize } from "@/lib/labels";

interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  category?: string | null;
  permissionCategory?: "MASTER" | "PUBLIC" | null;
}

const ENDPOINT = "/tickomium/permissions";

const VISIBILITY = [
  { value: "PUBLIC", label: "Asignable por la empresa" },
  { value: "MASTER", label: "Reservado para IKK" },
];

export default function TickomiumPermissionsPage() {
  const { canWrite } = useSession();
  const [editing, setEditing] = useState<Permission | "new" | null>(null);
  const [removing, setRemoving] = useState<Permission | null>(null);

  const list = useResourceList<Permission>(ENDPOINT, { limit: 50 });
  const remove = useResourceMutation(ENDPOINT, "delete", "Permiso eliminado.");

  const columns: Column<Permission>[] = [
    {
      key: "name",
      label: "Permiso",
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium">{row.name}</div>
          {row.description && (
            <div className="text-[13px] text-[var(--ikk-fg-muted)]">
              {row.description}
            </div>
          )}
        </div>
      ),
      csv: (row) => row.name,
    },
    {
      key: "code",
      label: "Clave técnica",
      hideOnMobile: true,
      render: (row) => (
        <code className="font-mono text-[12px] text-[var(--ikk-fg-muted)]">
          {row.code}
        </code>
      ),
    },
    {
      key: "category",
      label: "Módulo",
      render: (row) => humanize(String(row.category ?? "general")),
    },
    {
      key: "permissionCategory",
      label: "Visibilidad",
      render: (row) => (
        <Badge variant={row.permissionCategory === "MASTER" ? "suspend" : "active"}>
          {row.permissionCategory === "MASTER"
            ? "Reservado para IKK"
            : "Asignable por la empresa"}
        </Badge>
      ),
      csv: (row) => String(row.permissionCategory ?? "PUBLIC"),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Tickomium"
        title="Permisos"
        description="Catálogo global del sistema. Sólo IKK lo edita; cada empresa asigna estos permisos a sus roles."
        actions={
          canWrite && (
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus className="h-4 w-4" /> Nuevo permiso
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
        emptyMessage="El catálogo de permisos está vacío."
        search={list.search}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Buscar permiso…"
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName="permisos-tickomium"
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
        <PermissionForm
          permission={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        loading={remove.isPending}
        tone="danger"
        title="Eliminar permiso"
        highlight={removing?.name}
        consequence="Los roles que lo tuvieran asignado dejarán de otorgar esa capacidad en todas las empresas."
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

function PermissionForm({
  permission,
  onClose,
}: {
  permission: Permission | null;
  onClose: () => void;
}) {
  const isNew = permission === null;
  const save = useResourceMutation(
    ENDPOINT,
    isNew ? "post" : "patch",
    isNew ? "Permiso creado." : "Permiso actualizado."
  );

  const [form, setForm] = useState({
    code: permission?.code ?? "",
    name: permission?.name ?? "",
    description: permission?.description ?? "",
    category: permission?.category ?? "general",
    permissionCategory: permission?.permissionCategory ?? "PUBLIC",
  });

  const invalid = !form.code.trim() || !form.name.trim();

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Nuevo permiso" : "Editar permiso"}
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
                  path: isNew ? ENDPOINT : `${ENDPOINT}/${permission.id}`,
                  body: {
                    ...(isNew && { code: form.code.trim() }),
                    name: form.name.trim(),
                    description: form.description.trim() || undefined,
                    category: form.category.trim() || "general",
                    permissionCategory: form.permissionCategory,
                  },
                },
                { onSuccess: onClose }
              )
            }
          >
            {save.isPending ? "Guardando…" : isNew ? "Crear permiso" : "Guardar"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {isNew && (
          <Field
            label="Clave técnica"
            hint="Se usa en el código de Tickomium y no se puede cambiar después."
          >
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="sales.refund"
              className="font-mono"
            />
          </Field>
        )}
        <Field label="Nombre visible">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Autorizar devoluciones"
          />
        </Field>
        <Field label="Descripción">
          <Textarea
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Qué habilita este permiso, en palabras del usuario."
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Módulo">
            <Input
              value={form.category ?? ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="ventas"
            />
          </Field>
          <Field label="Visibilidad">
            <Select
              value={form.permissionCategory ?? "PUBLIC"}
              onChange={(e) =>
                setForm({
                  ...form,
                  permissionCategory: e.target.value as "MASTER" | "PUBLIC",
                })
              }
              options={VISIBILITY}
            />
          </Field>
        </div>
      </div>
    </Modal>
  );
}

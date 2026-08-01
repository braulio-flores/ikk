"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field, Select } from "@/components/ui/field";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { formatDate } from "@/lib/datetime";
import { fullName, humanize } from "@/lib/labels";

interface TickomiumUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role?: string | null;
  createdAt?: string;
}

const ENDPOINT = "/tickomium/users";

const ROLES = [
  { value: "USER", label: "Usuario" },
  { value: "ADMIN", label: "Administrador de empresa" },
];

export default function TickomiumUsersPage() {
  const { canWrite } = useSession();
  const [editing, setEditing] = useState<TickomiumUser | "new" | null>(null);
  const [removing, setRemoving] = useState<TickomiumUser | null>(null);

  const list = useResourceList<TickomiumUser>(ENDPOINT, { limit: 25 });
  const remove = useResourceMutation(ENDPOINT, "delete", "Usuario dado de baja.");

  const columns: Column<TickomiumUser>[] = [
    {
      key: "name",
      label: "Usuario",
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium">{fullName(row)}</div>
          <div className="truncate text-[13px] text-[var(--ikk-fg-muted)]">
            {row.email}
          </div>
        </div>
      ),
      csv: (row) => `${fullName(row)} <${row.email}>`,
    },
    {
      key: "role",
      label: "Rol",
      render: (row) =>
        ROLES.find((r) => r.value === row.role)?.label ?? humanize(String(row.role ?? "")),
      csv: (row) => humanize(String(row.role ?? "")),
    },
    {
      key: "phone",
      label: "Teléfono",
      render: (row) => row.phone ?? "—",
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
        eyebrow="Tickomium"
        title="Usuarios"
        description="Personas que acceden al punto de venta. El rol define qué puede hacer cada una dentro de su empresa."
        actions={
          canWrite && (
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus className="h-4 w-4" /> Nuevo usuario
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
        emptyMessage="No hay usuarios que coincidan con la búsqueda."
        search={list.search}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Buscar por nombre o correo…"
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName="usuarios-tickomium"
        actions={(row) =>
          canWrite ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                title="Editar"
                onClick={() => setEditing(row)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title="Dar de baja"
                onClick={() => setRemoving(row)}
              >
                <Trash2 className="h-4 w-4 text-[var(--ikk-danger)]" />
              </Button>
            </>
          ) : null
        }
      />

      {editing && (
        <UserForm
          user={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        loading={remove.isPending}
        tone="danger"
        title="Dar de baja usuario"
        highlight={removing ? fullName(removing) : undefined}
        consequence="La persona pierde el acceso a Tickomium de inmediato. Esta acción no se puede deshacer."
        confirmLabel="Dar de baja"
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

function UserForm({
  user,
  onClose,
}: {
  user: TickomiumUser | null;
  onClose: () => void;
}) {
  const isNew = user === null;
  const save = useResourceMutation(
    ENDPOINT,
    isNew ? "post" : "patch",
    isNew ? "Usuario creado." : "Usuario actualizado."
  );

  const [form, setForm] = useState({
    email: user?.email ?? "",
    password: "",
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
    role: user?.role ?? "USER",
  });

  const missing =
    isNew &&
    (!form.email.trim() ||
      !form.firstName.trim() ||
      !form.phone.trim() ||
      form.password.length < 8);

  function submit() {
    const body: Record<string, unknown> = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || undefined,
      phone: form.phone.trim(),
      role: form.role,
    };
    if (isNew) {
      body.email = form.email.trim().toLowerCase();
      body.password = form.password;
    } else if (form.password) {
      body.password = form.password;
    }

    save.mutate(
      { path: isNew ? ENDPOINT : `${ENDPOINT}/${user.id}`, body },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Nuevo usuario" : "Editar usuario"}
      description={isNew ? undefined : user?.email}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={save.isPending || missing}>
            {save.isPending ? "Guardando…" : isNew ? "Crear usuario" : "Guardar"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {isNew && (
          <Field label="Correo">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="off"
            />
          </Field>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre">
            <Input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </Field>
          <Field label="Apellido">
            <Input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Teléfono">
            <Input
              value={form.phone}
              inputMode="tel"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Rol">
            <Select
              value={form.role ?? "USER"}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              options={ROLES}
            />
          </Field>
        </div>
        <Field
          label={isNew ? "Contraseña" : "Nueva contraseña"}
          hint={
            isNew
              ? "Mínimo 8 caracteres. El usuario podrá cambiarla después."
              : "Déjala vacía para conservar la actual."
          }
        >
          <Input
            type="password"
            value={form.password}
            autoComplete="new-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>
      </div>
    </Modal>
  );
}

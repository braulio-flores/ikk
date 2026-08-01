"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field, Select, Switch } from "@/components/ui/field";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { formatDate } from "@/lib/datetime";
import { OPERATOR_ROLES, activeState, operatorRole } from "@/lib/labels";
import type { Operator } from "@/lib/types";

const ENDPOINT = "/operators";

export default function OperatorsPage() {
  const { isSuperAdmin, operator: me } = useSession();
  const [editing, setEditing] = useState<Operator | "new" | null>(null);
  const [removing, setRemoving] = useState<Operator | null>(null);

  const list = useResourceList<Operator>(ENDPOINT, {
    limit: 50,
    enabled: isSuperAdmin,
  });
  const remove = useResourceMutation(ENDPOINT, "delete", "Operador eliminado.");

  if (!isSuperAdmin) {
    return (
      <>
        <PageHeader
          eyebrow="Configuración"
          title="Operadores"
          description="Quién puede entrar al panel de IKK."
        />
        <Card className="p-6 text-sm text-[var(--ikk-fg-muted)]">
          Sólo un super administrador puede ver y administrar operadores.
        </Card>
      </>
    );
  }

  const columns: Column<Operator>[] = [
    {
      key: "name",
      label: "Operador",
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium">
            {row.name}
            {row.id === me?.id && (
              <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-[var(--ikk-fg-dim)]">
                tú
              </span>
            )}
          </div>
          <div className="truncate text-[13px] text-[var(--ikk-fg-muted)]">
            {row.email}
          </div>
        </div>
      ),
      csv: (row) => `${row.name} <${row.email}>`,
    },
    {
      key: "role",
      label: "Rol",
      render: (row) => operatorRole(row.role),
      csv: (row) => operatorRole(row.role),
    },
    {
      key: "isActive",
      label: "Acceso",
      render: (row) => {
        const s = activeState(row.isActive);
        return <Badge variant={s.tone}>{row.isActive ? "Habilitado" : "Bloqueado"}</Badge>;
      },
      csv: (row) => (row.isActive ? "Habilitado" : "Bloqueado"),
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
        eyebrow="Configuración"
        title="Operadores"
        description="Quién puede entrar al panel de IKK y con qué alcance."
        actions={
          <Button size="sm" onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" /> Nuevo operador
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(row) => row.id}
        isLoading={list.isLoading}
        error={list.error}
        emptyMessage="No hay operadores registrados."
        search={list.search}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Buscar operador…"
        exportName="operadores-ikk"
        actions={(row) => (
          <>
            <Button size="sm" variant="ghost" title="Editar" onClick={() => setEditing(row)}>
              <Pencil className="h-4 w-4" />
            </Button>
            {row.id !== me?.id && (
              <Button size="sm" variant="ghost" title="Eliminar" onClick={() => setRemoving(row)}>
                <Trash2 className="h-4 w-4 text-[var(--ikk-danger)]" />
              </Button>
            )}
          </>
        )}
      />

      {editing && (
        <OperatorForm
          operator={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        loading={remove.isPending}
        tone="danger"
        title="Eliminar operador"
        highlight={removing?.name}
        consequence="Pierde el acceso al panel de inmediato. Sus acciones anteriores siguen en la bitácora."
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

function OperatorForm({
  operator,
  onClose,
}: {
  operator: Operator | null;
  onClose: () => void;
}) {
  const isNew = operator === null;
  const save = useResourceMutation(
    ENDPOINT,
    isNew ? "post" : "patch",
    isNew ? "Operador creado." : "Operador actualizado."
  );

  const [form, setForm] = useState({
    name: operator?.name ?? "",
    email: operator?.email ?? "",
    password: "",
    role: operator?.role ?? "ADMIN",
    isActive: operator?.isActive ?? true,
  });

  const invalid = isNew
    ? !form.name.trim() || !form.email.trim() || form.password.length < 8
    : !form.name.trim() || (form.password !== "" && form.password.length < 8);

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Nuevo operador" : "Editar operador"}
      description={isNew ? undefined : operator?.email}
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
                  path: isNew ? ENDPOINT : `${ENDPOINT}/${operator.id}`,
                  body: isNew
                    ? {
                        name: form.name.trim(),
                        email: form.email.trim().toLowerCase(),
                        password: form.password,
                        role: form.role,
                      }
                    : {
                        name: form.name.trim(),
                        role: form.role,
                        isActive: form.isActive,
                        ...(form.password && { password: form.password }),
                      },
                },
                { onSuccess: onClose }
              )
            }
          >
            {save.isPending ? "Guardando…" : isNew ? "Crear operador" : "Guardar"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Nombre">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        {isNew && (
          <Field label="Correo">
            <Input
              type="email"
              value={form.email}
              autoComplete="off"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
        )}
        <Field
          label="Rol"
          hint="Sólo lectura navega el panel sin poder modificar nada."
        >
          <Select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as Operator["role"] })
            }
            options={OPERATOR_ROLES.map((r) => ({ value: r.value, label: r.label }))}
          />
        </Field>
        <Field
          label={isNew ? "Contraseña" : "Nueva contraseña"}
          hint={
            isNew
              ? "Mínimo 8 caracteres."
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
        {!isNew && (
          <Switch
            checked={form.isActive}
            onChange={(next) => setForm({ ...form, isActive: next })}
            label="Acceso habilitado"
          />
        )}
      </div>
    </Modal>
  );
}

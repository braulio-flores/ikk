"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { TenantPicker } from "@/components/panel/tenant-picker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Field, Select } from "@/components/ui/field";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { fullName, humanize } from "@/lib/labels";

interface TenantUser {
  id: string;
  role: string;
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

const ROLES = [
  { value: "owner", label: "Dueño" },
  { value: "admin", label: "Administrador" },
  { value: "employee", label: "Colaborador" },
];

export default function FormateUsersPage() {
  const { canWrite } = useSession();
  const [tenantId, setTenantId] = useState("");
  const [attaching, setAttaching] = useState(false);

  const endpoint = `/formate/tenants/${tenantId}/users`;
  const list = useResourceList<TenantUser>(endpoint, {
    limit: 100,
    enabled: Boolean(tenantId),
  });

  const columns: Column<TenantUser>[] = [
    {
      key: "user",
      label: "Persona",
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium">{fullName(row.user)}</div>
          <div className="truncate text-[13px] text-[var(--ikk-fg-muted)]">
            {row.user.email}
          </div>
        </div>
      ),
      csv: (row) => `${fullName(row.user)} <${row.user.email}>`,
    },
    {
      key: "role",
      label: "Rol en el local",
      render: (row) =>
        ROLES.find((r) => r.value === row.role)?.label ?? humanize(row.role),
      csv: (row) => humanize(row.role),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Formate"
        title="Usuarios por tenant"
        description="Quién puede entrar a cada local y con qué rol."
        actions={
          canWrite &&
          tenantId && (
            <Button size="sm" onClick={() => setAttaching(true)}>
              <UserPlus className="h-4 w-4" /> Vincular usuario
            </Button>
          )
        }
      />

      <TenantPicker value={tenantId} onChange={setTenantId} />

      {!tenantId ? (
        <Card className="p-6 text-sm text-[var(--ikk-fg-muted)]">
          Elige un tenant para ver a su equipo.
        </Card>
      ) : (
        <DataTable
          columns={columns}
          rows={list.items}
          rowKey={(row) => row.id}
          isLoading={list.isLoading}
          error={list.error}
          emptyMessage="Este local todavía no tiene usuarios vinculados."
          exportName="usuarios-formate"
        />
      )}

      {attaching && (
        <AttachUserForm
          tenantId={tenantId}
          endpoint={endpoint}
          onClose={() => setAttaching(false)}
        />
      )}
    </>
  );
}

function AttachUserForm({
  tenantId,
  endpoint,
  onClose,
}: {
  tenantId: string;
  endpoint: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ email: "", role: "employee" });
  const attach = useResourceMutation(endpoint, "post", "Usuario vinculado al local.");

  return (
    <Modal
      open
      onClose={onClose}
      title="Vincular usuario"
      description="La persona debe tener ya una cuenta en Formate. Se busca por su correo."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={attach.isPending || !form.email.trim()}
            onClick={() =>
              attach.mutate(
                {
                  path: `/formate/tenants/${tenantId}/users`,
                  body: {
                    email: form.email.trim().toLowerCase(),
                    role: form.role,
                  },
                },
                { onSuccess: onClose }
              )
            }
          >
            {attach.isPending ? "Vinculando…" : "Vincular"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Correo de la persona">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="persona@correo.com"
          />
        </Field>
        <Field label="Rol en el local">
          <Select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={ROLES}
          />
        </Field>
      </div>
    </Modal>
  );
}

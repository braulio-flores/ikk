"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Field, Select } from "@/components/ui/field";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { fullName } from "@/lib/labels";

interface Doctor {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
}

interface Clinic {
  id: string;
  name: string;
}

const ENDPOINT = "/mdoc/doctors";

export default function MdocDoctorsPage() {
  const { canWrite } = useSession();
  const [clinicId, setClinicId] = useState("");
  const [editing, setEditing] = useState<Doctor | "new" | null>(null);

  const clinics = useResourceList<Clinic>("/mdoc/clinics", { limit: 200 });
  const list = useResourceList<Doctor>(ENDPOINT, {
    limit: 25,
    params: { clinicId },
  });

  const columns: Column<Doctor>[] = [
    {
      key: "name",
      label: "Doctor",
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
      key: "phone",
      label: "Teléfono",
      render: (row) => row.phone ?? "—",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="mDoc"
        title="Doctores"
        description="Profesionales que atienden en cada clínica."
        actions={
          canWrite && (
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus className="h-4 w-4" /> Nuevo doctor
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
        emptyMessage="No hay doctores para este filtro."
        search={list.search}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Buscar por nombre o correo…"
        filters={
          <Select
            aria-label="Filtrar por clínica"
            className="h-9 w-auto"
            value={clinicId}
            onChange={(e) => setClinicId(e.target.value)}
            placeholder="Todas las clínicas"
            options={clinics.items.map((c) => ({ value: c.id, label: c.name }))}
          />
        }
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName="doctores-mdoc"
        actions={(row) =>
          canWrite ? (
            <Button size="sm" variant="ghost" title="Editar" onClick={() => setEditing(row)}>
              <Pencil className="h-4 w-4" />
            </Button>
          ) : null
        }
      />

      {editing && (
        <DoctorForm
          doctor={editing === "new" ? null : editing}
          clinics={clinics.items}
          defaultClinicId={clinicId}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

function DoctorForm({
  doctor,
  clinics,
  defaultClinicId,
  onClose,
}: {
  doctor: Doctor | null;
  clinics: Clinic[];
  defaultClinicId: string;
  onClose: () => void;
}) {
  const isNew = doctor === null;
  const save = useResourceMutation(
    ENDPOINT,
    isNew ? "post" : "patch",
    isNew ? "Doctor dado de alta." : "Doctor actualizado."
  );

  const [form, setForm] = useState({
    email: doctor?.email ?? "",
    password: "",
    firstName: doctor?.firstName ?? "",
    lastName: doctor?.lastName ?? "",
    phone: doctor?.phone ?? "",
    clinicId: defaultClinicId,
  });

  const invalid = isNew
    ? !form.email.trim() || !form.firstName.trim() || form.password.length < 8
    : !form.firstName.trim();

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Nuevo doctor" : "Editar doctor"}
      description={isNew ? undefined : doctor?.email}
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
                  path: isNew ? ENDPOINT : `${ENDPOINT}/${doctor.id}`,
                  body: isNew
                    ? {
                        email: form.email.trim().toLowerCase(),
                        password: form.password,
                        firstName: form.firstName.trim(),
                        lastName: form.lastName.trim() || undefined,
                        phone: form.phone.trim() || undefined,
                        clinicId: form.clinicId || undefined,
                      }
                    : {
                        firstName: form.firstName.trim(),
                        lastName: form.lastName.trim() || undefined,
                        phone: form.phone.trim() || undefined,
                      },
                },
                { onSuccess: onClose }
              )
            }
          >
            {save.isPending ? "Guardando…" : isNew ? "Dar de alta" : "Guardar"}
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
              autoComplete="off"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre">
            <Input
              value={form.firstName ?? ""}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </Field>
          <Field label="Apellido">
            <Input
              value={form.lastName ?? ""}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Teléfono">
          <Input
            value={form.phone ?? ""}
            inputMode="tel"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
        {isNew && (
          <>
            <Field label="Clínica" hint="Opcional: se puede vincular después.">
              <Select
                value={form.clinicId}
                onChange={(e) => setForm({ ...form, clinicId: e.target.value })}
                placeholder="Sin clínica"
                options={clinics.map((c) => ({ value: c.id, label: c.name }))}
              />
            </Field>
            <Field
              label="Contraseña temporal"
              hint="Mínimo 8 caracteres. El doctor puede cambiarla al entrar."
            >
              <Input
                type="password"
                value={form.password}
                autoComplete="new-password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Field>
          </>
        )}
      </div>
    </Modal>
  );
}

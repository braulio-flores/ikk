"use client";

// Selector de tenant de Formate. Las vistas de usuarios y configuración
// trabajan siempre sobre un tenant concreto, así que comparten este control.

import { Card } from "@/components/ui/card";
import { Field, Select } from "@/components/ui/field";
import { useResourceList } from "@/hooks/use-resource";

export interface TenantOption {
  id: string;
  name: string;
}

export function TenantPicker({
  value,
  onChange,
  hint,
}: {
  value: string;
  onChange: (tenantId: string) => void;
  hint?: string;
}) {
  const tenants = useResourceList<TenantOption>("/formate/tenants", {
    limit: 200,
  });

  return (
    <Card className="mb-4 p-4 sm:p-5">
      <Field
        label="Tenant"
        hint={
          tenants.error
            ? "No se pudo cargar la lista. Revisa que Formate esté en línea."
            : hint
        }
      >
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            tenants.isLoading ? "Cargando tenants…" : "Elige un tenant"
          }
          options={tenants.items.map((t) => ({ value: t.id, label: t.name }))}
        />
      </Field>
    </Card>
  );
}

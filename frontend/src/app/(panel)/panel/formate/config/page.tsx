"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/panel/page-header";
import { TenantPicker } from "@/components/panel/tenant-picker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/field";
import { apiGet } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import { useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { cn } from "@/lib/utils";

interface TenantConfig {
  isOpen?: boolean;
  deliveryEnabled?: boolean;
  localEnabled?: boolean;
  paymentMethods?: string[];
}

const PAYMENT_METHODS = [
  { value: "cash", label: "Efectivo" },
  { value: "card", label: "Tarjeta" },
  { value: "transfer", label: "Transferencia" },
];

export default function FormateConfigPage() {
  const { canWrite } = useSession();
  const [tenantId, setTenantId] = useState("");
  const [form, setForm] = useState<TenantConfig>({});

  const config = useQuery<TenantConfig>({
    queryKey: ["formate-config", tenantId],
    enabled: Boolean(tenantId),
    queryFn: () => apiGet<TenantConfig>(`/formate/tenants/${tenantId}/config`),
    retry: false,
  });

  useEffect(() => {
    if (config.data) {
      setForm({
        isOpen: config.data.isOpen ?? false,
        deliveryEnabled: config.data.deliveryEnabled ?? false,
        localEnabled: config.data.localEnabled ?? true,
        paymentMethods: config.data.paymentMethods ?? ["cash"],
      });
    } else if (config.isError) {
      // Un tenant sin configuración todavía: arrancamos con valores por defecto.
      setForm({
        isOpen: false,
        deliveryEnabled: false,
        localEnabled: true,
        paymentMethods: ["cash"],
      });
    }
  }, [config.data, config.isError]);

  const save = useResourceMutation(
    "formate-config",
    "patch",
    "Configuración guardada."
  );

  const methods = form.paymentMethods ?? [];

  function toggleMethod(value: string) {
    const next = methods.includes(value)
      ? methods.filter((m) => m !== value)
      : [...methods, value];
    setForm({ ...form, paymentMethods: next });
  }

  return (
    <>
      <PageHeader
        eyebrow="Formate"
        title="Configuración del local"
        description="Si el local está tomando pedidos, qué modalidades ofrece y cómo cobra."
      />

      <TenantPicker value={tenantId} onChange={setTenantId} />

      {!tenantId ? (
        <Card className="p-6 text-sm text-[var(--ikk-fg-muted)]">
          Elige un tenant para ver su configuración.
        </Card>
      ) : config.isLoading ? (
        <Card className="p-6 text-sm text-[var(--ikk-fg-muted)]">Cargando…</Card>
      ) : (
        <Card className="max-w-xl space-y-5 p-5 sm:p-6">
          {config.isError && (
            <p className="rounded-[var(--ikk-r-md)] border border-[var(--ikk-line)] bg-[var(--ikk-bg-elev)] p-3 text-[13px] text-[var(--ikk-fg-muted)]">
              {apiErrorMessage(
                config.error,
                "Este local aún no tiene configuración. Al guardar se crea con estos valores."
              )}
            </p>
          )}

          <Switch
            checked={Boolean(form.isOpen)}
            disabled={!canWrite}
            onChange={(next) => setForm({ ...form, isOpen: next })}
            label="Recibiendo pedidos ahora"
          />
          <Switch
            checked={Boolean(form.localEnabled)}
            disabled={!canWrite}
            onChange={(next) => setForm({ ...form, localEnabled: next })}
            label="Pedidos para consumo en el local"
          />
          <Switch
            checked={Boolean(form.deliveryEnabled)}
            disabled={!canWrite}
            onChange={(next) => setForm({ ...form, deliveryEnabled: next })}
            label="Pedidos a domicilio"
          />

          <div>
            <p className="mb-2 text-[13px] font-medium text-[var(--ikk-fg-muted)]">
              Formas de pago aceptadas
            </p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => {
                const on = methods.includes(m.value);
                return (
                  <button
                    key={m.value}
                    type="button"
                    disabled={!canWrite}
                    onClick={() => toggleMethod(m.value)}
                    className={cn(
                      "rounded-[var(--ikk-r-md)] border px-3 py-1.5 text-sm transition-colors disabled:opacity-60",
                      on
                        ? "border-[var(--ikk-accent)] bg-[var(--ikk-accent-soft)] text-[var(--ikk-fg)]"
                        : "border-[var(--ikk-line)] text-[var(--ikk-fg-muted)] hover:bg-[var(--ikk-bg-hover)]"
                    )}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
            {methods.length === 0 && (
              <p className="mt-2 text-[12px] text-[var(--ikk-danger)]">
                Debe quedar al menos una forma de pago.
              </p>
            )}
          </div>

          {canWrite && (
            <Button
              disabled={save.isPending || methods.length === 0}
              onClick={() =>
                save.mutate({
                  path: `/formate/tenants/${tenantId}/config`,
                  body: {
                    isOpen: Boolean(form.isOpen),
                    localEnabled: Boolean(form.localEnabled),
                    deliveryEnabled: Boolean(form.deliveryEnabled),
                    paymentMethods: methods,
                  },
                })
              }
            >
              {save.isPending ? "Guardando…" : "Guardar configuración"}
            </Button>
          )}
        </Card>
      )}
    </>
  );
}

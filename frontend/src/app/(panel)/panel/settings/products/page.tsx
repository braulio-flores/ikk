"use client";

// Estado de la conexión con cada producto hijo. IKK no guarda datos de los
// hijos: sólo habla con ellos por su API de gestión usando un token de
// servicio configurado en variables de entorno.

import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { productName } from "@/lib/labels";
import type { KPIStat } from "@/lib/types";

const PRODUCTS = [
  {
    key: "TICKOMIUM",
    description: "Punto de venta multiempresa. IKK administra empresas, planes, usuarios y permisos.",
  },
  {
    key: "FORMATE",
    description: "Pedidos multi-tenant. IKK administra locales, su equipo y su configuración.",
  },
  {
    key: "MDOC",
    description: "Gestión clínica. IKK administra clínicas, doctores y consulta la auditoría de expedientes.",
  },
] as const;

export default function ProductsConfigPage() {
  const stats = useQuery<{ kpis: KPIStat[] }>({
    queryKey: ["overview-stats"],
    queryFn: () => apiGet<{ kpis: KPIStat[] }>("/overview/stats"),
  });

  return (
    <>
      <PageHeader
        eyebrow="Configuración"
        title="Productos"
        description="Conexión de IKK con cada producto. Las direcciones y los tokens se configuran en el entorno del servidor, nunca desde aquí."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void stats.refetch()}
            disabled={stats.isFetching}
          >
            <RefreshCw
              className={stats.isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
            Probar conexión
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {PRODUCTS.map((p) => {
          const kpi = stats.data?.kpis.find((k) => k.product === p.key);
          return (
            <Card key={p.key} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--ikk-fg-muted)]">
                  {productName(p.key)}
                </div>
                <Badge variant={kpi?.ok ? "active" : "overdue"}>
                  {stats.isLoading
                    ? "probando"
                    : kpi?.ok
                      ? "Conectado"
                      : "Sin conexión"}
                </Badge>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[var(--ikk-fg-muted)]">
                {p.description}
              </p>

              {!kpi?.ok && !stats.isLoading && (
                <p className="mt-3 rounded-[var(--ikk-r-md)] border border-[var(--ikk-line)] bg-[var(--ikk-bg-elev)] p-3 text-[13px] text-[var(--ikk-fg-muted)]">
                  Verifica que el servicio esté desplegado y que su token de
                  gestión coincida con el que tiene IKK.
                </p>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="mt-4 p-5">
        <h2 className="text-[15px] font-semibold tracking-tight">
          Cómo se configura
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ikk-fg-muted)]">
          Cada producto necesita dos valores en el entorno del servidor de IKK:
          la dirección de su API de gestión y un token de servicio que debe ser
          idéntico al que tiene configurado el propio producto. Si el token no
          coincide, la tarjeta de arriba aparecerá sin conexión.
        </p>
      </Card>
    </>
  );
}

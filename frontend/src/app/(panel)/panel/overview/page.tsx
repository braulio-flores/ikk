"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Store,
  Stethoscope,
  ArrowRight,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { apiGet } from "@/lib/api";
import { PageHeader } from "@/components/panel/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/datetime";
import { auditAction, productName } from "@/lib/labels";
import type { AuditLogEntry, KPIStat } from "@/lib/types";

interface StatsResponse {
  kpis: KPIStat[];
}

const products = [
  {
    key: "TICKOMIUM",
    icon: Building2,
    unit: "empresas registradas",
    href: "/panel/tickomium/companies",
  },
  {
    key: "FORMATE",
    icon: Store,
    unit: "tenants registrados",
    href: "/panel/formate/tenants",
  },
  {
    key: "MDOC",
    icon: Stethoscope,
    unit: "clínicas registradas",
    href: "/panel/mdoc/clinics",
  },
] as const;

export default function OverviewPage() {
  const stats = useQuery<StatsResponse>({
    queryKey: ["overview-stats"],
    queryFn: () => apiGet<StatsResponse>("/overview/stats"),
    refetchInterval: 120_000,
  });

  const activity = useQuery<{ items: AuditLogEntry[] }>({
    queryKey: ["audit-recent"],
    queryFn: () => apiGet<{ items: AuditLogEntry[] }>("/audit?limit=6"),
  });

  const leads = useQuery<{ total: number }>({
    queryKey: ["leads-new-count"],
    queryFn: () => apiGet<{ total: number }>("/contact/leads?status=NEW&limit=1"),
  });

  const newLeads = leads.data?.total ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Panel master"
        title="Resumen"
        description="Estado de los tres productos y lo último que pasó en la operación."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              void stats.refetch();
              void activity.refetch();
              void leads.refetch();
            }}
            disabled={stats.isFetching}
          >
            <RefreshCw
              className={stats.isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            />
            Actualizar
          </Button>
        }
      />

      {/* Productos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const kpi = stats.data?.kpis.find((k) => k.product === p.key);
          const Icon = p.icon;
          const count = kpi?.ok ? extractCount(kpi.data) : null;

          return (
            <Card key={p.key} className="p-5">
              <div className="flex items-start justify-between">
                <Icon className="h-5 w-5 text-[var(--ikk-accent)]" />
                <Badge variant={kpi?.ok ? "active" : "overdue"}>
                  {stats.isLoading
                    ? "consultando"
                    : kpi?.ok
                      ? "En línea"
                      : "Sin conexión"}
                </Badge>
              </div>

              <div className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--ikk-fg-muted)]">
                {productName(p.key)}
              </div>
              <div className="mt-1 text-3xl font-semibold tracking-tight">
                {stats.isLoading ? "…" : (count ?? "—")}
              </div>
              <p className="mt-1 text-xs text-[var(--ikk-fg-muted)]">
                {kpi?.ok
                  ? p.unit
                  : "El servicio no respondió. Revisa su despliegue."}
              </p>

              <Link
                href={p.href}
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-[var(--ikk-accent)] transition-opacity hover:opacity-80"
              >
                Administrar <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Actividad */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[15px] font-semibold tracking-tight">
              Actividad reciente
            </h2>
            <Link
              href="/panel/settings/audit-log"
              className="shrink-0 text-[13px] text-[var(--ikk-fg-muted)] underline-offset-4 hover:text-[var(--ikk-fg)] hover:underline"
            >
              Ver bitácora
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {activity.isLoading ? (
              <p className="text-sm text-[var(--ikk-fg-muted)]">Cargando…</p>
            ) : (activity.data?.items.length ?? 0) === 0 ? (
              <p className="text-sm text-[var(--ikk-fg-muted)]">
                Todavía no se registran acciones administrativas.
              </p>
            ) : (
              activity.data?.items.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-4 border-b border-[var(--ikk-line-soft)] pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm">{auditAction(entry.action)}</p>
                    <p className="mt-0.5 text-xs text-[var(--ikk-fg-muted)]">
                      {productName(entry.product)}
                      {entry.operator?.name ? ` · ${entry.operator.name}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-[var(--ikk-fg-dim)]">
                    {formatRelative(entry.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Prospectos */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <Inbox className="h-5 w-5 text-[var(--ikk-accent)]" />
            {newLeads > 0 && <Badge variant="trial">Sin atender</Badge>}
          </div>
          <div className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--ikk-fg-muted)]">
            Prospectos nuevos
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight">
            {leads.isLoading ? "…" : newLeads}
          </div>
          <p className="mt-1 text-xs text-[var(--ikk-fg-muted)]">
            Contactos del formulario público pendientes de respuesta.
          </p>
          <Link
            href="/panel/leads"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-[var(--ikk-accent)] transition-opacity hover:opacity-80"
          >
            Ver prospectos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>
    </>
  );
}

function extractCount(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  if (typeof obj.total === "number") return String(obj.total);
  if (Array.isArray(obj.items)) return String(obj.items.length);
  return null;
}

"use client";

// Solicitudes de alta de Tickomium.
//
// Es la bandeja de trabajo del operador: lo único que hay aquí son empresas
// que pidieron el alta y esperan respuesta. Empresas sigue siendo el listado
// completo —plan, vigencia, miembros—; esta pantalla sólo resuelve la
// solicitud, que es la decisión que bloquea a alguien del otro lado.

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { DataTable, type Column } from "@/components/panel/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";
import { formatDate, formatRelative } from "@/lib/datetime";
import {
  AWAITING_APPROVAL_QUERY,
  CLOSED_REQUEST_QUERY,
  companyRequestKind,
  companyStatus,
  fullName,
} from "@/lib/labels";
import {
  COMPANIES_ENDPOINT,
  RejectRequestDialog,
  type RejectableCompany,
} from "../reject-request";

interface CompanyRequest extends RejectableCompany {
  subname?: string | null;
  rfc?: string | null;
  email?: string | null;
  phone?: string | null;
  status: string;
  createdAt: string;
  /** Motivo del rechazo. */
  statusReason?: string | null;
  /** Cuándo se rechazó o se retiró. */
  requestClosedAt?: string | null;
}

/**
 * Las dos vistas son el mismo listado con distinto filtro de estado. El valor
 * es literalmente lo que viaja como `?status=`.
 */
const VIEWS = [
  { value: AWAITING_APPROVAL_QUERY, label: "Pendientes" },
  { value: CLOSED_REQUEST_QUERY, label: "Resueltas" },
] as const;

/** Nombre completo de la empresa, con su sucursal si la trae. */
function companyLabel(row: CompanyRequest): string {
  return row.subname ? `${row.name} — ${row.subname}` : row.name;
}

function requesterLabel(row: CompanyRequest): string {
  return row.requestedBy ? fullName(row.requestedBy) : "—";
}

export default function RequestsPage() {
  const { canWrite } = useSession();
  const [view, setView] = useState<string>(AWAITING_APPROVAL_QUERY);
  const [approving, setApproving] = useState<CompanyRequest | null>(null);
  const [rejecting, setRejecting] = useState<CompanyRequest | null>(null);

  const pending = view === AWAITING_APPROVAL_QUERY;

  const list = useResourceList<CompanyRequest>(COMPANIES_ENDPOINT, {
    limit: 25,
    params: { status: view },
  });

  const approve = useResourceMutation(
    COMPANIES_ENDPOINT,
    "patch",
    "Solicitud aprobada. La empresa quedó activa."
  );

  // Una demo no tiene contraseña: en vez de activarla de un tiro, se le manda
  // un correo a quien la pidió para que la cree. La empresa queda activa sola
  // en cuanto lo hace.
  const activate = useResourceMutation(
    COMPANIES_ENDPOINT,
    "post",
    "Correo de activación enviado."
  );

  const approvingIsDemo = approving?.status === "DEMO_REQUESTED";

  const columns: Column<CompanyRequest>[] = [
    {
      key: "name",
      label: "Empresa",
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium">{companyLabel(row)}</div>
          {row.rfc && (
            <div className="font-mono text-[11px] uppercase text-[var(--ikk-fg-dim)]">
              {row.rfc}
            </div>
          )}
        </div>
      ),
      csv: (row) => companyLabel(row),
    },
    pending
      ? {
          key: "kind",
          label: "Pide",
          render: (row) => {
            const kind = companyRequestKind(row.status);
            return <Badge variant={kind.tone}>{kind.label}</Badge>;
          },
          csv: (row) => companyRequestKind(row.status).label,
        }
      : {
          key: "outcome",
          label: "Resultado",
          render: (row) => {
            const s = companyStatus(row.status);
            return <Badge variant={s.tone}>{s.label}</Badge>;
          },
          csv: (row) => companyStatus(row.status).label,
        },
    {
      key: "requestedBy",
      label: "Solicitante",
      render: (row) =>
        row.requestedBy ? (
          <div className="min-w-0">
            <div className="truncate">{fullName(row.requestedBy)}</div>
            <div className="truncate text-[11px] text-[var(--ikk-fg-dim)]">
              {row.requestedBy.email}
            </div>
          </div>
        ) : (
          // Sin solicitante: o se dio de alta desde el panel, o es una
          // solicitud vieja de antes de que se guardara quién la pedía.
          // Afirmar cuál de las dos sería inventar.
          <span
            className="text-[var(--ikk-fg-dim)]"
            title="Esta empresa no tiene registrado quién pidió el alta"
          >
            No registrado
          </span>
        ),
      csv: (row) =>
        row.requestedBy
          ? `${fullName(row.requestedBy)} <${row.requestedBy.email}>`
          : "",
    },
    {
      key: "contact",
      label: "Contacto",
      hideOnMobile: true,
      render: (row) => (
        <div className="min-w-0 text-[12px]">
          <div className="truncate">{row.email || "—"}</div>
          {row.phone && (
            <div className="truncate text-[var(--ikk-fg-dim)]">{row.phone}</div>
          )}
        </div>
      ),
      csv: (row) => [row.email, row.phone].filter(Boolean).join(" · "),
    },
    pending
      ? {
          key: "createdAt",
          label: "Recibida",
          render: (row) => (
            <div className="whitespace-nowrap">
              <div className="font-mono text-[12px] text-[var(--ikk-fg-muted)]">
                {formatDate(row.createdAt)}
              </div>
              <div className="text-[11px] text-[var(--ikk-fg-dim)]">
                {formatRelative(row.createdAt)}
              </div>
            </div>
          ),
          csv: (row) => formatDate(row.createdAt),
        }
      : {
          key: "requestClosedAt",
          label: "Resuelta",
          render: (row) => (
            <div className="min-w-0 max-w-[260px]">
              <div className="font-mono text-[12px] text-[var(--ikk-fg-muted)]">
                {formatDate(row.requestClosedAt)}
              </div>
              {row.statusReason && (
                <div
                  className="mt-1 line-clamp-2 text-[11px] text-[var(--ikk-fg-dim)]"
                  title={row.statusReason}
                >
                  Motivo: {row.statusReason}
                </div>
              )}
            </div>
          ),
          csv: (row) =>
            [formatDate(row.requestClosedAt), row.statusReason]
              .filter(Boolean)
              .join(" — "),
        },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Tickomium"
        title="Solicitudes"
        description="Altas de empresa pedidas desde la aplicación. Apruébalas para que puedan empezar a trabajar, o recházalas explicando por qué."
      />

      <DataTable
        columns={columns}
        rows={list.items}
        rowKey={(row) => row.id}
        isLoading={list.isLoading}
        error={list.error}
        emptyMessage={
          pending
            ? "No hay solicitudes esperando respuesta."
            : "Todavía no se ha resuelto ninguna solicitud."
        }
        search={list.search}
        onSearchChange={list.onSearchChange}
        searchPlaceholder="Buscar por nombre, RFC o correo…"
        filters={
          <Select
            aria-label="Ver solicitudes"
            className="h-9 w-auto"
            value={view}
            onChange={(e) => {
              setView(e.target.value);
              list.setPage(1);
            }}
            options={VIEWS}
          />
        }
        page={list.page}
        limit={list.limit}
        total={list.total}
        onPageChange={list.setPage}
        exportName={pending ? "solicitudes-pendientes" : "solicitudes-resueltas"}
        actions={(row) =>
          canWrite && pending ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                title={row.status === "DEMO_REQUESTED" ? "Activar empresa" : "Aprobar solicitud"}
                aria-label={
                  row.status === "DEMO_REQUESTED"
                    ? `Activar la empresa de ${row.name}`
                    : `Aprobar la solicitud de ${row.name}`
                }
                onClick={() => setApproving(row)}
              >
                <CheckCircle2 className="h-4 w-4 text-[var(--ikk-success)]" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title="Rechazar solicitud"
                aria-label={`Rechazar la solicitud de ${row.name}`}
                onClick={() => setRejecting(row)}
              >
                <XCircle className="h-4 w-4 text-[var(--ikk-danger)]" />
              </Button>
            </>
          ) : null
        }
      />

      <ConfirmDialog
        open={!!approving}
        onClose={() => setApproving(null)}
        onConfirm={() => {
          if (!approving) return;
          if (approvingIsDemo) {
            activate.mutate(
              { path: `${COMPANIES_ENDPOINT}/${approving.id}/activate` },
              { onSuccess: () => setApproving(null) }
            );
          } else {
            approve.mutate(
              {
                path: `${COMPANIES_ENDPOINT}/${approving.id}/status`,
                body: { status: "ACTIVE" },
              },
              { onSuccess: () => setApproving(null) }
            );
          }
        }}
        title={approvingIsDemo ? "Activar empresa" : "Aprobar solicitud"}
        highlight={approving ? companyLabel(approving) : undefined}
        consequence={
          approvingIsDemo ? (
            <p>
              Le enviamos un correo a{" "}
              {approving?.requestedBy ? (
                <strong>{requesterLabel(approving)}</strong>
              ) : (
                "quien pidió la demo"
              )}{" "}
              para que cree su contraseña. La empresa queda activa en cuanto la
              confirme — no hace falta volver a aprobarla.
            </p>
          ) : (
            <>
              <p>
                La empresa queda activa y{" "}
                {approving?.requestedBy ? (
                  <strong>{requesterLabel(approving)}</strong>
                ) : (
                  "quien la pidió"
                )}{" "}
                puede entrar al punto de venta, al inventario y a la caja.
              </p>
              <p className="mt-2">
                Queda sin plan ni vigencia: eso se asigna desde{" "}
                <strong>Empresas</strong>.
              </p>
            </>
          )
        }
        confirmLabel={approvingIsDemo ? "Enviar correo de activación" : "Aprobar solicitud"}
        loading={approvingIsDemo ? activate.isPending : approve.isPending}
      />

      {rejecting && (
        <RejectRequestDialog
          company={rejecting}
          onClose={() => setRejecting(null)}
        />
      )}
    </>
  );
}

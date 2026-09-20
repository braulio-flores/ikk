"use client";

// Rechazo de una solicitud de alta de empresa.
//
// Vive fuera de las páginas porque lo usan las dos que tocan solicitudes
// —Empresas y Solicitudes— y ambas invalidan el mismo listado, así que da
// igual desde cuál se rechace: las dos se refrescan.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Textarea } from "@/components/ui/field";
import { useResourceMutation } from "@/hooks/use-resource";
import { fullName } from "@/lib/labels";

/** Listado de empresas de Tickomium. Es la clave que invalidan las mutaciones. */
export const COMPANIES_ENDPOINT = "/tickomium/companies";

export const REJECT_REASON_MAX = 500;

export interface RejectableCompany {
  id: string;
  name: string;
  /** Quien pidió el alta desde Tickomium. */
  requestedBy?: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  } | null;
}

export function RejectRequestDialog({
  company,
  onClose,
}: {
  company: RejectableCompany;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const reject = useResourceMutation(
    COMPANIES_ENDPOINT,
    "post",
    "Solicitud rechazada."
  );
  const requester = company.requestedBy;

  return (
    <Modal
      open
      onClose={onClose}
      title="Rechazar solicitud"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={reject.isPending}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              reject.mutate(
                {
                  path: `${COMPANIES_ENDPOINT}/${company.id}/reject`,
                  body: { reason: reason.trim() || undefined },
                },
                { onSuccess: onClose }
              )
            }
            disabled={reject.isPending || reason.length > REJECT_REASON_MAX}
          >
            {reject.isPending ? "Rechazando…" : "Rechazar solicitud"}
          </Button>
        </>
      }
    >
      <p className="mb-3 text-2xl font-semibold tracking-tight">{company.name}</p>
      <div className="space-y-4 text-sm leading-relaxed text-[var(--ikk-fg-muted)]">
        <p>
          {requester ? (
            <>
              <strong>{fullName(requester)}</strong> ({requester.email}) deja de
              tener acceso a esta empresa
            </>
          ) : (
            "Quien la pidió deja de tener acceso a esta empresa"
          )}{" "}
          y le avisamos por correo. Su cuenta se conserva y puede enviar otra
          solicitud. La empresa queda aquí como solicitud rechazada.
        </p>
        <Field
          label="Motivo"
          hint={`Opcional. Se lo mostramos a quien la pidió. ${reason.length}/${REJECT_REASON_MAX}`}
        >
          <Textarea
            value={reason}
            rows={3}
            maxLength={REJECT_REASON_MAX}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Por ejemplo: no pudimos verificar los datos del negocio."
          />
        </Field>
      </div>
    </Modal>
  );
}

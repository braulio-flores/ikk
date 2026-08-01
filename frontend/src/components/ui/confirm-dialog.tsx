"use client";

// Confirmación obligatoria para toda acción consecuente (cambios de estado,
// suspensiones, bajas, envíos). Muestra el dato clave en grande y la
// consecuencia en español plano.

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  /** Frase corta y grande: el dato que el operador debe leer sí o sí. */
  highlight?: string;
  /** Qué va a pasar, en español plano. */
  consequence: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  highlight,
  consequence,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "primary",
  loading = false,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone} onClick={onConfirm} disabled={loading}>
            {loading ? "Aplicando…" : confirmLabel}
          </Button>
        </>
      }
    >
      {highlight && (
        <p className="mb-3 text-2xl font-semibold tracking-tight">{highlight}</p>
      )}
      <div className="text-sm leading-relaxed text-[var(--ikk-fg-muted)]">
        {consequence}
      </div>
    </Modal>
  );
}

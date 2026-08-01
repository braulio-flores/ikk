"use client";

// Modal propio (el proyecto no tiene Radix instalado).
// Cierra con Escape y con clic en el fondo, bloquea el scroll de atrás y
// devuelve el foco al elemento que lo abrió. En móvil entra como hoja
// desde abajo; en escritorio queda centrado.

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClass = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    // Foco al primer control del formulario.
    const timer = setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        "input, select, textarea, button"
      );
      focusable?.focus();
    }, 30);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      clearTimeout(timer);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={cn(
          "relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden border border-[var(--ikk-line)] bg-[var(--ikk-bg-card)] shadow-[var(--ikk-shadow-lg)]",
          "rounded-t-[var(--ikk-r-xl)] sm:rounded-[var(--ikk-r-xl)]",
          sizeClass[size]
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--ikk-line-soft)] px-5 py-4">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
            {description && (
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--ikk-fg-muted)]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-1 -mt-1 rounded-[var(--ikk-r-sm)] p-1.5 text-[var(--ikk-fg-muted)] transition-colors hover:bg-[var(--ikk-bg-hover)] hover:text-[var(--ikk-fg)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-[var(--ikk-line-soft)] px-5 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

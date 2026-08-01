"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/datetime";
import { productName } from "@/lib/labels";
import type { InboxItem, InboxResponse } from "@/lib/types";

const severityColor: Record<InboxItem["severity"], string> = {
  info: "var(--ikk-info)",
  warning: "var(--ikk-warn)",
  critical: "var(--ikk-danger)",
};

export function InboxBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer click fuera.
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Se refresca cada 60 s.
  const { data } = useQuery<InboxResponse>({
    queryKey: ["overview-inbox"],
    queryFn: () => apiGet<InboxResponse>("/overview/inbox"),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const total = data?.total ?? 0;
  const items = data?.items ?? [];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-[var(--ikk-r-md)] text-[var(--ikk-fg-muted)] transition-colors hover:bg-[var(--ikk-bg-hover)] hover:text-[var(--ikk-fg)]",
          open && "bg-[var(--ikk-bg-hover)] text-[var(--ikk-fg)]"
        )}
        aria-label="Inbox"
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--ikk-accent)] px-1 font-mono text-[10px] font-semibold text-[var(--ikk-accent-fg)]">
            {total > 99 ? "99+" : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-96 max-w-[90vw] overflow-hidden rounded-[var(--ikk-r-lg)] border border-[var(--ikk-line)] bg-[var(--ikk-bg-card)] shadow-[var(--ikk-shadow-lg)]">
          <div className="flex items-center justify-between border-b border-[var(--ikk-line-soft)] px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Bandeja</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--ikk-fg-muted)]">
                {total} pendiente{total === 1 ? "" : "s"}
              </div>
            </div>
            {data?.byProduct.some((b) => !b.ok) && (
              <span
                className="font-mono text-[10px] uppercase tracking-widest text-[var(--ikk-warn)]"
                title="Uno o más productos no responden"
              >
                servicio parcial
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-[var(--ikk-fg-muted)]">
                No hay nada pendiente.
              </div>
            ) : (
              items.map((item) => (
                <Link
                  key={item.id}
                  // La ruta la arma el producto hijo, así que no está en el
                  // mapa de rutas tipadas de Next.
                  href={item.actionUrl as Route}
                  onClick={() => setOpen(false)}
                  className="block border-b border-[var(--ikk-line-soft)] px-4 py-3 transition-colors last:border-b-0 hover:bg-[var(--ikk-bg-hover)]"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: severityColor[item.severity] }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium leading-tight">
                          {item.title}
                        </div>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[var(--ikk-fg-dim)]">
                          {productName(item.product)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--ikk-fg-muted)] leading-relaxed">
                        {item.message}
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-[var(--ikk-fg-dim)]">
                        {formatRelative(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

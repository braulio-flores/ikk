"use client";

// Tabla de datos del panel.
//
// Mobile-first: en pantallas chicas cada registro se dibuja como tarjeta con
// pares etiqueta/valor; a partir de `md` se convierte en tabla. Incluye
// búsqueda, paginación, exportación a CSV y estados de carga/error/vacío.

import { useMemo, type ReactNode } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fileStamp } from "@/lib/datetime";
import { apiErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  /** Contenido enriquecido de la celda. */
  render?: (row: T) => ReactNode;
  /** Texto plano para el CSV. Si falta, se usa el valor crudo del campo. */
  csv?: (row: T) => string;
  className?: string;
  /** Se oculta en la vista de tarjetas (móvil). */
  hideOnMobile?: boolean;
  align?: "left" | "right";
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  /** Identificador estable de cada fila (no se muestra nunca). */
  rowKey: (row: T) => string;
  isLoading?: boolean;
  error?: unknown;
  errorMessage?: string;
  emptyMessage?: string;

  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  filters?: ReactNode;

  page?: number;
  limit?: number;
  total?: number;
  onPageChange?: (page: number) => void;

  actions?: (row: T) => ReactNode;
  /** Nombre base del CSV; si no se pasa, no se ofrece exportar. */
  exportName?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  error,
  errorMessage = "No pudimos cargar la información. Puede que el producto esté fuera de línea.",
  emptyMessage = "Todavía no hay registros.",
  search,
  onSearchChange,
  searchPlaceholder = "Buscar…",
  filters,
  page = 1,
  limit = 50,
  total,
  onPageChange,
  actions,
  exportName,
}: Props<T>) {
  const totalCount = total ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const from = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalCount);

  const csvColumns = useMemo(
    () => columns.filter((c) => c.key !== "__actions"),
    [columns]
  );

  function exportCsv() {
    const header = csvColumns.map((c) => c.label);
    const body = rows.map((row) =>
      csvColumns.map((c) => {
        if (c.csv) return c.csv(row);
        const raw = (row as Record<string, unknown>)[c.key];
        return raw === null || raw === undefined ? "" : String(raw);
      })
    );

    const csv = [header, ...body]
      .map((line) =>
        line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportName}-${fileStamp()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const showToolbar = Boolean(onSearchChange || filters || exportName);

  return (
    <Card className="overflow-hidden">
      {showToolbar && (
        <div className="flex flex-col gap-3 border-b border-[var(--ikk-line-soft)] p-4 md:flex-row md:items-center">
          {onSearchChange && (
            <div className="relative w-full md:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ikk-fg-dim)]" />
              <input
                type="search"
                value={search ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-[var(--ikk-r-md)] border border-[var(--ikk-line)] bg-[var(--ikk-bg-elev)] pl-9 pr-3 text-sm outline-none placeholder:text-[var(--ikk-fg-dim)] focus:border-[var(--ikk-accent)] focus:ring-2 focus:ring-[var(--ikk-accent-soft)]"
              />
            </div>
          )}

          {filters && (
            <div className="flex flex-wrap items-center gap-2">{filters}</div>
          )}

          <div className="flex items-center gap-3 md:ml-auto">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ikk-fg-dim)]">
              {isLoading ? "cargando" : `${totalCount} registros`}
            </span>
            {exportName && rows.length > 0 && (
              <Button variant="secondary" size="sm" onClick={exportCsv}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Estados */}
      {isLoading ? (
        <TableSkeleton columns={columns.length} />
      ) : error ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm text-[var(--ikk-danger)]">
            {apiErrorMessage(error, errorMessage)}
          </p>
          <p className="mt-1 text-[13px] text-[var(--ikk-fg-muted)]">
            No se muestra información parcial: revisa el estado del producto en
            Configuración → Productos.
          </p>
        </div>
      ) : rows.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-[var(--ikk-fg-muted)]">
          {emptyMessage}
        </p>
      ) : (
        <>
          {/* Tarjetas (móvil) */}
          <ul className="divide-y divide-[var(--ikk-line-soft)] md:hidden">
            {rows.map((row) => (
              <li key={rowKey(row)} className="space-y-2 p-4">
                {columns
                  .filter((c) => !c.hideOnMobile && c.key !== "__actions")
                  .map((c, i) => (
                    <div
                      key={c.key}
                      className={cn(
                        "flex items-start justify-between gap-4",
                        i === 0 && "pb-1"
                      )}
                    >
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-[var(--ikk-fg-dim)]">
                        {c.label}
                      </span>
                      <span
                        className={cn(
                          "min-w-0 break-words text-right text-sm",
                          i === 0 && "font-medium"
                        )}
                      >
                        {c.render ? c.render(row) : plain(row, c.key)}
                      </span>
                    </div>
                  ))}
                {actions && (
                  <div className="flex flex-wrap justify-end gap-2 pt-1">
                    {actions(row)}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Tabla (escritorio) */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--ikk-line-soft)] text-left font-mono text-[10px] uppercase tracking-widest text-[var(--ikk-fg-dim)]">
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className={cn(
                        "px-4 py-3 font-normal",
                        c.align === "right" && "text-right"
                      )}
                    >
                      {c.key === "__actions" ? "" : c.label}
                    </th>
                  ))}
                  {actions && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className="border-b border-[var(--ikk-line-soft)] transition-colors last:border-0 hover:bg-[var(--ikk-bg-hover)]/40"
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={cn(
                          "px-4 py-3 align-middle",
                          c.align === "right" && "text-right",
                          c.className
                        )}
                      >
                        {c.render ? c.render(row) : plain(row, c.key)}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Paginación */}
      {onPageChange && totalCount > limit && (
        <div className="flex flex-col items-center gap-3 border-t border-[var(--ikk-line-soft)] p-4 sm:flex-row sm:justify-between">
          <p className="text-[13px] text-[var(--ikk-fg-muted)]">
            Mostrando {from}–{to} de {totalCount}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <span className="font-mono text-[11px] text-[var(--ikk-fg-dim)]">
              {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function plain<T>(row: T, key: string): ReactNode {
  const value = (row as Record<string, unknown>)[key];
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "object") return "—";
  return String(value);
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="divide-y divide-[var(--ikk-line-soft)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-4">
          {Array.from({ length: Math.min(columns, 5) }).map((__, j) => (
            <div
              key={j}
              className="h-3 flex-1 animate-pulse rounded-full bg-[var(--ikk-bg-hover)]"
              style={{ animationDelay: `${(i + j) * 60}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:mb-6 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ikk-fg-dim)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--ikk-fg-muted)]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 md:shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

"use client";

import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--ikk-fg-muted)]">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-[12px] text-[var(--ikk-danger)]">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[12px] text-[var(--ikk-fg-dim)]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

const controlClass =
  "w-full rounded-[var(--ikk-r-md)] border border-[var(--ikk-line)] bg-[var(--ikk-bg-elev)] px-3 text-sm text-[var(--ikk-fg)] outline-none transition placeholder:text-[var(--ikk-fg-dim)] focus:border-[var(--ikk-accent)] focus:ring-2 focus:ring-[var(--ikk-accent-soft)] disabled:opacity-60";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: ReadonlyArray<{ value: string; label: string }>;
    placeholder?: string;
  }
>(({ className, options, placeholder, ...props }, ref) => (
  <select ref={ref} className={cn(controlClass, "h-10 pr-8", className)} {...props}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
));
Select.displayName = "Select";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(controlClass, "py-2.5 leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

/** Interruptor sí/no accesible sin dependencias externas. */
export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={id} className="text-sm text-[var(--ikk-fg)]">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors disabled:opacity-50",
          checked
            ? "border-[var(--ikk-accent)] bg-[var(--ikk-accent)]"
            : "border-[var(--ikk-line)] bg-[var(--ikk-bg-elev)]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
          style={{ height: 18, width: 18 }}
        />
      </button>
    </div>
  );
}

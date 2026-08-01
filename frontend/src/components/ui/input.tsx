"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-[var(--ikk-r-md)] border border-[var(--ikk-line)] bg-[var(--ikk-bg-card)] px-3 text-sm text-[var(--ikk-fg)] outline-none transition placeholder:text-[var(--ikk-fg-dim)] focus:border-[var(--ikk-accent)] focus:ring-2 focus:ring-[var(--ikk-accent-soft)]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

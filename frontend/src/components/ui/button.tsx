"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ikk-accent-soft)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--ikk-accent)] text-[var(--ikk-accent-fg)] hover:bg-[var(--ikk-accent-hover)]",
        secondary:
          "bg-[var(--ikk-bg-card)] text-[var(--ikk-fg)] border border-[var(--ikk-line)] hover:bg-[var(--ikk-bg-hover)]",
        ghost:
          "bg-transparent text-[var(--ikk-fg)] hover:bg-[var(--ikk-bg-hover)]",
        danger:
          "bg-[var(--ikk-danger)] text-white hover:opacity-90",
      },
      size: {
        sm: "h-8 px-2.5 text-[13px] rounded-[var(--ikk-r-sm)]",
        md: "h-9 px-4 text-sm rounded-[var(--ikk-r-md)]",
        lg: "h-11 px-5 text-[15px] rounded-[var(--ikk-r-md)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

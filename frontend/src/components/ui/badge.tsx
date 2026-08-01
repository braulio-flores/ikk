import { cn } from "@/lib/utils";

type BadgeVariant = "active" | "trial" | "suspend" | "overdue" | "neutral";

const variantClass: Record<BadgeVariant, string> = {
  active: "ikk-badge ikk-badge--active",
  trial: "ikk-badge ikk-badge--trial",
  suspend: "ikk-badge ikk-badge--suspend",
  overdue: "ikk-badge ikk-badge--overdue",
  neutral: "ikk-badge ikk-badge--neutral",
};

export function Badge({
  variant = "neutral",
  children,
  className,
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(variantClass[variant], className)}>{children}</span>
  );
}

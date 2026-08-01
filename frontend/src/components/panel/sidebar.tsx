"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Bell,
  Store,
  Settings2,
  Stethoscope,
  ShieldCheck,
  KeyRound,
  FileText,
  Inbox,
  ChevronRight,
} from "lucide-react";
import { IkkLogo } from "@/components/logo";
import { cn } from "@/lib/utils";

interface Item {
  href: Route;
  label: string;
  icon: typeof LayoutDashboard;
}

interface NavSection {
  label: string;
  items: Item[];
}

const primary: Item[] = [
  { href: "/panel/overview", label: "Resumen", icon: LayoutDashboard },
  { href: "/panel/leads", label: "Prospectos", icon: Inbox },
];

const sections: NavSection[] = [
  {
    label: "Tickomium",
    items: [
      { href: "/panel/tickomium/companies", label: "Empresas", icon: Building2 },
      { href: "/panel/tickomium/users", label: "Usuarios", icon: Users },
      { href: "/panel/tickomium/plans", label: "Planes", icon: CreditCard },
      { href: "/panel/tickomium/permissions", label: "Permisos", icon: KeyRound },
      {
        href: "/panel/tickomium/notifications",
        label: "Notificaciones",
        icon: Bell,
      },
    ],
  },
  {
    label: "Formate",
    items: [
      { href: "/panel/formate/tenants", label: "Tenants", icon: Store },
      { href: "/panel/formate/users", label: "Usuarios", icon: Users },
      { href: "/panel/formate/config", label: "Configuración", icon: Settings2 },
    ],
  },
  {
    label: "mDoc",
    items: [
      { href: "/panel/mdoc/clinics", label: "Clínicas", icon: Stethoscope },
      { href: "/panel/mdoc/doctors", label: "Doctores", icon: Users },
      { href: "/panel/mdoc/audit", label: "Auditoría", icon: ShieldCheck },
    ],
  },
  {
    label: "Configuración",
    items: [
      { href: "/panel/settings/operators", label: "Operadores", icon: Users },
      { href: "/panel/settings/products", label: "Productos", icon: Settings2 },
      { href: "/panel/settings/audit-log", label: "Bitácora", icon: FileText },
    ],
  },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-[var(--ikk-line-soft)] px-5">
        <IkkLogo size={24} />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        <div className="space-y-0.5">
          {primary.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {sections.map((section) => (
          <div key={section.label}>
            <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ikk-fg-dim)]">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

function NavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: Item;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-[var(--ikk-r-md)] px-2.5 py-2 text-sm transition-colors",
        active
          ? "bg-[var(--ikk-bg-hover)] text-[var(--ikk-fg)]"
          : "text-[var(--ikk-fg-muted)] hover:bg-[var(--ikk-bg-hover)]/60 hover:text-[var(--ikk-fg)]"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {active && <ChevronRight className="h-3 w-3 opacity-60" />}
    </Link>
  );
}

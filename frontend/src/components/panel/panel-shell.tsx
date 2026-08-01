"use client";

// Estructura del panel: barra lateral fija en escritorio y cajón deslizable en
// móvil. El botón de menú vive en el topbar y comparte el estado desde acá.

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "@/components/panel/sidebar";
import { Topbar } from "@/components/panel/topbar";
import { cn } from "@/lib/utils";

export function PanelShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Cambiar de sección cierra el cajón.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = menuOpen ? "hidden" : overflow;
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-dvh">
      {/* Escritorio */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--ikk-line-soft)] bg-[var(--ikk-bg-elev)]/50 lg:block">
        <div className="sticky top-0 h-dvh">
          <SidebarNav />
        </div>
      </aside>

      {/* Móvil */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] border-r border-[var(--ikk-line)] bg-[var(--ikk-bg-elev)] transition-transform duration-200",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarNav onNavigate={() => setMenuOpen(false)} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-7">{children}</main>
      </div>
    </div>
  );
}

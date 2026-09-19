"use client";

// Navegación pública. NO contiene NUNCA enlaces a la ruta de acceso ni a /panel:
// es una regla dura del proyecto.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { IkkLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#productos", label: "Productos" },
  { href: "/#proceso", label: "Proceso" },
  { href: "/#stack", label: "Tecnología" },
];

export function NavPublic() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = open ? "hidden" : overflow;
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--ikk-line-soft)] bg-[var(--ikk-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" aria-label="IKK Solutions — inicio">
          <IkkLogo />
        </Link>

        <nav className="hidden gap-7 text-sm text-[var(--ikk-fg-muted)] md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[var(--ikk-fg)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="hidden sm:block">
            <Button size="sm">Hablemos</Button>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="-mr-1 rounded-[var(--ikk-r-md)] p-2 text-[var(--ikk-fg-muted)] transition-colors hover:bg-[var(--ikk-bg-hover)] hover:text-[var(--ikk-fg)] md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={cn(
          "overflow-hidden border-t border-[var(--ikk-line-soft)] bg-[var(--ikk-bg)] transition-[max-height] duration-200 md:hidden",
          open ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <nav className="flex flex-col px-5 py-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-[var(--ikk-line-soft)] py-3 text-[15px] text-[var(--ikk-fg-muted)] last:border-0 hover:text-[var(--ikk-fg)]"
            >
              {l.label}
            </a>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="py-3">
            <Button size="lg" className="w-full">
              Hablemos de tu proyecto
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

import type { ReactNode } from "react";
import { NavPublic } from "@/components/marketing/nav-public";
import { FooterPublic } from "@/components/marketing/footer-public";

// REGLA DURA: este layout NO importa nada de (auth) ni (panel) y NO contiene
// enlaces a la ruta de acceso ni a /panel. La superficie privada no se anuncia.

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavPublic />
      <main className="flex-1">{children}</main>
      <FooterPublic />
    </div>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SessionProvider } from "@/components/panel/session";
import { PanelShell } from "@/components/panel/panel-shell";

export const metadata: Metadata = {
  title: "Panel · IKK",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <PanelShell>{children}</PanelShell>
    </SessionProvider>
  );
}

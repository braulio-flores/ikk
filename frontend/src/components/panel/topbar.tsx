"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { InboxBell } from "@/components/panel/inbox-bell";
import { useSession } from "@/components/panel/session";
import { operatorRole } from "@/lib/labels";
import { ACCESS_PATH } from "@/lib/routes";
import { IkkMark } from "@/components/logo";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const router = useRouter();
  const { operator } = useSession();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [leaving, setLeaving] = useState(false);

  async function logout() {
    setLeaving(true);
    await apiPost("/auth/logout").catch(() => undefined);
    router.replace(ACCESS_PATH);
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-[var(--ikk-line-soft)] bg-[var(--ikk-bg)]/85 px-4 backdrop-blur-md sm:px-5">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menú"
          className="-ml-1 rounded-[var(--ikk-r-md)] p-2 text-[var(--ikk-fg-muted)] transition-colors hover:bg-[var(--ikk-bg-hover)] hover:text-[var(--ikk-fg)] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="lg:hidden">
          <IkkMark size={22} />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <InboxBell />

          {operator && (
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium leading-tight">
                {operator.name}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--ikk-fg-dim)]">
                {operatorRole(operator.role)}
              </div>
            </div>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setConfirmLogout(true)}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={logout}
        loading={leaving}
        title="Cerrar sesión"
        consequence="Vas a salir del panel. Para volver a entrar necesitarás tus credenciales de operador."
        confirmLabel="Cerrar sesión"
      />
    </>
  );
}

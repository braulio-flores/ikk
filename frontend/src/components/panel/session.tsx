"use client";

// Sesión del operador dentro del panel.
//
// Una sola llamada a /auth/me para todo el panel: el topbar muestra quién es y
// las páginas preguntan `canWrite` para esconder o deshabilitar acciones. Un
// VIEWER navega igual, pero sin botones de escritura.

import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { Operator } from "@/lib/types";

interface SessionValue {
  operator: Operator | null;
  isLoading: boolean;
  canWrite: boolean;
  isSuperAdmin: boolean;
}

const SessionContext = createContext<SessionValue>({
  operator: null,
  isLoading: true,
  canWrite: false,
  isSuperAdmin: false,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth-me"],
    queryFn: () => apiGet<{ operator: Operator }>("/auth/me"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isError) {
    // La cookie ya no vale: fuera del panel.
    if (typeof window !== "undefined") router.replace("/login");
  }

  const operator = data?.operator ?? null;

  return (
    <SessionContext.Provider
      value={{
        operator,
        isLoading,
        canWrite: operator?.role === "SUPER_ADMIN" || operator?.role === "ADMIN",
        isSuperAdmin: operator?.role === "SUPER_ADMIN",
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  return useContext(SessionContext);
}

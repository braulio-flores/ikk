"use client";

// Acceso genérico a los listados del panel.
//
// Todos los endpoints de IKK responden { items, total, page, limit } (los del
// propio IKK y los que delega a Tickomium / Formate / mDoc), así que una sola
// pieza cubre a todos y las páginas se quedan con la lógica de negocio.

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

interface ListOptions {
  limit?: number;
  /** Filtros extra que viajan como query string. */
  params?: Record<string, string | undefined>;
  enabled?: boolean;
}

export function useResourceList<T>(endpoint: string, options: ListOptions = {}) {
  const { limit = 25, params = {}, enabled = true } = options;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const query = useQuery<ListResponse<T>>({
    queryKey: [endpoint, debouncedSearch, page, limit, params],
    enabled,
    queryFn: async () => {
      const qs = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
        ),
      });
      const data = await apiGet<Partial<ListResponse<T>>>(`${endpoint}?${qs}`);
      return {
        items: data.items ?? [],
        total: data.total ?? data.items?.length ?? 0,
        page: data.page ?? page,
        limit: data.limit ?? limit,
      };
    },
  });

  function onSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  return {
    ...query,
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    page,
    limit,
    setPage,
    search,
    onSearchChange,
    /** Clave base para invalidar desde una mutación. */
    queryKey: endpoint,
  };
}

type MutationInput = { path?: string; body?: unknown };

/**
 * Mutaciones sobre un recurso. `invalidate` es la clave base del listado
 * (el mismo endpoint que usa useResourceList).
 */
export function useResourceMutation(
  invalidate: string | string[],
  method: "post" | "patch" | "delete",
  successMessage: string
): UseMutationResult<unknown, unknown, MutationInput> {
  const queryClient = useQueryClient();
  const keys = Array.isArray(invalidate) ? invalidate : [invalidate];

  return useMutation({
    mutationFn: ({ path = "", body }: MutationInput) => {
      if (method === "post") return apiPost(path, body);
      if (method === "patch") return apiPatch(path, body);
      return apiDelete(path);
    },
    onSuccess: () => {
      keys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key], exact: false })
      );
      toast.success(successMessage);
    },
    onError: (error: unknown) => {
      toast.error(apiErrorMessage(error));
    },
  });
}

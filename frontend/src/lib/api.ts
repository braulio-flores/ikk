// Cliente HTTP de IKK Solutions.
//
// Reglas:
//   - withCredentials: true (cookies HTTP-only del backend).
//   - Si una request devuelve 401, intentamos UN refresh y reintentamos.
//   - Si el refresh falla, redirigimos a la pantalla de acceso.
//   - Single-flight: si hay un refresh en curso, las demás requests esperan.

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { ACCESS_PATH } from "./routes";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4100/ikk";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

// =========================================================================
//   Refresh single-flight
// =========================================================================
let refreshPromise: Promise<void> | null = null;

async function performRefresh(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        // Pequeño microtask delay para que las requests en cola arranquen.
        setTimeout(() => {
          refreshPromise = null;
        }, 0);
      });
  }
  await refreshPromise;
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/refresh") &&
      !original.url?.includes("/auth/login")
    ) {
      original._retry = true;
      try {
        await performRefresh();
        return api.request(original as AxiosRequestConfig);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = ACCESS_PATH;
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// =========================================================================
//   Helpers tipados
// =========================================================================
export async function apiGet<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await api.get<T>(path, config);
  return data;
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await api.post<T>(path, body, config);
  return data;
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await api.patch<T>(path, body, config);
  return data;
}

export async function apiDelete<T>(
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await api.delete<T>(path, config);
  return data;
}

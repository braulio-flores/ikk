import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { HttpError } from "../../utils/HttpError";

export interface BaseClientOptions {
  baseUrl: string;
  serviceToken: string;
  productName: string;
}

export interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
}

export class BaseProductClient {
  protected readonly axios: AxiosInstance;
  protected readonly productName: string;

  constructor(opts: BaseClientOptions) {
    this.productName = opts.productName;
    this.axios = axios.create({
      baseURL: opts.baseUrl,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor: Authorization header
    this.axios.interceptors.request.use((config) => {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${opts.serviceToken}`;
      return config;
    });

    // Response interceptor: map axios errors to HttpError
    this.axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status ?? 502;
        const data = error.response?.data as { message?: string; code?: string } | undefined;
        const message = data?.message ?? this.fallbackMessage(error);
        const code = data?.code ?? "PRODUCT_CLIENT_ERROR";
        throw new HttpError(status, message, code);
      }
    );
  }

  /** Mensaje para cuando el producto no manda uno propio. */
  private fallbackMessage(error: AxiosError): string {
    if (!error.response) {
      return `No pudimos conectar con ${this.productName}. Puede que esté fuera de línea.`;
    }
    // Express responde 404 sin cuerpo JSON cuando la ruta no existe: el panel
    // ya usa una función que la versión publicada del producto aún no tiene.
    if (error.response.status === 404) {
      return `${this.productName} todavía no tiene esta función publicada. Actualiza su versión e inténtalo de nuevo.`;
    }
    return `Error comunicándose con el servicio ${this.productName}`;
  }

  protected async request<T>(opts: RequestOptions): Promise<T> {
    const config: AxiosRequestConfig = {
      method: opts.method,
      url: opts.path,
      params: opts.query,
      data: opts.body,
    };
    const res = await this.axios.request<T>(config);
    return res.data;
  }
}

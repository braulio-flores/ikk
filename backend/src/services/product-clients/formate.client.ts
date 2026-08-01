import { BaseProductClient, BaseClientOptions } from "./base-client";

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  [k: string]: unknown;
}

export class FormateClient extends BaseProductClient {
  constructor(opts: Omit<BaseClientOptions, "productName">) {
    super({ ...opts, productName: "Formate" });
  }

  // Tenants
  listTenants(query?: ListQuery): Promise<unknown> {
    return this.request({ method: "GET", path: "/management/tenants", query });
  }

  createTenant(body: unknown): Promise<unknown> {
    return this.request({ method: "POST", path: "/management/tenants", body });
  }

  getTenant(id: string): Promise<unknown> {
    return this.request({ method: "GET", path: `/management/tenants/${id}` });
  }

  updateTenant(id: string, body: unknown): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/tenants/${id}`,
      body,
    });
  }

  deleteTenant(id: string): Promise<unknown> {
    return this.request({ method: "DELETE", path: `/management/tenants/${id}` });
  }

  // Users
  listUsersByTenant(tenantId: string, query?: ListQuery): Promise<unknown> {
    return this.request({
      method: "GET",
      path: `/management/tenants/${tenantId}/users`,
      query,
    });
  }

  attachUserToTenant(tenantId: string, body: unknown): Promise<unknown> {
    return this.request({
      method: "POST",
      path: `/management/tenants/${tenantId}/users`,
      body,
    });
  }

  /**
   * Inbox (eventos accionables). El endpoint todavía no existe en Formate;
   * cuando se implemente, será GET /api/management/inbox. Mientras tanto
   * devolvemos un payload vacío para que el agregador no rompa.
   */
  getInbox(_query?: ListQuery): Promise<{ items: never[]; total: 0 }> {
    return Promise.resolve({ items: [], total: 0 });
  }

  // Config
  getTenantConfig(tenantId: string): Promise<unknown> {
    return this.request({
      method: "GET",
      path: `/management/tenants/${tenantId}/config`,
    });
  }

  updateTenantConfig(tenantId: string, body: unknown): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/tenants/${tenantId}/config`,
      body,
    });
  }
}

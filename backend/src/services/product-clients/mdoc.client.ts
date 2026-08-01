import { BaseProductClient, BaseClientOptions } from "./base-client";

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  [k: string]: unknown;
}

export class MdocClient extends BaseProductClient {
  constructor(opts: Omit<BaseClientOptions, "productName">) {
    super({ ...opts, productName: "mDoc" });
  }

  // Clinics
  listClinics(query?: ListQuery): Promise<unknown> {
    return this.request({ method: "GET", path: "/management/clinics", query });
  }

  createClinic(body: unknown): Promise<unknown> {
    return this.request({ method: "POST", path: "/management/clinics", body });
  }

  getClinic(id: string): Promise<unknown> {
    return this.request({ method: "GET", path: `/management/clinics/${id}` });
  }

  updateClinic(id: string, body: unknown): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/clinics/${id}`,
      body,
    });
  }

  suspendClinic(id: string, body?: { reason?: string }): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/clinics/${id}/suspend`,
      body,
    });
  }

  // Doctors
  listDoctors(query?: ListQuery): Promise<unknown> {
    return this.request({ method: "GET", path: "/management/doctors", query });
  }

  createDoctor(body: unknown): Promise<unknown> {
    return this.request({ method: "POST", path: "/management/doctors", body });
  }

  updateDoctor(id: string, body: unknown): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/doctors/${id}`,
      body,
    });
  }

  /**
   * Inbox (eventos accionables). El endpoint todavía no existe en mDoc;
   * cuando se implemente, será GET /mdoc/management/inbox. Mientras tanto
   * devolvemos un payload vacío.
   */
  getInbox(_query?: ListQuery): Promise<{ items: never[]; total: 0 }> {
    return Promise.resolve({ items: [], total: 0 });
  }

  // Access logs (audit del hijo)
  listAccessLogs(query?: ListQuery): Promise<unknown> {
    return this.request({
      method: "GET",
      path: "/management/audit/access-logs",
      query,
    });
  }
}

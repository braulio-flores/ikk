import { BaseProductClient, BaseClientOptions } from "./base-client";

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  [k: string]: unknown;
}

export class TickomiumClient extends BaseProductClient {
  constructor(opts: Omit<BaseClientOptions, "productName">) {
    super({ ...opts, productName: "Tickomium" });
  }

  // -----------------------------------------------------------------------
  //   Companies
  // -----------------------------------------------------------------------
  listCompanies(query?: ListQuery): Promise<unknown> {
    return this.request({ method: "GET", path: "/management/companies", query });
  }

  getCompany(id: string): Promise<unknown> {
    return this.request({ method: "GET", path: `/management/companies/${id}` });
  }

  createCompany(body: unknown): Promise<unknown> {
    return this.request({ method: "POST", path: "/management/companies", body });
  }

  updateCompany(id: string, body: unknown): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/companies/${id}`,
      body,
    });
  }

  updateCompanyStatus(id: string, body: { status: string }): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/companies/${id}/status`,
      body,
    });
  }

  extendSubscription(
    id: string,
    body: { months?: number }
  ): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/companies/${id}/extend-subscription`,
      body,
    });
  }

  createCompanyUser(id: string, body: unknown): Promise<unknown> {
    return this.request({
      method: "POST",
      path: `/management/companies/${id}/users`,
      body,
    });
  }

  // -----------------------------------------------------------------------
  //   Users
  // -----------------------------------------------------------------------
  listUsers(query?: ListQuery): Promise<unknown> {
    return this.request({ method: "GET", path: "/management/users", query });
  }

  createUser(body: unknown): Promise<unknown> {
    return this.request({ method: "POST", path: "/management/users", body });
  }

  updateUser(id: string, body: unknown): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/users/${id}`,
      body,
    });
  }

  deleteUser(id: string): Promise<unknown> {
    return this.request({ method: "DELETE", path: `/management/users/${id}` });
  }

  // -----------------------------------------------------------------------
  //   Plans
  // -----------------------------------------------------------------------
  listPlans(query?: ListQuery): Promise<unknown> {
    return this.request({ method: "GET", path: "/management/plans", query });
  }

  createPlan(body: unknown): Promise<unknown> {
    return this.request({ method: "POST", path: "/management/plans", body });
  }

  updatePlan(id: string, body: unknown): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/plans/${id}`,
      body,
    });
  }

  deletePlan(id: string): Promise<unknown> {
    return this.request({ method: "DELETE", path: `/management/plans/${id}` });
  }

  /**
   * Marca pago validado para una empresa: status=ACTIVE + planExpiresAt += 1 mes.
   */
  validatePayment(companyId: string): Promise<unknown> {
    return this.request({
      method: "POST",
      path: `/management/plans/companies/${companyId}/validate-payment`,
    });
  }

  // -----------------------------------------------------------------------
  //   Permissions (catálogo global)
  // -----------------------------------------------------------------------
  listPermissions(query?: ListQuery): Promise<unknown> {
    return this.request({
      method: "GET",
      path: "/management/permissions",
      query,
    });
  }

  createPermission(body: unknown): Promise<unknown> {
    return this.request({
      method: "POST",
      path: "/management/permissions",
      body,
    });
  }

  updatePermission(id: string, body: unknown): Promise<unknown> {
    return this.request({
      method: "PATCH",
      path: `/management/permissions/${id}`,
      body,
    });
  }

  deletePermission(id: string): Promise<unknown> {
    return this.request({
      method: "DELETE",
      path: `/management/permissions/${id}`,
    });
  }

  // -----------------------------------------------------------------------
  //   Notifications
  // -----------------------------------------------------------------------
  sendAdminNotification(body: unknown): Promise<unknown> {
    return this.request({
      method: "POST",
      path: "/management/notifications/send",
      body,
    });
  }

  // -----------------------------------------------------------------------
  //   Inbox (eventos accionables para el operador master)
  // -----------------------------------------------------------------------
  getInbox(query?: ListQuery): Promise<InboxResponse> {
    return this.request<InboxResponse>({
      method: "GET",
      path: "/management/inbox",
      query,
    });
  }
}

export interface InboxItem {
  id: string;
  product: "TICKOMIUM" | "FORMATE" | "MDOC";
  type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  targetId: string;
  actionUrl: string;
  createdAt: string;
}

export interface InboxResponse {
  items: InboxItem[];
  total: number;
  counts?: Record<string, number>;
}

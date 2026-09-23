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

  /** Suma un usuario existente a la empresa con un rol de la propia empresa. */
  addCompanyUser(id: string, body: AddCompanyUserBody): Promise<CompanyMember> {
    return this.request<CompanyMember>({
      method: "POST",
      path: `/management/companies/${id}/users`,
      body,
    });
  }

  /**
   * Rechaza una solicitud de alta. La empresa queda como "solicitud
   * rechazada", sin miembros, y a quien la pidió le llega el motivo.
   */
  rejectCompanyRequest(id: string, body: { reason?: string }): Promise<RejectedCompany> {
    return this.request<RejectedCompany>({
      method: "POST",
      path: `/management/companies/${id}/reject`,
      body,
    });
  }

  /** Quita al usuario de la empresa; su cuenta se conserva. */
  removeCompanyUser(id: string, userId: string): Promise<RemoveCompanyUserResponse> {
    return this.request<RemoveCompanyUserResponse>({
      method: "DELETE",
      path: `/management/companies/${id}/users/${userId}`,
    });
  }

  /**
   * Aprueba una demo: le manda a quien la pidió un correo para crear su
   * contraseña. La empresa queda en PENDING_EMAIL_VALIDATION hasta que la usa.
   */
  activateCompanyRequest(id: string): Promise<unknown> {
    return this.request({
      method: "POST",
      path: `/management/companies/${id}/activate`,
    });
  }

  /** Borrado real. Sólo funciona con empresas sin actividad registrada. */
  deleteCompany(id: string): Promise<{ ok: boolean; id: string }> {
    return this.request<{ ok: boolean; id: string }>({
      method: "DELETE",
      path: `/management/companies/${id}`,
    });
  }

  /**
   * TEMPORAL: repara empresas que se quedaron con un administrador sin rol
   * (bug ya corregido en el registro público de Tickomium). Quitar junto con
   * el botón de IKK una vez reparadas las empresas afectadas.
   */
  repairAdminRole(id: string): Promise<{ ok: boolean; repaired: number; message?: string }> {
    return this.request<{ ok: boolean; repaired: number; message?: string }>({
      method: "POST",
      path: `/management/companies/${id}/repair-admin-role`,
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

interface MemberUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
}

export interface AddCompanyUserBody {
  userId: string;
  companyRoleId?: string | null;
  /** Rol base en la empresa: "ADMIN" (la administra) o "EMPLOYEE". */
  role?: "ADMIN" | "EMPLOYEE";
}

export interface CompanyMember {
  userId: string;
  companyId: string;
  role: string;
  companyRoleId: string | null;
  user: MemberUser;
  companyRole: { id: string; name: string } | null;
}

export interface RejectedCompany {
  id: string;
  name: string;
  status: string;
  statusReason: string | null;
  requestClosedAt: string;
  requestedBy: MemberUser | null;
}

export interface RemoveCompanyUserResponse {
  ok: boolean;
  user: MemberUser;
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

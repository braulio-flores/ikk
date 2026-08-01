// Tipos compartidos del frontend.

export type OperatorRole = "SUPER_ADMIN" | "ADMIN" | "VIEWER";

export interface Operator {
  id: string;
  name: string;
  email: string;
  role: OperatorRole;
  isActive: boolean;
  createdAt: string;
}

export type ProductKey = "TICKOMIUM" | "FORMATE" | "MDOC" | "IKK";

export interface ApiError {
  message: string;
  code?: string;
  detail?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface KPIStat {
  product: "TICKOMIUM" | "FORMATE" | "MDOC";
  ok: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export interface InboxItem {
  id: string;
  product: ProductKey;
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
  byProduct: Array<{
    product: "TICKOMIUM" | "FORMATE" | "MDOC";
    ok: boolean;
    total: number;
    error?: string;
  }>;
}

export interface AuditLogEntry {
  id: string;
  operatorId: string | null;
  product: ProductKey;
  action: string;
  targetId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
  operator?: { id: string; name: string; email: string } | null;
}

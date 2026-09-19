// Traducción de códigos internos a lenguaje humano.
//
// Regla del proyecto: en la interfaz nunca aparece un enum crudo
// (PENDING_ACTIVATION), ni un identificador de base de datos. Todo lo que lee
// el operador pasa por acá.

export type BadgeTone = "active" | "trial" | "suspend" | "overdue" | "neutral";

// ---------------------------------------------------------------------------
// Empresas de Tickomium (enum CompanyStatus del hijo)
// ---------------------------------------------------------------------------
const COMPANY_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: "Activa", tone: "active" },
  PENDING_PAYMENT: { label: "Pago pendiente", tone: "overdue" },
  PENDING_ACTIVATION: { label: "Por activar", tone: "trial" },
  DEMO_REQUESTED: { label: "Demo solicitada", tone: "trial" },
  SUSPENDED: { label: "Suspendida", tone: "suspend" },
  BLOCKED: { label: "Bloqueada", tone: "overdue" },
  INACTIVE: { label: "Inactiva", tone: "neutral" },
  EXPIRED: { label: "Vencida", tone: "overdue" },
  PENDING_DELETION: { label: "Baja solicitada", tone: "suspend" },
};

/** Estados que el operador puede asignar desde el panel. */
export const COMPANY_STATUS_OPTIONS = Object.entries(COMPANY_STATUS).map(
  ([value, { label }]) => ({ value, label })
);

export function companyStatus(value: unknown): { label: string; tone: BadgeTone } {
  const key = String(value ?? "");
  return COMPANY_STATUS[key] ?? { label: humanize(key), tone: "neutral" };
}

/**
 * Rol base de alguien dentro de una empresa de Tickomium. Lo que puede hacer lo
 * define su rol de la empresa; el base sólo dice si la administra. OWNER viene
 * de datos viejos y equivale a administrador.
 */
export function isCompanyAdmin(role: unknown): boolean {
  return role === "ADMIN" || role === "OWNER";
}

// ---------------------------------------------------------------------------
// Operadores de IKK
// ---------------------------------------------------------------------------
export const OPERATOR_ROLES = [
  { value: "SUPER_ADMIN", label: "Super administrador" },
  { value: "ADMIN", label: "Administrador" },
  { value: "VIEWER", label: "Sólo lectura" },
] as const;

export function operatorRole(value: unknown): string {
  return (
    OPERATOR_ROLES.find((r) => r.value === value)?.label ?? humanize(String(value ?? ""))
  );
}

// ---------------------------------------------------------------------------
// Prospectos del formulario público
// ---------------------------------------------------------------------------
export const LEAD_STATUSES = [
  { value: "NEW", label: "Nuevo" },
  { value: "IN_PROGRESS", label: "En conversación" },
  { value: "WON", label: "Ganado" },
  { value: "ARCHIVED", label: "Archivado" },
] as const;

const LEAD_TONE: Record<string, BadgeTone> = {
  NEW: "trial",
  IN_PROGRESS: "neutral",
  WON: "active",
  ARCHIVED: "suspend",
};

export function leadStatus(value: unknown): { label: string; tone: BadgeTone } {
  const key = String(value ?? "");
  return {
    label: LEAD_STATUSES.find((s) => s.value === key)?.label ?? humanize(key),
    tone: LEAD_TONE[key] ?? "neutral",
  };
}

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------
const PRODUCTS: Record<string, string> = {
  TICKOMIUM: "Tickomium",
  FORMATE: "Formate",
  MDOC: "mDoc",
  IKK: "IKK",
};

export function productName(value: unknown): string {
  return PRODUCTS[String(value ?? "")] ?? humanize(String(value ?? ""));
}

// ---------------------------------------------------------------------------
// Acciones del audit log — "company.updateStatus" → "Cambio de estado de empresa"
// ---------------------------------------------------------------------------
const AUDIT_ACTIONS: Record<string, string> = {
  "company.create": "Alta de empresa",
  "company.update": "Edición de empresa",
  "company.updateStatus": "Cambio de estado de empresa",
  "company.extendSubscription": "Extensión de suscripción",
  "company.createUser": "Alta de usuario en empresa",
  "company.addUser": "Usuario agregado a empresa",
  "company.removeUser": "Usuario retirado de empresa",
  "user.create": "Alta de usuario",
  "user.update": "Edición de usuario",
  "user.delete": "Baja de usuario",
  "plan.create": "Alta de plan",
  "plan.update": "Edición de plan",
  "plan.delete": "Baja de plan",
  "payment.validate": "Validación de pago",
  "notification.send": "Envío de notificación",
  "permission.create": "Alta de permiso",
  "permission.update": "Edición de permiso",
  "permission.delete": "Baja de permiso",
  "tenant.create": "Alta de tenant",
  "tenant.update": "Edición de tenant",
  "tenant.delete": "Baja de tenant",
  "tenant.attachUser": "Usuario vinculado a tenant",
  "tenant.updateConfig": "Configuración de tenant",
  "clinic.create": "Alta de clínica",
  "clinic.update": "Edición de clínica",
  "clinic.suspend": "Suspensión de clínica",
  "doctor.create": "Alta de doctor",
  "doctor.update": "Edición de doctor",
  "operator.create": "Alta de operador",
  "operator.update": "Edición de operador",
  "operator.delete": "Baja de operador",
  "lead.update": "Seguimiento de prospecto",
};

export function auditAction(value: unknown): string {
  const key = String(value ?? "");
  return AUDIT_ACTIONS[key] ?? humanize(key.replace(/\./g, " "));
}

// ---------------------------------------------------------------------------
// Genéricos
// ---------------------------------------------------------------------------
export function yesNo(value: unknown): string {
  return value ? "Sí" : "No";
}

export function activeState(value: unknown): { label: string; tone: BadgeTone } {
  return value
    ? { label: "Activo", tone: "active" }
    : { label: "Inactivo", tone: "suspend" };
}

/** Último recurso: "PENDING_THING" → "Pending thing". Nunca deja ver el guion bajo. */
export function humanize(value: string): string {
  if (!value) return "—";
  const clean = value.replace(/_/g, " ").toLowerCase().trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/** Nombre completo de una persona a partir de campos sueltos. */
export function fullName(row: {
  firstName?: unknown;
  lastName?: unknown;
  name?: unknown;
  email?: unknown;
}): string {
  const parts = [row.firstName, row.lastName].filter(
    (p): p is string => typeof p === "string" && p.trim() !== ""
  );
  if (parts.length) return parts.join(" ");
  if (typeof row.name === "string" && row.name.trim()) return row.name;
  if (typeof row.email === "string") return row.email;
  return "—";
}

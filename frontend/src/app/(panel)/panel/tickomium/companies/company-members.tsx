"use client";

// Usuarios de una empresa de Tickomium: quién pertenece, con qué rol, y el
// alta/baja de esa relación. Quitar a alguien sólo lo saca de la empresa; su
// cuenta y lo que registró se quedan en Tickomium.

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserMinus, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field, Select, Switch } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useSession } from "@/components/panel/session";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useResourceMutation, type ListResponse } from "@/hooks/use-resource";
import { apiGet } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import { fullName, isClosedRequest, isCompanyAdmin } from "@/lib/labels";

const COMPANIES_ENDPOINT = "/tickomium/companies";
const USERS_ENDPOINT = "/tickomium/users";

interface MemberUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

interface CompanyRole {
  id: string;
  name: string;
  isExternal: boolean;
}

interface Member {
  userId: string;
  role: string;
  user: MemberUser;
  companyRole: CompanyRole | null;
}

interface CompanyDetail {
  id: string;
  name: string;
  companyUsers?: Member[];
  /** Falta si Tickomium todavía no expone los roles de la empresa. */
  companyRoles?: CompanyRole[];
}

function roleLabel(role: CompanyRole): string {
  return role.isExternal ? `${role.name} (miembro externo)` : role.name;
}

export function CompanyMembers({
  company,
  onClose,
}: {
  company: { id: string; name: string; status?: string };
  onClose: () => void;
}) {
  const { canWrite } = useSession();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<Member | null>(null);
  const [repairing, setRepairing] = useState(false);

  const detail = useQuery<CompanyDetail>({
    queryKey: [COMPANIES_ENDPOINT, "detail", company.id],
    queryFn: () => apiGet<CompanyDetail>(`${COMPANIES_ENDPOINT}/${company.id}`),
  });

  const remove = useResourceMutation(
    [COMPANIES_ENDPOINT, USERS_ENDPOINT],
    "delete",
    "Usuario retirado de la empresa."
  );

  // TEMPORAL: repara administradores que quedaron sin companyRole por un bug
  // ya corregido en el registro público de Tickomium. Quitar junto con el
  // botón y el endpoint /repair-admin-role una vez reparadas las empresas
  // afectadas.
  const repair = useResourceMutation(
    COMPANIES_ENDPOINT,
    "post",
    "Rol de administrador reparado."
  );

  const members = detail.data?.companyUsers ?? [];
  const adminCount = members.filter((m) => isCompanyAdmin(m.role)).length;
  const hasBrokenAdmin = members.some((m) => isCompanyAdmin(m.role) && !m.companyRole);

  return (
    <>
      <Modal
        open
        onClose={onClose}
        title="Usuarios de la empresa"
        description={company.name}
        size="lg"
        footer={
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        }
      >
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ikk-fg-dim)]">
            {detail.isLoading
              ? "cargando"
              : `${members.length} ${members.length === 1 ? "usuario" : "usuarios"}`}
          </span>
          <div className="flex gap-2">
            {canWrite && hasBrokenAdmin && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setRepairing(true)}
              >
                Reparar rol de administrador
              </Button>
            )}
            {canWrite && (
              <Button
                size="sm"
                onClick={() => setAdding(true)}
                disabled={!detail.data}
              >
                <UserPlus className="h-4 w-4" /> Agregar usuario
              </Button>
            )}
          </div>
        </div>

        {detail.isLoading ? (
          <div className="space-y-3 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-[var(--ikk-r-md)] bg-[var(--ikk-bg-hover)]"
              />
            ))}
          </div>
        ) : detail.error ? (
          <p className="py-8 text-center text-sm text-[var(--ikk-danger)]">
            {apiErrorMessage(
              detail.error,
              "No pudimos cargar los usuarios. Puede que Tickomium esté fuera de línea."
            )}
          </p>
        ) : members.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--ikk-fg-muted)]">
            {isClosedRequest(company.status)
              ? "La solicitud se cerró y nadie tiene acceso a esta empresa."
              : "Esta empresa todavía no tiene usuarios."}
          </p>
        ) : (
          <ul className="divide-y divide-[var(--ikk-line-soft)] rounded-[var(--ikk-r-md)] border border-[var(--ikk-line-soft)]">
            {members.map((member) => {
              const isAdmin = isCompanyAdmin(member.role);
              const lastAdmin = isAdmin && adminCount <= 1;
              return (
                <li key={member.userId} className="flex items-start gap-3 px-3 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium">{fullName(member.user)}</span>
                      {isAdmin && <Badge variant="trial">Administrador</Badge>}
                    </div>
                    <div className="truncate text-[13px] text-[var(--ikk-fg-muted)]">
                      {member.user.email}
                    </div>
                    <div className="mt-1 text-[12px] text-[var(--ikk-fg-dim)]">
                      Rol:{" "}
                      {member.companyRole
                        ? roleLabel(member.companyRole)
                        : "sin rol asignado"}
                      {canWrite && lastAdmin && " · único administrador, no se puede quitar"}
                    </div>
                  </div>
                  {canWrite && !lastAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Quitar de la empresa"
                      aria-label={`Quitar a ${fullName(member.user)} de la empresa`}
                      onClick={() => setRemoving(member)}
                    >
                      <UserMinus className="h-4 w-4 text-[var(--ikk-danger)]" />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Modal>

      {adding && detail.data && (
        <AddMemberForm
          company={detail.data}
          onClose={() => setAdding(false)}
        />
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        loading={remove.isPending}
        tone="danger"
        title="Quitar de la empresa"
        highlight={removing ? fullName(removing.user) : undefined}
        consequence={
          <>
            Deja de tener acceso a <strong>{company.name}</strong> de inmediato.
            Su cuenta de Tickomium, sus otras empresas y lo que registró aquí
            (ventas, movimientos) se conservan. Puedes volver a agregarla
            después.
          </>
        }
        confirmLabel="Quitar de la empresa"
        onConfirm={() =>
          removing &&
          remove.mutate(
            { path: `${COMPANIES_ENDPOINT}/${company.id}/users/${removing.userId}` },
            { onSuccess: () => setRemoving(null) }
          )
        }
      />

      {/* TEMPORAL: ver comentario junto al botón. */}
      <ConfirmDialog
        open={repairing}
        onClose={() => setRepairing(false)}
        loading={repair.isPending}
        title="Reparar rol de administrador"
        highlight={company.name}
        consequence="Crea (o reutiliza) el rol Administrador de esta empresa con todos los permisos, y se lo asigna a quien administra la empresa pero no tiene rol asignado."
        confirmLabel="Reparar"
        onConfirm={() =>
          repair.mutate(
            { path: `${COMPANIES_ENDPOINT}/${company.id}/repair-admin-role` },
            { onSuccess: () => setRepairing(false) }
          )
        }
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Agregar un usuario existente
// ---------------------------------------------------------------------------
function AddMemberForm({
  company,
  onClose,
}: {
  company: CompanyDetail;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<MemberUser | null>(null);
  const [companyRoleId, setCompanyRoleId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search.trim());
  const searching = !selected && query.length >= 2;
  const users = useQuery<ListResponse<MemberUser>>({
    queryKey: [USERS_ENDPOINT, "picker", query],
    enabled: searching,
    queryFn: () =>
      apiGet<ListResponse<MemberUser>>(
        `${USERS_ENDPOINT}?${new URLSearchParams({ search: query, limit: "8" })}`
      ),
  });
  const results = users.data?.items ?? [];

  const save = useResourceMutation(
    [COMPANIES_ENDPOINT, USERS_ENDPOINT],
    "post",
    "Usuario agregado a la empresa."
  );

  const memberIds = new Set((company.companyUsers ?? []).map((m) => m.userId));
  const roles = company.companyRoles ?? [];
  const role = roles.find((r) => r.id === companyRoleId);
  const ready = Boolean(selected) && (roles.length === 0 || Boolean(role));

  function submit() {
    if (!selected || !ready) return;
    save.mutate(
      {
        path: `${COMPANIES_ENDPOINT}/${company.id}/users`,
        body: {
          userId: selected.id,
          companyRoleId: companyRoleId || null,
          role: isAdmin ? "ADMIN" : "EMPLOYEE",
        },
      },
      { onSuccess: onClose }
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Agregar usuario"
      description={company.name}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={save.isPending || !ready}>
            {save.isPending ? "Agregando…" : "Agregar a la empresa"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {selected ? (
          <div>
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--ikk-fg-muted)]">
              Persona
            </span>
            <div className="flex items-center justify-between gap-3 rounded-[var(--ikk-r-md)] border border-[var(--ikk-line)] bg-[var(--ikk-bg-elev)] px-3 py-2">
              <div className="min-w-0">
                <div className="font-medium">{fullName(selected)}</div>
                <div className="truncate text-[13px] text-[var(--ikk-fg-muted)]">
                  {selected.email}
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>
                Cambiar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Field
              label="Persona"
              hint="Busca por nombre, correo o teléfono. Si no aparece, créala primero en Tickomium → Usuarios."
            >
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar usuario…"
                autoComplete="off"
              />
            </Field>

            {searching && (
              <div className="mt-2">
                {users.isFetching ? (
                  <p className="py-3 text-center text-[13px] text-[var(--ikk-fg-muted)]">
                    Buscando…
                  </p>
                ) : users.error ? (
                  <p className="py-3 text-center text-[13px] text-[var(--ikk-danger)]">
                    {apiErrorMessage(users.error)}
                  </p>
                ) : results.length === 0 ? (
                  <p className="py-3 text-center text-[13px] text-[var(--ikk-fg-muted)]">
                    Nadie coincide con la búsqueda.
                  </p>
                ) : (
                  <ul className="max-h-64 divide-y divide-[var(--ikk-line-soft)] overflow-y-auto rounded-[var(--ikk-r-md)] border border-[var(--ikk-line-soft)]">
                    {results.map((user) => {
                      const isMember = memberIds.has(user.id);
                      return (
                        <li key={user.id}>
                          <button
                            type="button"
                            disabled={isMember}
                            onClick={() => setSelected(user)}
                            className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--ikk-bg-hover)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                          >
                            <span className="min-w-0">
                              <span className="block text-sm font-medium">
                                {fullName(user)}
                              </span>
                              <span className="block truncate text-[13px] text-[var(--ikk-fg-muted)]">
                                {user.email}
                              </span>
                            </span>
                            {isMember && (
                              <span className="shrink-0 text-[12px] text-[var(--ikk-fg-dim)]">
                                Ya pertenece
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {roles.length > 0 ? (
          <Field label="Rol en la empresa" hint="Define lo que puede hacer dentro de la empresa.">
            <Select
              value={companyRoleId}
              onChange={(e) => setCompanyRoleId(e.target.value)}
              placeholder="Elige un rol"
              options={roles.map((r) => ({ value: r.id, label: roleLabel(r) }))}
            />
          </Field>
        ) : (
          <p className="text-[13px] leading-relaxed text-[var(--ikk-fg-muted)]">
            Esta empresa todavía no tiene roles creados. La persona entrará sin
            permisos hasta que se le asigne uno desde Tickomium.
          </p>
        )}

        <div>
          <Switch
            label="Administra la empresa"
            checked={isAdmin}
            onChange={setIsAdmin}
          />
          <p className="mt-1.5 text-[12px] text-[var(--ikk-fg-dim)]">
            Márcalo sólo para quien responde por la empresa. Lo que puede hacer
            lo sigue definiendo su rol.
          </p>
        </div>

        {selected && (
          <p className="text-sm text-[var(--ikk-fg-muted)]">
            <strong className="text-[var(--ikk-fg)]">{fullName(selected)}</strong>{" "}
            tendrá acceso a <strong className="text-[var(--ikk-fg)]">{company.name}</strong>
            {role ? (
              <>
                {" "}
                con el rol <strong className="text-[var(--ikk-fg)]">{role.name}</strong>
              </>
            ) : null}
            {isAdmin ? " y quedará como administrador" : ""}.
          </p>
        )}
      </div>
    </Modal>
  );
}

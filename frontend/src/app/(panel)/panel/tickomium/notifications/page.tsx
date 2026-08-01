"use client";

// Envío de avisos a los usuarios de una empresa de Tickomium.
// El hijo exige empresa destino: no existe un broadcast global.

import { useState } from "react";
import { Send } from "lucide-react";
import { PageHeader } from "@/components/panel/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/field";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useResourceList, useResourceMutation } from "@/hooks/use-resource";
import { useSession } from "@/components/panel/session";

interface Company {
  id: string;
  name: string;
}

const SEVERITIES = [
  { value: "info", label: "Informativo" },
  { value: "success", label: "Buenas noticias" },
  { value: "warning", label: "Advertencia" },
  { value: "critical", label: "Urgente" },
];

export default function NotificationsPage() {
  const { canWrite } = useSession();
  const [form, setForm] = useState({
    companyId: "",
    title: "",
    message: "",
    severity: "info",
    actionUrl: "",
  });
  const [confirming, setConfirming] = useState(false);

  const companies = useResourceList<Company>("/tickomium/companies", {
    limit: 200,
  });

  const send = useResourceMutation(
    "/tickomium/notifications",
    "post",
    "Aviso enviado a los usuarios de la empresa."
  );

  const selected = companies.items.find((c) => c.id === form.companyId);
  const incomplete =
    !form.companyId || !form.title.trim() || form.message.trim().length < 5;

  function submit() {
    send.mutate(
      {
        path: "/tickomium/notifications",
        body: {
          companyId: form.companyId,
          type: "IKK_ANNOUNCEMENT",
          category: "system",
          severity: form.severity,
          title: form.title.trim(),
          message: form.message.trim(),
          ...(form.actionUrl.trim() && {
            actionUrl: form.actionUrl.trim(),
            actionLabel: "Ver detalle",
          }),
        },
      },
      {
        onSuccess: () => {
          setConfirming(false);
          setForm({
            companyId: "",
            title: "",
            message: "",
            severity: "info",
            actionUrl: "",
          });
        },
      }
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Tickomium"
        title="Avisos"
        description="Manda un mensaje a todos los usuarios de una empresa. Aparece dentro de su Tickomium."
      />

      <Card className="max-w-2xl p-5 sm:p-6">
        {!canWrite ? (
          <p className="text-sm text-[var(--ikk-fg-muted)]">
            Tu rol es de sólo lectura: no puedes enviar avisos.
          </p>
        ) : (
          <div className="space-y-4">
            <Field
              label="Empresa destino"
              hint={
                companies.error
                  ? "No se pudo cargar la lista de empresas. Revisa que Tickomium esté en línea."
                  : undefined
              }
            >
              <Select
                value={form.companyId}
                onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                placeholder={
                  companies.isLoading ? "Cargando empresas…" : "Elige una empresa"
                }
                options={companies.items.map((c) => ({
                  value: c.id,
                  label: c.name,
                }))}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título">
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Mantenimiento programado"
                />
              </Field>
              <Field label="Tono">
                <Select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  options={SEVERITIES}
                />
              </Field>
            </div>

            <Field label="Mensaje">
              <Textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Escribe el aviso tal cual lo va a leer el usuario final."
              />
            </Field>

            <Field label="Liga de acción" hint="Opcional.">
              <Input
                value={form.actionUrl}
                onChange={(e) => setForm({ ...form, actionUrl: e.target.value })}
                placeholder="https://…"
              />
            </Field>

            <Button
              onClick={() => setConfirming(true)}
              disabled={incomplete || send.isPending}
            >
              <Send className="h-4 w-4" /> Enviar aviso
            </Button>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={submit}
        loading={send.isPending}
        title="Enviar aviso"
        highlight={selected?.name}
        consequence="Todos los usuarios de esta empresa recibirán la notificación dentro de Tickomium. No se puede deshacer."
        confirmLabel="Enviar"
      />
    </>
  );
}

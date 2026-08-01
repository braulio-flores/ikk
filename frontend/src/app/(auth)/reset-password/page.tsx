"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { IkkLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";

// useSearchParams obliga a renderizar del lado del cliente: sin el Suspense la
// build de producción falla al prerenderizar esta ruta.
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md p-6 sm:p-8">
          <p className="text-center text-sm text-[var(--ikk-fg-muted)]">
            Cargando…
          </p>
        </Card>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await apiPost("/auth/reset-password", { token, password });
      toast.success("Contraseña actualizada. Ya puedes entrar.");
      router.replace("/login");
    } catch (err) {
      setError(
        apiErrorMessage(err, "La liga es inválida o ya expiró. Solicita una nueva.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-6 sm:p-8">
      <div className="flex flex-col items-center gap-3">
        <IkkLogo showWordmark={false} size={36} />
        <h1 className="text-xl font-semibold tracking-tight">Nueva contraseña</h1>
      </div>

      {!token ? (
        <p className="mt-6 text-center text-sm leading-relaxed text-[var(--ikk-fg-muted)]">
          Esta liga no es válida. Solicita otra desde la pantalla de acceso.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <Field label="Nueva contraseña">
            <Input
              type="password"
              name="password"
              required
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirmar contraseña" error={error ?? undefined}>
            <Input
              type="password"
              name="confirm"
              required
              autoComplete="new-password"
            />
          </Field>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Actualizando…" : "Actualizar contraseña"}
          </Button>
        </form>
      )}
    </Card>
  );
}

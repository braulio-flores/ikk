"use client";

import { useState, type FormEvent } from "react";
import { IkkLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { apiPost } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    try {
      await apiPost("/auth/forgot-password", { email });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-6 sm:p-8">
      <div className="flex flex-col items-center gap-3">
        <IkkLogo showWordmark={false} size={36} />
        <h1 className="text-xl font-semibold tracking-tight">
          Recuperar acceso
        </h1>
      </div>

      {sent ? (
        <p className="mt-6 text-center text-sm text-[var(--ikk-fg-muted)] leading-relaxed">
          Si ese correo corresponde a un operador, te enviamos una liga para
          restablecer tu contraseña. Revisa tu bandeja de entrada.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <Input type="email" name="email" required placeholder="tu@correo.com" />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Enviando…" : "Enviar liga"}
          </Button>
        </form>
      )}
    </Card>
  );
}

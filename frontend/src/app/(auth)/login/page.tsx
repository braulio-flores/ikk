"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IkkLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { apiPost } from "@/lib/api";
import type { Operator } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      await apiPost<{ operator: Operator }>("/auth/login", { email, password });
      router.replace("/panel/overview");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? // axios error
            (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : null;
      setError(msg ?? "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md p-6 sm:p-8">
      <div className="flex flex-col items-center gap-3">
        <IkkLogo showWordmark={false} size={36} />
        <h1 className="text-xl font-semibold tracking-tight">Acceso operadores</h1>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ikk-fg-muted)]">
          IKK Solutions · panel master
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-[var(--ikk-fg-muted)]">
            Email
          </span>
          <Input
            type="email"
            name="email"
            required
            autoComplete="username"
            placeholder="tu@correo.com"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-[var(--ikk-fg-muted)]">
            Contraseña
          </span>
          <Input
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p className="text-sm text-[var(--ikk-danger)] font-mono">{error}</p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Ingresando…" : "Ingresar"}
        </Button>

        <div className="text-center text-[13px] text-[var(--ikk-fg-muted)]">
          <Link
            href="/forgot-password"
            className="hover:text-[var(--ikk-fg)] underline-offset-4 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </Card>
  );
}

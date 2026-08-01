"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Field, Textarea } from "@/components/ui/field";
import { apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/errors";
import { CONTACT_EMAIL } from "@/lib/site";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      company: String(form.get("company") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
      // Campo trampa para bots: una persona nunca lo ve.
      website: String(form.get("website") ?? ""),
    };

    if (payload.message.length < 10) {
      setError("Cuéntanos un poco más sobre el proyecto.");
      return;
    }

    setSending(true);
    try {
      await apiPost("/contact", payload);
      setSent(true);
      toast.success("Mensaje enviado. Te respondemos en menos de 48 horas.");
    } catch (err) {
      const message = apiErrorMessage(
        err,
        "No pudimos enviar tu mensaje. Escríbenos por correo mientras lo resolvemos."
      );
      setError(message);
      toast.error(message);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-6">
        <Card className="p-8 text-center sm:p-12">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--ikk-success)]" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Recibimos tu mensaje.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[var(--ikk-fg-muted)]">
            Te respondemos en menos de 48 horas con los siguientes pasos. Si es
            urgente, escríbenos directo a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[var(--ikk-accent)] underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <Link href="/" className="mt-7 inline-block">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" /> Volver al inicio
            </Button>
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ikk-fg-muted)]">
        Contacto
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Cuéntanos qué necesitas.
      </h1>
      <p className="mt-3 max-w-xl text-[var(--ikk-fg-muted)]">
        Mientras más nos digas del proyecto, mejor será nuestra respuesta. Te
        contactamos en menos de 48 horas.
      </p>

      <Card className="mt-8 p-5 sm:mt-10 sm:p-8">
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre">
              <Input name="name" required placeholder="Tu nombre" autoComplete="name" />
            </Field>
            <Field label="Empresa" hint="Opcional.">
              <Input name="company" placeholder="Nombre del negocio" autoComplete="organization" />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Correo">
              <Input
                type="email"
                name="email"
                required
                placeholder="tunombre@empresa.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Teléfono" hint="Opcional.">
              <Input
                name="phone"
                inputMode="tel"
                placeholder="55 1234 5678"
                autoComplete="tel"
              />
            </Field>
          </div>

          <Field label="Descripción del proyecto" error={error ?? undefined}>
            <Textarea
              name="message"
              rows={6}
              required
              placeholder="¿Qué quieres construir? ¿Para quién? ¿Tienes alguna fecha en mente?"
            />
          </Field>

          {/* Honeypot: oculto para personas, visible para bots. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute h-0 w-0 opacity-0"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" size="lg" disabled={sending} className="w-full sm:w-auto">
              {sending ? "Enviando…" : "Enviar mensaje"}
            </Button>
            <p className="text-[13px] text-[var(--ikk-fg-muted)]">
              O escríbenos a{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[var(--ikk-accent)] underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </form>
      </Card>
    </section>
  );
}

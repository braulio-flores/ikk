import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Check,
  Code2,
  Plug,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const services = [
  {
    icon: Code2,
    title: "Plataformas web",
    desc: "Aplicaciones completas en Next.js y Node: SaaS multiempresa, portales de clientes y sistemas internos.",
  },
  {
    icon: Smartphone,
    title: "Apps móviles",
    desc: "Aplicaciones para iOS y Android con React Native, listas para publicar en las tiendas.",
  },
  {
    icon: BarChart3,
    title: "Paneles de operación",
    desc: "Tableros de indicadores y administración con control de accesos por rol y trazabilidad.",
  },
  {
    icon: Plug,
    title: "Integraciones",
    desc: "Conectamos tu operación con los sistemas que ya usas: facturación, pagos, inventarios y mensajería.",
  },
];

const process = [
  {
    step: "01",
    title: "Descubrimiento",
    desc: "Entendemos la operación real y dónde duele hoy.",
  },
  {
    step: "02",
    title: "Diseño",
    desc: "Flujos y pantallas para validar antes de programar.",
  },
  {
    step: "03",
    title: "Desarrollo",
    desc: "Entregas cada semana, siempre con algo usable.",
  },
  {
    step: "04",
    title: "Puesta en marcha",
    desc: "Despliegue, migración de datos y capacitación al equipo.",
  },
  {
    step: "05",
    title: "Acompañamiento",
    desc: "Soporte y mejoras continuas sobre lo que ya vive en producción.",
  },
];

const products = [
  {
    name: "Tickomium",
    role: "Punto de venta",
    desc: "Ventas, caja, inventario, promociones y reportes para negocios con varias sucursales.",
    highlights: ["Multiempresa", "Corte de caja", "Inventario"],
  },
  {
    name: "Formate",
    role: "Pedidos en línea",
    desc: "Menú digital y pedidos para restaurantes y locales, con configuración por sucursal.",
    highlights: ["Multi-tenant", "Domicilio y local", "Pagos"],
  },
  {
    name: "mDoc",
    role: "Gestión clínica",
    desc: "Expediente clínico, agenda, consentimientos y auditoría de accesos para consultorios.",
    highlights: ["Expediente", "Agenda", "Auditoría"],
  },
];

const reasons = [
  "Trabajamos con lo que ya usas: no te pedimos cambiar toda tu operación.",
  "Entregas semanales: ves avances reales, no reportes de avance.",
  "El código es tuyo, con documentación y despliegue incluidos.",
  "Sostenemos lo que construimos: mantenimiento y mejoras después del arranque.",
];

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "NestJS",
  "Prisma",
  "PostgreSQL",
  "Redis",
  "React Native",
  "Tailwind",
  "Vercel",
  "Railway",
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="ikk-grid-bg relative overflow-hidden border-b border-[var(--ikk-line-soft)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--ikk-accent)" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24 md:py-32">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ikk-fg-muted)]">
            IKK Solutions — Software a medida
          </p>
          <h1 className="max-w-3xl text-[2.15rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            Convertimos tus ideas
            <br />
            <span className="text-[var(--ikk-accent)]">en productos reales.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--ikk-fg-muted)] sm:text-lg">
            Desarrollamos software para empresas que necesitan herramientas que
            no existen en el mercado — o que existen, pero no como su operación
            las necesita.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto">
                Hablemos de tu proyecto <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#productos">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Ver lo que hemos construido
              </Button>
            </a>
          </div>

          <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-3">
            <Stat value="3" label="productos propios en producción" />
            <Stat value="48 h" label="para responder tu solicitud" />
            <Stat value="1 semana" label="entre entrega y entrega" />
          </dl>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <SectionHeader eyebrow="Lo que hacemos" title="Servicios" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Card key={s.title} className="p-5">
              <s.icon className="mb-4 h-5 w-5 text-[var(--ikk-accent)]" />
              <CardTitle>{s.title}</CardTitle>
              <CardDescription className="mt-2">{s.desc}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Productos */}
      <section
        id="productos"
        className="border-y border-[var(--ikk-line-soft)] bg-[var(--ikk-bg-elev)]/50"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
          <SectionHeader
            eyebrow="Portafolio"
            title="Productos propios en producción"
            lead="No somos una agencia teórica. Estos productos los construimos nosotros, los mantenemos nosotros, y son la prueba de que podemos construir el tuyo."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {products.map((p) => (
              <Card key={p.name} className="flex flex-col p-6">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--ikk-fg-muted)]">
                  {p.role}
                </div>
                <CardTitle className="mt-2 text-xl">{p.name}</CardTitle>
                <CardDescription className="mt-3 flex-1">{p.desc}</CardDescription>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {p.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-[var(--ikk-r-sm)] border border-[var(--ikk-line-soft)] bg-[var(--ikk-bg-card)] px-2.5 py-1 font-mono text-[11px] text-[var(--ikk-fg-muted)]"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] text-[var(--ikk-fg-muted)]">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--ikk-success)" }}
                  />
                  En producción
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section id="proceso" className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <SectionHeader eyebrow="Cómo trabajamos" title="Proceso" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((p) => (
            <div
              key={p.step}
              className="border-t border-[var(--ikk-line)] pt-4"
            >
              <div className="font-mono text-xs text-[var(--ikk-fg-dim)]">
                {p.step}
              </div>
              <div className="mt-2 text-[15px] font-medium">{p.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-[var(--ikk-fg-muted)]">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Por qué nosotros */}
      <section className="border-y border-[var(--ikk-line-soft)] bg-[var(--ikk-bg-elev)]/50">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-10 md:grid-cols-2">
            <SectionHeader
              eyebrow="Por qué nosotros"
              title="Sin sorpresas a medio camino"
              className="mb-0"
            />
            <ul className="space-y-4">
              {reasons.map((r) => (
                <li key={r} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ikk-accent)]" />
                  <span className="text-sm leading-relaxed text-[var(--ikk-fg-muted)]">
                    {r}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section id="stack" className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <SectionHeader
          eyebrow="Capacidades"
          title="Tecnología que dominamos"
          lead="Elegimos herramientas maduras y bien documentadas, para que cualquier equipo pueda darle continuidad a lo que entregamos."
        />
        <ul className="flex flex-wrap gap-2">
          {stack.map((t) => (
            <li
              key={t}
              className="rounded-[var(--ikk-r-sm)] border border-[var(--ikk-line-soft)] bg-[var(--ikk-bg-card)] px-3 py-1.5 font-mono text-sm text-[var(--ikk-fg-muted)]"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* Cierre */}
      <section id="contacto" className="mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-[var(--ikk-r-xl)] border border-[var(--ikk-line-soft)] bg-[var(--ikk-bg-card)] p-7 sm:p-10 md:p-14">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Cuéntanos qué necesitas construir.
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--ikk-fg-muted)]">
            Te respondemos en menos de 48 horas con una propuesta de
            descubrimiento, sin compromiso.
          </p>
          <Link href="/contact" className="mt-6 inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Ir al formulario <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {value}
      </dt>
      <dd className="mt-1 text-[13px] leading-snug text-[var(--ikk-fg-muted)]">
        {label}
      </dd>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  lead,
  className = "mb-10",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ikk-fg-muted)]">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {lead && (
        <p className="mt-4 max-w-2xl text-[var(--ikk-fg-muted)]">{lead}</p>
      )}
    </div>
  );
}

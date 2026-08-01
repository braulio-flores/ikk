// IKK Solutions — Landing (rediseño editorial, sin tropos de IA)
// ──────────────────────────────────────────────────────────────────────────
// Qué evita:
//   · NADA de glow radial / blur en el hero
//   · NADA de pill "EN PROD" con dot verde
//   · NADA de grid 3×2 de cards [icono + título + descripción]
//   · NADA de "terminal con tres bolitas semáforo"
//   · NADA de cards con border-left de color
//   · NADA de iconografía decorativa por defecto
//
// Qué hace en su lugar:
//   · Layouts asimétricos, anclados a una columna numérica izquierda
//   · Tipografía como protagonista, mono como anotación documental
//   · Listas numeradas y reglas como separación (no contenedores)
//   · Datos crudos (números, fechas, slugs) en vez de pills genéricas
//   · Hairlines · 1px lines · más aire

function Landing({ personality = 'editorial', width = 1280 }) {
  return (
    <div className="ikk" style={{ background: 'var(--ikk-bg)', minHeight: '100%', width, fontFamily: 'var(--ikk-font-sans)' }}>
      <LandingNav />
      <LandingHero />
      <LandingProof />
      <LandingServices />
      <LandingProcess />
      <LandingProducts />
      <LandingStack />
      <LandingContact />
      <LandingFooter />
    </div>
  );
}

const PAGE_PAD = 'clamp(28px, 6vw, 88px)';

// ============================================================================
// NAV — minimal. Wordmark left, links center, single CTA right. Hairline only.
// ============================================================================
function LandingNav() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 5,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `16px ${PAGE_PAD}`,
      background: 'color-mix(in oklab, var(--ikk-bg) 86%, transparent)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--ikk-line-soft)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <IKKMark size={24} accent="var(--ikk-accent)" ghost="var(--ikk-fg)" ghostOpacity={0.22} />
        <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.015em' }}>IKK Solutions</span>
      </div>
      <nav style={{ display: 'flex', gap: 28, fontSize: 13.5, color: 'var(--ikk-fg-muted)' }}>
        <a href="#servicios">Servicios</a>
        <a href="#proceso">Proceso</a>
        <a href="#productos">Productos</a>
        <a href="#stack">Stack</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <a href="#contacto" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5,
        color: 'var(--ikk-fg)', borderBottom: '1px solid var(--ikk-fg)',
        paddingBottom: 2,
      }}>
        Empezar un proyecto
        <span style={{ fontFamily: 'var(--ikk-font-mono)' }}>↗</span>
      </a>
    </header>
  );
}

// ============================================================================
// HERO — Editorial. Two columns: left (huge type), right (running annotation
// with key facts). No badges, no glow, no terminal box.
// ============================================================================
function LandingHero() {
  return (
    <section style={{
      padding: `120px ${PAGE_PAD} 80px`,
      borderBottom: '1px solid var(--ikk-line-soft)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(220px, 320px)',
        gap: 64, alignItems: 'flex-end',
        maxWidth: 1300, margin: '0 auto',
      }}>
        <div>
          <div style={{
            display: 'flex', gap: 14, alignItems: 'center',
            fontFamily: 'var(--ikk-font-mono)', fontSize: 11.5,
            color: 'var(--ikk-fg-dim)', letterSpacing: '0.14em',
            marginBottom: 36,
          }}>
            <span>IKK · 001</span>
            <span style={{ flex: 1, height: 1, background: 'var(--ikk-line-soft)' }} />
            <span>BUENOS AIRES · 2026</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(48px, 7.2vw, 104px)',
            fontWeight: 500, letterSpacing: '-0.045em', lineHeight: 0.95,
            textWrap: 'balance',
          }}>
            Software<br />
            a medida.<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--ikk-fg-muted)' }}>Ideas en</span>
            <span style={{ color: 'var(--ikk-accent)' }}> producción</span>
            <span style={{ color: 'var(--ikk-accent)' }}>.</span>
          </h1>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: 22,
          paddingBottom: 12,
        }}>
          <p style={{
            fontSize: 16.5, lineHeight: 1.55, color: 'var(--ikk-fg-muted)',
            textWrap: 'pretty',
          }}>
            Construimos productos web, móviles y plataformas multitenant para empresas que dejaron de escalar con planillas y SaaS genéricos.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, fontSize: 13, fontFamily: 'var(--ikk-font-mono)' }}>
            <HeroFact k="EN OPERACIÓN" v="3 productos propios" />
            <HeroFact k="EQUIPO" v="6 personas · Argentina" />
            <HeroFact k="MEDIA A PRODUCCIÓN" v="142 días desde el kickoff" />
            <HeroFact k="ESTE MES" v="2 cupos de discovery" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
            <a href="#contacto" className="ikk-btn ikk-btn--primary">
              Hablemos de tu proyecto <ArrowRightIcon size={15} />
            </a>
            <a href="#productos" style={{
              fontSize: 13, color: 'var(--ikk-fg-muted)',
              textAlign: 'center', textDecoration: 'underline',
              textDecorationColor: 'var(--ikk-line)', textUnderlineOffset: 4,
            }}>o mirá qué ya está corriendo →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroFact({ k, v }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '8px 0', borderTop: '1px solid var(--ikk-line-soft)',
      fontSize: 12,
    }}>
      <span style={{ color: 'var(--ikk-fg-dim)', letterSpacing: '0.08em' }}>{k}</span>
      <span style={{ color: 'var(--ikk-fg)' }}>{v}</span>
    </div>
  );
}

// ============================================================================
// PROOF STRIP — Big-number proof. One row, four columns, hairlines.
// ============================================================================
function LandingProof() {
  const items = [
    { v: '3', k: 'productos propios en producción' },
    { v: '148', k: 'empresas / tenants / clínicas gestionadas' },
    { v: '2 410', k: 'usuarios activos en plataformas IKK' },
    { v: '< 24h', k: 'tiempo medio de respuesta a clientes' },
  ];
  return (
    <section style={{
      padding: `48px ${PAGE_PAD}`,
      borderBottom: '1px solid var(--ikk-line-soft)',
    }}>
      <div style={{
        maxWidth: 1300, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      }}>
        {items.map((it, i) => (
          <div key={it.k} style={{
            padding: '4px 24px',
            borderLeft: i === 0 ? 'none' : '1px solid var(--ikk-line-soft)',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <span style={{
              fontSize: 'clamp(36px, 4.4vw, 56px)', fontWeight: 500,
              letterSpacing: '-0.04em', lineHeight: 1,
              fontFeatureSettings: '"tnum"',
            }}>{it.v}</span>
            <span style={{
              fontSize: 12.5, color: 'var(--ikk-fg-muted)',
              maxWidth: 200, lineHeight: 1.4,
            }}>{it.k}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// SERVICES — Editorial list. Numbered rows, no cards, no icons.
// Each row: number · heading · description · "incluye" inline meta.
// ============================================================================
function LandingServices() {
  const items = [
    {
      n: '01', t: 'Productos web', d: 'Apps SaaS y portales con autenticación, billing y multi-rol — de cero a producción.',
      tags: ['Next.js', 'Postgres', 'Prisma', 'Stripe', 'MercadoPago'],
    },
    {
      n: '02', t: 'Apps móviles', d: 'React Native end-to-end. CI propio, builds firmadas, deploys a stores que no rompen el lunes.',
      tags: ['React Native', 'Expo', 'EAS', 'Push'],
    },
    {
      n: '03', t: 'Dashboards internos', d: 'Paneles para operaciones que dejaron de escalar con Excel y carpetas compartidas.',
      tags: ['React', 'tRPC', 'tablas pesadas', 'export CSV/XLSX'],
    },
    {
      n: '04', t: 'Sistemas multitenant', d: 'Una sola plataforma, N empresas o clínicas, datos aislados, billing por tenant y onboarding de minutos.',
      tags: ['row-level security', 'subdomains', 'feature flags por tenant'],
    },
    {
      n: '05', t: 'Integraciones', d: 'AFIP, MercadoPago, Stripe, ERPs, APIs legacy. Puentes que no se rompen los feriados.',
      tags: ['AFIP', 'webhooks reintentables', 'colas', 'logs auditables'],
    },
    {
      n: '06', t: 'Discovery & diseño', d: 'Cuando todavía no sabés qué construir: partimos del problema y aterrizamos un MVP medible.',
      tags: ['mapas de procesos', 'wireframes', 'mockups navegables'],
    },
  ];
  return (
    <Section id="servicios" eyebrow="002 — LO QUE HACEMOS" title="Construimos lo que tu negocio necesita,">
      <p style={{
        fontSize: 18, color: 'var(--ikk-fg-muted)', lineHeight: 1.5,
        maxWidth: 620, marginBottom: 32, marginTop: -28,
      }}>
        no lo que entra en la caja del SaaS de turno. Estos son los seis tipos de trabajo que hacemos.
      </p>

      <div style={{ borderTop: '1px solid var(--ikk-line)' }}>
        {items.map(it => (
          <article key={it.n} style={{
            display: 'grid',
            gridTemplateColumns: '64px 1fr 320px',
            gap: 36, padding: '28px 0',
            borderBottom: '1px solid var(--ikk-line-soft)',
            alignItems: 'baseline',
          }}>
            <div style={{
              fontFamily: 'var(--ikk-font-mono)', fontSize: 12,
              color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em', paddingTop: 6,
            }}>{it.n}</div>
            <div>
              <h3 style={{
                fontSize: 26, fontWeight: 500, letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}>{it.t}</h3>
              <p style={{
                marginTop: 10, fontSize: 15, color: 'var(--ikk-fg-muted)',
                lineHeight: 1.55, maxWidth: 540,
              }}>{it.d}</p>
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '4px 10px',
              paddingTop: 8,
              fontFamily: 'var(--ikk-font-mono)', fontSize: 12,
              color: 'var(--ikk-fg-dim)',
            }}>
              {it.tags.map((t, i) => (
                <span key={t}>
                  {t}{i !== it.tags.length - 1 && <span style={{ marginLeft: 8, opacity: 0.4 }}>·</span>}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// PROCESS — Horizontal rule with 5 labeled ticks. Number above, label below.
// No circles, no timeline beads, no cards.
// ============================================================================
function LandingProcess() {
  const steps = [
    ['01', 'Discovery',   'Entendemos el problema, mapeamos usuarios, validamos el alcance. 1–2 semanas.'],
    ['02', 'Diseño',      'Flujos, wireframes y mockups navegables antes de tocar código.'],
    ['03', 'Desarrollo',  'Sprints quincenales, demos cada viernes, el repo en tu organización desde el commit 1.'],
    ['04', 'Entrega',     'Deploy a producción, handoff técnico, capacitación al equipo, documentación.'],
    ['05', 'Soporte',     'SLA mensual, mejoras continuas, sin lock-in con nosotros.'],
  ];
  return (
    <Section id="proceso" eyebrow="003 — CÓMO TRABAJAMOS" title="De idea a producción, en cinco etapas.">
      <div style={{ marginTop: 8 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12, marginBottom: 18,
        }}>
          {steps.map(([n]) => (
            <div key={n} style={{
              fontFamily: 'var(--ikk-font-mono)', fontSize: 13,
              color: 'var(--ikk-accent)', letterSpacing: '0.06em',
            }}>{n}</div>
          ))}
        </div>
        <div style={{
          height: 1, background: 'var(--ikk-line)', position: 'relative',
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12,
        }}>
          {steps.map(([n], i) => (
            <span key={n} style={{
              width: 1, height: 8, background: 'var(--ikk-line)',
              alignSelf: 'flex-start', justifySelf: 'flex-start',
            }} />
          ))}
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12, marginTop: 16,
        }}>
          {steps.map(([_, t, d]) => (
            <div key={t}>
              <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.015em' }}>{t}</div>
              <p style={{ marginTop: 6, fontSize: 13, color: 'var(--ikk-fg-muted)', lineHeight: 1.5 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ============================================================================
// PRODUCTS — Documentary "expediente" entries. Number, name typeset large,
// stat row, paragraph, mini fact table. Read like a project file, not a card.
// ============================================================================
function LandingProducts() {
  const products = [
    {
      code: 'P-01', name: 'Tickomium', kind: 'POS · Punto de venta',
      since: 'En producción desde 2023', clients: '62 empresas activas',
      desc: 'Sistema de punto de venta multi-empresa para comercios y cadenas pequeñas. Caja, productos, ventas, facturación AFIP y reportes operativos consolidados.',
      facts: [
        ['Stack',    'Next.js · Postgres · Prisma'],
        ['Tenancy',  'multi-empresa, multi-sucursal'],
        ['Facturación', 'AFIP WSFE · MercadoPago'],
        ['Picos',    '~ 4 100 ventas / hora pico'],
      ],
    },
    {
      code: 'P-02', name: 'Formate', kind: 'Gestión de pedidos · multitenant',
      since: 'En producción desde 2024', clients: '47 tenants en operación',
      desc: 'Plataforma de pedidos multitenant para cadenas, distribuidoras y rubros con catálogos distintos por cliente. Cada tenant con su catálogo, reglas y dominio propio.',
      facts: [
        ['Stack',    'Next.js · Postgres · tRPC'],
        ['Tenancy',  'row-level isolation por tenant'],
        ['Onboarding','setup en 12 min promedio'],
        ['Catálogo', '~ 28 000 SKUs activos'],
      ],
    },
    {
      code: 'P-03', name: 'mDoc', kind: 'Gestión médica · consultorios y clínicas',
      since: 'En producción desde 2024', clients: '39 clínicas',
      desc: 'Historia clínica electrónica, agenda y auditoría para consultorios y clínicas medianas. Foco en cumplimiento, trazabilidad y velocidad de consulta.',
      facts: [
        ['Stack',     'Next.js · Postgres · audit-log'],
        ['Tenancy',   'multi-clínica · roles médicos'],
        ['Auditoría', 'log inmutable por evento'],
        ['Cumplimiento', 'datos sensibles cifrados'],
      ],
    },
  ];
  return (
    <Section id="productos" eyebrow="004 — PORTAFOLIO" title="Tres productos propios. Ya en producción.">
      <p style={{
        fontSize: 18, color: 'var(--ikk-fg-muted)', lineHeight: 1.5,
        maxWidth: 620, marginBottom: 8, marginTop: -28,
      }}>
        No vendemos un slide. Mantenemos estos sistemas hoy.
      </p>

      <div style={{ marginTop: 32 }}>
        {products.map((p, i) => (
          <article key={p.code} style={{
            display: 'grid',
            gridTemplateColumns: '88px 1fr 360px',
            gap: 36, padding: '40px 0',
            borderTop: i === 0 ? '1px solid var(--ikk-line)' : '1px solid var(--ikk-line-soft)',
            alignItems: 'flex-start',
          }}>
            <div style={{
              fontFamily: 'var(--ikk-font-mono)', fontSize: 12,
              color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em',
              paddingTop: 18,
            }}>{p.code}</div>

            <div>
              <div style={{
                fontFamily: 'var(--ikk-font-mono)', fontSize: 12,
                color: 'var(--ikk-fg-dim)', letterSpacing: '0.08em',
                marginBottom: 6,
              }}>{p.kind.toUpperCase()}</div>
              <h3 style={{
                fontSize: 'clamp(40px, 4.4vw, 56px)', fontWeight: 500,
                letterSpacing: '-0.04em', lineHeight: 0.95,
              }}>{p.name}</h3>
              <p style={{
                marginTop: 18, fontSize: 16, color: 'var(--ikk-fg-muted)',
                lineHeight: 1.55, maxWidth: 580,
              }}>{p.desc}</p>
              <div style={{
                marginTop: 18, display: 'flex', gap: 18,
                fontFamily: 'var(--ikk-font-mono)', fontSize: 12,
                color: 'var(--ikk-fg-dim)',
              }}>
                <span>{p.since}</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>{p.clients}</span>
              </div>
            </div>

            <div style={{ paddingTop: 6 }}>
              {p.facts.map((f, j) => (
                <div key={f[0]} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0',
                  borderTop: '1px solid var(--ikk-line-soft)',
                  borderBottom: j === p.facts.length - 1 ? '1px solid var(--ikk-line-soft)' : 'none',
                  fontSize: 13, fontFamily: 'var(--ikk-font-mono)',
                }}>
                  <span style={{ color: 'var(--ikk-fg-dim)' }}>{f[0]}</span>
                  <span style={{ color: 'var(--ikk-fg)', textAlign: 'right' }}>{f[1]}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// STACK — Dense mono manifest, not floating pills.
// Two columns: category · technologies (comma-separated, mono).
// ============================================================================
function LandingStack() {
  const groups = [
    ['Frontend',     'Next.js (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, React Native, Expo'],
    ['Backend',      'Node.js, tRPC, GraphQL, REST tradicional, BullMQ para colas, cron jobs auditables'],
    ['Datos',        'Postgres (RLS), Prisma, Redis, búsqueda full-text en pg, Elasticsearch cuando hace falta'],
    ['Integración',  'Stripe, MercadoPago, AFIP WSFE, ERPs (Tango, Bejerman), webhooks reintentables, OAuth'],
    ['Infra',        'Vercel, AWS (ECS, RDS, S3), Cloudflare, Docker, GitHub Actions, observabilidad con Sentry + Axiom'],
    ['Calidad',      'Playwright para E2E, Vitest para unitarios, code review obligatorio, deploys con preview por PR'],
  ];
  return (
    <Section id="stack" eyebrow="005 — STACK & CAPACIDADES" title="Lo que dominamos.">
      <p style={{
        fontSize: 18, color: 'var(--ikk-fg-muted)', lineHeight: 1.5,
        maxWidth: 620, marginBottom: 28, marginTop: -28,
      }}>
        No usamos algo nuevo porque está de moda. Lo usamos cuando entendemos cómo se rompe.
      </p>
      <div style={{ borderTop: '1px solid var(--ikk-line)' }}>
        {groups.map(([k, v]) => (
          <div key={k} style={{
            display: 'grid', gridTemplateColumns: '180px 1fr',
            gap: 36, padding: '18px 0',
            borderBottom: '1px solid var(--ikk-line-soft)',
            alignItems: 'baseline',
          }}>
            <div style={{
              fontFamily: 'var(--ikk-font-mono)', fontSize: 12,
              color: 'var(--ikk-fg-dim)', letterSpacing: '0.08em',
            }}>{k.toUpperCase()}</div>
            <div style={{
              fontFamily: 'var(--ikk-font-mono)', fontSize: 14,
              color: 'var(--ikk-fg)', lineHeight: 1.55,
            }}>{v}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ============================================================================
// CONTACT — Form sits inside a single-rule layout. No card chrome, no aside.
// The "What happens next" is inlined as a single hairline-separated paragraph.
// ============================================================================
function LandingContact() {
  return (
    <Section id="contacto" eyebrow="006 — EMPEZAR" title="Contanos qué estás pensando.">
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
        marginTop: 8,
      }}>
        <form onSubmit={(e) => e.preventDefault()} style={{
          display: 'flex', flexDirection: 'column', gap: 0,
          borderTop: '1px solid var(--ikk-line)',
        }}>
          <BareField label="Nombre" placeholder="Cómo te llamamos" />
          <BareField label="Email" type="email" placeholder="vos@empresa.com" />
          <BareField label="Empresa" placeholder="Opcional — si hay una atrás" />
          <BareField label="Proyecto" placeholder="Una empresa de logística, 40 camiones, hoy todo en Excel…" textarea />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '22px 0 0',
          }}>
            <span style={{ fontSize: 12, color: 'var(--ikk-fg-dim)', fontFamily: 'var(--ikk-font-mono)' }}>
              ↵ ENTER para enviar
            </span>
            <button className="ikk-btn ikk-btn--primary" type="submit">
              Enviar mensaje <ArrowRightIcon size={15} />
            </button>
          </div>
        </form>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 12, color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em' }}>
              CONTACTO DIRECTO
            </div>
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column' }}>
              <BareFact k="EMAIL"     v="hola@ikk.solutions" />
              <BareFact k="WHATSAPP"  v="+54 9 11 5555 4444" />
              <BareFact k="BASE"      v="Buenos Aires · trabajo remoto con LATAM y España" />
              <BareFact k="HORARIO"   v="Lun–Vie · 9:00–19:00 GMT-3" />
            </div>
          </div>
          <div style={{
            paddingTop: 22, borderTop: '1px solid var(--ikk-line)',
            fontSize: 14, color: 'var(--ikk-fg-muted)', lineHeight: 1.55, maxWidth: 460,
          }}>
            <strong style={{ color: 'var(--ikk-fg)', fontWeight: 500 }}>Lo que pasa después. </strong>
            Te respondemos en menos de 24h hábiles con 3 preguntas concretas y una propuesta de discovery de 30 minutos. Si encajamos, en esa llamada decidimos juntos si tiene sentido seguir.
          </div>
        </aside>
      </div>
    </Section>
  );
}

function BareField({ label, placeholder, type = 'text', textarea }) {
  const labelWidth = 120;
  return (
    <label style={{
      display: 'grid', gridTemplateColumns: `${labelWidth}px 1fr`,
      alignItems: textarea ? 'flex-start' : 'baseline',
      padding: '16px 0', gap: 24,
      borderBottom: '1px solid var(--ikk-line-soft)',
    }}>
      <span style={{
        fontFamily: 'var(--ikk-font-mono)', fontSize: 12,
        color: 'var(--ikk-fg-dim)', letterSpacing: '0.08em', paddingTop: textarea ? 6 : 0,
      }}>{label.toUpperCase()}</span>
      {textarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          style={{
            width: '100%', minHeight: 96, padding: 0, border: 'none', resize: 'vertical',
            background: 'transparent', color: 'var(--ikk-fg)',
            fontFamily: 'var(--ikk-font-sans)', fontSize: 15, lineHeight: 1.5,
            outline: 'none',
          }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          style={{
            width: '100%', padding: 0, border: 'none',
            background: 'transparent', color: 'var(--ikk-fg)',
            fontFamily: 'var(--ikk-font-sans)', fontSize: 16,
            outline: 'none',
          }}
        />
      )}
    </label>
  );
}

function BareFact({ k, v }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '120px 1fr',
      padding: '12px 0', gap: 24,
      borderBottom: '1px solid var(--ikk-line-soft)',
      fontFamily: 'var(--ikk-font-mono)', fontSize: 13,
    }}>
      <span style={{ color: 'var(--ikk-fg-dim)', letterSpacing: '0.06em' }}>{k}</span>
      <span style={{ color: 'var(--ikk-fg)' }}>{v}</span>
    </div>
  );
}

// ============================================================================
// FOOTER — Wide manifest line + small ledger.
// ============================================================================
function LandingFooter() {
  return (
    <footer style={{
      padding: `48px ${PAGE_PAD}`,
      borderTop: '1px solid var(--ikk-line)',
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{
          fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 500,
          letterSpacing: '-0.035em', lineHeight: 1.05, maxWidth: 900,
        }}>
          Software a medida.{' '}
          <span style={{ color: 'var(--ikk-fg-muted)' }}>Ideas en producción.</span>
        </div>
        <div style={{
          marginTop: 40, paddingTop: 22, borderTop: '1px solid var(--ikk-line-soft)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'var(--ikk-font-mono)', fontSize: 12,
          color: 'var(--ikk-fg-dim)', letterSpacing: '0.04em', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IKKMark size={18} accent="var(--ikk-accent)" ghost="var(--ikk-fg)" ghostOpacity={0.22} />
            <span>IKK SOLUTIONS · BUENOS AIRES · ©&nbsp;2026</span>
          </div>
          <div>hola@ikk.solutions</div>
          <div>+54 9 11 5555 4444</div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// SECTION wrapper — used by Services / Process / Products / Stack / Contact.
// Eyebrow numbered (00X), title big, body left-anchored.
// ============================================================================
function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} style={{
      padding: `100px ${PAGE_PAD}`,
      borderBottom: '1px solid var(--ikk-line-soft)',
    }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <header style={{
          display: 'grid',
          gridTemplateColumns: '64px 1fr',
          gap: 36, marginBottom: 48, alignItems: 'flex-start',
        }}>
          <div style={{
            fontFamily: 'var(--ikk-font-mono)', fontSize: 12,
            color: 'var(--ikk-accent)', letterSpacing: '0.1em', paddingTop: 10,
          }}>{eyebrow.split(' — ')[0]}</div>
          <div>
            <div style={{
              fontFamily: 'var(--ikk-font-mono)', fontSize: 12,
              color: 'var(--ikk-fg-dim)', letterSpacing: '0.12em', marginBottom: 14,
            }}>{eyebrow.split(' — ')[1]}</div>
            <h2 style={{
              fontSize: 'clamp(32px, 4.2vw, 56px)', fontWeight: 500,
              letterSpacing: '-0.035em', lineHeight: 1.05, maxWidth: 900,
            }}>{title}</h2>
          </div>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 36 }}>
          <div />
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MOBILE — Same editorial vocabulary, scaled for 390px.
// ============================================================================
function LandingMobile({ personality }) {
  return (
    <div className="ikk" style={{ background: 'var(--ikk-bg)', width: 390, minHeight: '100%' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1px solid var(--ikk-line-soft)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IKKMark size={20} accent="var(--ikk-accent)" ghost="var(--ikk-fg)" ghostOpacity={0.22} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>IKK Solutions</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ width: 18, height: 1.5, background: 'var(--ikk-fg)' }} />
          <span style={{ width: 18, height: 1.5, background: 'var(--ikk-fg)' }} />
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: '56px 24px 48px' }}>
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center',
          fontFamily: 'var(--ikk-font-mono)', fontSize: 10.5,
          color: 'var(--ikk-fg-dim)', letterSpacing: '0.14em',
          marginBottom: 24,
        }}>
          <span>IKK · 001</span>
          <span style={{ flex: 1, height: 1, background: 'var(--ikk-line-soft)' }} />
          <span>2026</span>
        </div>
        <h1 style={{ fontSize: 54, fontWeight: 500, letterSpacing: '-0.045em', lineHeight: 0.95 }}>
          Software<br />a medida.<br />
          <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--ikk-fg-muted)' }}>Ideas en</span>
          <span style={{ color: 'var(--ikk-accent)' }}> producción</span>
          <span style={{ color: 'var(--ikk-accent)' }}>.</span>
        </h1>
        <p style={{ marginTop: 22, fontSize: 15, color: 'var(--ikk-fg-muted)', lineHeight: 1.55 }}>
          Productos web, móviles y plataformas multitenant para empresas que dejaron de escalar con planillas y SaaS genéricos.
        </p>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column' }}>
          {[
            ['EN OPERACIÓN', '3 productos propios'],
            ['EQUIPO', '6 personas · Argentina'],
            ['ESTE MES', '2 cupos de discovery'],
          ].map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', padding: '8px 0',
              borderTop: '1px solid var(--ikk-line-soft)',
              fontFamily: 'var(--ikk-font-mono)', fontSize: 11.5,
            }}>
              <span style={{ color: 'var(--ikk-fg-dim)', letterSpacing: '0.06em' }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
        <a href="#contacto" className="ikk-btn ikk-btn--primary ikk-btn--lg" style={{ width: '100%', marginTop: 22 }}>
          Hablemos de tu proyecto <ArrowRightIcon size={15} />
        </a>
      </section>

      {/* PROOF */}
      <section style={{ padding: '32px 24px', borderTop: '1px solid var(--ikk-line)', borderBottom: '1px solid var(--ikk-line)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[['3', 'productos propios en producción'], ['148', 'empresas y tenants gestionados'], ['2 410', 'usuarios activos hoy'], ['< 24h', 'tiempo medio de respuesta']].map(([v, k]) => (
            <div key={k}>
              <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.035em', lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 12, color: 'var(--ikk-fg-muted)', marginTop: 6, lineHeight: 1.4 }}>{k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section style={{ padding: '36px 24px', borderBottom: '1px solid var(--ikk-line-soft)' }}>
        <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'var(--ikk-fg-dim)', letterSpacing: '0.12em' }}>004 — PORTAFOLIO</div>
        <h2 style={{ marginTop: 10, fontSize: 28, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.05 }}>Tres productos propios.<br/>En producción.</h2>
        <div style={{ marginTop: 24 }}>
          {[
            ['P-01', 'Tickomium', 'POS · Punto de venta',     '62 empresas activas'],
            ['P-02', 'Formate',   'Pedidos · multitenant',     '47 tenants en operación'],
            ['P-03', 'mDoc',      'Médica · consultorios',     '39 clínicas'],
          ].map(([c, n, k, s], i) => (
            <div key={c} style={{
              padding: '20px 0', borderTop: i === 0 ? '1px solid var(--ikk-line)' : '1px solid var(--ikk-line-soft)',
            }}>
              <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'var(--ikk-fg-dim)', letterSpacing: '0.08em' }}>{c} · {k.toUpperCase()}</div>
              <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.03em', marginTop: 6 }}>{n}</div>
              <div style={{ marginTop: 6, fontSize: 12, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-muted)' }}>{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: '36px 24px' }}>
        <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'var(--ikk-fg-dim)', letterSpacing: '0.12em' }}>006 — EMPEZAR</div>
        <h2 style={{ marginTop: 10, fontSize: 28, fontWeight: 500, letterSpacing: '-0.03em' }}>Hablemos.</h2>
        <div style={{ marginTop: 18, borderTop: '1px solid var(--ikk-line)' }}>
          <BareField label="Nombre" placeholder="Cómo te llamamos" />
          <BareField label="Email"  placeholder="vos@empresa.com" />
          <BareField label="Proyecto" textarea placeholder="Contanos en qué pensás…" />
        </div>
        <button className="ikk-btn ikk-btn--primary ikk-btn--lg" style={{ width: '100%', marginTop: 18 }}>
          Enviar mensaje →
        </button>
      </section>

      <footer style={{ padding: '24px', borderTop: '1px solid var(--ikk-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--ikk-font-mono)', fontSize: 10.5, color: 'var(--ikk-fg-dim)', letterSpacing: '0.04em' }}>
        <span>IKK SOLUTIONS · ©&nbsp;2026</span>
        <span>hola@ikk.solutions</span>
      </footer>
    </div>
  );
}

Object.assign(window, { Landing, LandingMobile });

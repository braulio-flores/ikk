// IKK Solutions — Private panel
// Login (isolated, no public chrome) + Overview + Tickomium → Empresas.
// The whole panel is unlinked from the landing — accessed only by URL.

const { useState: useStateP } = React;

// ===========================================================================
// LOGIN — Isolated screen, no nav. Centered card on the dark surface.
// ===========================================================================
function LoginScreen({ width = 1280, height = 800, state = 'idle' }) {
  // states: 'idle' | 'loading' | 'error'
  return (
    <div className="ikk" style={{
      width, height, background: 'var(--ikk-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle hairline grid — quiet, structural. No radial blur. */}
      <div className="ikk-grid-bg" style={{
        position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none',
      }} />

      {/* Top-left wordmark only — no nav, no menu */}
      <div style={{
        position: 'absolute', top: 28, left: 32,
        display: 'flex', alignItems: 'center', gap: 12, opacity: 0.85,
      }}>
        <IKKMark size={24} accent="var(--ikk-accent)" ghost="var(--ikk-fg)" ghostOpacity={0.22} />
        <span style={{ fontWeight: 600, fontSize: 14.5 }}>IKK Solutions</span>
        <span style={{ width: 1, height: 14, background: 'var(--ikk-line)' }} />
        <span style={{
          fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)',
          letterSpacing: '0.1em',
        }}>PANEL · INTERNO</span>
      </div>

      {/* Bottom-right system signature */}
      <div style={{
        position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center',
        fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)',
        letterSpacing: '0.12em',
      }}>
        ACCESO RESTRINGIDO · {window.location?.host || 'ikk.solutions'}/login
      </div>

      <div style={{
        position: 'relative', width: 400, padding: 32,
        background: 'var(--ikk-bg-card)', border: '1px solid var(--ikk-line)',
        borderRadius: 16, boxShadow: 'var(--ikk-shadow-lg)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <IKKMark size={44} accent="var(--ikk-accent)" ghost="var(--ikk-fg)" ghostOpacity={0.22} />
          <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Iniciar sesión</div>
          <div style={{ fontSize: 13, color: 'var(--ikk-fg-muted)' }}>Panel de administración interno</div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={(e) => e.preventDefault()}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--ikk-fg-muted)', fontFamily: 'var(--ikk-font-mono)', letterSpacing: '0.04em' }}>EMAIL</span>
            <div style={{ position: 'relative' }}>
              <MailIcon size={15} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--ikk-fg-dim)' }} />
              <input className="ikk-input" defaultValue="admin@ikk.solutions" style={{ paddingLeft: 36 }} />
            </div>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--ikk-fg-muted)', fontFamily: 'var(--ikk-font-mono)', letterSpacing: '0.04em' }}>CONTRASEÑA</span>
              <a href="#" style={{ fontSize: 12, color: 'var(--ikk-accent)' }}>Olvidé mi contraseña</a>
            </div>
            <div style={{ position: 'relative' }}>
              <LockIcon size={15} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--ikk-fg-dim)' }} />
              <input className="ikk-input" type="password" defaultValue={state === 'error' ? 'wrong-password' : '••••••••••'} style={{
                paddingLeft: 36,
                borderColor: state === 'error' ? 'var(--ikk-danger)' : undefined,
                boxShadow: state === 'error' ? '0 0 0 3px color-mix(in oklab, var(--ikk-danger) 18%, transparent)' : undefined,
              }} />
            </div>
            {state === 'error' && (
              <div style={{ fontSize: 12, color: 'var(--ikk-danger)', fontFamily: 'var(--ikk-font-mono)', marginTop: 2 }}>
                · Credenciales inválidas
              </div>
            )}
          </label>

          <button className="ikk-btn ikk-btn--primary" style={{ marginTop: 6, height: 42 }} disabled={state === 'loading'}>
            {state === 'loading' ? (
              <>
                <Spinner size={14} />
                <span>Verificando…</span>
              </>
            ) : (
              <>Entrar al panel <ArrowRightIcon size={16} /></>
            )}
          </button>
        </form>

        <div style={{
          marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--ikk-line-soft)',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 11.5, color: 'var(--ikk-fg-dim)', fontFamily: 'var(--ikk-font-mono)',
        }}>
          <ShieldIcon size={13} />
          <span>Sesión cifrada · 2FA opcional</span>
        </div>
      </div>
    </div>
  );
}

function Spinner({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'ikkspin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
      <path d="M 22 12 A 10 10 0 0 0 12 2" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ===========================================================================
// PANEL SHELL — Sidebar + Topbar, used by Overview + Tickomium.
// ===========================================================================
function PanelShell({ width = 1440, height = 900, active = 'overview', activeSub, headerSlot, children, productBadge = 'IKK Master' }) {
  return (
    <div className="ikk" style={{ width, height, background: 'var(--ikk-bg)', display: 'flex', overflow: 'hidden' }}>
      <Sidebar active={active} activeSub={activeSub} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar productBadge={productBadge} headerSlot={headerSlot} />
        <main style={{ flex: 1, overflow: 'auto', background: 'var(--ikk-bg)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function Sidebar({ active, activeSub }) {
  const sections = [
    { id: 'overview', label: 'Overview', icon: <HomeIcon size={15} /> },
    {
      id: 'tickomium', label: 'Tickomium', icon: <StoreIcon size={15} />, code: 'P-01',
      sub: [
        { id: 'empresas', label: 'Empresas' },
        { id: 'usuarios', label: 'Usuarios' },
        { id: 'planes', label: 'Planes' },
        { id: 'notif', label: 'Notificaciones' },
      ],
    },
    {
      id: 'formate', label: 'Formate', icon: <OrdersIcon size={15} />, code: 'P-02',
      sub: [
        { id: 'tenants', label: 'Tenants' },
        { id: 'usuarios', label: 'Usuarios' },
        { id: 'config', label: 'Configuración' },
      ],
    },
    {
      id: 'mdoc', label: 'mDoc', icon: <MedIcon size={15} />, code: 'P-03',
      sub: [
        { id: 'clinicas', label: 'Clínicas' },
        { id: 'medicos', label: 'Usuarios médicos' },
        { id: 'auditoria', label: 'Auditoría clínica' },
      ],
    },
    { id: 'config', label: 'Configuración global', icon: <SettingsIcon size={15} /> },
  ];

  return (
    <aside style={{
      width: 248, flexShrink: 0, height: '100%',
      background: 'var(--ikk-bg-elev)',
      borderRight: '1px solid var(--ikk-line-soft)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '18px 18px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <IKKMark size={24} accent="var(--ikk-accent)" ghost="var(--ikk-fg)" ghostOpacity={0.22} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', lineHeight: 1.1 }}>IKK Master</div>
          <div style={{ fontSize: 10.5, color: 'var(--ikk-fg-dim)', fontFamily: 'var(--ikk-font-mono)', letterSpacing: '0.08em' }}>PANEL · INTERNO</div>
        </div>
      </div>

      <div style={{ padding: '6px 12px' }}>
        <div style={{ position: 'relative' }}>
          <SearchIcon size={13} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--ikk-fg-dim)' }} />
          <input className="ikk-input" placeholder="Buscar empresa, tenant…" style={{ height: 32, fontSize: 13, paddingLeft: 30, paddingRight: 36, background: 'var(--ikk-bg)' }} />
          <span className="ikk-kbd" style={{ position: 'absolute', right: 8, top: 7 }}>⌘K</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
        {sections.map(s => (
          <SidebarItem key={s.id} item={s} active={active} activeSub={activeSub} />
        ))}
      </nav>

      <div style={{
        padding: 12, borderTop: '1px solid var(--ikk-line-soft)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 6, flexShrink: 0,
          background: 'var(--ikk-bg-hover)', color: 'var(--ikk-fg-muted)',
          border: '1px solid var(--ikk-line-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--ikk-font-mono)', fontWeight: 500, fontSize: 11,
        }}>IK</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.1 }}>Iván Krause</div>
          <div style={{ fontSize: 11, color: 'var(--ikk-fg-dim)', fontFamily: 'var(--ikk-font-mono)' }}>admin · owner</div>
        </div>
        <button style={ghostIcon}><LogoutIcon size={14} /></button>
      </div>
    </aside>
  );
}

const ghostIcon = {
  width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent',
  color: 'var(--ikk-fg-muted)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function SidebarItem({ item, active, activeSub }) {
  const isActive = active === item.id;
  const expanded = isActive && item.sub;
  return (
    <div>
      <button style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '8px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
        background: isActive ? 'var(--ikk-bg-hover)' : 'transparent',
        color: isActive ? 'var(--ikk-fg)' : 'var(--ikk-fg-muted)',
        fontSize: 13.5, fontFamily: 'inherit', fontWeight: 500, textAlign: 'left',
        position: 'relative',
      }}>
        {isActive && (
          <span style={{
            position: 'absolute', left: -8, top: 8, bottom: 8, width: 2,
            background: 'var(--ikk-accent)',
          }} />
        )}
        <span style={{
          width: 22, height: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isActive ? 'var(--ikk-fg)' : 'var(--ikk-fg-dim)',
        }}>{item.icon}</span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.code && (
          <span style={{
            fontFamily: 'var(--ikk-font-mono)', fontSize: 10.5,
            color: 'var(--ikk-fg-dim)', letterSpacing: '0.06em',
          }}>{item.code}</span>
        )}
        {item.sub && <ChevDownIcon size={13} style={{ opacity: 0.5, transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .15s' }} />}
      </button>
      {expanded && (
        <div style={{ marginLeft: 32, marginTop: 2, marginBottom: 4, display: 'flex', flexDirection: 'column', gap: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: -16, top: 4, bottom: 4, width: 1, background: 'var(--ikk-line-soft)' }} />
          {item.sub.map(s => {
            const sa = activeSub === s.id;
            return (
              <button key={s.id} style={{
                padding: '6px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
                background: sa ? 'var(--ikk-bg-hover)' : 'transparent',
                color: sa ? 'var(--ikk-fg)' : 'var(--ikk-fg-muted)',
                fontSize: 13, textAlign: 'left', fontFamily: 'inherit',
              }}>{s.label}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Topbar({ productBadge, headerSlot }) {
  return (
    <header style={{
      height: 56, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '0 24px',
      borderBottom: '1px solid var(--ikk-line-soft)',
      background: 'var(--ikk-bg)',
    }}>
      {headerSlot || (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 14px', borderRadius: 6,
          border: '1px solid var(--ikk-line)',
          fontSize: 13,
        }}>
          <span style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'var(--ikk-fg-dim)', letterSpacing: '0.08em' }}>IKK</span>
          <span style={{ fontWeight: 500 }}>{productBadge}</span>
          <ChevDownIcon size={13} style={{ color: 'var(--ikk-fg-dim)' }} />
        </div>
      )}
      <div style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
        <SearchIcon size={14} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--ikk-fg-dim)' }} />
        <input className="ikk-input" placeholder="Buscar empresas, usuarios, suscripciones…" style={{ height: 36, paddingLeft: 36, fontSize: 13, background: 'var(--ikk-bg-card)' }} />
        <span className="ikk-kbd" style={{ position: 'absolute', right: 10, top: 9 }}>⌘K</span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <button style={{ ...ghostIcon, width: 32, height: 32, position: 'relative' }}>
          <BellIcon size={15} />
          <span style={{ position: 'absolute', top: 7, right: 8, width: 6, height: 6, borderRadius: 999, background: 'var(--ikk-danger)' }} />
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '4px 4px 4px 12px', borderRadius: 6,
          border: '1px solid var(--ikk-line)',
        }}>
          <span style={{ fontSize: 12.5 }}>Iván Krause</span>
          <span style={{
            width: 24, height: 24, borderRadius: 5,
            background: 'var(--ikk-bg-hover)', color: 'var(--ikk-fg-muted)',
            border: '1px solid var(--ikk-line-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--ikk-font-mono)', fontWeight: 500, fontSize: 11,
          }}>IK</span>
        </div>
      </div>
    </header>
  );
}

// ===========================================================================
// OVERVIEW
// ===========================================================================
function PanelOverview({ width = 1440, height = 900 }) {
  return (
    <PanelShell width={width} height={height} active="overview">
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em' }}>HOME · MARTES 13 MAY · 09:42</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4 }}>
            <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Buen día, Iván</h1>
            <span style={{ fontSize: 14, color: 'var(--ikk-fg-muted)' }}>· 3 alertas pendientes · 2 pagos por revisar</span>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          <KPI label="Empresas / Tenants / Clínicas" value="148" delta="+12 / mes" />
          <KPI label="Usuarios activos" value="2 410" delta="+184" />
          <KPI label="Suscripciones activas" value="312" delta="+8.4%" />
          <KPI label="Ingresos del mes (MRR)" value="USD 18 420" delta="+6.1%" prim />
          <KPI label="Alertas pendientes" value="3" delta="2 pago · 1 trial venc." warn />
        </div>

        {/* Activity chart + alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
          <div className="ikk-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em' }}>ACTIVIDAD · ÚLTIMOS 30 DÍAS</div>
                <div style={{ fontSize: 17, fontWeight: 500, marginTop: 4 }}>Suscripciones nuevas vs canceladas</div>
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--ikk-fg-muted)' }}>
                <Legend color="var(--ikk-accent)" label="Nuevas" />
                <Legend color="var(--ikk-danger)" label="Canceladas" />
                <Legend color="var(--ikk-warn)" label="Trial → activa" />
              </div>
            </div>
            <ActivityChart />
          </div>

          <div className="ikk-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em' }}>ALERTAS</div>
              <div style={{ fontSize: 17, fontWeight: 500, marginTop: 4 }}>Requieren tu atención</div>
            </div>
            <Alert tone="danger" title="Pago rechazado · Empresa Ñandú" sub="Tickomium · plan PRO · 2do reintento" time="hace 2h" />
            <Alert tone="warn"   title="Trial por vencer · Quirquincho SA" sub="Formate · 3 días restantes" time="hoy 08:11" />
            <Alert tone="warn"   title="Trial por vencer · Clínica San Telmo" sub="mDoc · 5 días restantes" time="ayer" />
            <button className="ikk-btn ikk-btn--ghost ikk-btn--sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>Ver todas →</button>
          </div>
        </div>

        {/* Per-product breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <ProductSummary
            name="Tickomium" tag="POS" code="P-01"
            metrics={[['Empresas', '62'], ['Activas', '54'], ['Trial', '5'], ['MRR', 'USD 8 120']]}
          />
          <ProductSummary
            name="Formate" tag="Pedidos" code="P-02"
            metrics={[['Tenants', '47'], ['Activos', '41'], ['Trial', '4'], ['MRR', 'USD 5 980']]}
          />
          <ProductSummary
            name="mDoc" tag="Médica" code="P-03"
            metrics={[['Clínicas', '39'], ['Activas', '34'], ['Trial', '3'], ['MRR', 'USD 4 320']]}
          />
        </div>
      </div>
    </PanelShell>
  );
}

function KPI({ label, value, delta, prim, warn }) {
  return (
    <div className="ikk-card" style={{ padding: 16 }}>
      <div style={{ fontSize: 10.5, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', letterSpacing: '0.08em' }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', marginTop: 6, color: prim ? 'var(--ikk-accent)' : 'var(--ikk-fg)' }}>{value}</div>
      <div style={{ fontSize: 12, color: warn ? 'var(--ikk-warn)' : 'var(--ikk-success)', fontFamily: 'var(--ikk-font-mono)', marginTop: 3 }}>{delta}</div>
    </div>
  );
}

function Legend({ color, label }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />{label}</span>;
}

function ActivityChart() {
  // 30 data points, two series (new + cancelled). Hand-curated for shape.
  const news =   [3,4,5,3,6,7,5,6,8,7,9,8,10,9,11,10,12,11,13,12,14,13,15,14,16,15,17,16,18,17];
  const canc =   [1,2,1,2,1,2,3,2,3,2,3,4,3,4,3,4,5,4,5,4,5,6,5,6,5,6,7,6,7,6];
  const trials =[2,3,2,3,4,3,4,5,4,5,6,5,6,7,6,7,8,7,8,9,8,9,10,9,10,11,10,11,12,11];
  const W = 640, H = 200, P = 18;
  const max = 22;
  const x = (i) => P + (i / (news.length - 1)) * (W - P * 2);
  const y = (v) => H - P - (v / max) * (H - P * 2);
  const path = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const area = (arr) => path(arr) + ` L ${x(arr.length - 1)} ${H - P} L ${x(0)} ${H - P} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 200, overflow: 'visible' }}>
      <defs>
        <linearGradient id="grAcc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ikk-accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--ikk-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1={P} x2={W - P} y1={P + i * ((H - P * 2) / 3)} y2={P + i * ((H - P * 2) / 3)}
              stroke="var(--ikk-line-soft)" strokeDasharray="2 4" />
      ))}
      <path d={area(news)} fill="url(#grAcc)" />
      <path d={path(news)}   stroke="var(--ikk-accent)" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d={path(trials)} stroke="var(--ikk-warn)"   strokeWidth="1.5" fill="none" strokeDasharray="3 3" strokeLinejoin="round" />
      <path d={path(canc)}   stroke="var(--ikk-danger)" strokeWidth="1.5" fill="none" strokeLinejoin="round" opacity="0.9" />
      {/* x ticks */}
      {[0, 7, 14, 21, 29].map(i => (
        <text key={i} x={x(i)} y={H - 2} textAnchor="middle" fontFamily="var(--ikk-font-mono)" fontSize="10" fill="var(--ikk-fg-dim)">
          {`d${i + 1}`}
        </text>
      ))}
    </svg>
  );
}

function Alert({ tone, title, sub, time }) {
  const color = tone === 'danger' ? 'var(--ikk-danger)' : 'var(--ikk-warn)';
  const tag = tone === 'danger' ? 'PAGO' : 'TRIAL';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '64px 1fr auto',
      gap: 12, alignItems: 'flex-start',
      padding: '14px 0',
      borderBottom: '1px solid var(--ikk-line-soft)',
    }}>
      <div style={{
        fontFamily: 'var(--ikk-font-mono)', fontSize: 11,
        color, letterSpacing: '0.08em', paddingTop: 2,
      }}>· {tag}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.25 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--ikk-fg-muted)', marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', paddingTop: 3 }}>{time}</div>
    </div>
  );
}

function ProductSummary({ name, tag, hue, glyph, metrics, code }) {
  return (
    <div className="ikk-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--ikk-line-soft)' }}>
        <div>
          <div style={{ fontSize: 10.5, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em' }}>{code} · {tag.toUpperCase()}</div>
          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>{name}</div>
        </div>
        <button style={ghostIcon}><MoreIcon size={14} /></button>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {metrics.map(([k, v], i) => (
          <div key={k} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: i === metrics.length - 1 ? 'none' : '1px solid var(--ikk-line-soft)',
            fontSize: 13, fontFamily: 'var(--ikk-font-mono)',
          }}>
            <span style={{ color: 'var(--ikk-fg-dim)' }}>{k}</span>
            <span style={{ color: 'var(--ikk-fg)' }}>{v}</span>
          </div>
        ))}
      </div>
      <button className="ikk-btn ikk-btn--secondary ikk-btn--sm" style={{ alignSelf: 'flex-start' }}>Abrir {name} →</button>
    </div>
  );
}

// ===========================================================================
// TICKOMIUM → EMPRESAS
// ===========================================================================
function TickomiumEmpresas({ width = 1440, height = 900, drawerOpen = false }) {
  const rows = [
    { id: 1, name: 'Empresa Ñandú',         state: 'active',   plan: 'PRO',    since: '14 mar 2024', until: '12 dic 2026', mrr: '$ 240', users: 18 },
    { id: 2, name: 'Quirquincho SA',         state: 'trial',    plan: 'TRIAL',  since: '06 may 2026', until: '20 may 2026', mrr: '—',     users: 4 },
    { id: 3, name: 'Tres Marías SRL',        state: 'active',   plan: 'STARTER',since: '02 oct 2024', until: '02 oct 2026', mrr: '$ 90',  users: 7 },
    { id: 4, name: 'Distri Norte',           state: 'suspend',  plan: 'PRO',    since: '11 jun 2023', until: '11 jun 2026', mrr: '$ 240', users: 22 },
    { id: 5, name: 'Café Quebracho',         state: 'active',   plan: 'STARTER',since: '21 feb 2025', until: '21 feb 2027', mrr: '$ 90',  users: 5 },
    { id: 6, name: 'Mercado Sur',            state: 'overdue',  plan: 'STARTER',since: '03 sep 2024', until: '03 abr 2026', mrr: '$ 90',  users: 6 },
    { id: 7, name: 'Almacén Don Pedro',      state: 'active',   plan: 'STARTER',since: '18 ene 2025', until: '18 ene 2027', mrr: '$ 90',  users: 3 },
    { id: 8, name: 'Carnicería La Esperanza',state: 'trial',    plan: 'TRIAL',  since: '09 may 2026', until: '23 may 2026', mrr: '—',     users: 2 },
    { id: 9, name: 'Panadería Pampa',        state: 'active',   plan: 'PRO',    since: '14 nov 2023', until: '14 nov 2026', mrr: '$ 240', users: 12 },
    { id:10, name: 'Bodega Mendoza',         state: 'active',   plan: 'PRO',    since: '07 mar 2024', until: '07 mar 2027', mrr: '$ 240', users: 16 },
    { id:11, name: 'Heladería Esquina',      state: 'overdue',  plan: 'STARTER',since: '22 oct 2024', until: '22 abr 2026', mrr: '$ 90',  users: 4 },
    { id:12, name: 'Kiosko 24 / Lavalle',    state: 'active',   plan: 'STARTER',since: '01 ago 2025', until: '01 ago 2027', mrr: '$ 90',  users: 2 },
  ];
  const stateLabel = { active: 'Activo', trial: 'Trial', suspend: 'Suspendido', overdue: 'Vencido' };
  const stateClass = { active: 'active', trial: 'trial', suspend: 'suspend', overdue: 'overdue' };

  const productBadge = (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '8px 14px', borderRadius: 6,
      background: 'transparent', border: '1px solid var(--ikk-line)',
      fontSize: 13,
    }}>
      <span style={{
        fontFamily: 'var(--ikk-font-mono)', fontSize: 11,
        color: 'var(--ikk-fg-dim)', letterSpacing: '0.08em',
      }}>P-01</span>
      <span style={{ fontWeight: 500 }}>Tickomium</span>
      <span style={{ width: 1, height: 14, background: 'var(--ikk-line)' }} />
      <span style={{ color: 'var(--ikk-fg-muted)' }}>Empresas</span>
      <ChevDownIcon size={13} style={{ color: 'var(--ikk-fg-dim)', marginLeft: 4 }} />
    </div>
  );

  return (
    <PanelShell width={width} height={height} active="tickomium" activeSub="empresas" headerSlot={productBadge}>
      <div style={{ position: 'relative', height: '100%' }}>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, opacity: drawerOpen ? 0.35 : 1, transition: 'opacity .15s' }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em' }}>TICKOMIUM / EMPRESAS</div>
              <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>Empresas <span style={{ color: 'var(--ikk-fg-dim)', fontWeight: 400 }}>· 62</span></h1>
              <div style={{ fontSize: 13.5, color: 'var(--ikk-fg-muted)', marginTop: 4 }}>Empresas que usan Tickomium. Acciones rápidas: extender, cambiar plan, suspender.</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="ikk-btn ikk-btn--secondary"><DownloadIcon size={14} /> Exportar CSV</button>
              <button className="ikk-btn ikk-btn--primary"><PlusIcon size={14} /> Crear empresa</button>
            </div>
          </div>

          {/* Filter / tab strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid var(--ikk-line-soft)', paddingBottom: 0 }}>
            <div style={{ display: 'flex', gap: 0 }}>
              {[
                ['all', 'Todas', 62],
                ['active', 'Activas', 54],
                ['trial', 'Trial', 5],
                ['suspend', 'Suspendidas', 2],
                ['overdue', 'Vencidas', 1],
              ].map(([k, l, n], i) => (
                <button key={k} style={{
                  padding: '10px 14px', border: 'none', cursor: 'pointer',
                  background: 'transparent', fontFamily: 'inherit',
                  color: i === 0 ? 'var(--ikk-fg)' : 'var(--ikk-fg-muted)',
                  fontSize: 13, fontWeight: 500,
                  borderBottom: i === 0 ? '2px solid var(--ikk-accent)' : '2px solid transparent',
                  marginBottom: -1,
                }}>{l}<span style={{ marginLeft: 6, fontSize: 11, color: 'var(--ikk-fg-dim)', fontFamily: 'var(--ikk-font-mono)' }}>{n}</span></button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative' }}>
                <SearchIcon size={13} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--ikk-fg-dim)' }} />
                <input className="ikk-input" placeholder="Buscar empresa…" style={{ height: 32, paddingLeft: 30, fontSize: 13, width: 220, background: 'var(--ikk-bg-card)' }} />
              </div>
              <button className="ikk-btn ikk-btn--secondary ikk-btn--sm"><FilterIcon size={13} /> Filtros</button>
            </div>
          </div>

          {/* Table */}
          <div className="ikk-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '34px 1.5fr 110px 110px 130px 130px 100px 60px 36px',
              padding: '10px 16px', alignItems: 'center', gap: 12,
              background: 'var(--ikk-bg-elev)',
              borderBottom: '1px solid var(--ikk-line)',
              fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', letterSpacing: '0.08em',
            }}>
              <input type="checkbox" />
              <div>EMPRESA</div>
              <div>ESTADO</div>
              <div>PLAN</div>
              <div>FECHA ALTA</div>
              <div>VENCE</div>
              <div style={{ textAlign: 'right' }}>MRR</div>
              <div style={{ textAlign: 'right' }}>USR</div>
              <div />
            </div>
            {rows.map((r, i) => (
              <div key={r.id} style={{
                display: 'grid', gridTemplateColumns: '34px 1.5fr 110px 110px 130px 130px 100px 60px 36px',
                padding: '14px 16px', alignItems: 'center', gap: 12,
                borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--ikk-line-soft)',
                background: drawerOpen && r.id === 1 ? 'var(--ikk-bg-hover)' : 'transparent',
                fontSize: 13.5,
              }}>
                <input type="checkbox" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: 'var(--ikk-bg-hover)', color: 'var(--ikk-fg-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--ikk-font-mono)', fontWeight: 600, fontSize: 11,
                  }}>{r.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{r.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ikk-fg-dim)', fontFamily: 'var(--ikk-font-mono)' }}>#{r.id.toString().padStart(4, '0')}</div>
                  </div>
                </div>
                <div><span className={`ikk-badge ikk-badge--${stateClass[r.state]}`}>{stateLabel[r.state]}</span></div>
                <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 12, color: 'var(--ikk-fg-muted)' }}>{r.plan}</div>
                <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 12, color: 'var(--ikk-fg-muted)' }}>{r.since}</div>
                <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 12, color: r.state === 'overdue' ? 'var(--ikk-danger)' : 'var(--ikk-fg-muted)' }}>{r.until}</div>
                <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 12, textAlign: 'right' }}>{r.mrr}</div>
                <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 12, color: 'var(--ikk-fg-muted)', textAlign: 'right' }}>{r.users}</div>
                <button style={ghostIcon}><MoreIcon size={14} /></button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ikk-fg-muted)', fontFamily: 'var(--ikk-font-mono)' }}>
            <span>Mostrando 1–12 de 62</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="ikk-btn ikk-btn--secondary ikk-btn--sm">‹ Anterior</button>
              <button className="ikk-btn ikk-btn--secondary ikk-btn--sm">Siguiente ›</button>
            </div>
          </div>
        </div>

        {drawerOpen && <EmpresaDrawer />}
      </div>
    </PanelShell>
  );
}

function EmpresaDrawer() {
  return (
    <aside style={{
      position: 'absolute', top: 0, right: 0, width: 440, height: '100%',
      background: 'var(--ikk-bg-card)', borderLeft: '1px solid var(--ikk-line)',
      boxShadow: '-24px 0 60px rgba(0,0,0,0.35)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '18px 22px', borderBottom: '1px solid var(--ikk-line-soft)',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, flexShrink: 0,
          background: 'var(--ikk-bg-hover)', color: 'var(--ikk-fg-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--ikk-font-mono)', fontWeight: 600, fontSize: 14,
        }}>EÑ</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em' }}>EMPRESA · #0001</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2, letterSpacing: '-0.01em' }}>Empresa Ñandú</div>
          <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
            <span className="ikk-badge ikk-badge--active">Activo</span>
            <span className="ikk-badge ikk-badge--neutral">PRO · USD 240</span>
          </div>
        </div>
        <button style={ghostIcon}>×</button>
      </div>

      <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 18, overflow: 'auto', flex: 1 }}>
        <DrawerSection label="DETALLE">
          <DrawerRow k="Razón social" v="Ñandú Comercial SRL" />
          <DrawerRow k="CUIT"          v="30-71456789-2" />
          <DrawerRow k="Alta"          v="14 mar 2024" />
          <DrawerRow k="Vence"         v="12 dic 2026" />
          <DrawerRow k="Plan"          v="PRO · USD 240 / mes" />
          <DrawerRow k="Sucursales"    v="4" />
          <DrawerRow k="Usuarios"      v="18 (3 admin · 15 cajero)" />
        </DrawerSection>

        <DrawerSection label="ACTIVIDAD RECIENTE">
          <Timeline items={[
            { d: 'hoy 09:14', t: 'Plan extendido a 12 dic 2026', tone: 'info' },
            { d: 'ayer',      t: 'Usuario nuevo: maria@nandu.com', tone: 'neutral' },
            { d: '11 may',    t: 'Pago procesado · USD 240',     tone: 'success' },
            { d: '02 may',    t: 'Cambio de plan: STARTER → PRO', tone: 'info' },
          ]} />
        </DrawerSection>
      </div>

      <div style={{
        padding: 16, borderTop: '1px solid var(--ikk-line-soft)',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
      }}>
        <button className="ikk-btn ikk-btn--secondary ikk-btn--sm">Cambiar plan</button>
        <button className="ikk-btn ikk-btn--secondary ikk-btn--sm">Extender suscripción</button>
        <button className="ikk-btn ikk-btn--ghost ikk-btn--sm" style={{ color: 'var(--ikk-warn)', gridColumn: '1 / -1' }}>Suspender empresa</button>
      </div>
    </aside>
  );
}

function DrawerSection({ label, children }) {
  return (
    <section>
      <div style={{ fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', letterSpacing: '0.12em', marginBottom: 10 }}>{label}</div>
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: 'var(--ikk-bg-elev)', border: '1px solid var(--ikk-line-soft)',
        borderRadius: 10, overflow: 'hidden',
      }}>{children}</div>
    </section>
  );
}
function DrawerRow({ k, v }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 14px', borderBottom: '1px solid var(--ikk-line-soft)',
      fontSize: 13,
    }}>
      <span style={{ color: 'var(--ikk-fg-muted)' }}>{k}</span>
      <span style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 12.5 }}>{v}</span>
    </div>
  );
}
function Timeline({ items }) {
  const map = { info: 'var(--ikk-info)', success: 'var(--ikk-success)', neutral: 'var(--ikk-fg-dim)' };
  return (
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: map[it.tone], marginTop: 5 }} />
            {i !== items.length - 1 && <span style={{ flex: 1, width: 1, background: 'var(--ikk-line-soft)', marginTop: 4 }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: i === items.length - 1 ? 0 : 6 }}>
            <div style={{ fontSize: 13 }}>{it.t}</div>
            <div style={{ fontSize: 11, color: 'var(--ikk-fg-dim)', fontFamily: 'var(--ikk-font-mono)', marginTop: 2 }}>{it.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { LoginScreen, PanelOverview, TickomiumEmpresas, PanelShell, Sidebar, Topbar });

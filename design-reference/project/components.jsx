// IKK Solutions — Core components artboard
// Inline showcase: Button, Input, Select, Badge, Card, Tabs, Toast, Modal.
// Plus the Sidebar + Topbar primitives that the panel screens reuse.

const { useState: useStateC } = React;

function ComponentsArtboard() {
  const [tab, setTab] = useStateC('all');
  return (
    <div className="ikk" style={{ padding: 32, background: 'var(--ikk-bg)', height: '100%', overflow: 'auto' }}>
      <ArtboardHeader title="Componentes" sub="Botones, inputs, badges, tablas, modal — base shadcn-friendly" />

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        <Panel title="Buttons">
          <Row>
            <button className="ikk-btn ikk-btn--primary">Hablemos de tu proyecto</button>
            <button className="ikk-btn ikk-btn--secondary">Ver productos</button>
            <button className="ikk-btn ikk-btn--ghost">Cancelar</button>
          </Row>
          <Row>
            <button className="ikk-btn ikk-btn--primary ikk-btn--sm">Crear</button>
            <button className="ikk-btn ikk-btn--secondary ikk-btn--sm">Exportar</button>
            <button className="ikk-btn ikk-btn--ghost ikk-btn--sm">···</button>
          </Row>
          <Row>
            <button className="ikk-btn ikk-btn--primary ikk-btn--lg">Iniciar proyecto →</button>
          </Row>
        </Panel>

        <Panel title="Inputs">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={fieldLabelStyle}>Email</label>
            <input className="ikk-input" defaultValue="admin@ikk.solutions" />
            <label style={fieldLabelStyle}>Contraseña</label>
            <input className="ikk-input" type="password" defaultValue="••••••••••" />
            <label style={fieldLabelStyle}>Buscar</label>
            <div style={{ position: 'relative' }}>
              <input className="ikk-input" placeholder="Buscar empresas, usuarios…" style={{ paddingLeft: 36 }} />
              <SearchIcon style={{ position: 'absolute', left: 12, top: 12, color: 'var(--ikk-fg-dim)' }} />
              <span className="ikk-kbd" style={{ position: 'absolute', right: 10, top: 11 }}>⌘K</span>
            </div>
          </div>
        </Panel>

        <Panel title="Badges — estados de suscripción">
          <Row>
            <span className="ikk-badge ikk-badge--active">Activo</span>
            <span className="ikk-badge ikk-badge--trial">Trial</span>
            <span className="ikk-badge ikk-badge--suspend">Suspendido</span>
            <span className="ikk-badge ikk-badge--overdue">Vencido</span>
            <span className="ikk-badge ikk-badge--neutral">Borrador</span>
          </Row>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ikk-fg-dim)' }}>
            Mono · color heredado del estado · indicador puntual a la izquierda.
          </div>
        </Panel>

        <Panel title="Tabs">
          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--ikk-line)', paddingBottom: 0 }}>
            {['all', 'active', 'trial', 'suspended'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer',
                color: tab === t ? 'var(--ikk-fg)' : 'var(--ikk-fg-muted)',
                fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                borderBottom: tab === t ? '2px solid var(--ikk-accent)' : '2px solid transparent',
                marginBottom: -1,
              }}>{labelES(t)}</button>
            ))}
          </div>
        </Panel>

        <Panel title="Card / KPI">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <KPICard label="Empresas" value="148" delta="+12" trend="up" />
            <KPICard label="Suscripciones activas" value="312" delta="+8.4%" trend="up" />
          </div>
        </Panel>

        <Panel title="Toast">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Toast tone="success" title="Suscripción extendida" sub="Plan PRO de Empresa Ñandú hasta 12 dic." />
            <Toast tone="danger" title="Pago rechazado" sub="Empresa Quirquincho · revisar método de pago." />
          </div>
        </Panel>

        <Panel title="Modal (preview)" wide>
          <div style={{
            background: 'var(--ikk-bg-card)', border: '1px solid var(--ikk-line)', borderRadius: 12,
            padding: 20, boxShadow: 'var(--ikk-shadow-lg)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Suspender empresa</div>
            <div style={{ fontSize: 13, color: 'var(--ikk-fg-muted)', marginTop: 6 }}>
              Esto pausa el acceso de "Empresa Ñandú" a Tickomium. Los datos no se eliminan.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 18 }}>
              <button className="ikk-btn ikk-btn--ghost ikk-btn--sm">Cancelar</button>
              <button className="ikk-btn ikk-btn--primary ikk-btn--sm" style={{ background: 'var(--ikk-danger)' }}>Suspender</button>
            </div>
          </div>
        </Panel>

      </div>
    </div>
  );
}

function labelES(t) {
  return { all: 'Todas', active: 'Activas', trial: 'Trial', suspended: 'Suspendidas' }[t];
}

function Panel({ title, children, wide }) {
  return (
    <div className="ikk-card" style={{ padding: 18, gridColumn: wide ? '1 / -1' : undefined }}>
      <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'var(--ikk-fg-dim)', letterSpacing: '0.12em', marginBottom: 14 }}>{title.toUpperCase()}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}
function Row({ children }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>{children}</div>;
}
const fieldLabelStyle = { fontSize: 12, color: 'var(--ikk-fg-muted)', fontFamily: 'var(--ikk-font-mono)', letterSpacing: '0.04em' };

function KPICard({ label, value, delta, trend }) {
  const color = trend === 'up' ? 'var(--ikk-success)' : 'var(--ikk-danger)';
  return (
    <div style={{
      padding: 14, background: 'var(--ikk-bg-elev)', borderRadius: 10,
      border: '1px solid var(--ikk-line-soft)',
    }}>
      <div style={{ fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)', letterSpacing: '0.08em' }}>{label.toUpperCase()}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{value}</div>
        <div style={{ fontSize: 12, color, fontFamily: 'var(--ikk-font-mono)' }}>{delta}</div>
      </div>
    </div>
  );
}

function Toast({ tone, title, sub }) {
  const map = {
    success: { color: 'var(--ikk-success)', label: 'OK' },
    danger:  { color: 'var(--ikk-danger)',  label: 'ERR' },
    info:    { color: 'var(--ikk-info)',    label: 'INF' },
  }[tone];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '56px 1fr auto',
      gap: 14, alignItems: 'flex-start',
      padding: '12px 0',
      borderTop: '1px solid var(--ikk-line-soft)',
    }}>
      <div style={{
        fontFamily: 'var(--ikk-font-mono)', fontSize: 11,
        color: map.color, letterSpacing: '0.08em', paddingTop: 2,
      }}>· {map.label}</div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--ikk-fg-muted)', marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ color: 'var(--ikk-fg-dim)', cursor: 'pointer', fontSize: 14, paddingTop: 2 }}>×</div>
    </div>
  );
}

// --- Inline icon set (Lucide-derived) -------------------------------------
function Icon({ d, size = 16, stroke = 1.6, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}>
      {d}
    </svg>
  );
}
const SearchIcon = (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />;
const ChevDownIcon = (p) => <Icon {...p} d={<path d="m6 9 6 6 6-6"/>} />;
const ChevRightIcon = (p) => <Icon {...p} d={<path d="m9 18 6-6-6-6"/>} />;
const HomeIcon = (p) => <Icon {...p} d={<><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></>} />;
const StoreIcon = (p) => <Icon {...p} d={<><path d="M3 9 4 4h16l1 5"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/></>} />;
const OrdersIcon = (p) => <Icon {...p} d={<><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>} />;
const MedIcon = (p) => <Icon {...p} d={<><path d="M12 3v18M3 12h18" strokeWidth="2.2"/><circle cx="12" cy="12" r="9"/></>} />;
const SettingsIcon = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>} />;
const BellIcon = (p) => <Icon {...p} d={<><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>} />;
const ArrowRightIcon = (p) => <Icon {...p} d={<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>} />;
const CheckIcon = (p) => <Icon {...p} d={<path d="m5 13 4 4L19 7"/>} />;
const PlusIcon = (p) => <Icon {...p} d={<><path d="M12 5v14"/><path d="M5 12h14"/></>} />;
const DownloadIcon = (p) => <Icon {...p} d={<><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>} />;
const MoreIcon = (p) => <Icon {...p} d={<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>} />;
const UsersIcon = (p) => <Icon {...p} d={<><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="3"/><path d="M22 20a5 5 0 0 0-5-5"/></>} />;
const CreditIcon = (p) => <Icon {...p} d={<><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20"/></>} />;
const BuildingIcon = (p) => <Icon {...p} d={<><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01"/></>} />;
const StackIcon = (p) => <Icon {...p} d={<><path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>} />;
const FlowIcon = (p) => <Icon {...p} d={<><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 6h8M7 8l4 8M17 8l-4 8"/></>} />;
const SparkIcon = (p) => <Icon {...p} d={<path d="m12 2 2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/>} />;
const ShieldIcon = (p) => <Icon {...p} d={<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/>} />;
const MailIcon = (p) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>} />;
const LockIcon = (p) => <Icon {...p} d={<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>} />;
const LogoutIcon = (p) => <Icon {...p} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></>} />;
const FilterIcon = (p) => <Icon {...p} d={<path d="M3 5h18l-7 9v6l-4-2v-4z"/>} />;

Object.assign(window, {
  ComponentsArtboard,
  SearchIcon, ChevDownIcon, ChevRightIcon, HomeIcon, StoreIcon, OrdersIcon, MedIcon,
  SettingsIcon, BellIcon, ArrowRightIcon, CheckIcon, PlusIcon, DownloadIcon, MoreIcon,
  UsersIcon, CreditIcon, BuildingIcon, StackIcon, FlowIcon, SparkIcon, ShieldIcon,
  MailIcon, LockIcon, LogoutIcon, FilterIcon, Icon,
});

// IKK Solutions — Brand artboards (logo, palette, type)
// All SVGs are typographic — IKK is built from a custom letterform that
// mirrors the two K's around the central vertical axis, with the second K
// faintly echoed (option-3 direction the user picked).

const { useState } = React;

// --- Logo ------------------------------------------------------------------
function IKKMark({ size = 64, accent = 'currentColor', ghost = 'currentColor', ghostOpacity = 0.28, bg = 'transparent', rounded = true }) {
  // 64x64 viewBox. Bar I + two opposing K's. The right K is mirrored about
  // the right edge so the two diagonals form an arrow / chevron pair.
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" style={{ display: 'block' }}>
      {bg !== 'transparent' && (
        <rect x="0" y="0" width="64" height="64" rx={rounded ? 14 : 0} fill={bg} />
      )}
      {/* I */}
      <rect x="10" y="14" width="6" height="36" fill={accent} />
      {/* K — main */}
      <rect x="22" y="14" width="6" height="36" fill={accent} />
      <path d="M 28 32 L 42 14 L 50 14 L 36 32 L 50 50 L 42 50 Z" fill={accent} />
      {/* K — echoed/ghost (mirrored), shifted in so it overlaps the main K */}
      <path
        d="M 50 32 L 36 14 L 28 14 L 42 32 L 28 50 L 36 50 Z"
        fill={ghost}
        opacity={ghostOpacity}
      />
    </svg>
  );
}

function LogoLockup({ orientation = 'horizontal', theme = 'dark', accent, scale = 1 }) {
  const dark = theme === 'dark';
  const bg = dark ? '#0a0a0c' : '#ffffff';
  const fg = dark ? '#ffffff' : '#0a0a0c';
  const sub = dark ? 'rgba(255,255,255,0.55)' : 'rgba(10,10,12,0.55)';
  const accentColor = accent || 'var(--ikk-accent)';

  if (orientation === 'horizontal') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16 * scale,
        padding: `${24 * scale}px ${28 * scale}px`,
        background: bg, borderRadius: 14, minWidth: 260 * scale,
      }}>
        <IKKMark size={56 * scale} accent={accentColor} ghost={fg} ghostOpacity={0.20} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 * scale }}>
          <div style={{
            fontFamily: 'var(--ikk-font-sans)', fontWeight: 600, color: fg,
            fontSize: 22 * scale, letterSpacing: '-0.02em', lineHeight: 1,
          }}>IKK Solutions</div>
          <div style={{
            fontFamily: 'var(--ikk-font-mono)', color: sub,
            fontSize: 10.5 * scale, letterSpacing: '0.08em',
          }}>SOFTWARE · A · MEDIDA</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 * scale,
      padding: `${28 * scale}px ${32 * scale}px`, background: bg, borderRadius: 14,
    }}>
      <IKKMark size={72 * scale} accent={accentColor} ghost={fg} ghostOpacity={0.20} />
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontFamily: 'var(--ikk-font-sans)', fontWeight: 600, color: fg, fontSize: 18 * scale, letterSpacing: '-0.02em' }}>IKK Solutions</div>
        <div style={{ fontFamily: 'var(--ikk-font-mono)', color: sub, fontSize: 10 * scale, letterSpacing: '0.12em' }}>SOFTWARE · A · MEDIDA</div>
      </div>
    </div>
  );
}

function BrandLogoArtboard() {
  return (
    <div className="ikk" style={{ padding: 32, background: 'var(--ikk-bg)', height: '100%', overflow: 'hidden' }}>
      <ArtboardHeader title="Logo / IKK Solutions" sub="Símbolo + wordmark · doble K espejada · variantes claro/oscuro" />
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 18, marginTop: 20 }}>
        {/* HERO — large symbol on dark */}
        <div style={{
          gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#0a0a0c', borderRadius: 16, padding: '40px 48px', border: '1px solid var(--ikk-line)',
        }}>
          <IKKMark size={140} accent="var(--ikk-accent)" ghost="#ffffff" ghostOpacity={0.22} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>SYMBOL · PRIMARY</div>
            <div style={{ fontFamily: 'var(--ikk-font-sans)', fontWeight: 600, fontSize: 38, color: '#fff', letterSpacing: '-0.03em', marginTop: 6 }}>IKK</div>
            <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>64 × 64 · safe area 8px</div>
          </div>
        </div>

        {/* Horizontal lockups */}
        <LogoLockup orientation="horizontal" theme="dark" />
        <LogoLockup orientation="horizontal" theme="light" />

        {/* Stacked lockups */}
        <LogoLockup orientation="stacked" theme="dark" />
        <LogoLockup orientation="stacked" theme="light" />

        {/* App-icon / favicon row */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 18, padding: 20, background: 'var(--ikk-bg-card)', borderRadius: 14, border: '1px solid var(--ikk-line-soft)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em' }}>APP ICON · FAVICON</div>
            <div style={{ color: 'var(--ikk-fg-muted)', fontSize: 13 }}>Cuadrado, esquinas redondeadas, símbolo centrado con 14% padding interior.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <IconTile size={72} />
            <IconTile size={48} />
            <IconTile size={32} />
            <IconTile size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

function IconTile({ size }) {
  const pad = size * 0.18;
  return (
    <div style={{
      width: size, height: size, background: 'var(--ikk-accent)', borderRadius: size * 0.22,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    }}>
      <IKKMark size={size - pad * 2} accent="#fff" ghost="#fff" ghostOpacity={0.25} />
    </div>
  );
}

function ArtboardHeader({ title, sub }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'var(--ikk-fg-dim)', letterSpacing: '0.12em' }}>IKK · DESIGN SYSTEM</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 4 }}>
        <div style={{ fontFamily: 'var(--ikk-font-sans)', fontWeight: 600, fontSize: 22, color: 'var(--ikk-fg)', letterSpacing: '-0.02em' }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--ikk-fg-muted)' }}>{sub}</div>
      </div>
    </div>
  );
}

// --- Palette ---------------------------------------------------------------
function BrandPaletteArtboard() {
  const accent = [
    { name: 'Acento', token: '--ikk-accent', value: 'oklch(0.58 0.18 H)' },
    { name: 'Acento hover', token: '--ikk-accent-hover', value: 'oklch(0.64 0.18 H)' },
    { name: 'Acento soft', token: '--ikk-accent-soft', value: 'oklch(0.58 0.18 H / 14%)' },
  ];
  const neutrals = [
    { name: 'bg',        token: '--ikk-bg',        value: 'oklch(0.16)' },
    { name: 'bg-elev',   token: '--ikk-bg-elev',   value: 'oklch(0.19)' },
    { name: 'bg-card',   token: '--ikk-bg-card',   value: 'oklch(0.21)' },
    { name: 'line',      token: '--ikk-line',      value: 'oklch(0.28)' },
    { name: 'fg-dim',    token: '--ikk-fg-dim',    value: 'oklch(0.52)' },
    { name: 'fg-muted',  token: '--ikk-fg-muted',  value: 'oklch(0.72)' },
    { name: 'fg',        token: '--ikk-fg',        value: 'oklch(0.98)' },
  ];
  const semantic = [
    { name: 'Success', token: '--ikk-success', value: 'oklch(0.72 0.16 150)' },
    { name: 'Warn',    token: '--ikk-warn',    value: 'oklch(0.78 0.16 75)' },
    { name: 'Danger',  token: '--ikk-danger',  value: 'oklch(0.65 0.20 25)' },
    { name: 'Info',    token: '--ikk-info',    value: 'oklch(0.70 0.14 240)' },
  ];
  return (
    <div className="ikk" style={{ padding: 32, background: 'var(--ikk-bg)', height: '100%' }}>
      <ArtboardHeader title="Paleta" sub="Tokens semánticos · accent en oklch hue 260 (cobalto)" />
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <PaletteRow label="ACENTO" items={accent} big />
        <PaletteRow label="NEUTROS" items={neutrals} />
        <PaletteRow label="SEMÁNTICOS" items={semantic} />
      </div>
    </div>
  );
}

function PaletteRow({ label, items, big }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'var(--ikk-fg-dim)', letterSpacing: '0.12em', marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 12 }}>
        {items.map(c => (
          <div key={c.token} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              height: big ? 96 : 64, borderRadius: 10,
              background: `var(${c.token})`,
              border: '1px solid var(--ikk-line-soft)',
            }} />
            <div>
              <div style={{ fontSize: 13, color: 'var(--ikk-fg)', fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--ikk-font-mono)', color: 'var(--ikk-fg-dim)' }}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Type ------------------------------------------------------------------
function BrandTypeArtboard() {
  const scale = [
    { name: 'Display',  size: 56, weight: 600, family: 'sans', sample: 'Software a medida.' },
    { name: 'H1',       size: 40, weight: 600, family: 'sans', sample: 'Ideas en producción.' },
    { name: 'H2',       size: 28, weight: 600, family: 'sans', sample: 'Cómo trabajamos' },
    { name: 'H3',       size: 20, weight: 500, family: 'sans', sample: 'Productos propios' },
    { name: 'Body',     size: 16, weight: 400, family: 'sans', sample: 'Convertimos tus ideas en productos reales — desde el discovery hasta el soporte continuo.' },
    { name: 'Small',    size: 14, weight: 400, family: 'sans', sample: 'POS multi-empresa, plataforma de pedidos multitenant, gestión clínica con auditoría.' },
    { name: 'Mono / Eyebrow', size: 12, weight: 500, family: 'mono', sample: 'IKK · 001 — STACK & CAPACIDADES' },
  ];
  return (
    <div className="ikk" style={{ padding: 32, background: 'var(--ikk-bg)', height: '100%' }}>
      <ArtboardHeader title="Tipografía" sub="Geist (sans) · Geist Mono (eyebrows, datos, badges)" />
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column' }}>
        {scale.map((row, i) => (
          <div key={row.name} style={{
            display: 'grid', gridTemplateColumns: '140px 1fr 110px', alignItems: 'baseline',
            padding: '18px 0', borderTop: i === 0 ? 'none' : '1px solid var(--ikk-line-soft)',
            gap: 24,
          }}>
            <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'var(--ikk-fg-dim)', letterSpacing: '0.1em' }}>
              {row.name.toUpperCase()}
            </div>
            <div style={{
              fontFamily: row.family === 'mono' ? 'var(--ikk-font-mono)' : 'var(--ikk-font-sans)',
              fontSize: row.size, fontWeight: row.weight, color: 'var(--ikk-fg)',
              letterSpacing: row.size > 30 ? '-0.025em' : (row.family === 'mono' ? '0.04em' : '-0.01em'),
              lineHeight: 1.15,
            }}>{row.sample}</div>
            <div style={{ fontFamily: 'var(--ikk-font-mono)', fontSize: 11, color: 'var(--ikk-fg-dim)', textAlign: 'right' }}>
              {row.size}px · {row.weight}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  IKKMark, LogoLockup, BrandLogoArtboard, BrandPaletteArtboard, BrandTypeArtboard,
  ArtboardHeader,
});

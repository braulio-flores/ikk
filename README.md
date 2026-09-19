# IKK Solutions

> Software a medida. Ideas en producción.

Plataforma de doble cara:

1. **Sitio público corporativo** (`/`) — landing de IKK Solutions, agencia de
   desarrollo de software a medida: servicios, proceso, productos propios
   (Tickomium / Formate / mDoc) y formulario de contacto.
2. **Panel master privado** (`/ikk-ops` → `/panel/...`) — desde donde el dueño
   administra empresas, tenants, clínicas, usuarios, planes y suscripciones de
   los tres productos hijos, además de los prospectos que llegan de la web.

La landing **NO** contiene ningún enlace al panel. Para un visitante normal el
sitio parece sólo corporativo.

```
ikk-solutions/
├── backend/                # Express 5 + TS + Prisma. API en :4100/ikk
├── frontend/               # Next.js 16 App Router. Marketing + panel.
├── design-reference/       # Bundle de Claude Design (mocks JSX + tokens)
├── DEPLOY.md               # Runbook de despliegue (Neon/Railway/Vercel/Cloudflare)
└── README.md               # este archivo
```

Junto a IKK viven los tres proyectos hijos (Tickomium / Formate / mDoc), cada
uno con su carpeta `management/` que IKK consume vía service token.

---

## Stack

| Capa     | Tecnología |
| -------- | ---------- |
| Frontend | Next.js 16 · React 19 · TypeScript · Tailwind 4 · TanStack Query · Sonner |
| Backend  | Node.js · Express 5 · TypeScript · Prisma · PostgreSQL |
| Auth     | JWT (access 2h + refresh 7d) · cookies HTTP-only `ikk_access` / `ikk_refresh` · SHA256 del refresh · rotación + revoke-on-reuse |
| Email    | Resend |
| Diseño   | Acento cobalto `oklch(0.58 0.20 260)` · Geist Sans + Geist Mono · dark-first |

---

## Decisiones arquitectónicas

- **Route Groups separados** en App Router: `(marketing)`, `(auth)`, `(panel)`.
  Layouts independientes, sin cross-links.
- **404 silencioso para `/panel/*`** cuando no hay sesión. Nunca 401: el panel
  no debe revelar su existencia.
- **Acceso bajo `/ikk-ops`**, no `/login`: los bots que barren internet prueban
  `/login`, `/admin`, `/manage`… Quita ruido, no es la protección real. Las rutas
  viven en `frontend/src/lib/routes.ts`.
- `robots.txt` **no** lista la ruta de acceso ni `/panel` (sería un letrero de
  "aquí está la entrada"); esas páginas llevan `noindex,nofollow` en su layout.
- **Cookies con prefijo `ikk_`.** En producción el panel vive en un subdominio de
  `tickomium.com` y la cookie se emite con `COOKIE_DOMAIN=.tickomium.com` para
  que el middleware del frontend pueda verla; con los nombres genéricos
  colisionaría con la sesión de Tickomium.
- **IKK no duplica datos de hijos.** Su BD guarda operadores, refresh tokens,
  audit logs, credenciales de producto y los prospectos del formulario público.
  Todo lo demás se delega al hijo vía `ProductClient`.
- **Un producto caído no tumba el panel:** si falta configuración o el hijo no
  responde, esa sección se muestra como "Sin conexión" (`Promise.allSettled`).
- **AuditLog en cada acción admin** que delega a un hijo.
- **Fechas siempre en hora de México.** Frontend: `frontend/src/lib/datetime.ts`
  (`date-fns-tz`, `America/Mexico_City`). Backend: `TZ` fijado en `index.ts`.
  Nunca `new Date(x).toLocaleDateString()` suelto.
- **Nada de códigos internos en la interfaz.** Enums, roles y acciones pasan por
  `frontend/src/lib/labels.ts`; los identificadores de base de datos no se
  muestran nunca.

---

## Levantar todo en local

### 0. Pre-requisitos

- Node 20+
- Docker + Docker Compose (para la BD)
- Una API key de Resend (opcional: sin ella el contacto se guarda igual)

### 1. Base de datos

```bash
cd ikk-solutions && docker compose up -d
```

Postgres queda en el puerto **5433** (Tickomium usa 5432, así conviven).
Credenciales por defecto: `ikk` / `ikk` / `ikk_dev`.

### 2. Backend

```bash
cd ikk-solutions/backend && cp .env.example .env && npm install
```

Edita `.env` (secretos con `openssl rand -hex 64`) y luego:

```bash
cd ikk-solutions/backend && npx prisma migrate deploy && npm run seed && npm run dev
```

`npm run seed` crea el primer operador con `BOOTSTRAP_ADMIN_*` del `.env`. Es
idempotente: si ya hay operadores, no hace nada. Los demás se crean desde el
panel.

### 3. Frontend

```bash
cd ikk-solutions/frontend && cp .env.example .env && npm install && npm run dev
```

Abre `http://localhost:3000` (landing). Para el panel, escribe **directamente**
`http://localhost:3000/ikk-ops`.

### 4. Verificación

1. `/` carga la landing y no enlaza al panel.
2. `/panel/overview` sin sesión → **404**.
3. El formulario de contacto responde con la pantalla de confirmación y el
   prospecto aparece en `/panel/leads`.
4. Tras entrar, `/panel/overview` muestra las tres tarjetas de producto ("En
   línea" o "Sin conexión" según estén corriendo los hijos).

### Comandos útiles

| Comando | Qué hace |
| ------- | -------- |
| `npm run dev` (backend) | API con recarga en caliente |
| `npm run build` (backend) | `prisma generate` + `tsc`, y luego `postbuild` aplica migraciones |
| `npm run seed` (backend) | Crea el primer operador |
| `npm run typecheck` | TypeScript sin emitir |
| `npm run build` (frontend) | Build de producción de Next |

---

## Endpoints de IKK (todos bajo `/ikk`)

| Endpoint | Método | Notas |
| -------- | :----: | ----- |
| `/health` y `/ikk/health` | GET | Público. Lo consulta Railway. |
| `/auth/login` · `/refresh` · `/logout` · `/me` | POST/GET | Rate-limit estricto en login |
| `/auth/forgot-password` · `/reset-password` | POST | Correo vía Resend |
| `/contact` | POST | **Público.** Guarda el prospecto + avisa por correo. Honeypot y 5 envíos por IP cada 15 min |
| `/contact/leads` (+ `PATCH /:id`) | GET/PATCH | Bandeja de prospectos del panel |
| `/operators` | CRUD | Sólo SUPER_ADMIN |
| `/overview/stats` · `/overview/inbox` | GET | Tolerante a hijos caídos |
| `/audit` | GET | Filtros por producto, acción y operador |
| `/tickomium/*` | CRUD | Empresas (alta, edición, estado, extensión, validar pago), usuarios, planes, permisos, avisos |
| `/formate/*` | CRUD | Tenants, usuarios por tenant, configuración |
| `/mdoc/*` | CRUD | Clínicas (alta, edición, suspensión), doctores, bitácora de accesos |

Todos los listados responden con la misma forma: `{ items, total, page, limit }`.

---

## Layout de BDs

Cada proyecto tiene su propio Postgres. **Las BDs no se comparten.**

```
ikk        → DATABASE_URL en ikk-solutions/backend/.env
tickomium  → DATABASE_URL en tickomium/backend/.env
formate    → DATABASE_URL en formate/apps/api/.env
mdoc       → DATABASE_URL en mdoc/backend/.env
```

---

## Reglas duras del proyecto

1. **NO duplicar lógica de hijos en IKK.** IKK delega vía ProductClient al
   endpoint `/management/*` del hijo.
2. **NO mezclar datos de hijos en la BD de IKK.** Tablas propias: `Operator`,
   `RefreshToken`, `PasswordResetToken`, `AuditLog`, `ProductCredential`,
   `ContactLead`.
3. **NO tocar código de los hijos fuera de su carpeta `management/`.**
4. **NO cross-links entre marketing y panel.**
5. **TypeScript estricto. Sin `any`.**
6. **404 silencioso en `/panel/*` sin sesión.** Nunca 401.
7. **Mobile-first.** Toda vista del panel se usa desde un teléfono: la barra
   lateral es un cajón y las tablas se vuelven tarjetas.
8. **Confirmación obligatoria** en toda acción consecuente (cambios de estado,
   suspensiones, bajas, envíos), mostrando el dato clave y la consecuencia en
   español plano.
9. **Español de México.** Nada de voseo.

---

## Despliegue

Ver [DEPLOY.md](DEPLOY.md): Neon (base) → Railway (API, con migraciones en el
post-build) → Vercel (sitio y panel) → Cloudflare (DNS de
`ikk.tickomium.com` y `api-ikk.tickomium.com`).

---

## Pendientes conocidos

- [ ] Encriptación at-rest de `ProductCredential.serviceAccountTokenEncrypted`
      (AES-256-GCM); hoy las credenciales viven en variables de entorno.
- [ ] `Clinic` de mDoc no persiste el motivo de suspensión (sólo `isActive`);
      el motivo queda en la bitácora de IKK.
- [ ] Inbox de eventos accionables sólo implementado en Tickomium; Formate y
      mDoc devuelven vacío.
- [ ] Tests E2E con Playwright del flujo login → alta de empresa → bitácora.

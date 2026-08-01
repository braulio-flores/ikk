# Despliegue de IKK Solutions

Objetivo:

| Pieza | Dónde vive | Dirección final |
| ----- | ---------- | --------------- |
| Sitio público + panel (Next.js) | Vercel | `https://ikk.tickomium.com` |
| API (Express + Prisma) | Railway | `https://api-ikk.tickomium.com` |
| Base de datos (Postgres) | Neon | interna, sólo la usa Railway |
| DNS | Cloudflare (zona `tickomium.com`) | dos registros CNAME |

Todo el flujo se hace desde los paneles web. El orden importa: **Neon → Railway
→ Vercel → Cloudflare**, porque cada paso necesita un dato del anterior.

---

## 0. Antes de empezar

Genera estos valores en tu terminal y guárdalos a la mano:

```bash
openssl rand -hex 64   # JWT_ACCESS_SECRET
```

```bash
openssl rand -hex 64   # JWT_REFRESH_SECRET
```

También necesitas:

- El código en un repositorio de GitHub (ver "Subir el código" abajo).
- Una API key de Resend, si quieres recibir por correo los contactos de la web.
- Los `IKK_SERVICE_TOKEN` de Tickomium, Formate y mDoc **sólo cuando esos
  productos estén desplegados**. Sin ellos el panel funciona, pero las
  secciones de cada producto aparecerán como "Sin conexión".

### Subir el código

El repositorio ya está inicializado con un commit. Crea el repo vacío en
GitHub (privado) y luego:

```bash
git -C ~/Developer/react/ikk-solutions remote add origin git@github.com:<usuario>/ikk-solutions.git
```

```bash
git -C ~/Developer/react/ikk-solutions push -u origin main
```

---

## 1. Neon (base de datos)

1. Entra a <https://console.neon.tech> → **New project**.
2. Nombre: `ikk-solutions`. Región: la más cercana a Railway (ej. `US East (Ohio)`).
   Versión de Postgres: 16 o superior.
3. Al crearlo, Neon muestra la cadena de conexión. Copia la variante
   **Pooled connection** (contiene `-pooler` en el host). Debe verse así:

   ```
   postgresql://USUARIO:CONTRASEÑA@ep-xxxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

4. Guarda esa cadena: es el `DATABASE_URL` de Railway.

> No hace falta crear tablas a mano. Railway las crea en el primer despliegue
> (paso 2.4).

---

## 2. Railway (API)

### 2.1 Crear el servicio

1. <https://railway.app> → **New Project** → **Deploy from GitHub repo** →
   elige `ikk-solutions`.
2. Cuando cargue el servicio, entra a **Settings**:
   - **Root Directory**: `backend`
   - **Build**: se detecta solo con `backend/nixpacks.toml`.
   - **Healthcheck Path**: `/health` (ya viene en `backend/railway.json`).

### 2.2 Variables de entorno

**Settings → Variables**. Pega estas (Railway acepta pegar varias líneas a la vez):

| Variable | Valor |
| -------- | ----- |
| `DATABASE_URL` | la cadena *pooled* de Neon (paso 1.3) |
| `JWT_ACCESS_SECRET` | el primer `openssl rand -hex 64` |
| `JWT_REFRESH_SECRET` | el segundo `openssl rand -hex 64` |
| `ACCESS_TOKEN_EXPIRY` | `2h` |
| `REFRESH_TOKEN_EXPIRY` | `7d` |
| `REFRESH_TOKEN_DAYS` | `7` |
| `COOKIE_DOMAIN` | `.tickomium.com` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://ikk.tickomium.com` |
| `TZ` | `America/Mexico_City` |
| `RESEND_API_KEY` | tu API key de Resend |
| `EMAIL_FROM` | `IKK Solutions <no-reply@tickomium.com>` |
| `CONTACT_EMAIL_TO` | el buzón donde quieres recibir los prospectos |
| `API_URL_TICKOMIUM` | URL pública del backend de Tickomium + `/tickomium` |
| `API_URL_FORMATE` | URL pública del backend de Formate + `/api` |
| `API_URL_MDOC` | URL pública del backend de mDoc + `/mdoc` |
| `SERVICE_TOKEN_TICKOMIUM` | debe ser **idéntico** al `IKK_SERVICE_TOKEN` de Tickomium |
| `SERVICE_TOKEN_FORMATE` | idéntico al `IKK_SERVICE_TOKEN` de Formate |
| `SERVICE_TOKEN_MDOC` | idéntico al `IKK_SERVICE_TOKEN` de mDoc |

`PORT` lo inyecta Railway solo: no lo definas.

> Las variables de los productos hijos son opcionales: si falta alguna, la API
> arranca igual, deja un aviso en los logs y ese producto aparece como "Sin
> conexión" en el panel hasta que la configures.

### 2.3 Dominio

**Settings → Networking → Custom Domain** → `api-ikk.tickomium.com`.
Railway te muestra un destino CNAME (algo como `xxxx.up.railway.app`).
Anótalo para el paso 4.

### 2.4 Primer despliegue y migraciones

Al desplegar, el build corre:

```
prisma generate && tsc      →  npm run build
prisma migrate deploy       →  npm run postbuild  (crea las tablas en Neon)
node dist/index.js          →  npm start
```

En **Deploy Logs** debes ver `The following migration(s) have been applied` y
después `[IKK] API escuchando en :PORT`.

### 2.5 Crear el primer operador

Sin operadores nadie puede entrar al panel. En Railway, abre la consola del
servicio (**⋮ → Run command** o la pestaña *Shell*) y ejecuta, reemplazando los
valores:

```bash
BOOTSTRAP_ADMIN_NAME="Braulio Flores" BOOTSTRAP_ADMIN_EMAIL="tucorreo@dominio.com" BOOTSTRAP_ADMIN_PASSWORD="una-contraseña-larga-y-única" npx ts-node prisma/seed.ts
```

El script es idempotente: si ya existe algún operador, no crea nada. Los demás
operadores se dan de alta desde el panel, en Configuración → Operadores.

---

## 3. Vercel (sitio y panel)

1. <https://vercel.com> → **Add New → Project** → importa `ikk-solutions`.
2. **Root Directory**: `frontend`. Framework: Next.js (se detecta solo).
3. **Environment Variables** (Production y Preview):

| Variable | Valor |
| -------- | ----- |
| `NEXT_PUBLIC_API_URL` | `https://api-ikk.tickomium.com/ikk` |
| `NEXT_PUBLIC_SITE_URL` | `https://ikk.tickomium.com` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | el correo público de contacto |

4. **Deploy**.
5. **Settings → Domains** → agrega `ikk.tickomium.com`. Vercel te dará el
   destino CNAME (`cname.vercel-dns.com`).

---

## 4. Cloudflare (DNS)

En el panel de Cloudflare, zona `tickomium.com` → **DNS → Records**:

| Tipo | Nombre | Destino | Proxy |
| ---- | ------ | ------- | ----- |
| CNAME | `ikk` | `cname.vercel-dns.com` | **DNS only** (nube gris) |
| CNAME | `api-ikk` | el destino que dio Railway | **DNS only** (nube gris) |

El proxy debe quedar **apagado** en los dos: Vercel y Railway emiten sus propios
certificados TLS y con el proxy encendido la validación falla o se rompe el
manejo de cookies.

La propagación tarda de 1 a 30 minutos. Vercel y Railway marcan el dominio como
válido en cuanto ven el registro.

---

## 5. Verificación

```bash
curl -s https://api-ikk.tickomium.com/health
```

Debe responder `{"ok":true,...}`.

Después, en el navegador:

1. `https://ikk.tickomium.com` → carga la landing. **No** debe haber ningún
   enlace a `/login` ni a `/panel`.
2. `https://ikk.tickomium.com/panel/overview` sin sesión → **404**. Si devuelve
   401 o muestra el panel, algo está mal en el middleware.
3. Envía el formulario de contacto. Debe aparecer la pantalla de confirmación.
4. `https://ikk.tickomium.com/login` → entra con el operador del paso 2.5.
5. Ya dentro: Resumen debe mostrar el prospecto que acabas de enviar y las tres
   tarjetas de producto (en línea o sin conexión, según estén desplegados).

---

## 6. Conectar los productos hijos

Cuando despliegues Tickomium, Formate o mDoc:

1. Genera un token por producto: `openssl rand -hex 48`.
2. En el producto hijo: variable `IKK_SERVICE_TOKEN` = ese token.
3. En Railway (IKK): `SERVICE_TOKEN_<PRODUCTO>` = **el mismo** token, y
   `API_URL_<PRODUCTO>` = la URL pública de su API de gestión:
   - Tickomium → `https://…/tickomium`
   - Formate → `https://…/api`
   - mDoc → `https://…/mdoc`
4. Redespliega el servicio de IKK y revisa Configuración → Productos: la tarjeta
   debe pasar a "Conectado".

---

## Problemas comunes

| Síntoma | Causa probable |
| ------- | -------------- |
| El login responde 200 pero el panel devuelve 404 | Falta `COOKIE_DOMAIN=.tickomium.com` en Railway, o el proxy de Cloudflare está encendido |
| `Origen no permitido` en las llamadas del panel | `FRONTEND_URL` en Railway no coincide exactamente con el dominio de Vercel (sin diagonal final) |
| El build de Railway falla en `prisma migrate deploy` | `DATABASE_URL` mal copiada o sin `?sslmode=require` |
| Todos los productos aparecen "Sin conexión" | Es lo esperado mientras los hijos no estén desplegados con su `IKK_SERVICE_TOKEN` |
| No llegan los correos de contacto | Falta `RESEND_API_KEY` o `CONTACT_EMAIL_TO`; el prospecto igual quedó guardado en el panel |

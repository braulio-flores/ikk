# Landing page design

_Started 2026-05-14 05:25 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "ikk"
Current date is now May 13, 2026
</system-info>

<default aesthetic>
If no references, art direction or design systems were provided, use this default professional modern, minimal aesthetic as a base. Declare your choice out loud so you stick to it. Guidance:
- Choose a type pairing from web-safe set or Google Fonts. Helvetica is a good choice. Avoid hard-to-read or overly stylized fonts. Use 1-3 fonts only.
- Foreground and background: choose a color tone (warm, cool, neutral, something in-between). Use subtly-toned whites and blacks; avoid saturations above 0.02 for whites.
- Accents: choose 0-2 additional accent colors using oklch. All accents should share same chroma and lightness; vary hue.
- NEVER write out an SVG yourself that's more complicated than a square, circle, diamond, etc.
- For imagery, never hand-draw SVGs; use subtly-striped SVG placeholders instead with monospace explainers for what should be dropped there (e.g. “product shot”)

CRITICAL: ignore default aesthetic entirely if given other aesthetic instructions like reference images, design systems or guidance, or if there are files in the project already.
</default aesthetic>

<pasted_text name="Pasted text (123 lines)">
Necesito que diseñes la identidad visual y las pantallas base de "IKK Solutions".

## ¿Qué es IKK Solutions?
IKK Solutions es DOS cosas en una sola plataforma:

1. **La cara pública**: es la carta de presentación de la empresa. IKK
   Solutions es una empresa que ofrece desarrollo de software a medida —
   trabajamos con lo que el cliente quiera y materializamos sus ideas. Ya
   tenemos algunos productos propios funcionando que sirven como portafolio
   y prueba de capacidad:
   - Tickomium (Punto de venta / POS)
   - Formate (Gestión de pedidos multitenant)
   - mDoc (Gestión médica / consultorios)
   Cualquier visitante en la landing debe entender: "estos tipos construyen
   software real, ya tienen productos en producción, y pueden construir lo
   que yo necesite".

2. **El panel privado de administración**: en el MISMO dominio convive un
   panel master desde el que el dueño administra empresas, usuarios, planes
   y suscripciones de los productos hijos (Tickomium, Formate, mDoc). Este
   panel NO está expuesto al público — no aparece en la navegación de la
   landing, no hay enlaces visibles, no se anuncia. Solo el dueño/admin
   conoce la ruta de acceso (ej: `/login` o `/panel`) y entra por ahí. Para
   un visitante normal, IKK Solutions parece "solo" un sitio corporativo.

Piensa en la analogía: una agencia de desarrollo que en su mismo sitio tiene
una puerta sin letrero que lleva al cuarto de máquinas.

## Identidad de marca
- Nombre: IKK Solutions
- Tagline sugerido: "Software a medida. Ideas en producción."
  (o propón 2-3 alternativas en el mismo tono)
- Tono: profesional, técnico, confiable, moderno. Tipo Linear / Vercel /
  Resend, no tipo agencia colorida.
- Audiencia pública: clientes potenciales que buscan desarrollar software a
  medida (founders, PYMES, equipos sin tech in-house).
- Audiencia privada: el dueño/admin de IKK (uno o pocos operadores
  internos).
- Paleta sugerida: base oscura (negro/grafito) + un acento vibrante (propón
  2-3 opciones: violeta eléctrico, verde lima, o azul cobalto).
- Tipografía: sans-serif geométrica moderna (Inter, Geist o similar).

## Entregables

### 1. Logo
- Símbolo + wordmark "IKK Solutions"
- Versión solo símbolo (favicon / app icon)
- Versión horizontal y versión apilada
- Variantes claro y oscuro
- Construcción tipográfica memorable de las tres letras "IKK" (jugá con la
  simetría de la doble K)

### 2. Landing page pública (one-pager — carta de presentación de la empresa)
Secciones:
- Hero: nombre + tagline + subcopy "Desarrollamos software a medida.
  Convertimos tus ideas en productos reales." + CTA principal "Hablemos de
  tu proyecto" (lleva a contacto, no a login)
- Sección "Lo que hacemos": cards de servicios — productos web, apps
  móviles, dashboards internos, integraciones, sistemas multitenant
- Sección "Cómo trabajamos": discovery → diseño → desarrollo → entrega →
  soporte continuo
- Sección "Productos propios" (portafolio): tres cards de Tickomium /
  Formate / mDoc, con descripción corta y un mini-testimonio de capacidad
  ("POS multi-empresa en producción", "plataforma de pedidos multitenant",
  "gestión clínica con auditoría"). Esto demuestra que NO somos solo una
  agencia teórica.
- Sección "Stack y capacidades": tecnologías que dominamos (Next.js, Node,
  Prisma, Postgres, React Native, etc.)
- Sección "Contacto": form simple (nombre, email, descripción del proyecto)
  + CTA secundario
- Footer minimalista
- IMPORTANTE: la navegación pública NO debe contener ningún link a "Panel",
  "Admin", "Dashboard" ni "Login". El acceso al panel privado se hace
  escribiendo la URL directamente.

### 3. Pantalla de Login (acceso privado, no linkeado desde la landing)
- Ruta dedicada (proponer `/login` o `/panel`)
- Login con email + password
- Link a "Olvidé mi contraseña"
- Estados de carga y error
- Diseño limpio, centrado, con el branding de IKK pero sin elementos
  públicos (sin nav de landing, es una pantalla aislada)
- El acceso al panel queda solo a quien conozca la URL

### 4. Dashboard principal (home post-login del panel privado)
- Sidebar izquierdo con navegación por producto:
  - Overview (home)
  - Tickomium (sub-items: Empresas, Usuarios, Planes, Notificaciones)
  - Formate (sub-items: Tenants, Usuarios, Configuración)
  - mDoc (sub-items: Clínicas, Usuarios médicos, Auditoría clínica)
  - Configuración global
- Topbar: selector de producto activo, búsqueda global, usuario actual,
  logout
- Vista Overview con KPIs: total empresas/tenants/clínicas, usuarios
  activos, suscripciones activas, ingresos del mes, alertas pendientes
- Gráfica de actividad reciente

### 5. Dashboard de un producto hijo (ejemplo: Tickomium → Empresas)
Plantilla replicable para cada producto:
- Header con título y acciones (crear, exportar)
- Tabla con: nombre, estado (activo/suspendido/trial), plan, fecha de alta,
  vence, acciones
- Filtros y búsqueda
- Drawer/modal lateral para ver detalle y editar
- Acciones: "Extender suscripción", "Cambiar plan", "Suspender"

### 6. Sistema de diseño base
- Tokens: colores, spacing, radios, sombras, tipografía
- Componentes core: Button, Input, Select, Table, Badge (estados: Activo /
  Trial / Suspendido / Vencido), Modal, Drawer, Toast, Card, Tabs, Sidebar,
  Topbar
- Iconografía consistente (Lucide o similar)

## Restricciones técnicas
- Implementación final: Next.js (App Router) + React 19 + Tailwind CSS 4 +
  shadcn/ui. No diseñes nada imposible de portar a ese stack.
- Mobile-friendly. La landing prioriza mobile + desktop; el panel prioriza
  desktop.
- Modo claro y modo oscuro.

Entrégame: logo en SVG, mockups de cada pantalla, y el código base
(Next.js + Tailwind + shadcn) de landing, login y los dos dashboards
descritos, con los tokens del sistema de diseño aplicados.
</pasted_text>


<system-reminder>Auto-injected reminder (ignore if not relevant): do not recreate copyrighted or branded UI unless the user's email domain matches that company. Create original designs instead.</system-reminder>

## Assistant

_[tool: questions_v2]_

Voy a hacerte algunas preguntas rápidas para arrancar bien antes de construir todo esto. Es un alcance grande (logo + landing + login + 2 dashboards + design system) así que vale la pena alinear primero.

## User

Questions answered:
- scope_format: Un solo HTML con design canvas (todas las pantallas lado a lado, comparables)
- accent_color: 3
- logo_direction: 3
- font_pair: Decide for me
- tagline_choice: Software a medida. Ideas en producción.
- landing_personality: Mix de las anteriores — explorar varias en tweaks
- panel_density: Cómoda, prioriza legibilidad
- dark_light_priority: Decide for me
- code_delivery: Solo mocks por ahora, el código lo hago yo después
- products_visual: Solo cards con nombre + descripción, sin visuales

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: write_file]_

_[tool: write_file]_

Voy a construir. Mis decisiones (declaro para fijar el rumbo):

- **Acento:** Azul cobalto (`oklch(0.58 0.20 260)`)
- **Tipografía:** Geist Sans + Geist Mono
- **Tema base:** Oscuro consistente (landing y panel), con override claro disponible
- **Logo:** símbolo bold IKK con doble-K espejada como en la opción 3
- **Estructura:** un solo `index.html` con design canvas; artboards agrupados en 4 secciones (Marca → Sistema → Público → Privado)

Empiezo por tokens, logo y componentes core en paralelo.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: set_project_title]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: done]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: register_assets]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Listo. Te dejé el sistema completo en un solo HTML con design canvas para que veas todo lado a lado.

**Lo que armé** (4 secciones en el canvas, podés ocultar/mostrar cada una desde Tweaks):

- **Marca** — logo IKK (con la doble K espejada que elegiste), variantes horizontal/apilada en claro y oscuro, app-icon hasta 16px, paleta de tokens en oklch, escala tipográfica Geist + Geist Mono.
- **Componentes** — buttons, inputs, badges (Activo / Trial / Suspendido / Vencido / Borrador), tabs, KPI, toast, modal de confirmación.
- **Pública** — landing desktop 1280px + landing móvil 390px. Hero, servicios, proceso de 5 etapas, portafolio (Tickomium / Formate / mDoc), stack, contacto, footer. Sin un solo link al panel.
- **Privada** — `/login` en estado idle y en estado error, dashboard Overview (KPIs, chart de actividad 30d, alertas, breakdown por producto) y Tickomium → Empresas con su drawer lateral abierto como variante.

**Tweaks en vivo** (esquina inferior derecha):
- Color acento: Cobalto / Violeta / Lima (cambia el `--ikk-accent-h` global)
- Personalidad de landing: Sobria / Sobria+terminal / Sobria+producto
- Tema landing: Oscuro / Claro
- Mostrar / ocultar cada sección del canvas

**Decisiones declaradas:**
- Acento cobalto base (oklch L 0.58 / C 0.18 / H 260), todos los acentos comparten L y C así el cambio de hue mantiene peso visual.
- Geist + Geist Mono — el mono se usa con propósito (eyebrows, datos tabulares, badges de estado, paths tipo `/login`), no decorativo.
- Panel y landing comparten el mismo set de tokens; la "puerta sin letrero" es solamente que el header público no tiene entrada al panel — el shell privado es estructural, no estético.

**Caveats / próximos pasos lógicos:**
- Como pediste solo mocks, no toqué Next.js/shadcn todavía. Cuando quieras el código portado, los tokens viven en `tokens.css` listos para mudarse a `globals.css` y los componentes están escritos en un vocabulario que mapea 1:1 a shadcn (`Button variant="ghost|secondary|primary"`, `Badge`, `Input`, etc).
- Faltarían pantallas de Formate (Tenants) y mDoc (Clínicas / Auditoría) si querés la plantilla replicada para los tres — la base está; es ~30 min más.
- Avisame si querés que agregue una variante "panel en claro" como artboard adicional, o tweaks de densidad del panel.

## User

lo unico que me falto mencionar es que evites patrones de ia por favir, nada de patrones de ia, quita todos los patrones de ia, como cards con borde a la izquierda de colores o evitar emojis, o cards genericas que tienen todos los proyectos, evita a toda costa eso, haz algo difernete no lo mismo de siempre que le das a todos

## Assistant

_[tool: update_todos]_

_[tool: write_file]_

Buen punto, gracias por la corrección. Voy a barrer todos los tropos: nada de glow radial en hero, nada de badge-pill "EN PROD" con dot verde, nada de grid 3×2 de cards `icono+título+descripción`, nada de border-left de color en toasts/alerts, nada de "card de terminal con tres bolitas semáforo". Reescribo landing y limpio los componentes con un lenguaje editorial — la tabla y la tipografía hacen el trabajo, no los contenedores decorativos.

_[tool: str_replace_edit]_

Ahora limpio Toast / Alert / Badges en `components.jsx`, `panel.jsx` y `tokens.css` para sacar el patrón de `border-left de color` y las pills con dot.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Listo. Quité los tropos que mencionaste:

**Fuera:**
- Glow radiales / blurs ambientales (hero landing, login)
- Cards con `border-left: 3px solid <color>` (Toast, Alert)
- Badges-píldora con dot circular y bg tinted → ahora son `· ACTIVO` en mono, color heredado, sin fondo, sin píldora
- Grid 3×2 de cards `icono + título + descripción` para servicios → lista numerada editorial con hairlines (`01 · Productos web · etiquetas mono`)
- Cards de productos con cuadrado tinted + glifo "T/F/M" → expedientes documentales con código `P-01 / P-02 / P-03` y mini-tabla de hechos
- Hero badge "EN PROD · 3 productos" con dot verde → numeración `IKK · 001 · BUENOS AIRES · 2026` + tabla de facts en mono
- Terminal mock con tres bolitas semáforo → eliminado
- Avatars circulares con accent-soft bg → cuadrados neutros con borde hairline
- Sidebar items con tinted icon block por producto → marcador hairline lateral acento + código `P-0X` en mono a la derecha

**Lenguaje editorial que entra:**
- Numeración explícita en secciones (`002 — LO QUE HACEMOS`)
- Listas y hairlines como separación; los contenedores casi desaparecen
- Mono como anotación documental, no como decoración
- Tipografía masiva en hero (hasta 104px), datos crudos como prueba (`148 empresas`, `< 24h respuesta`)
- Productos como ficha técnica: código, kind, cuándo entró a prod, mini-tabla `Stack / Tenancy / Facturación / Picos`
- Stack como manifest denso de dos columnas mono, no como pills flotantes

Avisame si querés que empuje más en alguna dirección — por ejemplo un hero con tipografía aún más editorial estilo periódico, o si querés que la landing se aleje totalmente del oscuro y vaya en papel/claro como contraste con el panel.

## User

Verifier agent check completed

## Assistant

El verificador confirmó los cinco checks. Todo limpio.


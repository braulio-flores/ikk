import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Región del negocio: todo lo que el servidor formatee o calcule con fechas
// debe razonar en hora de México, igual que Tickomium y mDoc.
process.env.TZ = process.env.TZ || "America/Mexico_City";

import authRoutes from "./routes/auth.routes";
import operatorsRoutes from "./routes/operators.routes";
import overviewRoutes from "./routes/overview.routes";
import auditRoutes from "./routes/audit.routes";
import contactRoutes from "./routes/contact.routes";
import tickomiumRoutes from "./routes/tickomium.routes";
import formateRoutes from "./routes/formate.routes";
import mdocRoutes from "./routes/mdoc.routes";

import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Railway/Vercel terminan TLS en un proxy: sin esto el rate-limit no ve la IP
// real del visitante.
app.set("trust proxy", 1);

// Orígenes permitidos: FRONTEND_URL + los extra de CORS_ORIGINS (separados por
// coma) + localhost para desarrollo.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS?.split(",") ?? []),
  "http://localhost:3000",
  "http://localhost:3001",
]
  .map((o) => o?.trim().replace(/\/$/, ""))
  .filter((o): o is string => Boolean(o));

// Previews de Vercel: https://<algo>.vercel.app
const vercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const clean = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(clean) || vercelPreview.test(clean)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] origen bloqueado: ${origin}`);
        callback(new Error("Origen no permitido"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// Rate-limit global modesto
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

// Health check. `/health` es el que consulta Railway; `/ikk/health` se mantiene
// por compatibilidad con lo ya documentado.
const health = (_req: Request, res: Response): void => {
  res.json({ ok: true, ts: new Date().toISOString() });
};
app.get("/health", health);
app.get("/ikk/health", health);

// Rutas IKK
app.use("/ikk/auth", authRoutes);
app.use("/ikk/operators", operatorsRoutes);
app.use("/ikk/overview", overviewRoutes);
app.use("/ikk/audit", auditRoutes);
app.use("/ikk/contact", contactRoutes);
app.use("/ikk/tickomium", tickomiumRoutes);
app.use("/ikk/formate", formateRoutes);
app.use("/ikk/mdoc", mdocRoutes);

// 404 silencioso para rutas no IKK
app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler global (último)
app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 4100);
app.listen(PORT, () => {
  console.log(`[IKK] API escuchando en :${PORT} (TZ ${process.env.TZ})`);
});

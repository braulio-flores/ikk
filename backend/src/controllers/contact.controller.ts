// Formulario de contacto de la landing pública.
//
// El lead se guarda SIEMPRE en la base de IKK; el email es un aviso extra que
// nunca debe tumbar la request si Resend falla.

import { Request, Response } from "express";
import { z } from "zod";
import { LeadStatus, PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../utils/HttpError";
import { requireParam, optionalParam } from "../utils/params";
import { sendContactNotificationEmail } from "../services/email.service";
import { writeAudit } from "../services/audit.service";

const prisma = new PrismaClient();

const contactSchema = z.object({
  name: z.string().trim().min(2, "El nombre es demasiado corto").max(120),
  email: z.string().trim().toLowerCase().email("Correo inválido").max(160),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más sobre el proyecto")
    .max(4000),
  // Honeypot: si viene lleno, es un bot.
  website: z.string().max(0).optional().or(z.literal("")),
});

// =========================================================================
//   POST /ikk/contact  (público)
// =========================================================================
export const submit = async (req: Request, res: Response): Promise<void> => {
  const parsed = contactSchema.safeParse(req.body);

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new BadRequestError(first?.message ?? "Revisa los datos del formulario");
  }

  const { name, email, company, phone, message, website } = parsed.data;

  // Bot detectado: respondemos 200 sin guardar nada.
  if (website) {
    res.status(201).json({ ok: true });
    return;
  }

  const lead = await prisma.contactLead.create({
    data: {
      name,
      email,
      company: company || null,
      phone: phone || null,
      message,
    },
    select: { id: true, createdAt: true },
  });

  sendContactNotificationEmail({ name, email, company, phone, message }).catch(
    (err: unknown) => {
      console.error("[CONTACT] No se pudo enviar el aviso por email:", err);
    }
  );

  res.status(201).json({ ok: true, receivedAt: lead.createdAt });
};

// =========================================================================
//   GET /ikk/contact/leads  (panel)
// =========================================================================
export const list = async (req: Request, res: Response): Promise<void> => {
  const {
    search,
    status,
    page = "1",
    limit = "50",
  } = req.query as Record<string, string | undefined>;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(200, Math.max(1, Number(limit) || 50));

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status && status in LeadStatus) {
    where.status = status as LeadStatus;
  }

  const [items, total] = await Promise.all([
    prisma.contactLead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limitNum,
      skip: (pageNum - 1) * limitNum,
    }),
    prisma.contactLead.count({ where }),
  ]);

  res.json({ items, total, page: pageNum, limit: limitNum });
};

// =========================================================================
//   PATCH /ikk/contact/leads/:id  (panel)
// =========================================================================
export const update = async (req: Request, res: Response): Promise<void> => {
  const id = requireParam(req, "id");

  const { status, notes } = req.body as { status?: string; notes?: string };

  const data: Record<string, unknown> = {};
  if (status !== undefined) {
    if (!(status in LeadStatus)) throw new BadRequestError("Estado inválido");
    data.status = status as LeadStatus;
  }
  if (notes !== undefined) data.notes = notes.trim() || null;

  if (Object.keys(data).length === 0) {
    throw new BadRequestError("No hay cambios que guardar");
  }

  const lead = await prisma.contactLead
    .update({ where: { id }, data })
    .catch(() => null);

  if (!lead) throw new NotFoundError("Contacto no encontrado");

  await writeAudit({
    operatorId: req.user?.id,
    product: "IKK",
    action: "lead.update",
    targetId: id,
    payload: { changes: Object.keys(data) },
  });

  res.json({ lead });
};

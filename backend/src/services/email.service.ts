import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM;
const FRONTEND_URL = process.env.FRONTEND_URL;
// Ruta del frontend donde se fija la nueva contraseña. Debe coincidir con
// RESET_PATH en frontend/src/lib/routes.ts.
const RESET_PATH = "/ikk-ops/restablecer";
const CONTACT_INBOX = process.env.CONTACT_EMAIL_TO;

/** Fecha legible en hora de México para el cuerpo de los correos. */
function nowInMexico(): string {
  return new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
    dateStyle: "long",
    timeStyle: "short",
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  firstName: string
): Promise<void> {
  const resetUrl = `${FRONTEND_URL}${RESET_PATH}?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL ?? "IKK Solutions <noreply@ikksolutions.com>",
    to,
    subject: "Restablecer tu contraseña — IKK Solutions",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="margin: 0 0 8px; font-size: 22px; color: #1a1a1a;">Hola ${firstName},</h2>
        <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta de operador en IKK Solutions.
        </p>
        <a
          href="${resetUrl}"
          style="display: inline-block; background: #1f2937; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;"
        >
          Restablecer contraseña
        </a>
        <p style="color: #999; font-size: 13px; line-height: 1.5; margin: 24px 0 0;">
          Este enlace expira en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
        <p style="color: #bbb; font-size: 12px; margin: 0;">IKK Solutions — Panel master</p>
      </div>
    `,
  });

  if (error) {
    console.error("[RESEND] Error:", JSON.stringify(error));
    throw new Error(error.message);
  }

  console.log("[RESEND] Email enviado, id:", data?.id);
}

export interface ContactNotification {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

/**
 * Aviso interno de un nuevo prospecto del formulario público. Si
 * CONTACT_EMAIL_TO no está configurado, no se envía nada: el lead ya quedó
 * guardado en la base.
 */
export async function sendContactNotificationEmail(
  lead: ContactNotification
): Promise<void> {
  if (!CONTACT_INBOX) {
    console.warn("[RESEND] CONTACT_EMAIL_TO sin configurar: no se envía aviso");
    return;
  }

  const rows: Array<[string, string]> = [
    ["Nombre", lead.name],
    ["Correo", lead.email],
    ...(lead.company ? ([["Empresa", lead.company]] as Array<[string, string]>) : []),
    ...(lead.phone ? ([["Teléfono", lead.phone]] as Array<[string, string]>) : []),
    ["Recibido", nowInMexico()],
  ];

  const { error } = await resend.emails.send({
    from: FROM_EMAIL ?? "IKK Solutions <noreply@ikksolutions.com>",
    to: CONTACT_INBOX,
    replyTo: lead.email,
    subject: `Nuevo contacto: ${lead.name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 20px;">
        <h2 style="margin: 0 0 16px; font-size: 20px; color: #1a1a1a;">Nuevo contacto desde la web</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
          ${rows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding: 6px 12px 6px 0; color: #888; white-space: nowrap;">${label}</td>
              <td style="padding: 6px 0;">${escapeHtml(value)}</td>
            </tr>`
            )
            .join("")}
        </table>
        <p style="margin: 24px 0 6px; color: #888; font-size: 13px;">Mensaje</p>
        <div style="white-space: pre-wrap; background: #f6f6f6; border-radius: 8px; padding: 16px; font-size: 14px; color: #222; line-height: 1.6;">${escapeHtml(
          lead.message
        )}</div>
        <p style="color: #bbb; font-size: 12px; margin: 28px 0 0;">Este prospecto también quedó guardado en el panel de IKK.</p>
      </div>
    `,
  });

  if (error) {
    console.error("[RESEND] Error enviando aviso de contacto:", JSON.stringify(error));
    throw new Error(error.message);
  }
}

// Bootstrap del primer operador de IKK.
//
// Idempotente: si ya existe algún operador no hace nada. Se ejecuta a mano
// (local o desde la consola de Railway) con:
//
//   BOOTSTRAP_ADMIN_EMAIL=... BOOTSTRAP_ADMIN_PASSWORD=... npm run seed
//
// El resto de los operadores se crean desde /panel/settings/operators.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || "Administrador";

  if (!email || !password) {
    console.error(
      "[SEED] Faltan BOOTSTRAP_ADMIN_EMAIL y BOOTSTRAP_ADMIN_PASSWORD."
    );
    process.exitCode = 1;
    return;
  }

  if (password.length < 12) {
    console.error(
      "[SEED] La contraseña del primer operador debe tener al menos 12 caracteres."
    );
    process.exitCode = 1;
    return;
  }

  const existing = await prisma.operator.count();
  if (existing > 0) {
    console.log(`[SEED] Ya hay ${existing} operador(es). No se creó ninguno.`);
    return;
  }

  const operator = await prisma.operator.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: "SUPER_ADMIN",
    },
    select: { email: true, role: true },
  });

  console.log(`[SEED] Operador creado: ${operator.email} (${operator.role})`);
}

main()
  .catch((err: unknown) => {
    console.error("[SEED] Error:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

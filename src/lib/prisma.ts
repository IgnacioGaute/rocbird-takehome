import { PrismaClient } from "@prisma/client";

// Extiende el objeto global para que pueda guardar la instancia
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Reutiliza la instancia existente o crea una nueva
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // opcional: loguea consultas en consola
  });

// En producción, se recomienda una sola instancia real
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

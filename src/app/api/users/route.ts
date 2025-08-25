import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Logger } from "@/lib/logger";

const logger = new Logger("UsersAPI");

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("GET - Intento no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const users = await prisma.user.findMany();
    logger.log(`GET - ${users.length} usuarios obtenidos`);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    logger.error("Error al obtener usuarios", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("POST - Intento no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      logger.warn("POST - Body inválido");
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    const { email, firstName, lastName, password } = body;
    if (!email || !password) {
      logger.warn("POST - Campos obligatorios faltantes");
      return NextResponse.json({ error: "Campos obligatorios faltantes" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { email, firstName, lastName, password: hashedPassword },
    });

    logger.log(`POST - Usuario creado: ${newUser.id}`);

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    logger.error("Error al crear usuario", error);
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}

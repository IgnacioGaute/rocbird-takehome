import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Logger } from "@/lib/logger";

const logger = new Logger("UsersByIdAPI");

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`GET - Intento no autorizado para id=${params.id}`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      logger.warn(`GET - Usuario no encontrado: id=${id}`);
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    logger.log(`GET - Usuario obtenido: id=${id}`);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    logger.error(`GET - Error al obtener usuario id=${params.id}`, error);
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`PUT - Intento no autorizado para id=${params.id}`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      logger.warn(`PUT - Body inválido para id=${params.id}`);
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    const { id } = params;

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 12);
    }

    const updatedUser = await prisma.user.update({ where: { id }, data: body });
    logger.log(`PUT - Usuario actualizado: id=${id}`);
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    logger.error(`PUT - Error al actualizar usuario id=${params.id}`, error);
    if (error.code === "P2025")
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`DELETE - Intento no autorizado para id=${params.id}`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;

    await prisma.user.delete({ where: { id } });
    logger.log(`DELETE - Usuario eliminado: id=${id}`);
    return NextResponse.json({ message: "Usuario eliminado" }, { status: 200 });
  } catch (error: any) {
    logger.error(`DELETE - Error al eliminar usuario id=${params.id}`, error);
    if (error.code === "P2025")
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 });
  }
}

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Logger } from "@/lib/logger";

const logger = new Logger("ReferenteByIdAPI");

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`GET /${id} - Intento no autorizado`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const referente = await prisma.referenteTecnico.findUnique({
      where: { id: Number(id) },
      include: {
        liderTalentos: true,
        mentorTalentos: true,
      },
    });

    if (!referente) {
      logger.warn(`GET /${id} - Referente no encontrado`);
      return NextResponse.json({ error: "Referente no encontrado" }, { status: 404 });
    }

    logger.log(`GET /${id} - Referente obtenido`);
    return NextResponse.json(referente, { status: 200 });
  } catch (error) {
    logger.error(`Error al obtener referente ${await context.params}`, error);
    return NextResponse.json({ error: "Error al obtener referente" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`PUT /${id} - Intento no autorizado`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { nombre_y_apellido } = body;

    const referenteActualizado = await prisma.referenteTecnico.update({
      where: { id: Number(id) },
      data: { nombre_y_apellido },
    });

    logger.log(`PUT /${id} - Referente actualizado`);
    return NextResponse.json(referenteActualizado, { status: 200 });
  } catch (error) {
    logger.error(`Error al actualizar referente ${await context.params}`, error);
    return NextResponse.json({ error: "Error al actualizar referente" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`DELETE /${id} - Intento no autorizado`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.referenteTecnico.delete({
      where: { id: Number(id) },
    });

    logger.log(`DELETE /${id} - Referente eliminado`);
    return NextResponse.json({ message: "Referente eliminado correctamente" }, { status: 200 });
  } catch (error) {
    logger.error(`Error al eliminar referente ${await context.params}`, error);
    return NextResponse.json({ error: "Error al eliminar referente" }, { status: 500 });
  }
}

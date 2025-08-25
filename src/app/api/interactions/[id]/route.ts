import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Logger } from "@/lib/logger"; 

const logger = new Logger("InteraccionesByIdAPI");

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const interaccion = await prisma.interaccion.findUnique({
      where: { id: Number(id) },
      include: { talento: true },
    });

    if (!interaccion) {
      return NextResponse.json({ error: "Interacción no encontrada" }, { status: 404 });
    }

    return NextResponse.json(interaccion, { status: 200 });
  } catch (error) {
    logger.error("Error al obtener interacción:", error);
    return NextResponse.json({ error: "Error al obtener interacción" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { talentoId, tipo_de_interaccion, fecha, detalle, estado } = body;

    if (talentoId) {
      const talento = await prisma.talento.findUnique({
        where: { id: talentoId },
        select: { id: true },
      });
      if (!talento) {
        return NextResponse.json(
          { error: `El talento con id ${talentoId} no existe` },
          { status: 404 }
        );
      }
    }

    const interaccion = await prisma.interaccion.update({
      where: { id: Number(id) },
      data: {
        talentoId,
        tipo_de_interaccion,
        fecha,
        detalle,
        estado,
      },
    });

    return NextResponse.json(interaccion, { status: 200 });
  } catch (err) {
    logger.error("Error al actualizar interacción:", err);
    return NextResponse.json({ error: "Error al actualizar interacción" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    await prisma.interaccion.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Interacción eliminada" }, { status: 200 });
  } catch (error) {
    logger.error("Error al eliminar interacción:", error);
    return NextResponse.json({ error: "Error al eliminar interacción" }, { status: 500 });
  }
}

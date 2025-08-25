import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Logger } from "@/lib/logger";

const logger = new Logger("TalentoByIdAPI");

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`GET /talento/${id} sin autorización`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const talento = await prisma.talento.findUnique({
      where: { id: Number(id) },
    });

    if (!talento) {
      logger.warn(`GET /talento/${id}: Talento no encontrado`);
      return NextResponse.json({ error: "Talento no encontrado" }, { status: 404 });
    }

    const referentes = await prisma.referenteTecnico.findMany({
      where: {
        id: {
          in: [talento.referenteLiderId, talento.referenteMentorId].filter(
            (id): id is number => id !== null && id !== undefined
          ),
        }
      },
      select: { id: true },
    });

    if (talento.referenteLiderId && !referentes.some(r => r.id === talento.referenteLiderId)) {
      logger.warn(`GET /talento/${id}: referente líder no existe`);
      return NextResponse.json(
        { error: `El referente líder con id ${talento.referenteLiderId} no existe` },
        { status: 404 }
      );
    }

    if (talento.referenteMentorId && !referentes.some(r => r.id === talento.referenteMentorId)) {
      logger.warn(`GET /talento/${id}: referente mentor no existe`);
      return NextResponse.json(
        { error: `El referente mentor con id ${talento.referenteMentorId} no existe` },
        { status: 404 }
      );
    }

    logger.log(`GET /talento/${id}: éxito`);
    return NextResponse.json(talento, { status: 200 });
  } catch (error) {
    logger.error(`GET /talento/${context.params.id} error:`, error);
    return NextResponse.json({ error: "Error al obtener talento" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) {
      logger.warn("PUT /talento: falta id");
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`PUT /talento/${id} sin autorización`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { nombre_y_apellido, seniority, rol, estado, referenteLiderId, referenteMentorId } = body;

    const referentes = await prisma.referenteTecnico.findMany({
      where: { id: { in: [referenteLiderId, referenteMentorId].filter(Boolean) } },
      select: { id: true },
    });

    if (referenteLiderId && !referentes.some(r => r.id === referenteLiderId)) {
      logger.warn(`PUT /talento/${id}: referente líder no existe`);
      return NextResponse.json(
        { error: `El referente líder con id ${referenteLiderId} no existe` },
        { status: 404 }
      );
    }
    if (referenteMentorId && !referentes.some(r => r.id === referenteMentorId)) {
      logger.warn(`PUT /talento/${id}: referente mentor no existe`);
      return NextResponse.json(
        { error: `El referente mentor con id ${referenteMentorId} no existe` },
        { status: 404 }
      );
    }

    const talento = await prisma.talento.update({
      where: { id: Number(id) },
      data: { nombre_y_apellido, seniority, rol, estado, referenteLiderId, referenteMentorId },
    });

    logger.log(`PUT /talento/${id}: actualizado con éxito`);
    return NextResponse.json(talento, { status: 200 });
  } catch (error) {
    logger.error(`PUT /talento/${context.params.id} error:`, error);
    return NextResponse.json({ error: "Error al actualizar talento" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`DELETE /talento/${id} sin autorización`);
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.talento.delete({ where: { id: Number(id) } });
    logger.log(`DELETE /talento/${id}: eliminado`);
    return NextResponse.json({ message: "Talento eliminado" }, { status: 200 });
  } catch (error) {
    logger.error(`DELETE /talento/${context.params.id} error:`, error);
    return NextResponse.json({ error: "Error al eliminar talento" }, { status: 500 });
  }
}

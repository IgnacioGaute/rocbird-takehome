import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Logger } from "@/lib/logger";

const logger = new Logger("ReferentesAPI");

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn("GET - Intento no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const referentes = await prisma.referenteTecnico.findMany({
      include: {
        liderTalentos: {
          select: {
            id: true,
            nombre_y_apellido: true,
            seniority: true,
            rol: true,
            estado: true,
          },
        },
        mentorTalentos: {
          select: {
            id: true,
            nombre_y_apellido: true,
            seniority: true,
            rol: true,
            estado: true,
          },
        },
      },
    });

    logger.log(`GET - ${referentes.length} referentes obtenidos`);
    return NextResponse.json(referentes, { status: 200 });
  } catch (error) {
    logger.error("Error al obtener referentes", error);
    return NextResponse.json({ error: "Error al obtener referentes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn("POST - Intento no autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { nombre_y_apellido } = body;

    if (!nombre_y_apellido) {
      logger.warn("POST - Nombre obligatorio no proporcionado");
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const nuevoReferente = await prisma.referenteTecnico.create({
      data: { nombre_y_apellido },
    });

    logger.log(`POST - Nuevo referente creado: ${nuevoReferente.id}`);
    return NextResponse.json(nuevoReferente, { status: 201 });
  } catch (error) {
    logger.error("Error al crear referente", error);
    return NextResponse.json({ error: "Error al crear referente" }, { status: 500 });
  }
}

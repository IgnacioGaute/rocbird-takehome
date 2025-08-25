import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { Logger } from "@/lib/logger";

const logger = new Logger("InteraccionesAPI");

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      logger.warn("POST /interacciones: No autorizado");
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    const { talentoId, tipo_de_interaccion, fecha, detalle, estado } = await req.json();

    if (talentoId) {
      const talento = await prisma.talento.findUnique({ where: { id: talentoId }, select: { id: true } });
      if (!talento) {
        logger.warn(`POST /interacciones: talento ${talentoId} no existe`);
        return new Response(JSON.stringify({ error: `El talento con id ${talentoId} no existe` }), { status: 404 });
      }
    }

    const interaccion = await prisma.interaccion.create({
      data: { talentoId, tipo_de_interaccion, fecha, detalle, estado },
    });

    logger.log(`POST /interacciones: interacción creada (talentoId=${talentoId})`);
    return new Response(JSON.stringify(interaccion), { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    logger.error("POST /interacciones error:", error);
    return NextResponse.json(
      { error: "Error al crear interacción" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn("GET /interacciones: No autorizado");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const interacciones = await prisma.interaccion.findMany({
      include: { talento: true },
    });

    logger.log(`GET /interacciones: ${interacciones.length} interacciones obtenidas`);
    return NextResponse.json(interacciones, { status: 200 });
  } catch (error) {
    logger.error("GET /interacciones error:", error);
    return NextResponse.json({ error: "Error al obtener interacciones" }, { status: 500 });
  }
}

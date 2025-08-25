import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Logger } from "@/lib/logger";

const logger = new Logger("TalentosAPI");

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    const { nombre_y_apellido, seniority, rol, estado, referenteLiderId, referenteMentorId } = body;

    if (!nombre_y_apellido || !seniority || !rol || !estado) {
      return NextResponse.json<{ error: string }>(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }
    

    const referentes = await prisma.referenteTecnico.findMany({
      where: { id: { in: [referenteLiderId, referenteMentorId].filter(Boolean) } },
      select: { id: true },
    });

    if (referenteLiderId && !referentes.some(r => r.id === referenteLiderId)) {
      return NextResponse.json(
        { error: `El referente líder con id ${referenteLiderId} no existe` },
        { status: 404 }
      );
    }
    if (referenteMentorId && !referentes.some(r => r.id === referenteMentorId)) {
      return NextResponse.json(
        { error: `El referente mentor con id ${referenteMentorId} no existe` },
        { status: 404 }
      );
    }

    const talento = await prisma.talento.create({
      data: { nombre_y_apellido, seniority, rol, estado, referenteLiderId, referenteMentorId },
    });

    return NextResponse.json(talento, { status: 201 });
  } catch (error) {
    logger.error("Error al crear talento:", error);
    return NextResponse.json({ error: "Error al crear talento" }, { status: 500 });
  }
}

// GET lista talentos
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";    
    const skip = (page - 1) * limit;

    const talentos = await prisma.talento.findMany({
      take: limit,
      skip,
      orderBy: { nombre_y_apellido: sort },
      include: {
        referenteLider: true,
        referenteMentor: true,
        interacciones: true,
      },
    });

    return NextResponse.json(talentos, { status: 200 });
  } catch (error) {
    logger.error("Error al obtener talentos:", error);
    return NextResponse.json({ error: "Error al obtener talentos" }, { status: 500 });
  }
}

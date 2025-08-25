-- CreateEnum
CREATE TYPE "public"."EstadoTalento" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "public"."EstadoInteraccion" AS ENUM ('INICIADA', 'EN_PROGRESO', 'FINALIZADA');

-- CreateTable
CREATE TABLE "public"."Talento" (
    "id" SERIAL NOT NULL,
    "nombre_y_apellido" TEXT NOT NULL,
    "seniority" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "estado" "public"."EstadoTalento" NOT NULL DEFAULT 'ACTIVO',
    "referenteLiderId" INTEGER,
    "referenteMentorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Talento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReferenteTecnico" (
    "id" SERIAL NOT NULL,
    "nombre_y_apellido" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferenteTecnico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interaccion" (
    "id" SERIAL NOT NULL,
    "talentoId" INTEGER NOT NULL,
    "tipo_de_interaccion" TEXT NOT NULL,
    "detalle" TEXT NOT NULL,
    "estado" "public"."EstadoInteraccion" NOT NULL DEFAULT 'INICIADA',
    "fecha" TIMESTAMP(3) NOT NULL,
    "fecha_de_modificacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interaccion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Talento" ADD CONSTRAINT "Talento_referenteLiderId_fkey" FOREIGN KEY ("referenteLiderId") REFERENCES "public"."ReferenteTecnico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Talento" ADD CONSTRAINT "Talento_referenteMentorId_fkey" FOREIGN KEY ("referenteMentorId") REFERENCES "public"."ReferenteTecnico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interaccion" ADD CONSTRAINT "Interaccion_talentoId_fkey" FOREIGN KEY ("talentoId") REFERENCES "public"."Talento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

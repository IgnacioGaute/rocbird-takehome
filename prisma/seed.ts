import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const lider1 = await prisma.referenteTecnico.create({
    data: { nombre_y_apellido: 'Juan Pérez' },
  });

  const mentor1 = await prisma.referenteTecnico.create({
    data: { nombre_y_apellido: 'María Gómez' },
  });

  const lider2 = await prisma.referenteTecnico.create({
    data: { nombre_y_apellido: 'Carlos Rodríguez' },
  });

  const talento1 = await prisma.talento.create({
    data: {
      nombre_y_apellido: 'Ana Martínez',
      seniority: 'JUNIOR',
      rol: 'Frontend Developer',
      estado: 'ACTIVO',
      referenteLiderId: lider1.id,
      referenteMentorId: mentor1.id,
    },
  });

  const talento2 = await prisma.talento.create({
    data: {
      nombre_y_apellido: 'Luis Fernández',
      seniority: 'SENIOR',
      rol: 'Backend Developer',
      estado: 'ACTIVO',
      referenteLiderId: lider2.id,
      referenteMentorId: mentor1.id,
    },
  });

  await prisma.interaccion.createMany({
    data: [
      {
        talentoId: talento1.id,
        tipo_de_interaccion: 'Reunión',
        detalle: 'Reunión inicial con el líder',
        estado: 'INICIADA',
        fecha: new Date(),
      },
      {
        talentoId: talento1.id,
        tipo_de_interaccion: 'Feedback',
        detalle: 'Feedback sobre primer proyecto',
        estado: 'EN_PROGRESO',
        fecha: new Date(),
      },
      {
        talentoId: talento2.id,
        tipo_de_interaccion: 'Reunión',
        detalle: 'Reunión de seguimiento',
        estado: 'FINALIZADA',
        fecha: new Date(),
      },
    ],
  });

  console.log('Seed inicial completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

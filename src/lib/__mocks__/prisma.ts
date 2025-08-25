export const prisma = {
    talento: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    referenteTecnico: {
      findMany: jest.fn(),
    }
  };
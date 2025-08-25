
import { NextRequest } from "next/server";
import { GET as getReferente, PUT, DELETE } from "../../api/technical-reference/[id]/route";
import { POST, GET as listReferentes } from "../../api/technical-reference/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => {
  return {
    prisma: {
      referenteTecnico: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
  };
});

const mockAuthHeader = { authorization: "Bearer token123" };

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("API Referentes Técnicos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/referentes-tecnicos/[id]", () => {
    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/referentes-tecnicos/1");
      const res = await getReferente(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    it("retorna 404 si no existe el referente", async () => {
      (prisma.referenteTecnico.findUnique as jest.Mock).mockResolvedValue(null);

      const req = new NextRequest("http://localhost/api/referentes-tecnicos/1", {
        headers: mockAuthHeader,
      });
      const res = await getReferente(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(404);
    });

    it("retorna 200 con el referente", async () => {
      (prisma.referenteTecnico.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        nombre_y_apellido: "Juan Pérez",
      });

      const req = new NextRequest("http://localhost/api/referentes-tecnicos/1", {
        headers: mockAuthHeader,
      });
      const res = await getReferente(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.referenteTecnico.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));

      const req = new NextRequest("http://localhost/api/referentes-tecnicos/1", {
        headers: mockAuthHeader,
      });
      const res = await getReferente(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/referentes-tecnicos", () => {
    it("crea un referente correctamente", async () => {
      (prisma.referenteTecnico.create as jest.Mock).mockResolvedValue({
        id: 1,
        nombre_y_apellido: "Juan Pérez",
      });

      const req = new NextRequest("http://localhost/api/referentes-tecnicos", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Juan Pérez" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/referentes-tecnicos", { method: "POST" });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("retorna 400 si falta nombre", async () => {
      const req = new NextRequest("http://localhost/api/referentes-tecnicos", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({}),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.referenteTecnico.create as jest.Mock).mockRejectedValue(new Error("DB fail"));

      const req = new NextRequest("http://localhost/api/referentes-tecnicos", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Juan Pérez" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(500);
    });
  });

  describe("PUT /api/referentes-tecnicos/[id]", () => {
    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/referentes-tecnicos/1", { method: "PUT" });
      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    it("actualiza un referente correctamente", async () => {
      (prisma.referenteTecnico.update as jest.Mock).mockResolvedValue({
        id: 1,
        nombre_y_apellido: "Nuevo Nombre",
      });

      const req = new NextRequest("http://localhost/api/referentes-tecnicos/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Nuevo Nombre" }),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.referenteTecnico.update as jest.Mock).mockRejectedValue(new Error("DB fail"));

      const req = new NextRequest("http://localhost/api/referentes-tecnicos/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Nombre" }),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  describe("DELETE /api/referentes-tecnicos/[id]", () => {
    it("elimina un referente correctamente", async () => {
      (prisma.referenteTecnico.delete as jest.Mock).mockResolvedValue({});

      const req = new NextRequest("http://localhost/api/referentes-tecnicos/1", {
        method: "DELETE",
        headers: mockAuthHeader,
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/referentes-tecnicos/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.referenteTecnico.delete as jest.Mock).mockRejectedValue(new Error("DB fail"));

      const req = new NextRequest("http://localhost/api/referentes-tecnicos/1", {
        method: "DELETE",
        headers: mockAuthHeader,
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  describe("GET /api/referentes-tecnicos", () => {
    it("lista referentes correctamente", async () => {
      (prisma.referenteTecnico.findMany as jest.Mock).mockResolvedValue([
        { id: 1, nombre_y_apellido: "Juan Pérez" },
      ]);

      const req = new NextRequest("http://localhost/api/referentes-tecnicos", {
        headers: mockAuthHeader,
      });

      const res = await listReferentes(req);
      expect(res.status).toBe(200);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/referentes-tecnicos");
      const res = await listReferentes(req);
      expect(res.status).toBe(401);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.referenteTecnico.findMany as jest.Mock).mockRejectedValue(new Error("DB fail"));

      const req = new NextRequest("http://localhost/api/referentes-tecnicos", {
        headers: mockAuthHeader,
      });

      const res = await listReferentes(req);
      expect(res.status).toBe(500);
    });
  });
});

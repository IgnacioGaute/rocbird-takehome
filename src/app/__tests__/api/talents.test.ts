import { NextRequest } from "next/server";
import { GET as getTalento, PUT, DELETE } from "../../api/talents/[id]/route";
import { POST, GET as listTalentos } from "../../api/talents/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma");

const mockAuthHeader = { authorization: "Bearer token123" };

describe("API Talentos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/talentos/[id]", () => {
    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/talentos/1");
      const res = await getTalento(req, { params: { id: "1" } });
      expect(res.status).toBe(401);
    });

    it("retorna 404 si el talento no existe", async () => {
      (prisma.talento.findUnique as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost/api/talentos/1", { headers: mockAuthHeader });
      const res = await getTalento(req, { params: { id: "1" } });
      expect(res.status).toBe(404);
    });

    it("retorna 200 con el talento", async () => {
      (prisma.talento.findUnique as jest.Mock).mockResolvedValue({ id: 1, nombre_y_apellido: "Juan Pérez" });
      const req = new NextRequest("http://localhost/api/talentos/1", { headers: mockAuthHeader });
      const res = await getTalento(req, { params: { id: "1" } });
      expect(res.status).toBe(200);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.talento.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));
      const req = new NextRequest("http://localhost/api/talentos/1", { headers: mockAuthHeader });
      const res = await getTalento(req, { params: { id: "1" } });
      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/talentos", () => {
    it("crea un talento correctamente", async () => {
      (prisma.referenteTecnico.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.talento.create as jest.Mock).mockResolvedValue({ id: 1, nombre_y_apellido: "Ana Gómez" });
      const req = new NextRequest("http://localhost/api/talentos", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Ana Gómez", seniority: "JUNIOR", rol: "Frontend", estado: "ACTIVO" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(201);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/talentos", { method: "POST" });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("retorna 404 si referente no existe", async () => {
      (prisma.referenteTecnico.findMany as jest.Mock).mockResolvedValue([]);
      const req = new NextRequest("http://localhost/api/talentos", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "X", seniority: "JUNIOR", estado: "ACTIVO", rol: "Dev", referenteLiderId: 999 }),
      });
      const res = await POST(req);
      expect(res.status).toBe(404);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.talento.create as jest.Mock).mockRejectedValue(new Error("DB fail"));
      const req = new NextRequest("http://localhost/api/talentos", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "X", seniority: "JUNIOR", rol: "Dev", estado: "ACTIVO" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(500);
    });

    it("retorna 404 si referente líder no existe", async () => {
      (prisma.referenteTecnico.findMany as jest.Mock).mockResolvedValue([{ id: 2 }]);
      const req = new NextRequest("http://localhost/api/talentos", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Ana", seniority: "JUNIOR", rol: "Dev", estado: "ACTIVO", referenteLiderId: 1, referenteMentorId: 2 }),
      });
      const res = await POST(req);
      const data = await res.json();
      expect(res.status).toBe(404);
      expect(data.error).toBe("El referente líder con id 1 no existe");
    });

    it("retorna 404 si referente mentor no existe", async () => {
      (prisma.referenteTecnico.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const req = new NextRequest("http://localhost/api/talentos", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Ana", seniority: "JUNIOR", rol: "Dev", estado: "ACTIVO", referenteLiderId: 1, referenteMentorId: 2 }),
      });
      const res = await POST(req);
      const data = await res.json();
      expect(res.status).toBe(404);
      expect(data.error).toBe("El referente mentor con id 2 no existe");
    });
    it("retorna 400 si el body no es JSON válido", async () => {
        const req = new NextRequest("http://localhost/api/talentos", {
          method: "POST",
          headers: mockAuthHeader,
          body: "no es JSON"
        });
      
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe("Body inválido");
      });
      

    it("retorna 400 si faltan campos obligatorios", async () => {
        const req = new NextRequest("http://localhost/api/talentos", {
          method: "POST",
          headers: mockAuthHeader,
          body: JSON.stringify({ seniority: "JUNIOR", rol: "Dev", estado: "ACTIVO" }), // falta nombre_y_apellido
        });
        const res = await POST(req);
        const data = await res.json();
        expect(res.status).toBe(400);
        expect(data.error).toBe("Campos obligatorios faltantes");
      });
      
  });

  describe("PUT /api/talentos/[id]", () => {
    it("actualiza un talento", async () => {
      (prisma.referenteTecnico.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.talento.update as jest.Mock).mockResolvedValue({ id: 1, nombre_y_apellido: "Pedro Actualizado" });
      const req = new NextRequest("http://localhost/api/talentos/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Pedro Actualizado", seniority: "SENIOR", rol: "Backend", estado: "ACTIVO" }),
      });
      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(200);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/talentos/1", { method: "PUT" });
      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(401);
    });

    it("retorna 400 si falta id en params", async () => {
      const req = new NextRequest("http://localhost/api/talentos", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Test", seniority: "JUNIOR", rol: "Dev", estado: "ACTIVO" }),
      });
      const res = await PUT(req, { params: {} as any });
      expect(res.status).toBe(400);
    });

    it("retorna 404 si referente líder no existe", async () => {
      (prisma.referenteTecnico.findMany as jest.Mock).mockResolvedValue([{ id: 2 }]);
      const req = new NextRequest("http://localhost/api/talentos/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Ana", seniority: "JUNIOR", rol: "Dev", estado: "ACTIVO", referenteLiderId: 1, referenteMentorId: 2 }),
      });
      const res = await PUT(req, { params: { id: "1" } });
      const data = await res.json();
      expect(res.status).toBe(404);
      expect(data.error).toBe("El referente líder con id 1 no existe");
    });

    it("retorna 404 si referente mentor no existe", async () => {
      (prisma.referenteTecnico.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const req = new NextRequest("http://localhost/api/talentos/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "Ana", seniority: "JUNIOR", rol: "Dev", estado: "ACTIVO", referenteLiderId: 1, referenteMentorId: 2 }),
      });
      const res = await PUT(req, { params: { id: "1" } });
      const data = await res.json();
      expect(res.status).toBe(404);
      expect(data.error).toBe("El referente mentor con id 2 no existe");
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.talento.update as jest.Mock).mockRejectedValue(new Error("DB fail"));
      const req = new NextRequest("http://localhost/api/talentos/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ nombre_y_apellido: "X", seniority: "JUNIOR", rol: "Dev", estado: "ACTIVO" }),
      });
      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(500);
    });
  });

  describe("DELETE /api/talentos/[id]", () => {
    it("elimina un talento", async () => {
      (prisma.talento.delete as jest.Mock).mockResolvedValue({});
      const req = new NextRequest("http://localhost/api/talentos/1", { method: "DELETE", headers: mockAuthHeader });
      const res = await DELETE(req, { params: { id: "1" } });
      expect(res.status).toBe(200);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/talentos/1", { method: "DELETE" });
      const res = await DELETE(req, { params: { id: "1" } });
      expect(res.status).toBe(401);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.talento.delete as jest.Mock).mockRejectedValue(new Error("DB fail"));
      const req = new NextRequest("http://localhost/api/talentos/1", { method: "DELETE", headers: mockAuthHeader });
      const res = await DELETE(req, { params: { id: "1" } });
      expect(res.status).toBe(500);
    });
  });

  describe("GET /api/talentos", () => {
    it("lista talentos", async () => {
      (prisma.talento.findMany as jest.Mock).mockResolvedValue([{ id: 1, nombre_y_apellido: "Juan" }]);
      const req = new NextRequest("http://localhost/api/talentos?page=1&limit=5", { headers: mockAuthHeader });
      const res = await listTalentos(req);
      expect(res.status).toBe(200);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/talentos");
      const res = await listTalentos(req);
      expect(res.status).toBe(401);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.talento.findMany as jest.Mock).mockRejectedValue(new Error("DB fail"));
      const req = new NextRequest("http://localhost/api/talentos", { headers: mockAuthHeader });
      const res = await listTalentos(req);
      expect(res.status).toBe(500);
    });

    it("GET con sort=asc", async () => {
      (prisma.talento.findMany as jest.Mock).mockResolvedValue([]);
      const req = new NextRequest("http://localhost/api/talentos?sort=asc", { headers: mockAuthHeader });
      const res = await listTalentos(req);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/talentos/[id] - referentes inexistentes", () => {
    it("retorna 404 si referente mentor no existe", async () => {
      (prisma.talento.findUnique as jest.Mock).mockResolvedValue({ id: 1, nombre_y_apellido: "Juan Pérez", referenteMentorId: 999, referenteLiderId: 1 });
      (prisma.referenteTecnico.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const req = new NextRequest("http://localhost/api/talentos/1", { headers: mockAuthHeader });
      const res = await getTalento(req, { params: { id: "1" } });
      const data = await res.json();
      expect(data.error).toBe("El referente mentor con id 999 no existe");
      expect(res.status).toBe(404);
    });

    it("retorna 404 si referente líder no existe", async () => {
      (prisma.talento.findUnique as jest.Mock).mockResolvedValue({ id: 1, nombre_y_apellido: "Juan Pérez", referenteLiderId: 1, referenteMentorId: 2 });
      (prisma.referenteTecnico.findMany as jest.Mock).mockResolvedValue([{ id: 2 }]);
      const req = new NextRequest("http://localhost/api/talentos/1", { headers: mockAuthHeader });
      const res = await getTalento(req, { params: { id: "1" } });
      const data = await res.json();
      expect(data.error).toBe("El referente líder con id 1 no existe");
      expect(res.status).toBe(404);
    });
  });
});

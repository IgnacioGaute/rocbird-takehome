import { NextRequest } from "next/server";
import { GET as getInteraccion, PUT, DELETE } from "../../api/interactions/[id]/route";
import { POST, GET as listInteracciones } from "../../api/interactions/route";
import { prisma } from "@/lib/prisma";


jest.mock("@/lib/prisma", () => {
  return {
    prisma: {
      interaccion: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      talento: {
        findUnique: jest.fn(),
      },
    },
  };
});

beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  

const mockAuthHeader = { authorization: "Bearer token123" };



describe("API Interacciones", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/interacciones/[id]", () => {
    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/interacciones/1");
      const res = await getInteraccion(req, { params: { id: "1" } }
      );
      expect(res.status).toBe(401);
    });

    it("retorna 404 si la interacción no existe", async () => {
      (prisma.interaccion.findUnique as jest.Mock).mockResolvedValue(null);

      const req = new NextRequest("http://localhost/api/interacciones/1", {
        headers: mockAuthHeader,
      });

      const res = await getInteraccion(req, { params: { id: "1" } }
      );
      expect(res.status).toBe(404);
    });

    it("retorna 200 con la interacción", async () => {
      (prisma.interaccion.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        tipo_de_interaccion: "Llamada",
        talento: { id: 1, nombre_y_apellido: "Juan Pérez" },
      });

      const req = new NextRequest("http://localhost/api/interacciones/1", {
        headers: mockAuthHeader,
      });

      const res = await getInteraccion(req, { params: { id: "1" } }
      );
      expect(res.status).toBe(200);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.interaccion.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));

      const req = new NextRequest("http://localhost/api/interacciones/1", {
        headers: mockAuthHeader,
      });

      const res = await getInteraccion(req, { params: { id: "1" } }
      );
      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/interacciones", () => {
    it("crea una interacción correctamente", async () => {
      (prisma.talento.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.interaccion.create as jest.Mock).mockResolvedValue({
        id: 1,
        tipo_de_interaccion: "Llamada",
      });

      const req = new NextRequest("http://localhost/api/interacciones", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({
          talentoId: 1,
          tipo_de_interaccion: "Llamada",
          fecha: "2025-08-24",
          detalle: "Detalles de la llamada",
          estado: "ACTIVO",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/interacciones", { method: "POST" });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("retorna 404 si el talento no existe", async () => {
      (prisma.talento.findUnique as jest.Mock).mockResolvedValue(null);

      const req = new NextRequest("http://localhost/api/interacciones", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({ talentoId: 999 }),
      });

      const res = await POST(req);
      expect(res.status).toBe(404);
    });

    it("retorna 500 si Prisma lanza error", async () => {
        (prisma.talento.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
        (prisma.interaccion.create as jest.Mock).mockRejectedValue(new Error("DB fail"));
        
        const req = new NextRequest("http://localhost/api/interacciones", {
          method: "POST",
          headers: mockAuthHeader,
          body: JSON.stringify({ talentoId: 1 }),
        });
        
        const res = await POST(req);
        expect(res.status).toBe(500);        
      });

      it("retorna 404 si el talentoId proporcionado no existe", async () => {
        (prisma.talento.findUnique as jest.Mock).mockResolvedValue(null);
        
        const req = new NextRequest("http://localhost/api/interacciones", {
          method: "POST",
          headers: mockAuthHeader,
          body: JSON.stringify({ talentoId: "123", descripcion: "Test" }),
        });
      
        const res = await POST(req);
        expect(res.status).toBe(404);
        const json = await res.json();
        expect(json.error).toBe("El talento con id 123 no existe");
      });
      it("permite crear interacción sin talentoId", async () => {
        (prisma.interaccion.create as jest.Mock).mockResolvedValue({
          id: 2,
          tipo_de_interaccion: "Llamada",
        });
      
        const req = new NextRequest("http://localhost/api/interacciones", {
          method: "POST",
          headers: mockAuthHeader,
          body: JSON.stringify({ tipo_de_interaccion: "Llamada", fecha: "2025-08-24", detalle: "Sin talentoId", estado: "ACTIVO" }),
        });
      
        const res = await POST(req);
        expect(res.status).toBe(201);
      });
      
      
  });

  describe("PUT /api/interacciones/[id]", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/interacciones/1", { method: "PUT" });
      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(401);
    });
  
    it("retorna 404 si talento no existe", async () => {
      (prisma.talento.findUnique as jest.Mock).mockResolvedValue(null);
  
      const req = new NextRequest("http://localhost/api/interacciones/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ talentoId: 999 }),
      });
  
      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(404);
    });
  
    it("retorna 500 si Prisma lanza error y cubre console.error", async () => {
      (prisma.talento.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.interaccion.update as jest.Mock).mockRejectedValue(new Error("DB fail"));
  
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  
      const req = new NextRequest("http://localhost/api/interacciones/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({
          talentoId: 1,
          tipo_de_interaccion: "Llamada",
          fecha: "2025-08-24",
          detalle: "Detalle",
          estado: "ACTIVO",
        }),
      });
  
      const res = await PUT(req, { params: { id: "1" } });
  
      expect(res.status).toBe(500);
      expect(consoleSpy).toHaveBeenCalled();
      const calledWith = consoleSpy.mock.calls[0];
      expect(calledWith[0]).toContain("Error al actualizar interacción:");
      expect(calledWith[1]).toBeInstanceOf(Error);
      expect(calledWith[1].message).toBe("DB fail");
  
      consoleSpy.mockRestore();
    });
  
    it("actualiza una interacción correctamente", async () => {
      const mockInteraccion = { id: "1", descripcion: "Actualizada" };
      (prisma.interaccion.update as jest.Mock).mockResolvedValue(mockInteraccion);
  
      const req = new NextRequest("http://localhost/api/interacciones/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ descripcion: "Actualizada" }),
      });
  
      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual(mockInteraccion);
    });
  
    it("cubre el catch y console.error en PUT", async () => {
      (prisma.talento.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.interaccion.update as jest.Mock).mockRejectedValue(new Error("DB fail"));
  
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  
      const req = new NextRequest("http://localhost/api/interacciones/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({
          talentoId: 1,
          tipo_de_interaccion: "Llamada",
          fecha: "2025-08-24",
          detalle: "Detalle",
          estado: "ACTIVO",
        }),
      });
  
      const res = await PUT(req, { params: { id: "1" } });
  
      expect(res.status).toBe(500);
      expect(consoleSpy).toHaveBeenCalled();
      const calledWith = consoleSpy.mock.calls[0];
      expect(calledWith[0]).toContain("Error al actualizar interacción:");
      expect(calledWith[1]).toBeInstanceOf(Error);
      expect(calledWith[1].message).toBe("DB fail");
  
      consoleSpy.mockRestore();
    });
  });
  
  

  describe("DELETE /api/interacciones/[id]", () => {
    it("elimina una interacción", async () => {
      (prisma.interaccion.delete as jest.Mock).mockResolvedValue({});

      const req = new NextRequest("http://localhost/api/interacciones/1", {
        method: "DELETE",
        headers: mockAuthHeader,
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(200);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/interacciones/1", { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(401);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.interaccion.delete as jest.Mock).mockRejectedValue(new Error("DB fail"));

      const req = new NextRequest("http://localhost/api/interacciones/1", {
        method: "DELETE",
        headers: mockAuthHeader,
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: "1" }) });
      expect(res.status).toBe(500);
    });
  });

  describe("GET /api/interacciones", () => {
    it("lista interacciones", async () => {
      (prisma.interaccion.findMany as jest.Mock).mockResolvedValue([
        { id: 1, tipo_de_interaccion: "Llamada", talento: { id: 1, nombre_y_apellido: "Juan" } },
      ]);

      const req = new NextRequest("http://localhost/api/interacciones", {
        headers: mockAuthHeader,
      });

      const res = await listInteracciones(req);
      expect(res.status).toBe(200);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/interacciones");
      const res = await listInteracciones(req);
      expect(res.status).toBe(401);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.interaccion.findMany as jest.Mock).mockRejectedValue(new Error("DB fail"));

      const req = new NextRequest("http://localhost/api/interacciones", {
        headers: mockAuthHeader,
      });

      const res = await listInteracciones(req);
      expect(res.status).toBe(500);
    });
  });
});
import { Logger } from "@/lib/logger";

describe("Logger", () => {
  const logger = new Logger("TestContext");

  it("debe ejecutar log, error, warn, debug y verbose", () => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.debug = jest.fn();
    console.info = jest.fn();

    logger.log("mensaje log", 1);
    logger.error("mensaje error", "trace");
    logger.warn("mensaje warn");
    logger.debug("mensaje debug");
    logger.verbose("mensaje verbose", { a: 1 });

    expect(console.log).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
    expect(console.debug).toHaveBeenCalled();
    expect(console.info).toHaveBeenCalled();
  });
});

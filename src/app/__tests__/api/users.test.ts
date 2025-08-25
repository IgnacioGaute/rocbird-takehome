import { NextRequest } from "next/server";
import { GET as getUser, PUT, DELETE } from "../../api/users/[id]/route";
import { POST, GET as listUsers } from "../../api/users/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockAuthHeader = { authorization: "Bearer token123" };

describe("API Users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/users/[id]", () => {
    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/users/1");
      const res = await getUser(req, { params: { id: "1" } });
      expect(res.status).toBe(401);
    });

    it("retorna 404 si el usuario no existe", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost/api/users/1", { headers: mockAuthHeader });
      const res = await getUser(req, { params: { id: "1" } });
      expect(res.status).toBe(404);
    });

    it("retorna 200 con el usuario", async () => {
      const mockUser = { id: "1", email: "a@b.com" };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const req = new NextRequest("http://localhost/api/users/1", { headers: mockAuthHeader });
      const res = await getUser(req, { params: { id: "1" } });
      expect(res.status).toBe(200);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));
      const req = new NextRequest("http://localhost/api/users/1", { headers: mockAuthHeader });
      const res = await getUser(req, { params: { id: "1" } });
      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/users", () => {
    it("crea un usuario correctamente", async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: "1", email: "a@b.com" });
      jest.spyOn(bcrypt, "hash").mockImplementation(async () => "hashedPassword");

      const req = new NextRequest("http://localhost/api/users", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({ email: "a@b.com", password: "123456", firstName: "John", lastName: "Doe" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/users", { method: "POST" });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("retorna 400 si body inválido", async () => {
      const req = new NextRequest("http://localhost/api/users", { method: "POST", headers: mockAuthHeader, body: null as any });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue(new Error("DB fail"));
      const req = new NextRequest("http://localhost/api/users", {
        method: "POST",
        headers: mockAuthHeader,
        body: JSON.stringify({ email: "a@b.com", password: "123456" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(500);
    });

    it("retorna 400 si faltan campos obligatorios", async () => {
        const req = new NextRequest("http://localhost/api/users", {
          method: "POST",
          headers: mockAuthHeader,
          body: JSON.stringify({ email: "a@b.com" }),
        });
      
        const res = await POST(req);
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe("Campos obligatorios faltantes");
      });
      
  });

  describe("PUT /api/users/[id]", () => {
    it("actualiza usuario con password y hash", async () => {
      (prisma.user.update as jest.Mock).mockResolvedValue({ id: "1", email: "x@b.com" });
      jest.spyOn(bcrypt, "hash").mockImplementation(async () => "hashedPassword");

      const req = new NextRequest("http://localhost/api/users/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ email: "x@b.com", password: "123456" }),
      });

      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(200);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/users/1", { method: "PUT" });
      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(401);
    });

    it("retorna 400 si body inválido", async () => {
      const req = new NextRequest("http://localhost/api/users/1", { method: "PUT", headers: mockAuthHeader, body: null as any });
      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(400);
    });

    it("retorna 404 si usuario no existe (Prisma P2025)", async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue({ code: "P2025" });
      const req = new NextRequest("http://localhost/api/users/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ email: "x@b.com" }),
      });
      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(404);
    });

    it("retorna 500 si Prisma lanza otro error", async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue(new Error("DB fail"));
      const req = new NextRequest("http://localhost/api/users/1", {
        method: "PUT",
        headers: mockAuthHeader,
        body: JSON.stringify({ email: "x@b.com" }),
      });
      const res = await PUT(req, { params: { id: "1" } });
      expect(res.status).toBe(500);
    });
  });

  describe("DELETE /api/users/[id]", () => {
    it("elimina usuario correctamente", async () => {
      (prisma.user.delete as jest.Mock).mockResolvedValue({});
      const req = new NextRequest("http://localhost/api/users/1", { method: "DELETE", headers: mockAuthHeader });
      const res = await DELETE(req, { params: { id: "1" } });
      expect(res.status).toBe(200);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/users/1", { method: "DELETE" });
      const res = await DELETE(req, { params: { id: "1" } });
      expect(res.status).toBe(401);
    });

    it("retorna 404 si usuario no existe (Prisma P2025)", async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue({ code: "P2025" });
      const req = new NextRequest("http://localhost/api/users/1", { method: "DELETE", headers: mockAuthHeader });
      const res = await DELETE(req, { params: { id: "1" } });
      expect(res.status).toBe(404);
    });

    it("retorna 500 si Prisma lanza otro error", async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue(new Error("DB fail"));
      const req = new NextRequest("http://localhost/api/users/1", { method: "DELETE", headers: mockAuthHeader });
      const res = await DELETE(req, { params: { id: "1" } });
      expect(res.status).toBe(500);
    });
  });

  describe("GET /api/users", () => {
    it("lista usuarios", async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: "1", email: "a@b.com" }]);
      const req = new NextRequest("http://localhost/api/users", { headers: mockAuthHeader });
      const res = await listUsers(req);
      expect(res.status).toBe(200);
    });

    it("retorna 401 si no hay auth", async () => {
      const req = new NextRequest("http://localhost/api/users");
      const res = await listUsers(req);
      expect(res.status).toBe(401);
    });

    it("retorna 500 si Prisma lanza error", async () => {
      (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error("DB fail"));
      const req = new NextRequest("http://localhost/api/users", { headers: mockAuthHeader });
      const res = await listUsers(req);
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

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function login(email: string, password: string) {
  try {
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);


    if (!passwordsMatch) {
      throw new Error("Invalid email or password");
    }

    const { password: _password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  } catch (error) {
    console.error('Error en función login:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    
    const body = await request.json();
    
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y password son requeridos" },
        { status: 400 }
      );
    }

    const user = await login(email, password);
    
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    
    if (error instanceof Error && error.message === "Invalid credentials") {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message === "Invalid email or password") {
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
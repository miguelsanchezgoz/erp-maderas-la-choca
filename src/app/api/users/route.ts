import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error al consultar colaboradores" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, role, status = "ACTIVO" } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y correo son requeridos" }, { status: 400 });
    }

    // Verificar unicidad de correo
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: "Ya existe un colaborador con este correo" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: role || "VENTAS",
        status: status || "ACTIVO",
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error al registrar colaborador" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        _count: {
          select: {
            leads: true,
            quotes: true,
            workOrders: true,
          },
        },
      },
      orderBy: { businessName: "asc" },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Error al consultar clientes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessName,
      commercialName,
      rfc,
      phone,
      whatsapp,
      email,
      contactPerson,
      deliveryAddress,
      freightZone,
      notes,
    } = body;

    if (!businessName) {
      return NextResponse.json({ error: "La Razón Social es requerida" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        businessName,
        commercialName,
        rfc,
        phone,
        whatsapp: whatsapp ? whatsapp.replace(/\D/g, "") : null,
        email,
        contactPerson,
        deliveryAddress,
        freightZone: freightZone || "LOCAL_VILLAHERMOSA",
        notes,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "Error al registrar cliente" }, { status: 500 });
  }
}

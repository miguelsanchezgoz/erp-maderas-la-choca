import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Error al consultar prospectos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      customerId,
      contactName,
      phone,
      email,
      estimatedValue,
      stage,
      priority,
      notes,
      expectedCloseDate,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        title,
        customerId: customerId || null,
        contactName,
        phone,
        email,
        estimatedValue: parseFloat(estimatedValue) || 0,
        stage: stage || "NUEVO",
        priority: priority || "MEDIA",
        notes,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Error al crear prospecto" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stage, priority, notes, estimatedValue } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de prospecto requerido" }, { status: 400 });
    }

    const updateData: any = {};
    if (stage) updateData.stage = stage;
    if (priority) updateData.priority = priority;
    if (notes !== undefined) updateData.notes = notes;
    if (estimatedValue !== undefined) updateData.estimatedValue = parseFloat(estimatedValue) || 0;

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: { customer: true },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ error: "Error al actualizar prospecto" }, { status: 500 });
  }
}

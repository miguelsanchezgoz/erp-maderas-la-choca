import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        customer: true,
        quote: true,
        materials: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(workOrders);
  } catch (error) {
    console.error("Error fetching work orders:", error);
    return NextResponse.json({ error: "Error al consultar órdenes de trabajo" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      customerName,
      quoteId,
      serviceType,
      subcategory,
      title,
      description,
      priority = "MEDIA",
      requiresNom144 = false,
      nom144BatchCode,
      semarnatStampRegistry,
      estimatedHours = 0,
      estimatedBoardFeet = 0,
      estimatedCost = 0,
      finalPrice = 0,
      targetDeliveryDate,
      assignedTo,
      notes,
      materials = [],
    } = body;

    if (!title || !customerName || !serviceType) {
      return NextResponse.json({ error: "Título, cliente y tipo de servicio requeridos" }, { status: 400 });
    }

    const count = await prisma.workOrder.count();
    const currentYear = new Date().getFullYear();
    const orderNumber = `OT-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const workOrder = await prisma.workOrder.create({
      data: {
        orderNumber,
        customerId: customerId || null,
        customerName,
        quoteId: quoteId || null,
        serviceType,
        subcategory: subcategory || "OTRO",
        status: "PENDIENTE",
        priority,
        title,
        description,
        requiresNom144: Boolean(requiresNom144),
        nom144BatchCode: requiresNom144 ? (nom144BatchCode || `HT-${currentYear}-${String(count + 1).padStart(3, "0")}`) : null,
        semarnatStampRegistry: requiresNom144 ? (semarnatStampRegistry || process.env.NEXT_PUBLIC_SEMARNAT_REGISTRY || "MX-04-1234-SEMARNAT-HT") : null,
        estimatedHours: Number(estimatedHours) || 0,
        estimatedBoardFeet: Number(estimatedBoardFeet) || 0,
        estimatedCost: Number(estimatedCost) || 0,
        finalPrice: Number(finalPrice) || 0,
        targetDeliveryDate: targetDeliveryDate ? new Date(targetDeliveryDate) : null,
        assignedTo,
        notes,
        materials: {
          create: materials.map((m: any) => ({
            materialName: m.materialName,
            category: m.category || "MADERA",
            quantity: Number(m.quantity) || 1,
            unit: m.unit || "PT",
            unitCost: Number(m.unitCost) || 0,
            subtotal: Number(m.subtotal) || (Number(m.quantity) * Number(m.unitCost)),
          })),
        },
      },
      include: {
        customer: true,
        materials: true,
      },
    });

    return NextResponse.json(workOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating work order:", error);
    return NextResponse.json({ error: "Error al crear orden de trabajo" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, actualHours, notes, assignedTo } = body;

    if (!id) {
      return NextResponse.json({ error: "ID de orden de trabajo requerido" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === "LISTO_ENTREGA" || status === "ENTREGADO") {
        updateData.completionDate = new Date();
      }
    }
    if (actualHours !== undefined) updateData.actualHours = Number(actualHours);
    if (notes !== undefined) updateData.notes = notes;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: updateData,
      include: { customer: true, materials: true },
    });

    return NextResponse.json(workOrder);
  } catch (error) {
    console.error("Error updating work order:", error);
    return NextResponse.json({ error: "Error al actualizar orden de trabajo" }, { status: 500 });
  }
}

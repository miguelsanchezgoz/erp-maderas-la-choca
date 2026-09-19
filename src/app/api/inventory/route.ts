import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: {
        woodSpecies: true,
        movements: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json({ error: "Error al consultar inventario" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      inventoryItemId,
      type, // ENTRADA_COMPRA, ENTRADA_RECEPCION_TROZA, SALIDA_VENTA, SALIDA_TALLER, MERMA_ASERRADERO, AJUSTE_INVENTARIO
      quantity,
      referenceNumber,
      notes,
      recordedBy = "Usuario Sistema",
    } = body;

    if (!inventoryItemId || !type || quantity === undefined) {
      return NextResponse.json({ error: "Artículo, tipo y cantidad son requeridos" }, { status: 400 });
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 });
    }

    const qty = Math.abs(Number(quantity));
    let newStock = item.currentStock;

    if (type.startsWith("ENTRADA")) {
      newStock += qty;
    } else if (type.startsWith("SALIDA") || type === "MERMA_ASERRADERO") {
      newStock = Math.max(0, newStock - qty);
    } else if (type === "AJUSTE_INVENTARIO") {
      newStock = Number(quantity);
    }

    // Registrar movimiento y actualizar stock
    const [movement, updatedItem] = await prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          inventoryItemId,
          type,
          quantity: qty,
          previousStock: item.currentStock,
          newStock,
          referenceNumber,
          notes,
          recordedBy,
        },
      }),
      prisma.inventoryItem.update({
        where: { id: inventoryItemId },
        data: { currentStock: newStock },
        include: { woodSpecies: true, movements: { take: 5, orderBy: { createdAt: "desc" } } },
      }),
    ]);

    return NextResponse.json({ movement, item: updatedItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating stock movement:", error);
    return NextResponse.json({ error: "Error al registrar movimiento de inventario" }, { status: 500 });
  }
}

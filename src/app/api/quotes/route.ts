import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json({ error: "Error al consultar cotizaciones" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      customerName,
      rfc,
      deliveryAddress,
      freightZone,
      items,
      freightCost = 0,
      discount = 0,
      notes,
      validityDays = 15,
      deliveryTimeDays = 5,
      paymentTerms = "50% Anticipo, 50% Contra entrega",
    } = body;

    if (!customerName) {
      return NextResponse.json({ error: "Nombre o razón social requerida" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Debe agregar al menos una partida de madera" }, { status: 400 });
    }

    // Generar consecutivo de folio
    const count = await prisma.quote.count();
    const currentYear = new Date().getFullYear();
    const quoteNumber = `COT-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    // Calcular subtotales
    let subtotalWood = 0;
    let valueAddedTotal = 0;

    const formattedItems = items.map((item: any) => {
      subtotalWood += Number(item.woodSubtotal) || 0;
      const services =
        (Number(item.cuttingCost) || 0) +
        (Number(item.planingCost) || 0) +
        (Number(item.dryingCost) || 0);
      valueAddedTotal += services;

      return {
        woodSpeciesId: item.woodSpeciesId || null,
        speciesName: item.speciesName,
        thicknessInches: Number(item.thicknessInches),
        widthInches: Number(item.widthInches),
        lengthValue: Number(item.lengthValue),
        lengthUnit: item.lengthUnit || "PIES",
        pieces: Number(item.pieces) || 1,
        boardFeetTotal: Number(item.boardFeetTotal),
        cubicMetersTotal: Number(item.cubicMetersTotal),
        unitPricePerPt: Number(item.unitPricePerPt),
        woodSubtotal: Number(item.woodSubtotal),
        cuttingService: Boolean(item.cuttingService),
        cuttingCost: Number(item.cuttingCost) || 0,
        planingService: item.planingService || "NINGUNO",
        planingCost: Number(item.planingCost) || 0,
        dryingService: Boolean(item.dryingService),
        dryingCost: Number(item.dryingCost) || 0,
        itemTotal: Number(item.itemTotal),
      };
    });

    const subtotal = Math.max(0, subtotalWood + valueAddedTotal + Number(freightCost) - Number(discount));
    const iva = Math.round(subtotal * 0.16 * 100) / 100;
    const total = Math.round((subtotal + iva) * 100) / 100;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        customerId: customerId || null,
        customerName,
        rfc,
        deliveryAddress,
        freightZone: freightZone || "LOCAL_VILLAHERMOSA",
        subtotalWood,
        valueAddedTotal,
        freightCost: Number(freightCost) || 0,
        discount: Number(discount) || 0,
        subtotal,
        iva,
        total,
        status: "ENVIADA",
        notes,
        validityDays: Number(validityDays) || 15,
        deliveryTimeDays: Number(deliveryTimeDays) || 5,
        paymentTerms,
        items: {
          create: formattedItems,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json({ error: "Error al generar cotización" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalQuotes,
      quotes,
      leads,
      workOrders,
      inventoryItems,
      species,
    ] = await Promise.all([
      prisma.quote.count(),
      prisma.quote.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.lead.findMany({
        include: { customer: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.workOrder.findMany({
        include: { customer: true, materials: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.inventoryItem.findMany({
        include: { woodSpecies: true },
      }),
      prisma.woodSpecies.findMany(),
    ]);

    // Métricas de CRM & Ventas
    const pipelineValue = leads.reduce((acc, lead) => acc + (lead.estimatedValue || 0), 0);
    const wonLeads = leads.filter((l) => l.stage === "GANADO");
    const wonValue = wonLeads.reduce((acc, lead) => acc + (lead.estimatedValue || 0), 0);
    const totalQuotesValue = quotes.reduce((acc, q) => acc + (q.total || 0), 0);

    const conversionRate = leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0;

    // Métricas de Taller
    const activeWorkOrders = workOrders.filter((wo) => wo.status !== "ENTREGADO");
    const nom144Orders = workOrders.filter((wo) => wo.requiresNom144);

    // Especies con mayor demanda calculada
    const speciesDemandMap: Record<string, { name: string; totalPt: number; count: number }> = {};
    for (const s of species) {
      speciesDemandMap[s.commonName] = { name: s.commonName, totalPt: 0, count: 0 };
    }

    quotes.forEach((q) => {
      q.items.forEach((item) => {
        if (speciesDemandMap[item.speciesName]) {
          speciesDemandMap[item.speciesName].totalPt += item.boardFeetTotal || 0;
          speciesDemandMap[item.speciesName].count += 1;
        }
      });
    });

    const topSpecies = Object.values(speciesDemandMap)
      .sort((a, b) => b.totalPt - a.totalPt)
      .slice(0, 5);

    // Métricas de Inventario
    const lowStockCount = inventoryItems.filter((i) => i.currentStock <= i.minimumStock).length;
    const totalInventoryPt = inventoryItems
      .filter((i) => i.unit === "PT")
      .reduce((acc, i) => acc + i.currentStock, 0);

    return NextResponse.json({
      pipelineValue,
      wonValue,
      totalQuotesValue,
      conversionRate,
      totalLeadsCount: leads.length,
      activeWorkOrdersCount: activeWorkOrders.length,
      nom144OrdersCount: nom144Orders.length,
      lowStockCount,
      totalInventoryPt,
      topSpecies,
      recentQuotes: quotes.slice(0, 5),
      recentWorkOrders: workOrders.slice(0, 5),
      recentLeads: leads.slice(0, 5),
    });
  } catch (error) {
    console.error("Error generating dashboard stats:", error);
    return NextResponse.json({ error: "Error al generar estadísticas" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const species = await prisma.woodSpecies.findMany({
      orderBy: { commonName: "asc" },
    });
    return NextResponse.json(species);
  } catch (error) {
    console.error("Error fetching species:", error);
    return NextResponse.json({ error: "Error al consultar especies" }, { status: 500 });
  }
}

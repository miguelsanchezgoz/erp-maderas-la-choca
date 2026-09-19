/**
 * Motor de Cálculo Maderero y Cubicaje - Maderas La Choca ERP/CRM
 * 
 * Fórmulas oficiales de la industria forestal y maderera en México:
 * - 1 Pie Tabla (PT) = 1 pulgada (grosor) × 12 pulgadas (ancho) × 1 pie (largo) = 144 pulg³
 * - Si el largo se expresa en pies (ft): PT = (Grosor" × Ancho" × Largo') / 12 * Piezas
 * - Si el largo se expresa en metros (m): PT = (Grosor" × Ancho" × Largo(m) × 3.28084) / 12 * Piezas
 * - Conversión a Metros Cúbicos (m³): 1 PT ≈ 0.002359737 m³ (o 1 m³ ≈ 423.776 PT)
 */

export interface LumberCalcInput {
  thicknessInches: number; // Grosor en pulgadas (ej. 1, 1.5, 2, 3, 4)
  widthInches: number;     // Ancho en pulgadas (ej. 4, 6, 8, 10, 12)
  lengthValue: number;     // Largo numérico
  lengthUnit: "PIES" | "METROS"; // Unidad de longitud
  pieces: number;          // Cantidad de piezas
  unitPricePerPt: number;  // Precio unitario por Pie Tabla (MXN)
  cuttingService?: boolean;
  cuttingRatePerPt?: number;
  planingService?: "NINGUNO" | "DOS_CARAS" | "CUATRO_CARAS";
  planingRate2Caras?: number;
  planingRate4Caras?: number;
  dryingService?: boolean;
  dryingRatePerPt?: number;
}

export interface LumberCalcResult {
  lengthInFeet: number;
  lengthInMeters: number;
  boardFeetPerPiece: number;
  boardFeetTotal: number;
  cubicMetersPerPiece: number;
  cubicMetersTotal: number;
  woodSubtotal: number;
  cuttingCost: number;
  planingCost: number;
  dryingCost: number;
  valueAddedTotal: number;
  itemTotal: number;
}

export const CUBIC_METERS_PER_BOARD_FOOT = 0.0023597372;
export const METERS_TO_FEET = 3.280839895;
export const FEET_TO_METERS = 0.3048;

export function calculateLumber(input: LumberCalcInput): LumberCalcResult {
  const {
    thicknessInches = 1,
    widthInches = 1,
    lengthValue = 1,
    lengthUnit = "PIES",
    pieces = 1,
    unitPricePerPt = 0,
    cuttingService = false,
    cuttingRatePerPt = 3.0, // $3.00 MXN por PT de corte a medida
    planingService = "NINGUNO",
    planingRate2Caras = 4.0, // $4.00 MXN por PT
    planingRate4Caras = 7.5, // $7.50 MXN por PT
    dryingService = false,
    dryingRatePerPt = 6.0,  // $6.00 MXN por PT
  } = input;

  const validThickness = Math.max(0.1, Number(thicknessInches) || 0);
  const validWidth = Math.max(0.1, Number(widthInches) || 0);
  const validLength = Math.max(0.1, Number(lengthValue) || 0);
  const validPieces = Math.max(1, Math.floor(Number(pieces) || 1));
  const validPrice = Math.max(0, Number(unitPricePerPt) || 0);

  let lengthInFeet: number;
  let lengthInMeters: number;

  if (lengthUnit === "METROS") {
    lengthInMeters = validLength;
    lengthInFeet = validLength * METERS_TO_FEET;
  } else {
    lengthInFeet = validLength;
    lengthInMeters = validLength * FEET_TO_METERS;
  }

  // PT por pieza: (Grosor" * Ancho" * Largo') / 12
  const rawBoardFeetPerPiece = (validThickness * validWidth * lengthInFeet) / 12;
  const boardFeetPerPiece = Math.round(rawBoardFeetPerPiece * 100) / 100;
  const boardFeetTotal = Math.round(boardFeetPerPiece * validPieces * 100) / 100;

  // Volumen en Metros Cúbicos
  const cubicMetersPerPiece = Math.round(boardFeetPerPiece * CUBIC_METERS_PER_BOARD_FOOT * 10000) / 10000;
  const cubicMetersTotal = Math.round(boardFeetTotal * CUBIC_METERS_PER_BOARD_FOOT * 10000) / 10000;

  // Costo base de la madera
  const woodSubtotal = Math.round(boardFeetTotal * validPrice * 100) / 100;

  // Servicios de valor agregado
  const cuttingCost = cuttingService ? Math.round(boardFeetTotal * cuttingRatePerPt * 100) / 100 : 0;
  
  let planingCost = 0;
  if (planingService === "DOS_CARAS") {
    planingCost = Math.round(boardFeetTotal * planingRate2Caras * 100) / 100;
  } else if (planingService === "CUATRO_CARAS") {
    planingCost = Math.round(boardFeetTotal * planingRate4Caras * 100) / 100;
  }

  const dryingCost = dryingService ? Math.round(boardFeetTotal * dryingRatePerPt * 100) / 100 : 0;

  const valueAddedTotal = cuttingCost + planingCost + dryingCost;
  const itemTotal = Math.round((woodSubtotal + valueAddedTotal) * 100) / 100;

  return {
    lengthInFeet: Math.round(lengthInFeet * 100) / 100,
    lengthInMeters: Math.round(lengthInMeters * 100) / 100,
    boardFeetPerPiece,
    boardFeetTotal,
    cubicMetersPerPiece,
    cubicMetersTotal,
    woodSubtotal,
    cuttingCost,
    planingCost,
    dryingCost,
    valueAddedTotal,
    itemTotal,
  };
}

/**
 * Cálculo estimado de flete logístico en Tabasco y sureste
 */
export function estimateFreightCost(zone: string, totalWeightKgEstimated: number): number {
  switch (zone) {
    case "LOCAL_VILLAHERMOSA":
      return totalWeightKgEstimated > 3000 ? 2500 : 1200;
    case "MUNICIPIO_TABASCO": // Cárdenas, Comalcalco, Paraíso / Dos Bocas, Macuspana, Teapa
      return totalWeightKgEstimated > 3000 ? 4500 : 2800;
    case "FORANEO": // Campeche, Chiapas, Veracruz
      return totalWeightKgEstimated > 3000 ? 9500 : 6500;
    default:
      return 1500;
  }
}

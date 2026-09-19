import { calculateLumber, estimateFreightCost } from "./lumber-calc";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("=== INICIANDO PRUEBAS UNITARIAS DEL MOTOR DE CUBICAJE MADERAS LA CHOCA ===");

// Caso 1: 1 pieza de 2" de grosor x 8" de ancho x 12' de largo (Tablón tradicional)
// PT esperado: (2 * 8 * 12) / 12 = 16 PT
const test1 = calculateLumber({
  thicknessInches: 2,
  widthInches: 8,
  lengthValue: 12,
  lengthUnit: "PIES",
  pieces: 1,
  unitPricePerPt: 80,
});
assert(test1.boardFeetTotal === 16, `Esperado 16 PT, obtenido ${test1.boardFeetTotal}`);
assert(test1.woodSubtotal === 16 * 80, `Subtotal madera esperado $1280, obtenido ${test1.woodSubtotal}`);
console.log("✓ Caso 1 superado: Tablón 2x8x12ft = 16 PT exactos ($1,280 MXN)");

// Caso 2: 25 piezas de 2" x 8" x 12' con corte y cepillado 4 caras
const test2 = calculateLumber({
  thicknessInches: 2,
  widthInches: 8,
  lengthValue: 12,
  lengthUnit: "PIES",
  pieces: 25,
  unitPricePerPt: 88,
  cuttingService: true,
  planingService: "CUATRO_CARAS",
  dryingService: true,
});
// 16 PT * 25 = 400 PT
assert(test2.boardFeetTotal === 400, `Esperado 400 PT, obtenido ${test2.boardFeetTotal}`);
// Volumen m3: 400 * 0.00235974 ≈ 0.9439 m3
assert(Math.abs(test2.cubicMetersTotal - 0.9439) < 0.01, `Volumen m3 incorrecto: ${test2.cubicMetersTotal}`);
// Servicios: corte (400 * 3 = 1200) + cepillado 4 caras (400 * 7.5 = 3000) + secado (400 * 6 = 2400) = 6600
assert(test2.valueAddedTotal === 1200 + 3000 + 2400, `Servicios incorrectos: ${test2.valueAddedTotal}`);
console.log("✓ Caso 2 superado: 25 pzas (400 PT) con corte, cepillado 4 caras y estufado");

// Caso 3: Medidas en metros (ej. 3.5 metros de largo)
const test3 = calculateLumber({
  thicknessInches: 3,
  widthInches: 6,
  lengthValue: 3.5,
  lengthUnit: "METROS",
  pieces: 10,
  unitPricePerPt: 92,
});
// 3.5m = 3.5 * 3.28084 ≈ 11.4829 ft
// (3 * 6 * 11.4829) / 12 = 17.224 PT por pieza * 10 = ~172.2 PT
assert(test3.boardFeetTotal > 170 && test3.boardFeetTotal < 175, `PT en metros fuera de rango: ${test3.boardFeetTotal}`);
console.log(`✓ Caso 3 superado: Conversión métrica 3.5m -> ${test3.boardFeetTotal} PT`);

// Caso 4: Estimación de flete en Tabasco
assert(estimateFreightCost("LOCAL_VILLAHERMOSA", 1000) === 1200, "Flete local incorrecto");
assert(estimateFreightCost("MUNICIPIO_TABASCO", 4000) === 4500, "Flete Dos Bocas/municipio pesado incorrecto");
assert(estimateFreightCost("FORANEO", 1000) === 6500, "Flete foráneo incorrecto");
console.log("✓ Caso 4 superado: Fletes de Tabasco y Sureste validados.");

console.log("\nTODOS LOS TESTS DE CUBICAJE Y CÁLCULO PASARON EXITOSAMENTE (4/4)");

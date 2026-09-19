"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calculator,
  Layers,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { calculateLumber, LumberCalcResult } from "@/lib/lumber-calc";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import Link from "next/link";

interface QuickLumberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_SPECIES = [
  { name: "Pino Tratado", price: 48 },
  { name: "Maculis", price: 88 },
  { name: "Parota", price: 92 },
  { name: "Teca", price: 95 },
  { name: "Amargoso", price: 85 },
  { name: "Caracolillo", price: 78 },
  { name: "Jahua", price: 45 },
  { name: "Macayo", price: 89 },
];

export function QuickLumberModal({ isOpen, onClose }: QuickLumberModalProps) {
  const [thickness, setThickness] = useState<number>(2);
  const [width, setWidth] = useState<number>(8);
  const [lengthVal, setLengthVal] = useState<number>(10);
  const [lengthUnit, setLengthUnit] = useState<"PIES" | "METROS">("PIES");
  const [pieces, setPieces] = useState<number>(10);
  const [unitPrice, setUnitPrice] = useState<number>(88);
  const [selectedSpecies, setSelectedSpecies] = useState<string>("Maculis");

  // Servicios
  const [cutting, setCutting] = useState<boolean>(false);
  const [planing, setPlaning] = useState<"NINGUNO" | "DOS_CARAS" | "CUATRO_CARAS">("NINGUNO");
  const [drying, setDrying] = useState<boolean>(false);

  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const result: LumberCalcResult = calculateLumber({
    thicknessInches: thickness,
    widthInches: width,
    lengthValue: lengthVal,
    lengthUnit: lengthUnit,
    pieces: pieces,
    unitPricePerPt: unitPrice,
    cuttingService: cutting,
    planingService: planing,
    dryingService: drying,
  });

  const handleSpeciesChange = (name: string, price: number) => {
    setSelectedSpecies(name);
    setUnitPrice(price);
  };

  const handleCopySummary = () => {
    const text = `CUBICAJE MADERAS LA CHOCA:
Especie: ${selectedSpecies}
Dimensiones: ${thickness}" × ${width}" × ${lengthVal} ${lengthUnit.toLowerCase()} (${pieces} piezas)
Volumen: ${formatNumber(result.boardFeetTotal)} PT (${formatNumber(result.cubicMetersTotal, 4)} m³)
Precio unitario base: $${unitPrice}/PT
Subtotal Madera: ${formatCurrency(result.woodSubtotal)}
Servicios (Corte/Cepillado/Estufado): ${formatCurrency(result.valueAddedTotal)}
TOTAL ESTIMADO: ${formatCurrency(result.itemTotal)} MXN`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-timber-800 via-timber-700 to-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Calculator className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Calculadora Técnica de Cubicaje Maderero
              </h3>
              <p className="text-xs text-amber-100/80">
                Fórmula oficial para aserraderos y patios de Tabasco (PT & m³)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Selector Rápido de Especie */}
          <div>
            <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 uppercase tracking-wider mb-2">
              Especie Tropical de Referencia
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMMON_SPECIES.map((sp) => (
                <button
                  key={sp.name}
                  onClick={() => handleSpeciesChange(sp.name, sp.price)}
                  type="button"
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    selectedSpecies === sp.name
                      ? "bg-timber-50 dark:bg-timber-950/40 border-timber-600 dark:border-amber-500 text-timber-900 dark:text-amber-300 shadow-xs"
                      : "border-industrial-200 dark:border-industrial-700 hover:bg-industrial-50 dark:hover:bg-industrial-800 text-industrial-600 dark:text-industrial-400"
                  }`}
                >
                  <span>{sp.name}</span>
                  <span className="font-mono text-[10px] opacity-75">${sp.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Entradas de Dimensiones */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-industrial-50 dark:bg-industrial-800/50 p-4 rounded-xl border border-industrial-200 dark:border-industrial-700">
            <div>
              <label className="block text-[11px] font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                Grosor (Pulgadas)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                value={thickness}
                onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 rounded-lg text-sm font-semibold text-industrial-900 dark:text-white focus:ring-2 focus:ring-timber-500 outline-hidden"
              />
              <span className="text-[10px] text-industrial-400">Ej: 1", 1.5", 2"</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                Ancho (Pulgadas)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 rounded-lg text-sm font-semibold text-industrial-900 dark:text-white focus:ring-2 focus:ring-timber-500 outline-hidden"
              />
              <span className="text-[10px] text-industrial-400">Ej: 4", 6", 8", 12"</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-industrial-600 dark:text-industrial-400">
                  Largo ({lengthUnit === "PIES" ? "Pies" : "Metros"})
                </label>
                <button
                  type="button"
                  onClick={() => setLengthUnit(lengthUnit === "PIES" ? "METROS" : "PIES")}
                  className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200"
                >
                  {lengthUnit === "PIES" ? "Cambiar a Metros" : "Cambiar a Pies"}
                </button>
              </div>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={lengthVal}
                onChange={(e) => setLengthVal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 rounded-lg text-sm font-semibold text-industrial-900 dark:text-white focus:ring-2 focus:ring-timber-500 outline-hidden"
              />
              <span className="text-[10px] text-industrial-400">
                ≈ {lengthUnit === "PIES" ? `${formatNumber(result.lengthInMeters)} m` : `${formatNumber(result.lengthInFeet)} ft`}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                Piezas (Cantidad)
              </label>
              <input
                type="number"
                min="1"
                value={pieces}
                onChange={(e) => setPieces(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 rounded-lg text-sm font-semibold text-industrial-900 dark:text-white focus:ring-2 focus:ring-timber-500 outline-hidden"
              />
              <span className="text-[10px] text-industrial-400">Total a procesar</span>
            </div>
          </div>

          {/* Servicios de Valor Agregado */}
          <div>
            <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 uppercase tracking-wider mb-2">
              Servicios de Transformación y Acabado
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-industrial-200 dark:border-industrial-700 cursor-pointer hover:bg-industrial-50 dark:hover:bg-industrial-800">
                <input
                  type="checkbox"
                  checked={cutting}
                  onChange={(e) => setCutting(e.target.checked)}
                  className="rounded text-timber-600 focus:ring-timber-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-semibold block text-industrial-900 dark:text-white">Corte a Medida</span>
                  <span className="text-[10px] text-industrial-500">+$3.00 MXN / PT</span>
                </div>
              </label>

              <div className="p-3 rounded-xl border border-industrial-200 dark:border-industrial-700">
                <span className="text-xs font-semibold block text-industrial-900 dark:text-white mb-1">
                  Cepillado de Caras
                </span>
                <select
                  value={planing}
                  onChange={(e) => setPlaning(e.target.value as any)}
                  className="w-full text-xs p-1 rounded bg-industrial-100 dark:bg-industrial-800 border-none text-industrial-900 dark:text-white"
                >
                  <option value="NINGUNO">Sin cepillar (En bruto)</option>
                  <option value="DOS_CARAS">2 Caras (+$4.00/PT)</option>
                  <option value="CUATRO_CARAS">4 Caras (+$7.50/PT)</option>
                </select>
              </div>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl border border-industrial-200 dark:border-industrial-700 cursor-pointer hover:bg-industrial-50 dark:hover:bg-industrial-800">
                <input
                  type="checkbox"
                  checked={drying}
                  onChange={(e) => setDrying(e.target.checked)}
                  className="rounded text-timber-600 focus:ring-timber-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-semibold block text-industrial-900 dark:text-white">Secado en Horno</span>
                  <span className="text-[10px] text-industrial-500">+$6.00 MXN / PT</span>
                </div>
              </label>
            </div>
          </div>

          {/* Tarjeta de Resultados en Vivo */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-forest-700/10 border-2 border-timber-400 dark:border-amber-600/50 rounded-2xl p-4">
            <div className="flex items-center justify-between border-b border-timber-200 dark:border-amber-800/40 pb-3 mb-3">
              <span className="text-xs font-extrabold uppercase text-timber-900 dark:text-amber-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Resultados de Cubicaje Calculados</span>
              </span>
              <span className="text-xs font-bold text-forest-700 dark:text-forest-400">
                {selectedSpecies} (${unitPrice}/PT)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
              <div className="bg-white/80 dark:bg-industrial-800/80 p-2.5 rounded-xl border border-industrial-200 dark:border-industrial-700">
                <span className="text-[10px] uppercase font-bold text-industrial-500 dark:text-industrial-400 block">
                  PT por Pieza
                </span>
                <span className="text-base font-black text-industrial-900 dark:text-white">
                  {formatNumber(result.boardFeetPerPiece)}
                </span>
              </div>

              <div className="bg-white/80 dark:bg-industrial-800/80 p-2.5 rounded-xl border border-timber-300 dark:border-amber-600/50">
                <span className="text-[10px] uppercase font-bold text-timber-700 dark:text-amber-400 block">
                  Total Pies Tabla (PT)
                </span>
                <span className="text-lg font-black text-timber-800 dark:text-amber-300">
                  {formatNumber(result.boardFeetTotal)}
                </span>
              </div>

              <div className="bg-white/80 dark:bg-industrial-800/80 p-2.5 rounded-xl border border-industrial-200 dark:border-industrial-700">
                <span className="text-[10px] uppercase font-bold text-industrial-500 dark:text-industrial-400 block">
                  Metros Cúbicos ($m^3$)
                </span>
                <span className="text-base font-black text-forest-700 dark:text-forest-400 font-mono">
                  {formatNumber(result.cubicMetersTotal, 4)}
                </span>
              </div>

              <div className="bg-white/80 dark:bg-industrial-800/80 p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-600/50">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                  Total Estimado
                </span>
                <span className="text-lg font-black text-emerald-800 dark:text-emerald-300 font-mono">
                  {formatCurrency(result.itemTotal)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-industrial-600 dark:text-industrial-300 flex justify-between px-2 pt-1 border-t border-timber-200/50 dark:border-industrial-700">
              <span>Madera en bruto: {formatCurrency(result.woodSubtotal)}</span>
              <span>Servicios adicionales: {formatCurrency(result.valueAddedTotal)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-industrial-50 dark:bg-industrial-950/60 border-t border-industrial-200 dark:border-industrial-800 flex items-center justify-between">
          <button
            onClick={handleCopySummary}
            type="button"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-industrial-300 dark:border-industrial-700 bg-white dark:bg-industrial-800 text-xs font-semibold text-industrial-700 dark:text-industrial-200 hover:bg-industrial-100 transition-all shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "¡Copiado al portapapeles!" : "Copiar Resumen"}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-industrial-600 dark:text-industrial-400 hover:bg-industrial-200/60 dark:hover:bg-industrial-800 transition-colors"
            >
              Cerrar
            </button>
            <Link
              href="/cotizaciones"
              onClick={onClose}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-timber-700 hover:bg-timber-800 text-white text-xs font-bold shadow-md shadow-timber-900/20 transition-all"
            >
              <span>Ir a Cotizador Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

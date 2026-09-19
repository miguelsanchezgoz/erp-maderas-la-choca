"use client";

import React from "react";
import { Calculator, Sparkles, FileSpreadsheet, ArrowRight } from "lucide-react";
import Link from "next/link";
import { QuickLumberModal } from "@/components/calculator/QuickLumberModal";

export default function CubicajePage() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>Cálculo Técnico Maderero</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Cubicaje & Pies Tabla (PT)
          </h1>
          <p className="text-xs md:text-sm text-industrial-500 dark:text-industrial-400 mt-1">
            Cálculo volumétrico oficial: Fórmula comercial (Grosor" × Ancho" × Largo' / 12) y conversión a m³.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold self-start md:self-auto">
          Roles: DUENO, ENCARGADO_PISO, OPERATIVO
        </span>
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-r from-timber-900 via-amber-950 to-forest-950 border border-timber-800/60 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Herramienta Interactiva</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Calculadora Especializada de Madera Aserrada & Trozas
          </h2>
          <p className="text-xs text-amber-100/80 max-w-xl mt-1">
            Calcula instantáneamente pies tabla (PT), metros cúbicos (m³) y peso estimado de las 15 especies de maderas tropicales de Tabasco con precios actualizados.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          type="button"
          className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-timber-950 font-bold text-sm shadow-xl transition-all shrink-0 cursor-pointer"
        >
          <Calculator className="w-5 h-5" />
          <span>Abrir Calculadora</span>
        </button>
      </div>

      <QuickLumberModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

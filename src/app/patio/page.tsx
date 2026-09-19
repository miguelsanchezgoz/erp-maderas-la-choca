"use client";

import React from "react";
import { Package, Truck, Layers, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PatioPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Operaciones de Patio de Trozas</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Patio de Recepción & Trozas
          </h1>
          <p className="text-xs md:text-sm text-industrial-500 dark:text-industrial-400 mt-1">
            Supervisión física de patios de acopio, recepción de trozas y clasificación por especie.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold self-start md:self-auto">
          Roles: DUENO, ENCARGADO_PISO, OPERATIVO
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-industrial-500">Patio 1: Maderas Duras</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Activo</span>
          </div>
          <p className="text-sm font-bold text-industrial-900 dark:text-white mt-2">Maculis, Jahua, Amargoso</p>
          <span className="text-xs text-industrial-400 block mt-1">Capacidad: 85% ocupada</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-industrial-500">Patio 2: Maderas Preciosas</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Activo</span>
          </div>
          <p className="text-sm font-bold text-industrial-900 dark:text-white mt-2">Teca & Parota</p>
          <span className="text-xs text-industrial-400 block mt-1">Capacidad: 60% ocupada</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-industrial-500">Nave C: Pino & Trozas Ligeras</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Activo</span>
          </div>
          <p className="text-sm font-bold text-industrial-900 dark:text-white mt-2">Pino Tratado & Mango</p>
          <span className="text-xs text-industrial-400 block mt-1">Capacidad: 40% ocupada</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-industrial-900 dark:text-white">Ver Inventario General de Maderas</h3>
          <p className="text-xs text-industrial-500 dark:text-industrial-400">Consulta los SKU, piezas y pies tabla disponibles en stock.</p>
        </div>
        <Link
          href="/inventario"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-timber-700 hover:bg-timber-800 text-white text-xs font-bold transition-all shadow-xs"
        >
          <span>Ir a Inventario</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

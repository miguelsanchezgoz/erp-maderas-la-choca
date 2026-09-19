"use client";

import React from "react";
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, BarChart3, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

export default function FinanzasPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Módulo Financiero & Tesorería</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Finanzas & Control Fiscal
          </h1>
          <p className="text-xs md:text-sm text-industrial-500 dark:text-industrial-400 mt-1">
            Gestión de ingresos, egresos operativos de aserradero y flujo de caja en Tabasco.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold">
            Roles: DUENO, CXC_CXP
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-industrial-500 dark:text-industrial-400">Ventas del Mes</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-industrial-900 dark:text-white font-mono">
              {formatCurrency(845200)}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
              +14.2% vs mes anterior
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-industrial-500 dark:text-industrial-400">Por Cobrar (CxC)</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-industrial-900 dark:text-white font-mono">
              {formatCurrency(312450)}
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block mt-1">
              8 clientes con saldo pendiente
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-industrial-500 dark:text-industrial-400">Por Pagar (CxP)</span>
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-industrial-900 dark:text-white font-mono">
              {formatCurrency(198700)}
            </span>
            <span className="text-[11px] text-industrial-500 dark:text-industrial-400 font-semibold block mt-1">
              Trozas, fletes y químicos NOM-144
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-industrial-500 dark:text-industrial-400">Margen Operativo</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-industrial-900 dark:text-white font-mono">
              34.8%
            </span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block mt-1">
              Utilidad bruta aserradero
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor Informativo */}
      <div className="p-6 rounded-3xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs">
        <h3 className="font-bold text-base text-industrial-900 dark:text-white mb-2 flex items-center space-x-2">
          <FileSpreadsheet className="w-4 h-4 text-timber-600 dark:text-timber-400" />
          <span>Conciliación de Cuentas & Flujo de Caja</span>
        </h3>
        <p className="text-xs text-industrial-500 dark:text-industrial-400 max-w-2xl leading-relaxed">
          Este módulo está reservado exclusivamente para los roles <strong className="text-industrial-800 dark:text-industrial-200">DUEÑO</strong> y <strong className="text-industrial-800 dark:text-industrial-200">CXC_CXP</strong>. Los reportes de flujo de efectivo detallan los cobros recibidos por anticipos de cotizaciones y los pagos a proveedores forestales de trozas de Tabasco.
        </p>
      </div>
    </div>
  );
}

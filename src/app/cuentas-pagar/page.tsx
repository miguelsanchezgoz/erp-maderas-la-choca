"use client";

import React from "react";
import { Receipt, Truck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

export default function CuentasPagarPage() {
  const samplePayables = [
    {
      id: "CXP-001",
      supplier: "Ejido San Carlos (Trozas de Maculis)",
      concept: "Lote de 25 Trozas de Maculis 1ra calidad",
      amount: 88000,
      dueDate: "2026-09-28",
      status: "PROGRAMADO",
    },
    {
      id: "CXP-002",
      supplier: "Insumos Fitosanitarios del Golfo",
      concept: "Sensores térmicos para horno de estufado NOM-144",
      amount: 24500,
      dueDate: "2026-09-22",
      status: "PENDIENTE",
    },
    {
      id: "CXP-003",
      supplier: "Transportes y Grúas Villahermosa",
      concept: "Flete plataforma de trozas desde Balancán",
      amount: 32000,
      dueDate: "2026-10-05",
      status: "PROGRAMADO",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>Módulo de Pagos a Proveedores</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Cuentas por Pagar (CxP)
          </h1>
          <p className="text-xs md:text-sm text-industrial-500 dark:text-industrial-400 mt-1">
            Gestión de pagos a proveedores forestales, insumos industriales de taller y fletes.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold self-start md:self-auto">
          Roles: DUENO, CXC_CXP
        </span>
      </div>

      <div className="bg-white dark:bg-industrial-900 rounded-3xl border border-industrial-200 dark:border-industrial-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-industrial-100 dark:border-industrial-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-industrial-900 dark:text-white">
            Compromisos de Pago Programados
          </h3>
          <span className="text-xs text-industrial-500 dark:text-industrial-400">
            Total programado: <strong className="text-industrial-900 dark:text-white font-mono">{formatCurrency(144500)}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-industrial-50 dark:bg-industrial-950 text-industrial-500 dark:text-industrial-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Folio</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4">Concepto</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4">Fecha Pago</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-100 dark:divide-industrial-800">
              {samplePayables.map((pay) => (
                <tr key={pay.id} className="hover:bg-industrial-50/50 dark:hover:bg-industrial-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-industrial-800 dark:text-industrial-200">{pay.id}</td>
                  <td className="py-3 px-4 font-medium text-industrial-900 dark:text-white">{pay.supplier}</td>
                  <td className="py-3 px-4 text-industrial-600 dark:text-industrial-300">{pay.concept}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-industrial-900 dark:text-white">
                    {formatCurrency(pay.amount)}
                  </td>
                  <td className="py-3 px-4 text-industrial-500 dark:text-industrial-400">{pay.dueDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

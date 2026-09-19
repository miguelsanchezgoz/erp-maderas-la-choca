"use client";

import React from "react";
import { CreditCard, Clock, AlertTriangle, CheckCircle2, Search, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

export default function CuentasCobrarPage() {
  const sampleInvoices = [
    {
      id: "CXC-001",
      customer: "Constructora del Sureste S.A. de C.V.",
      concept: "Anticipo 50% Cuñas de Parota y Polines",
      amount: 68500,
      dueDate: "2026-09-25",
      status: "VIGENTE",
    },
    {
      id: "CXC-002",
      customer: "Carrocerías del Golfo S.A.",
      concept: "Finiquito Piso de Low-Boy en Maculis",
      amount: 112000,
      dueDate: "2026-09-18",
      status: "VENCIDO",
    },
    {
      id: "CXC-003",
      customer: "Industrial Petrolera Olmeca",
      concept: "Tarimas Pesadas NOM-144 con Sello HT",
      amount: 45000,
      dueDate: "2026-09-30",
      status: "VIGENTE",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Módulo de Cobranza</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Cuentas por Cobrar (CxC)
          </h1>
          <p className="text-xs md:text-sm text-industrial-500 dark:text-industrial-400 mt-1">
            Control de saldos por cobrar a clientes, anticipos de cotizaciones y facturas vigentes.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold self-start md:self-auto">
          Roles: DUENO, CXC_CXP
        </span>
      </div>

      {/* Lista de Saldos */}
      <div className="bg-white dark:bg-industrial-900 rounded-3xl border border-industrial-200 dark:border-industrial-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-industrial-100 dark:border-industrial-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-industrial-900 dark:text-white">
            Cartera de Cobranza Pendiente
          </h3>
          <span className="text-xs text-industrial-500 dark:text-industrial-400">
            Total en cartera: <strong className="text-industrial-900 dark:text-white font-mono">{formatCurrency(225500)}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-industrial-50 dark:bg-industrial-950 text-industrial-500 dark:text-industrial-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Folio</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Concepto</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-100 dark:divide-industrial-800">
              {sampleInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-industrial-50/50 dark:hover:bg-industrial-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-industrial-800 dark:text-industrial-200">{inv.id}</td>
                  <td className="py-3 px-4 font-medium text-industrial-900 dark:text-white">{inv.customer}</td>
                  <td className="py-3 px-4 text-industrial-600 dark:text-industrial-300">{inv.concept}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-industrial-900 dark:text-white">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="py-3 px-4 text-industrial-500 dark:text-industrial-400">{inv.dueDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === "VENCIDO"
                        ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    }`}>
                      {inv.status}
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

"use client";

import React from "react";
import { FileText, CheckCircle2, AlertCircle, Download, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

export default function FacturacionPage() {
  const sampleCFDIs = [
    {
      uuid: "4A8B9C1D-2E3F-4G5H-6I7J-8K9L0M1N2O3P",
      folio: "FAC-2026-0142",
      customer: "Constructora del Sureste S.A. de C.V.",
      rfc: "CSU120504TR8",
      total: 79460,
      date: "2026-09-17",
      status: "TIMBRADA",
    },
    {
      uuid: "9F8E7D6C-5B4A-3Z2Y-1X0W-9V8U7T6S5R4Q",
      folio: "FAC-2026-0143",
      customer: "Carrocerías del Golfo S.A.",
      rfc: "CGO980112AB4",
      total: 129920,
      date: "2026-09-18",
      status: "TIMBRADA",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Módulo de Comprobantes Fiscales</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Facturación Electrónica CFDI 4.0
          </h1>
          <p className="text-xs md:text-sm text-industrial-500 dark:text-industrial-400 mt-1">
            Emisión y timbrado de facturas con desglose de IVA y retenciones para venta de madera.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold self-start md:self-auto">
          Roles: DUENO, CXC_CXP
        </span>
      </div>

      <div className="bg-white dark:bg-industrial-900 rounded-3xl border border-industrial-200 dark:border-industrial-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-industrial-100 dark:border-industrial-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-industrial-900 dark:text-white">
            Facturas Emitidas Recientemente
          </h3>
          <span className="text-xs text-industrial-500 dark:text-industrial-400">
            PAC Activo • Conexión SAT Estable
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-industrial-50 dark:bg-industrial-950 text-industrial-500 dark:text-industrial-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Folio</th>
                <th className="py-3 px-4">Receptor / RFC</th>
                <th className="py-3 px-4">UUID SAT</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-100 dark:divide-industrial-800">
              {sampleCFDIs.map((fac) => (
                <tr key={fac.folio} className="hover:bg-industrial-50/50 dark:hover:bg-industrial-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-industrial-800 dark:text-industrial-200">{fac.folio}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-industrial-900 dark:text-white block">{fac.customer}</span>
                    <span className="text-[10px] text-industrial-400 font-mono">{fac.rfc}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-industrial-500 dark:text-industrial-400">{fac.uuid}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-industrial-900 dark:text-white">
                    {formatCurrency(fac.total)}
                  </td>
                  <td className="py-3 px-4 text-industrial-500 dark:text-industrial-400">{fac.date}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {fac.status}
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

"use client";

import React from "react";
import { Settings, ShieldCheck, Database, Sliders, Bell, Lock } from "lucide-react";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Panel de Configuración del Sistema</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Configuración General & Parámetros
          </h1>
          <p className="text-xs md:text-sm text-industrial-500 dark:text-industrial-400 mt-1">
            Ajustes globales de aserradero, parámetros fitosanitarios NOM-144 y respaldos.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold self-start md:self-auto">
          Exclusivo: DUENO
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-industrial-900 dark:text-white">Acreditación NOM-144-SEMARNAT</h3>
              <p className="text-xs text-industrial-500 dark:text-industrial-400">Folio oficial fitosanitario</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-industrial-50 dark:bg-industrial-950 border border-industrial-200 dark:border-industrial-800">
            <span className="text-[11px] font-mono text-industrial-500 block mb-1">Registro Autorizado:</span>
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">MX-04-1234-SEMARNAT-HT</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-industrial-900 dark:text-white">Políticas de Acceso & Auditoría</h3>
              <p className="text-xs text-industrial-500 dark:text-industrial-400">NextAuth JWT & Logs de Seguridad</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-industrial-50 dark:bg-industrial-950 border border-industrial-200 dark:border-industrial-800">
            <span className="text-[11px] font-mono text-industrial-500 block mb-1">Estado de Seguridad:</span>
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">RBAC Activo (4 Roles Oficiales)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

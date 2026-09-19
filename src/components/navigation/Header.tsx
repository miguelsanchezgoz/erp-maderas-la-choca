"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  ChevronDown,
  Building,
  Check,
  UserCog,
  Users,
} from "lucide-react";
import { useRole } from "./RoleContext";
import { UserRole } from "@/types";

export function Header() {
  const { currentUser, users, setCurrentUserId, isDarkMode, toggleDarkMode } = useRole();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roleColors: Record<UserRole, string> = {
    ADMIN: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    VENTAS: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    TALLER: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    ALMACEN: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  };

  const roleNames: Record<UserRole, string> = {
    ADMIN: "Dirección General",
    VENTAS: "Asesor de Ventas & CRM",
    TALLER: "Producción & Taller",
    ALMACEN: "Patio & Almacén",
  };

  const activeUsers = users.filter((u) => u.status === "ACTIVO");

  return (
    <header className="h-16 bg-white/90 dark:bg-industrial-900/90 backdrop-blur-md border-b border-industrial-200 dark:border-industrial-800 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 no-print">
      {/* Indicador de Ubicación y Estado */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-industrial-500 dark:text-industrial-400 bg-industrial-100 dark:bg-industrial-800/80 px-3 py-1.5 rounded-lg border border-industrial-200 dark:border-industrial-700/60">
          <Building className="w-3.5 h-3.5 text-timber-600 dark:text-timber-400" />
          <span>Planta Villahermosa - Km 8.5</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>
      </div>

      {/* Acciones de Cabecera: Selector de Usuario/Rol y Modo Oscuro */}
      <div className="flex items-center space-x-3">
        {/* Selector Dinámico de Colaborador */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            type="button"
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl border border-industrial-200 dark:border-industrial-700 bg-white dark:bg-industrial-800 hover:bg-industrial-50 dark:hover:bg-industrial-700/70 text-industrial-800 dark:text-industrial-200 text-xs font-medium shadow-xs transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-timber-600 to-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
              {currentUser.name?.charAt(0) || "U"}
            </div>
            <div className="text-left hidden sm:block">
              <span className="block font-bold text-industrial-900 dark:text-white leading-tight">
                {currentUser.name}
              </span>
              <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded border font-semibold ${roleColors[currentUser.role] || ""}`}>
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-industrial-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-industrial-800 rounded-2xl shadow-xl border border-industrial-200 dark:border-industrial-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 border-b border-industrial-100 dark:border-industrial-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-industrial-400 uppercase tracking-wider block">
                    Colaboradores Activos
                  </span>
                  <span className="text-[11px] text-industrial-500 dark:text-industrial-400">
                    Cambiar usuario en sesión
                  </span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {activeUsers.length} en línea
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-industrial-100 dark:divide-industrial-700/50">
                {activeUsers.map((user) => {
                  const isSelected = currentUser.id === user.id;

                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUserId(user.id);
                        setShowRoleDropdown(false);
                      }}
                      type="button"
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-industrial-50 dark:hover:bg-industrial-700/50 transition-colors ${
                        isSelected ? "bg-amber-50/60 dark:bg-amber-950/30 font-semibold" : ""
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-industrial-900 dark:text-white font-medium truncate">
                            {user.name}
                          </span>
                          <span className={`text-[9px] px-1 rounded font-bold border shrink-0 ${roleColors[user.role] || ""}`}>
                            {user.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-industrial-500 dark:text-industrial-400 block truncate">
                          {user.email} {user.phone ? `• ${user.phone}` : ""}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-timber-600 dark:text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Acceso directo a administración de usuarios */}
              <div className="p-2 border-t border-industrial-100 dark:border-industrial-700 bg-industrial-50 dark:bg-industrial-900/50">
                <Link
                  href="/usuarios"
                  onClick={() => setShowRoleDropdown(false)}
                  className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-timber-700 hover:bg-timber-800 text-white text-[11px] font-bold transition-all shadow-xs"
                >
                  <UserCog className="w-3.5 h-3.5" />
                  <span>Gestionar Personal & Roles</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Interruptor Modo Claro / Oscuro */}
        <button
          onClick={toggleDarkMode}
          type="button"
          aria-label="Alternar modo claro / oscuro"
          className="p-2 rounded-xl border border-industrial-200 dark:border-industrial-700 bg-white dark:bg-industrial-800 text-industrial-600 dark:text-amber-400 hover:bg-industrial-50 dark:hover:bg-industrial-700 transition-colors shadow-xs"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}

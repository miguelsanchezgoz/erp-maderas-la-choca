"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  FileSpreadsheet,
  Hammer,
  Package,
  Calculator,
  ShieldCheck,
  UserCog,
  DollarSign,
  CreditCard,
  Receipt,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useRole } from "./RoleContext";
import { UserRole } from "@/types";

interface SidebarProps {
  onOpenCalculator?: () => void;
}

export function Sidebar({ onOpenCalculator }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser } = useRole();

  const navItems = [
    {
      label: "Dashboard General",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["DUENO", "CXC_CXP", "ENCARGADO_PISO", "OPERATIVO"],
      badge: null,
    },
    // Finanzas, CxC, CxP y Facturación (DUENO y CXC_CXP)
    {
      label: "Finanzas & Reportes",
      href: "/finanzas",
      icon: DollarSign,
      roles: ["DUENO", "CXC_CXP"],
      badge: "Finanzas",
    },
    {
      label: "Cuentas por Cobrar",
      href: "/cuentas-cobrar",
      icon: CreditCard,
      roles: ["DUENO", "CXC_CXP"],
      badge: "CxC",
    },
    {
      label: "Cuentas por Pagar",
      href: "/cuentas-pagar",
      icon: Receipt,
      roles: ["DUENO", "CXC_CXP"],
      badge: "CxP",
    },
    {
      label: "Facturación",
      href: "/facturacion",
      icon: FileSpreadsheet,
      roles: ["DUENO", "CXC_CXP"],
      badge: "CFDI",
    },
    // CRM, Clientes y Cotizaciones (DUENO, CXC_CXP y ENCARGADO_PISO)
    {
      label: "CRM & Prospectos",
      href: "/crm",
      icon: KanbanSquare,
      roles: ["DUENO", "CXC_CXP", "ENCARGADO_PISO"],
      badge: "Kanban",
    },
    {
      label: "Directorio de Clientes",
      href: "/clientes",
      icon: Users,
      roles: ["DUENO", "CXC_CXP", "ENCARGADO_PISO"],
      badge: null,
    },
    {
      label: "Cotizaciones & Cubicaje",
      href: "/cotizaciones",
      icon: FileSpreadsheet,
      roles: ["DUENO", "CXC_CXP", "ENCARGADO_PISO"],
      badge: "PT / m³",
    },
    // Taller e Inventario/Patio (DUENO, ENCARGADO_PISO y OPERATIVO)
    {
      label: "Taller & NOM-144",
      href: "/taller",
      icon: Hammer,
      roles: ["DUENO", "ENCARGADO_PISO", "OPERATIVO"],
      badge: "OTs",
    },
    {
      label: "Inventario & Patio",
      href: "/inventario",
      icon: Package,
      roles: ["DUENO", "ENCARGADO_PISO", "OPERATIVO"],
      badge: "Stock",
    },
    // Usuarios y Configuración (Exclusivo DUENO)
    {
      label: "Personal & Roles",
      href: "/usuarios",
      icon: UserCog,
      roles: ["DUENO"],
      badge: "Seguridad",
    },
    {
      label: "Configuración",
      href: "/configuracion",
      icon: Settings,
      roles: ["DUENO"],
      badge: null,
    },
  ];

  const allowedNavItems = navItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  return (
    <aside className="w-64 bg-white dark:bg-industrial-900 border-r border-industrial-200 dark:border-industrial-800 flex flex-col h-screen sticky top-0 transition-colors duration-200 select-none no-print">
      {/* Brand Header */}
      <div className="p-4 border-b border-industrial-100 dark:border-industrial-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-timber-600 via-timber-700 to-forest-800 flex items-center justify-center shadow-md shadow-timber-900/10 text-white font-black text-lg">
          LC
        </div>
        <div>
          <h1 className="font-display font-extrabold text-industrial-900 dark:text-white tracking-tight leading-tight text-base">
            Maderas <span className="text-forest-600 dark:text-forest-400">La Choca</span>
          </h1>
          <p className="text-[10px] font-semibold tracking-wider text-amber-700 dark:text-amber-400 uppercase">
            ERP / CRM Tabasco
          </p>
        </div>
      </div>

      {/* Acceso Rápido a Calculadora Maderera (para roles con acceso a cubicaje/taller/cotizaciones) */}
      {["DUENO", "CXC_CXP", "ENCARGADO_PISO", "OPERATIVO"].includes(currentUser.role) && (
        <div className="px-3 pt-3">
          <button
            onClick={onOpenCalculator}
            type="button"
            className="w-full group relative flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-timber-500/10 via-amber-500/10 to-forest-500/10 hover:from-timber-500/20 hover:to-forest-500/20 border border-timber-200 dark:border-industrial-700 text-timber-900 dark:text-amber-200 transition-all shadow-sm"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-timber-600 text-white shadow-xs">
                <Calculator className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold leading-tight">
                  Calculadora de Madera
                </span>
                <span className="block text-[10px] text-industrial-500 dark:text-industrial-400 font-medium">
                  Pies Tabla (PT) & m³
                </span>
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-industrial-400 dark:text-industrial-500 uppercase tracking-wider flex items-center justify-between">
          <span>Módulos de Negocio</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-industrial-100 dark:bg-industrial-800 text-industrial-600 dark:text-industrial-300 font-mono">
            {currentUser.role}
          </span>
        </div>

        {allowedNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-timber-700 text-white shadow-sm shadow-timber-900/20 font-semibold"
                  : "text-industrial-600 dark:text-industrial-300 hover:bg-industrial-100 dark:hover:bg-industrial-800/70 hover:text-industrial-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive
                      ? "text-amber-300"
                      : "text-industrial-400 dark:text-industrial-500 group-hover:text-timber-600 dark:group-hover:text-amber-400"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ml-1 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-industrial-100 dark:bg-industrial-800 text-industrial-500 dark:text-industrial-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Certificación Fitosanitaria & Botón Cerrar Sesión */}
      <div className="p-3 border-t border-industrial-100 dark:border-industrial-800 bg-industrial-50/50 dark:bg-industrial-950/40">
        {/* Botón Visible de Cerrar Sesión */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          type="button"
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-red-700 dark:text-red-400 bg-red-50/80 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 border border-red-200/80 dark:border-red-900/40 transition-all mb-3 shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>

        <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div className="text-[10px] leading-tight text-emerald-900 dark:text-emerald-200">
            <span className="font-bold block">NOM-144-SEMARNAT</span>
            <span className="text-[9px] text-emerald-700 dark:text-emerald-300">
              Tratamiento Térmico HT Acreditado
            </span>
          </div>
        </div>

        <div className="px-2 text-[10px] text-industrial-400 dark:text-industrial-500 flex justify-between items-center">
          <span>Villahermosa, Tab.</span>
          <span className="font-mono text-[9px]">v1.0 • 2026</span>
        </div>
      </div>
    </aside>
  );
}

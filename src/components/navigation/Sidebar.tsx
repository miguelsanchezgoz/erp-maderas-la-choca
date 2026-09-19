"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  FileSpreadsheet,
  Hammer,
  Package,
  Calculator,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  UserCog,
} from "lucide-react";
import { useRole } from "./RoleContext";

interface SidebarProps {
  onOpenCalculator?: () => void;
}

export function Sidebar({ onOpenCalculator }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser } = useRole();

  const navItems = [
    {
      label: "Dashboard Ejecutivo",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "VENTAS", "TALLER", "ALMACEN"],
      badge: null,
    },
    {
      label: "CRM & Prospectos",
      href: "/crm",
      icon: KanbanSquare,
      roles: ["ADMIN", "VENTAS"],
      badge: "Kanban",
    },
    {
      label: "Directorio de Clientes",
      href: "/clientes",
      icon: Users,
      roles: ["ADMIN", "VENTAS", "TALLER"],
      badge: null,
    },
    {
      label: "Cotizaciones & Cubicaje",
      href: "/cotizaciones",
      icon: FileSpreadsheet,
      roles: ["ADMIN", "VENTAS"],
      badge: "PT / m³",
    },
    {
      label: "Taller & NOM-144",
      href: "/taller",
      icon: Hammer,
      roles: ["ADMIN", "TALLER", "VENTAS"],
      badge: "OTs",
    },
    {
      label: "Inventario & Patio",
      href: "/inventario",
      icon: Package,
      roles: ["ADMIN", "ALMACEN", "TALLER"],
      badge: "Stock",
    },
    {
      label: "Personal / Usuarios",
      href: "/usuarios",
      icon: UserCog,
      roles: ["ADMIN"],
      badge: "Equipo",
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

      {/* Acceso Rápido a Calculadora Maderera */}
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

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-industrial-400 dark:text-industrial-500 uppercase tracking-wider">
          Módulos Operativos
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
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive
                      ? "text-amber-300"
                      : "text-industrial-400 dark:text-industrial-500 group-hover:text-timber-600 dark:group-hover:text-amber-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
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

      {/* Certificación Fitosanitaria & Footer */}
      <div className="p-3 border-t border-industrial-100 dark:border-industrial-800 bg-industrial-50/50 dark:bg-industrial-950/40">
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

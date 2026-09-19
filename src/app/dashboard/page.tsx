import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  TrendingUp,
  DollarSign,
  FileSpreadsheet,
  Hammer,
  Package,
  Layers,
  ShieldCheck,
  Building,
  ArrowRight,
  Clock,
  Sparkles,
  Calculator,
  RefreshCw,
  BarChart3,
  Flame,
  ShieldAlert,
  X,
} from "lucide-react";
import { formatCurrency, formatNumber, formatDate, formatFreightZone } from "@/lib/formatters";
import { useRole } from "@/components/navigation/RoleContext";

export default function DashboardPage() {
  const { currentUser } = useRole();
  const searchParams = useSearchParams();
  const unauthorizedError = searchParams.get("error") === "unauthorized";
  const [showUnauthorizedAlert, setShowUnauthorizedAlert] = useState(unauthorizedError);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (unauthorizedError) {
      setShowUnauthorizedAlert(true);
    }
  }, [unauthorizedError]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Alerta de Acceso No Autorizado por Rol */}
      {showUnauthorizedAlert && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-amber-900 dark:text-amber-200 animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Acceso Restringido por Rol ({currentUser.role})
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                No cuentas con los permisos requeridos para acceder al módulo solicitado. Has sido redirigido a tu panel principal.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUnauthorizedAlert(false)}
            type="button"
            className="p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner de Bienvenida y Perfil Activo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-timber-900 via-timber-800 to-forest-900 text-white p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Panel de Control Integral • Villahermosa, Tabasco</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight text-white">
              Bienvenido, {currentUser.name}
            </h1>
            <p className="text-xs md:text-sm text-amber-100/80 max-w-2xl mt-1">
              Operación comercial, cubicaje maderero y taller de transformación con certificación oficial fitosanitaria NOM-144-SEMARNAT.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto">
            <button
              onClick={fetchDashboard}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all shadow-xs"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link
              href="/cotizaciones"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-timber-950 font-bold text-xs shadow-lg transition-all"
            >
              <Calculator className="w-4 h-4" />
              <span>Cubicaje & Cotización</span>
            </Link>
          </div>
        </div>

        {/* Círculos decorativos de fondo */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/2 -top-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Grid de KPIs Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Pipeline & Cotizaciones */}
        <div className="bg-white dark:bg-industrial-900 rounded-2xl border border-industrial-200 dark:border-industrial-800 p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-industrial-500 uppercase tracking-wider">
              Valor del Pipeline
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-timber-700 dark:text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-industrial-900 dark:text-white">
            {formatCurrency(stats?.pipelineValue || 0)}
          </span>
          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{stats?.conversionRate || 0}% tasa de conversión</span>
          </div>
        </div>

        {/* KPI 2: Ventas Cerradas */}
        <div className="bg-white dark:bg-industrial-900 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Negocios Concretados
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
            {formatCurrency(stats?.wonValue || 0)}
          </span>
          <p className="text-[11px] text-emerald-600/80 mt-2">
            Ventas ganadas en el ciclo actual
          </p>
        </div>

        {/* KPI 3: Órdenes en Taller */}
        <div className="bg-white dark:bg-industrial-900 rounded-2xl border border-industrial-200 dark:border-industrial-800 p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-industrial-500 uppercase tracking-wider">
              Órdenes de Taller
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Hammer className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-industrial-900 dark:text-white">
            {stats?.activeWorkOrdersCount || 0} Activas
          </span>
          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{stats?.nom144OrdersCount || 0} con certificación NOM-144</span>
          </div>
        </div>

        {/* KPI 4: Madera en Patio */}
        <div className="bg-white dark:bg-industrial-900 rounded-2xl border border-industrial-200 dark:border-industrial-800 p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-industrial-500 uppercase tracking-wider">
              Stock de Madera en Patio
            </span>
            <div className="p-2 rounded-xl bg-timber-50 dark:bg-timber-950/40 text-timber-700 dark:text-amber-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black font-mono text-timber-800 dark:text-amber-400">
            {formatNumber(stats?.totalInventoryPt || 0)} PT
          </span>
          <p className="text-[11px] text-industrial-500 dark:text-industrial-400 mt-2">
            {stats?.lowStockCount || 0} artículos cerca del mínimo
          </p>
        </div>
      </div>

      {/* Sección Doble: Especies de Mayor Demanda y Órdenes Activas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Especies Más Demandadas en Cotizaciones */}
        <div className="bg-white dark:bg-industrial-900 rounded-2xl border border-industrial-200 dark:border-industrial-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-industrial-900 dark:text-white">
                  Especies Tropicales con Mayor Demanda
                </h3>
              </div>
              <span className="text-[10px] text-industrial-400">En base a cubicaje cotizado</span>
            </div>

            <div className="space-y-3">
              {stats?.topSpecies?.map((sp: any, idx: number) => {
                const maxPt = stats?.topSpecies[0]?.totalPt || 1;
                const percent = Math.min(100, Math.round((sp.totalPt / maxPt) * 100));

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-industrial-800 dark:text-industrial-200">
                        {idx + 1}. {sp.name}
                      </span>
                      <span className="font-mono text-timber-800 dark:text-amber-400">
                        {formatNumber(sp.totalPt)} PT ({sp.count} solicitudes)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-industrial-100 dark:bg-industrial-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-timber-600 via-amber-500 to-forest-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(8, percent)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}

              {(!stats?.topSpecies || stats.topSpecies.length === 0) && (
                <div className="text-center py-8 text-xs text-industrial-400 italic">
                  Aún no hay suficientes partidas cotizadas para generar la gráfica
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-industrial-100 dark:border-industrial-800 mt-4 flex items-center justify-between text-xs text-industrial-500">
            <span>Maderas de selva y plantaciones de Tabasco</span>
            <Link
              href="/cotizaciones"
              className="font-bold text-timber-700 dark:text-amber-400 hover:underline flex items-center space-x-1"
            >
              <span>Generar Cotización</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Órdenes de Trabajo Destacadas */}
        <div className="bg-white dark:bg-industrial-900 rounded-2xl border border-industrial-200 dark:border-industrial-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Hammer className="w-4 h-4 text-timber-600" />
                <h3 className="font-bold text-sm text-industrial-900 dark:text-white">
                  Órdenes en Taller & Líneas Industriales
                </h3>
              </div>
              <Link
                href="/taller"
                className="text-xs text-timber-700 dark:text-amber-400 font-bold hover:underline"
              >
                Ver Todas
              </Link>
            </div>

            <div className="space-y-2.5">
              {stats?.recentWorkOrders?.slice(0, 4).map((wo: any) => (
                <div
                  key={wo.id}
                  className="p-3 rounded-xl border border-industrial-200 dark:border-industrial-800 bg-industrial-50/50 dark:bg-industrial-850/50 flex items-center justify-between text-xs hover:bg-industrial-100/50 transition-colors"
                >
                  <div className="space-y-0.5 max-w-[70%]">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-timber-800 dark:text-amber-400">
                        {wo.orderNumber}
                      </span>
                      {wo.requiresNom144 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                          NOM-144
                        </span>
                      )}
                    </div>
                    <span className="font-semibold block text-industrial-900 dark:text-white truncate">
                      {wo.title}
                    </span>
                    <span className="text-[10px] text-industrial-500 block truncate">
                      {wo.customerName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {wo.status}
                    </span>
                    <span className="font-mono text-[11px] block mt-1 text-industrial-600 dark:text-industrial-300">
                      {formatNumber(wo.estimatedBoardFeet)} PT
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-industrial-100 dark:border-industrial-800 mt-4 flex justify-end">
            <Link
              href="/taller"
              className="text-xs font-bold text-timber-700 dark:text-amber-400 hover:underline flex items-center space-x-1"
            >
              <span>Ir al Tablero de Taller</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Actividad Reciente de Cotizaciones */}
      <div className="bg-white dark:bg-industrial-900 rounded-2xl border border-industrial-200 dark:border-industrial-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-forest-600" />
            <h3 className="font-bold text-sm text-industrial-900 dark:text-white">
              Cotizaciones Técnicas Recientes
            </h3>
          </div>
          <Link
            href="/cotizaciones"
            className="text-xs text-timber-700 dark:text-amber-400 font-bold hover:underline"
          >
            Ver Historial Completo
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-industrial-100/70 dark:bg-industrial-800/70 font-bold text-industrial-600 dark:text-industrial-400">
                <th className="p-3">Folio</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Destino / Flete</th>
                <th className="p-3 text-right">Volumen PT</th>
                <th className="p-3 text-right">Total MXN</th>
                <th className="p-3 text-center">Estatus</th>
                <th className="p-3 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-100 dark:divide-industrial-800">
              {stats?.recentQuotes?.map((q: any) => {
                const totalQPt = q.items?.reduce((acc: number, it: any) => acc + (it.boardFeetTotal || 0), 0) || 0;

                return (
                  <tr key={q.id} className="hover:bg-industrial-50 dark:hover:bg-industrial-850/50">
                    <td className="p-3 font-mono font-bold text-timber-800 dark:text-amber-400">
                      {q.quoteNumber}
                    </td>
                    <td className="p-3 font-semibold text-industrial-900 dark:text-white">
                      {q.customerName}
                    </td>
                    <td className="p-3 text-industrial-500">
                      {formatFreightZone(q.freightZone)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-timber-800 dark:text-amber-300">
                      {formatNumber(totalQPt)} PT
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(q.total)}
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-industrial-400">
                      {formatDate(q.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

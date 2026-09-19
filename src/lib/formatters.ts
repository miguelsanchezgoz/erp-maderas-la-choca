export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value || 0);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatFreightZone(zone: string): string {
  switch (zone) {
    case "LOCAL_VILLAHERMOSA":
      return "Local Villahermosa";
    case "MUNICIPIO_TABASCO":
      return "Municipio de Tabasco (Dos Bocas / Cárdenas / etc.)";
    case "FORANEO":
      return "Foráneo (Sureste / Peninsular)";
    default:
      return zone;
  }
}

export function formatStageLabel(stage: string): { label: string; color: string } {
  switch (stage) {
    case "NUEVO":
      return { label: "Nuevo Lead", color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" };
    case "CONTACTADO":
      return { label: "Contactado", color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800" };
    case "POR_COTIZAR":
      return { label: "Por Cotizar", color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" };
    case "COTIZADO":
      return { label: "Cotizado", color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800" };
    case "EN_NEGOCIACION":
      return { label: "En Negociación", color: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800" };
    case "GANADO":
      return { label: "Ganado / Cerrado", color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800" };
    case "PERDIDO":
      return { label: "Perdido", color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800" };
    default:
      return { label: stage, color: "bg-gray-100 text-gray-800 border-gray-200" };
  }
}

export function formatWorkOrderStatus(status: string): { label: string; color: string } {
  switch (status) {
    case "PENDIENTE":
      return { label: "Pendiente", color: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" };
    case "EN_PROCESO":
      return { label: "En Proceso", color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800" };
    case "CONTROL_CALIDAD":
      return { label: "Control de Calidad", color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800" };
    case "LISTO_ENTREGA":
      return { label: "Listo para Entrega", color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800" };
    case "ENTREGADO":
      return { label: "Entregado", color: "bg-green-100 text-green-900 border-green-300 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-800 border-gray-200" };
  }
}

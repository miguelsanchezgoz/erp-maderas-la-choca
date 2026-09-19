"use client";

import React, { useState, useEffect } from "react";
import {
  Hammer,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  Truck,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  User,
  ArrowRight,
  ArrowLeft,
  X,
  Layers,
  Printer,
  Calendar,
  DollarSign,
  Building,
} from "lucide-react";
import { formatCurrency, formatNumber, formatDate, formatWorkOrderStatus } from "@/lib/formatters";
import { WorkOrderType, CustomerType } from "@/types";

const WORK_ORDER_STAGES = [
  { id: "PENDIENTE", name: "Pendiente", color: "border-t-slate-500" },
  { id: "EN_PROCESO", name: "En Proceso", color: "border-t-amber-500" },
  { id: "CONTROL_CALIDAD", name: "Control de Calidad", color: "border-t-blue-500" },
  { id: "LISTO_ENTREGA", name: "Listo para Entrega", color: "border-t-emerald-500" },
];

const SUBCATEGORIES = {
  REPARACION_TRANSPORTE: [
    { id: "LOW_BOY", label: "Cama Baja / Low-Boy (50T - 80T)" },
    { id: "CAJA_SECA", label: "Caja Seca de Carga" },
    { id: "PLATAFORMA_PLANA", label: "Plataforma Plana Petrolera" },
    { id: "CARROCERIA_REDILAS", label: "Carrocería / Redilas Ganaderas" },
    { id: "REMOLQUE_ESPECIAL", label: "Remolque Especializado" },
  ],
  FABRICACION_INDUSTRIAL: [
    { id: "CAJA_EXPORTACION_NOM144", label: "Caja de Exportación (Sello NOM-144 HT)" },
    { id: "CAJA_TRANSPORTE_PESADO", label: "Caja de Transporte Pesado / Válvulas" },
    { id: "TARIMA_REFORZADA_PETROLERA", label: "Tarima Reforzada Petrolera (2.5T+)" },
    { id: "CUNAS_TUBERIA_PIPE_SADDLE", label: "Cuñas para Tubería (Pipe Saddles)" },
    { id: "CHOCK_BLOCKS_SEGURIDAD", label: "Chock-Blocks de Seguridad para Ruedas" },
    { id: "ESTACAS_TOPOGRAFIA", label: "Estacas y Trompos de Topografía" },
    { id: "PIZARRA_SOPORTE_MOTOR", label: "Pizarra / Soporte de Motor y Bombas" },
  ],
};

export default function TallerPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrderType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("TODOS");

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<WorkOrderType | null>(null);

  // Formulario Nueva Orden
  const [title, setTitle] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [serviceType, setServiceType] = useState<"REPARACION_TRANSPORTE" | "FABRICACION_INDUSTRIAL">("FABRICACION_INDUSTRIAL");
  const [subcategory, setSubcategory] = useState("CAJA_EXPORTACION_NOM144");
  const [priority, setPriority] = useState<"BAJA" | "MEDIA" | "ALTA" | "URGENTE">("ALTA");
  const [requiresNom144, setRequiresNom144] = useState(true);
  const [nom144BatchCode, setNom144BatchCode] = useState(`HT-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [description, setDescription] = useState("");
  const [estimatedHours, setEstimatedHours] = useState(30);
  const [estimatedBoardFeet, setEstimatedBoardFeet] = useState(450);
  const [finalPrice, setFinalPrice] = useState(42000);
  const [assignedTo, setAssignedTo] = useState("Mtro. Roberto Morales");
  const [targetDeliveryDate, setTargetDeliveryDate] = useState("");
  const [saving, setSaving] = useState(false);

  // Materiales de la orden
  const [materials, setMaterials] = useState<any[]>([
    { materialName: "Tablón de Madera Dura 2\" x 8\" x 10'", category: "MADERA", quantity: 300, unit: "PT", unitCost: 75 },
    { materialName: "Pernos galvanizados grado 5 con tuerca", category: "HERRAJES_TORNILLERIA", quantity: 50, unit: "PIEZAS", unitCost: 18 },
  ]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [woRes, cRes] = await Promise.all([
        fetch("/api/work-orders"),
        fetch("/api/customers"),
      ]);
      const [woData, cData] = await Promise.all([
        woRes.json(),
        cRes.json(),
      ]);
      setWorkOrders(woData);
      setCustomers(cData);
    } catch (err) {
      console.error("Error loading work orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCustomerSelect = (custId: string) => {
    setSelectedCustomerId(custId);
    const found = customers.find((c) => c.id === custId);
    if (found) {
      setCustomerName(found.businessName);
    }
  };

  const handleMoveStatus = async (orderId: string, currentStatus: string, direction: "prev" | "next") => {
    const currentIndex = WORK_ORDER_STAGES.findIndex((s) => s.id === currentStatus);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= WORK_ORDER_STAGES.length) return;

    const nextStatus = WORK_ORDER_STAGES[newIndex].id;

    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === orderId ? { ...wo, status: nextStatus as any } : wo))
    );

    try {
      await fetch("/api/work-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: nextStatus }),
      });
    } catch (err) {
      console.error("Error updating order status:", err);
      fetchOrders();
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !customerName.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId || null,
          customerName,
          title,
          serviceType,
          subcategory,
          priority,
          requiresNom144,
          nom144BatchCode: requiresNom144 ? nom144BatchCode : null,
          semarnatStampRegistry: requiresNom144 ? "MX-04-1234-SEMARNAT-HT" : null,
          description,
          estimatedHours: Number(estimatedHours),
          estimatedBoardFeet: Number(estimatedBoardFeet),
          finalPrice: Number(finalPrice),
          assignedTo,
          targetDeliveryDate: targetDeliveryDate || null,
          materials,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        fetchOrders();
      }
    } catch (err) {
      console.error("Error creating work order:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService =
      serviceFilter === "TODOS" || wo.serviceType === serviceFilter;
    return matchesSearch && matchesService;
  });

  const totalActive = filteredOrders.filter((wo) => wo.status !== "ENTREGADO").length;
  const nom144Count = filteredOrders.filter((wo) => wo.requiresNom144).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Taller & Servicios Industriales
          </h1>
          <p className="text-xs text-industrial-500 dark:text-industrial-400">
            Control de Órdenes de Trabajo (OTs): Reparación de transporte pesado y manufactura con certificación NOM-144-SEMARNAT
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-timber-700 to-timber-800 hover:from-timber-800 hover:to-timber-900 text-white text-xs font-bold shadow-md shadow-timber-900/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Orden de Trabajo (OT)</span>
        </button>
      </div>

      {/* Tarjetas Informativas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 no-print">
        <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-industrial-500 uppercase tracking-wider block mb-1">
            Órdenes Activas en Taller
          </span>
          <span className="text-xl font-black text-industrial-900 dark:text-white">
            {totalActive} OTs
          </span>
          <span className="text-[10px] text-industrial-400 block mt-1">
            En producción o control de calidad
          </span>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-emerald-200 dark:border-emerald-800/50 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center space-x-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Cumplimiento NOM-144
            </span>
          </div>
          <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">
            {nom144Count} Órdenes HT
          </span>
          <span className="text-[10px] text-emerald-600/80 block mt-1">
            Tratamiento Térmico Fitosanitario Acreditado
          </span>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
            Volumen de Madera en Proceso
          </span>
          <span className="text-xl font-black text-amber-700 dark:text-amber-300">
            {formatNumber(
              filteredOrders.reduce((acc, wo) => acc + (wo.estimatedBoardFeet || 0), 0)
            )}{" "}
            PT
          </span>
          <span className="text-[10px] text-amber-600/80 block mt-1">
            Cubicaje asignado a líneas de taller
          </span>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-industrial-900 p-3 rounded-2xl border border-industrial-200 dark:border-industrial-800 no-print">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-industrial-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por OT-, cliente, descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 rounded-xl focus:ring-2 focus:ring-timber-500 outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-industrial-400" />
          <span className="text-xs text-industrial-500">Línea de Servicio:</span>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-industrial-200 dark:border-industrial-700 bg-industrial-50 dark:bg-industrial-800 text-industrial-800 dark:text-industrial-200"
          >
            <option value="TODOS">Todas las Líneas</option>
            <option value="REPARACION_TRANSPORTE">Reparación de Transporte Pesado</option>
            <option value="FABRICACION_INDUSTRIAL">Fabricación Industrial & NOM-144</option>
          </select>
        </div>
      </div>

      {/* Tablero Kanban de Órdenes de Trabajo */}
      <div className="overflow-x-auto pb-4 no-print">
        <div className="inline-flex gap-4 min-w-[1200px] w-full">
          {WORK_ORDER_STAGES.map((stage) => {
            const stageOrders = filteredOrders.filter((wo) => wo.status === stage.id);

            return (
              <div
                key={stage.id}
                className={`flex-1 min-w-[280px] bg-industrial-100/70 dark:bg-industrial-900/60 rounded-2xl border border-industrial-200 dark:border-industrial-800 flex flex-col max-h-[75vh] border-t-4 ${stage.color}`}
              >
                {/* Cabecera de Columna */}
                <div className="p-3 border-b border-industrial-200 dark:border-industrial-800 bg-white/60 dark:bg-industrial-900/60 rounded-t-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-industrial-900 dark:text-white block">
                      {stage.name}
                    </span>
                    <span className="text-[10px] text-industrial-500">
                      {stageOrders.length} orden(es)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-industrial-200 dark:bg-industrial-800 text-industrial-700 dark:text-industrial-300">
                    {stageOrders.length}
                  </span>
                </div>

                {/* Lista de Tarjetas de OT */}
                <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1">
                  {stageOrders.map((wo) => {
                    const currentIndex = WORK_ORDER_STAGES.findIndex((s) => s.id === stage.id);
                    const canGoPrev = currentIndex > 0;
                    const canGoNext = currentIndex < WORK_ORDER_STAGES.length - 1;

                    return (
                      <div
                        key={wo.id}
                        className="bg-white dark:bg-industrial-850 p-4 rounded-xl border border-industrial-200 dark:border-industrial-700/80 shadow-xs hover:shadow-md hover:border-timber-400 dark:hover:border-timber-600 transition-all space-y-2.5"
                      >
                        {/* Header de la Tarjeta */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-xs text-timber-800 dark:text-amber-400">
                            {wo.orderNumber}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${wo.priority === "URGENTE"
                                ? "bg-rose-100 text-rose-800 border-rose-300"
                                : wo.priority === "ALTA"
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-slate-100 text-slate-700 border-slate-300"
                              }`}
                          >
                            {wo.priority}
                          </span>
                        </div>

                        {/* Sello NOM-144 si aplica */}
                        {wo.requiresNom144 && (
                          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>CERTIFICADO NOM-144 (HT: {wo.nom144BatchCode || "LOTE"})</span>
                          </div>
                        )}

                        {/* Título de la orden */}
                        <h4 className="text-xs font-bold text-industrial-900 dark:text-white leading-tight">
                          {wo.title}
                        </h4>

                        {/* Cliente */}
                        <div className="flex items-center space-x-1 text-[11px] text-industrial-600 dark:text-industrial-400">
                          <Building className="w-3 h-3 text-timber-600 shrink-0" />
                          <span className="truncate">{wo.customerName}</span>
                        </div>

                        {/* Métricas de Madera y Horas */}
                        <div className="grid grid-cols-2 gap-1.5 bg-industrial-50 dark:bg-industrial-900/50 p-2 rounded-lg text-[10px] text-industrial-600 dark:text-industrial-300">
                          <div>
                            Madera: <b className="text-timber-800 dark:text-amber-300">{wo.estimatedBoardFeet} PT</b>
                          </div>
                          <div>
                            Horas: <b>{wo.actualHours} / {wo.estimatedHours}h</b>
                          </div>
                        </div>

                        {/* Responsable de Taller */}
                        {wo.assignedTo && (
                          <div className="flex items-center space-x-1 text-[10px] text-industrial-500">
                            <User className="w-3 h-3" />
                            <span>{wo.assignedTo}</span>
                          </div>
                        )}

                        {/* Footer con Acciones */}
                        <div className="flex items-center justify-between pt-2 border-t border-industrial-100 dark:border-industrial-800 text-[10px]">
                          <button
                            onClick={() => setSelectedOrderForPrint(wo)}
                            className="text-timber-700 dark:text-amber-400 hover:underline font-semibold flex items-center space-x-1"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Hoja de Taller</span>
                          </button>

                          <div className="flex items-center space-x-1">
                            {canGoPrev && (
                              <button
                                onClick={() => handleMoveStatus(wo.id, wo.status, "prev")}
                                className="p-1 rounded bg-industrial-100 dark:bg-industrial-800 hover:bg-industrial-200 text-industrial-600"
                                title="Retroceder estatus"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {canGoNext && (
                              <button
                                onClick={() => handleMoveStatus(wo.id, wo.status, "next")}
                                className="p-1 rounded bg-timber-100 dark:bg-timber-900/40 hover:bg-timber-200 text-timber-800 dark:text-amber-300"
                                title="Avanzar estatus"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {stageOrders.length === 0 && (
                    <div className="text-center py-8 text-industrial-400 text-xs italic">
                      Sin órdenes en este estatus
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL NUEVA ORDEN DE TRABAJO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
          <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-6">
            <div className="p-4 bg-timber-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Crear Nueva Orden de Trabajo (Taller)</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Título del Trabajo / Servicio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Fabricación de 40 Cajas de Exportación HT o Rehabilitación de Cama Baja"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Cliente *
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700"
                  >
                    <option value="">-- Seleccionar cliente --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.businessName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Nombre o Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Línea de Servicio
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => {
                      const st = e.target.value as keyof typeof SUBCATEGORIES;
                      setServiceType(st);
                      setSubcategory(SUBCATEGORIES[st][0].id);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700"
                  >
                    <option value="FABRICACION_INDUSTRIAL">Fabricación Industrial & Embalajes</option>
                    <option value="REPARACION_TRANSPORTE">Reparación de Transporte Pesado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Especialidad / Subcategoría
                  </label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700"
                  >
                    {SUBCATEGORIES[serviceType].map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Registro de Cumplimiento Fitosanitario NOM-144-SEMARNAT */}
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl space-y-2">
                <label className="flex items-center space-x-2 text-xs font-bold text-emerald-900 dark:text-emerald-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiresNom144}
                    onChange={(e) => setRequiresNom144(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Requiere Certificación NOM-144-SEMARNAT-2017 / NIMF 15 (Tratamiento Térmico HT)</span>
                </label>

                {requiresNom144 && (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block font-semibold">
                        Código de Lote de Tratamiento
                      </span>
                      <input
                        type="text"
                        value={nom144BatchCode}
                        onChange={(e) => setNom144BatchCode(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-industrial-900 border border-emerald-300 dark:border-emerald-700 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block font-semibold">
                        Sello Oficial Acreditado
                      </span>
                      <span className="font-mono text-xs font-bold text-emerald-900 dark:text-emerald-200 block pt-1">
                        MX-04-1234-SEMARNAT-HT
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Madera Asignada (PT)
                  </label>
                  <input
                    type="number"
                    value={estimatedBoardFeet}
                    onChange={(e) => setEstimatedBoardFeet(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Horas de Mano de Obra
                  </label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Precio Final Cotizado ($)
                  </label>
                  <input
                    type="number"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Maestro Carpintero / Soldador Responsable
                  </label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Descripción Técnica y Procedimiento
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles de ensamble, barrenado, pintura, herrajes especiales..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-industrial-100 dark:border-industrial-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-industrial-500 hover:text-industrial-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold bg-timber-700 hover:bg-timber-800 text-white rounded-xl shadow-md transition-all"
                >
                  {saving ? "Generando OT..." : "Crear Orden de Trabajo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HOJA DE TALLER IMPRIMIBLE (OPERARIOS & CALIDAD) */}
      {selectedOrderForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-industrial-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-4 print-card">
            {/* Header no-print */}
            <div className="p-3 bg-industrial-900 text-white flex items-center justify-between no-print">
              <span className="font-bold text-xs">
                Hoja de Fabricación y Control: {selectedOrderForPrint.orderNumber}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-timber-700 hover:bg-timber-800 text-white text-xs font-bold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir para Taller</span>
                </button>
                <button
                  onClick={() => setSelectedOrderForPrint(null)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Documento Físico */}
            <div className="p-8 space-y-6 text-xs text-industrial-900 bg-white">
              <div className="flex justify-between items-start border-b-2 border-industrial-800 pb-3">
                <div>
                  <h2 className="text-xl font-black font-display text-timber-900">
                    MADERAS LA CHOCA • ORDEN DE TALLER
                  </h2>
                  <p className="text-[11px] text-industrial-600">
                    Planta de Transformación y Aserradero • Carretera Villahermosa-Cárdenas Km 8.5
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-base text-timber-800 block">
                    {selectedOrderForPrint.orderNumber}
                  </span>
                  <span className="text-[10px] text-industrial-500 block">
                    Fecha: {formatDate(selectedOrderForPrint.createdAt)}
                  </span>
                </div>
              </div>

              {/* Distintivo NOM-144 */}
              {selectedOrderForPrint.requiresNom144 && (
                <div className="p-3 bg-emerald-50 border-2 border-dashed border-emerald-600 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-black text-emerald-900 text-sm block">
                      SELLO FITOSANITARIO OFICIAL REQUERIDO
                    </span>
                    <span className="text-[11px] text-emerald-800 block">
                      Norma Oficial Mexicana NOM-144-SEMARNAT-2017 / NIMF 15
                    </span>
                    <span className="font-mono text-xs text-emerald-900 font-bold block mt-0.5">
                      Lote HT: {selectedOrderForPrint.nom144BatchCode} • Registro: {selectedOrderForPrint.semarnatStampRegistry}
                    </span>
                  </div>
                  <div className="border-2 border-emerald-800 p-2 font-mono text-[10px] text-center font-black text-emerald-900">
                    <div>MX - 04</div>
                    <div className="border-t border-b border-emerald-800 py-0.5 my-0.5">SEMARNAT</div>
                    <div>HT - 2026</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 bg-industrial-50 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] font-bold text-industrial-400 block">Cliente:</span>
                  <span className="font-bold text-industrial-900 text-sm">{selectedOrderForPrint.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-industrial-400 block">Especialidad:</span>
                  <span className="font-bold text-industrial-900">{selectedOrderForPrint.subcategory}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-industrial-800 block mb-1">Descripción del Trabajo:</span>
                <p className="text-industrial-700 bg-industrial-50 p-2.5 rounded-lg border border-industrial-200">
                  {selectedOrderForPrint.title}
                  {selectedOrderForPrint.description && ` — ${selectedOrderForPrint.description}`}
                </p>
              </div>

              {/* Materiales asignados */}
              <div>
                <span className="font-bold text-industrial-800 block mb-1">Materiales Asignados de Almacén:</span>
                <table className="w-full text-left border-collapse border border-industrial-200">
                  <thead>
                    <tr className="bg-industrial-100 font-bold">
                      <th className="p-2 border border-industrial-200">Material / Insumo</th>
                      <th className="p-2 border border-industrial-200 text-center">Cantidad</th>
                      <th className="p-2 border border-industrial-200 text-center">Unidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderForPrint.materials?.map((m, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border border-industrial-200">{m.materialName}</td>
                        <td className="p-2 border border-industrial-200 text-center font-bold">{m.quantity}</td>
                        <td className="p-2 border border-industrial-200 text-center">{m.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Firmas de Control */}
              <div className="grid grid-cols-3 gap-4 pt-10 text-center text-[10px]">
                <div className="border-t border-industrial-400 pt-1">
                  <span className="font-bold block">Mtro. Roberto Morales</span>
                  <span>Jefe de Taller / Asignado</span>
                </div>
                <div className="border-t border-industrial-400 pt-1">
                  <span className="font-bold block">Control de Calidad & Higrometría</span>
                  <span>Humedad menor a 18%</span>
                </div>
                <div className="border-t border-industrial-400 pt-1">
                  <span className="font-bold block">Recepción de Almacén</span>
                  <span>Listo para Entrega</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

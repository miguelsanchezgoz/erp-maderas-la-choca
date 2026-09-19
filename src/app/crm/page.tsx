"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Phone,
  MessageSquare,
  DollarSign,
  Calendar,
  Sparkles,
  AlertCircle,
  Building,
  CheckCircle2,
  X,
  RefreshCw,
} from "lucide-react";
import { formatCurrency, formatStageLabel, formatDate } from "@/lib/formatters";
import { LeadType, CustomerType } from "@/types";

const STAGES = [
  { id: "NUEVO", name: "Nuevo Lead", color: "border-t-blue-500" },
  { id: "CONTACTADO", name: "Contactado", color: "border-t-purple-500" },
  { id: "POR_COTIZAR", name: "Por Cotizar", color: "border-t-amber-500" },
  { id: "COTIZADO", name: "Cotizado", color: "border-t-indigo-500" },
  { id: "EN_NEGOCIACION", name: "En Negociación", color: "border-t-cyan-500" },
  { id: "GANADO", name: "Ganado / Cerrado", color: "border-t-emerald-500" },
  { id: "PERDIDO", name: "Perdido", color: "border-t-rose-500" },
];

export default function CRMPage() {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("TODAS");

  // Modal Nuevo Prospecto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newPriority, setNewPriority] = useState<"BAJA" | "MEDIA" | "ALTA" | "URGENTE">("MEDIA");
  const [newNotes, setNewNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const [leadsRes, custRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/customers"),
      ]);
      const [leadsData, custData] = await Promise.all([
        leadsRes.json(),
        custRes.json(),
      ]);
      setLeads(leadsData);
      setCustomers(custData);
    } catch (err) {
      console.error("Error loading CRM:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleMoveStage = async (leadId: string, currentStage: string, direction: "prev" | "next") => {
    const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0 || newIndex >= STAGES.length) return;

    const nextStage = STAGES[newIndex].id;

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: nextStage as any } : l))
    );

    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, stage: nextStage }),
      });
    } catch (err) {
      console.error("Error updating lead stage:", err);
      fetchLeads();
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          customerId: selectedCustomerId || null,
          contactName: newContact,
          phone: newPhone,
          email: newEmail,
          estimatedValue: parseFloat(newValue) || 0,
          priority: newPriority,
          notes: newNotes,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewTitle("");
        setSelectedCustomerId("");
        setNewContact("");
        setNewPhone("");
        setNewEmail("");
        setNewValue("");
        setNewNotes("");
        fetchLeads();
      }
    } catch (err) {
      console.error("Error creating lead:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.customer?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      priorityFilter === "TODAS" || lead.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const totalPipeline = filteredLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
  const totalWon = filteredLeads
    .filter((l) => l.stage === "GANADO")
    .reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Métricas de Pipeline */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Pipeline Comercial & CRM
          </h1>
          <p className="text-xs text-industrial-500 dark:text-industrial-400">
            Embudo de ventas y cotizaciones para madera y servicios industriales
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2 rounded-xl border border-industrial-300 dark:border-industrial-700 bg-white dark:bg-industrial-800 text-industrial-700 dark:text-industrial-300 hover:bg-industrial-50 transition-all shadow-xs"
            title="Refrescar prospectos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-timber-700 to-timber-800 hover:from-timber-800 hover:to-timber-900 text-white text-xs font-bold shadow-md shadow-timber-900/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Prospecto</span>
          </button>
        </div>
      </div>

      {/* KPIs Rápidos del Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-industrial-500 uppercase tracking-wider block mb-1">
            Valor Total del Embudo
          </span>
          <span className="text-xl font-black text-industrial-900 dark:text-white font-mono">
            {formatCurrency(totalPipeline)}
          </span>
          <span className="text-[10px] text-industrial-400 block mt-1">
            {filteredLeads.length} oportunidades activas
          </span>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-emerald-200 dark:border-emerald-800/40 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
            Negocios Ganados / Cerrados
          </span>
          <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
            {formatCurrency(totalWon)}
          </span>
          <span className="text-[10px] text-emerald-600/80 block mt-1">
            Ventas concretadas en el ciclo
          </span>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
            Tasa de Cierre Estimada
          </span>
          <span className="text-xl font-black text-amber-700 dark:text-amber-300">
            {filteredLeads.length > 0
              ? `${Math.round((filteredLeads.filter((l) => l.stage === "GANADO").length / filteredLeads.length) * 100)}%`
              : "0%"}
          </span>
          <span className="text-[10px] text-amber-600/80 block mt-1">
            Efectividad en conversión
          </span>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-industrial-900 p-3 rounded-2xl border border-industrial-200 dark:border-industrial-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-industrial-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por título, cliente o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 rounded-xl focus:ring-2 focus:ring-timber-500 outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-industrial-400" />
          <span className="text-xs text-industrial-500">Prioridad:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-industrial-200 dark:border-industrial-700 bg-industrial-50 dark:bg-industrial-800 text-industrial-800 dark:text-industrial-200"
          >
            <option value="TODAS">Todas</option>
            <option value="URGENTE">Urgente</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
        </div>
      </div>

      {/* Tablero Kanban de CRM */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-4 min-w-[1400px] w-full">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
            const stageTotal = stageLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

            return (
              <div
                key={stage.id}
                className={`flex-1 min-w-[210px] bg-industrial-100/70 dark:bg-industrial-900/60 rounded-2xl border border-industrial-200 dark:border-industrial-800 flex flex-col max-h-[75vh] border-t-4 ${stage.color}`}
              >
                {/* Cabecera de Columna */}
                <div className="p-3 border-b border-industrial-200 dark:border-industrial-800 bg-white/60 dark:bg-industrial-900/60 rounded-t-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-industrial-900 dark:text-white block">
                      {stage.name}
                    </span>
                    <span className="text-[10px] font-mono text-industrial-500">
                      {formatCurrency(stageTotal)}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-industrial-200 dark:bg-industrial-800 text-industrial-700 dark:text-industrial-300">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Lista de Tarjetas */}
                <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1">
                  {stageLeads.map((lead) => {
                    const currentIndex = STAGES.findIndex((s) => s.id === stage.id);
                    const canGoPrev = currentIndex > 0;
                    const canGoNext = currentIndex < STAGES.length - 1;

                    return (
                      <div
                        key={lead.id}
                        className="bg-white dark:bg-industrial-850 p-3.5 rounded-xl border border-industrial-200 dark:border-industrial-700/80 shadow-xs hover:shadow-md hover:border-timber-400 dark:hover:border-timber-600 transition-all group"
                      >
                        {/* Header de la tarjeta */}
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                              lead.priority === "URGENTE"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300"
                                : lead.priority === "ALTA"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {lead.priority}
                          </span>

                          <span className="font-bold font-mono text-xs text-timber-700 dark:text-amber-400">
                            {formatCurrency(lead.estimatedValue)}
                          </span>
                        </div>

                        {/* Título de la oportunidad */}
                        <h4 className="text-xs font-bold text-industrial-900 dark:text-white leading-tight mb-2">
                          {lead.title}
                        </h4>

                        {/* Cliente asociado */}
                        {lead.customer && (
                          <div className="flex items-center space-x-1.5 text-[11px] text-industrial-600 dark:text-industrial-400 mb-2 font-medium">
                            <Building className="w-3 h-3 text-timber-600 flex-shrink-0" />
                            <span className="truncate">{lead.customer.businessName}</span>
                          </div>
                        )}

                        {/* Notas */}
                        {lead.notes && (
                          <p className="text-[10px] text-industrial-500 dark:text-industrial-400 line-clamp-2 bg-industrial-50 dark:bg-industrial-900/50 p-1.5 rounded-lg mb-2 italic">
                            "{lead.notes}"
                          </p>
                        )}

                        {/* Footer con Contacto y Acciones de Avance */}
                        <div className="flex items-center justify-between pt-2 border-t border-industrial-100 dark:border-industrial-800 text-[10px]">
                          <div className="flex items-center space-x-2">
                            {lead.phone && (
                              <a
                                href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                                title="Enviar WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </a>
                            )}
                            <span className="text-industrial-400">
                              {formatDate(lead.createdAt)}
                            </span>
                          </div>

                          {/* Botones de Cambio de Fase */}
                          <div className="flex items-center space-x-1">
                            {canGoPrev && (
                              <button
                                onClick={() => handleMoveStage(lead.id, lead.stage, "prev")}
                                className="p-1 rounded bg-industrial-100 dark:bg-industrial-800 hover:bg-industrial-200 text-industrial-600 dark:text-industrial-300"
                                title="Mover a etapa anterior"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {canGoNext && (
                              <button
                                onClick={() => handleMoveStage(lead.id, lead.stage, "next")}
                                className="p-1 rounded bg-timber-100 dark:bg-timber-900/40 hover:bg-timber-200 text-timber-800 dark:text-amber-300"
                                title="Avanzar a siguiente etapa"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-industrial-400 text-xs italic">
                      Sin prospectos en esta etapa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Nuevo Prospecto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 bg-timber-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Registrar Nuevo Prospecto / Cotización</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Título de la Oportunidad *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 30 Tarimas de Parota grado pesado para Dos Bocas"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Cliente Registrado (Opcional)
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 text-industrial-900 dark:text-white"
                >
                  <option value="">-- Seleccionar de la cartera --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.businessName} {c.commercialName ? `(${c.commercialName})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Valor Estimado (MXN)
                  </label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 text-industrial-900 dark:text-white"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Contacto Directo
                  </label>
                  <input
                    type="text"
                    placeholder="Ing. Encargado"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="993 123 4567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Notas Técnicas o Requerimientos de Madera
                </label>
                <textarea
                  rows={2}
                  placeholder="Especificaciones de espesor, especie requerida, si requiere sello NOM-144..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-industrial-100 dark:border-industrial-800">
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
                  {saving ? "Guardando..." : "Crear Oportunidad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

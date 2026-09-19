"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Truck,
  FileSpreadsheet,
  Hammer,
  KanbanSquare,
  X,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { formatFreightZone, formatDate } from "@/lib/formatters";
import { CustomerType } from "@/types";

interface ExtendedCustomer extends CustomerType {
  _count?: {
    leads: number;
    quotes: number;
    workOrders: number;
  };
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<ExtendedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState("TODAS");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [commercialName, setCommercialName] = useState("");
  const [rfc, setRfc] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [freightZone, setFreightZone] = useState("LOCAL_VILLAHERMOSA");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          commercialName,
          rfc,
          phone,
          whatsapp,
          email,
          contactPerson,
          deliveryAddress,
          freightZone,
          notes,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setBusinessName("");
        setCommercialName("");
        setRfc("");
        setPhone("");
        setWhatsapp("");
        setEmail("");
        setContactPerson("");
        setDeliveryAddress("");
        setNotes("");
        fetchCustomers();
      }
    } catch (err) {
      console.error("Error creating customer:", err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.commercialName && c.commercialName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.rfc && c.rfc.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesZone = zoneFilter === "TODAS" || c.freightZone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Directorio de Clientes & Logística
          </h1>
          <p className="text-xs text-industrial-500 dark:text-industrial-400">
            Cuentas comerciales, datos fiscales (RFC) y zonas de flete para Tabasco y el Sureste
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-timber-700 to-timber-800 hover:from-timber-800 hover:to-timber-900 text-white text-xs font-bold shadow-md shadow-timber-900/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-industrial-900 p-3 rounded-2xl border border-industrial-200 dark:border-industrial-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-industrial-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por razón social, nombre comercial, RFC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 rounded-xl focus:ring-2 focus:ring-timber-500 outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-industrial-500">Zona de Flete:</span>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-industrial-200 dark:border-industrial-700 bg-industrial-50 dark:bg-industrial-800 text-industrial-800 dark:text-industrial-200"
          >
            <option value="TODAS">Todas las Zonas</option>
            <option value="LOCAL_VILLAHERMOSA">Local Villahermosa</option>
            <option value="MUNICIPIO_TABASCO">Municipio de Tabasco</option>
            <option value="FORANEO">Foráneo / Sureste</option>
          </select>
        </div>
      </div>

      {/* Grid de Tarjetas de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            className="bg-white dark:bg-industrial-900 rounded-2xl border border-industrial-200 dark:border-industrial-800 p-5 shadow-xs hover:shadow-md hover:border-timber-300 dark:hover:border-industrial-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Cliente */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-timber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                  {customer.businessName.charAt(0)}
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-industrial-100 dark:bg-industrial-800 text-industrial-600 dark:text-industrial-300">
                  {formatFreightZone(customer.freightZone)}
                </span>
              </div>

              <h3 className="font-bold text-sm text-industrial-900 dark:text-white leading-tight mb-1">
                {customer.businessName}
              </h3>
              {customer.commercialName && (
                <span className="text-xs text-timber-700 dark:text-amber-400 font-semibold block mb-2">
                  {customer.commercialName}
                </span>
              )}

              {/* RFC y Contacto */}
              <div className="space-y-1.5 py-2 border-y border-industrial-100 dark:border-industrial-800 text-xs">
                {customer.rfc && (
                  <div className="flex items-center space-x-2 text-industrial-600 dark:text-industrial-300">
                    <span className="text-[10px] font-bold text-industrial-400">RFC:</span>
                    <span className="font-mono font-semibold">{customer.rfc}</span>
                  </div>
                )}

                {customer.contactPerson && (
                  <div className="flex items-center space-x-2 text-industrial-600 dark:text-industrial-300">
                    <span className="text-[10px] font-bold text-industrial-400">Contacto:</span>
                    <span>{customer.contactPerson}</span>
                  </div>
                )}

                {customer.deliveryAddress && (
                  <div className="flex items-start space-x-1.5 text-[11px] text-industrial-500 dark:text-industrial-400 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{customer.deliveryAddress}</span>
                  </div>
                )}
              </div>

              {/* Indicadores de Actividad */}
              <div className="flex items-center space-x-4 py-3 text-[11px] text-industrial-600 dark:text-industrial-400">
                <div className="flex items-center space-x-1">
                  <KanbanSquare className="w-3.5 h-3.5 text-blue-500" />
                  <span>{customer._count?.leads || 0} Leads</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
                  <span>{customer._count?.quotes || 0} Cotiz.</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Hammer className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{customer._count?.workOrders || 0} OTs</span>
                </div>
              </div>
            </div>

            {/* Footer con Acciones de Contacto */}
            <div className="flex items-center justify-between pt-3 border-t border-industrial-100 dark:border-industrial-800">
              <div className="flex items-center space-x-1.5">
                {customer.whatsapp && (
                  <a
                    href={`https://wa.me/${customer.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {customer.phone && (
                  <a
                    href={`tel:${customer.phone}`}
                    className="p-1.5 rounded-lg bg-industrial-100 dark:bg-industrial-800 text-industrial-600 dark:text-industrial-300 hover:bg-industrial-200"
                    title="Llamar"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}

                {customer.email && (
                  <a
                    href={`mailto:${customer.email}`}
                    className="p-1.5 rounded-lg bg-industrial-100 dark:bg-industrial-800 text-industrial-600 dark:text-industrial-300 hover:bg-industrial-200"
                    title="Enviar Correo"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <span className="text-[10px] text-industrial-400">
                Alta: {formatDate(customer.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Registrar Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-timber-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Registrar Nueva Cuenta de Cliente</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Razón Social (Oficial) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Perforadora Petrolera del Golfo S.A. de C.V."
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Nombre Comercial
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: PPG Servicios"
                    value={commercialName}
                    onChange={(e) => setCommercialName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    RFC Fiscal
                  </label>
                  <input
                    type="text"
                    placeholder="PPG180905M72"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Teléfono Fijo
                  </label>
                  <input
                    type="text"
                    placeholder="993 310 9800"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    WhatsApp (Cotizaciones)
                  </label>
                  <input
                    type="text"
                    placeholder="529933109800"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="ventas@cliente.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="Lic. Comprador / Ing. Residente"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Zona Logística de Flete
                  </label>
                  <select
                    value={freightZone}
                    onChange={(e) => setFreightZone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 text-industrial-900 dark:text-white"
                  >
                    <option value="LOCAL_VILLAHERMOSA">Local Villahermosa (Urbano)</option>
                    <option value="MUNICIPIO_TABASCO">Municipio de Tabasco (Dos Bocas / Cárdenas / etc.)</option>
                    <option value="FORANEO">Foráneo / Peninsular (Campeche, Chiapas, Ver.)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Dirección de Entrega / Nave / Patio
                </label>
                <input
                  type="text"
                  placeholder="Calle, Número, Parque Industrial, Municipio, Tabasco"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Notas Especiales
                </label>
                <textarea
                  rows={2}
                  placeholder="Requisitos de acceso a patio, si solicitan EPP para maniobras..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
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
                  {saving ? "Guardando..." : "Guardar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Plus,
  Search,
  Printer,
  MessageSquare,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Calculator,
  Trash2,
  Share2,
  X,
  FileCheck,
  Truck,
  Sparkles,
  Layers,
  Eye,
} from "lucide-react";
import { calculateLumber, estimateFreightCost } from "@/lib/lumber-calc";
import { formatCurrency, formatNumber, formatDate, formatFreightZone } from "@/lib/formatters";
import { QuoteType, WoodSpeciesType, CustomerType } from "@/types";

export default function CotizacionesPage() {
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [speciesList, setSpeciesList] = useState<WoodSpeciesType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedQuoteForView, setSelectedQuoteForView] = useState<QuoteType | null>(null);

  // Formulario Nueva Cotización
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [rfc, setRfc] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [freightZone, setFreightZone] = useState("LOCAL_VILLAHERMOSA");
  const [notes, setNotes] = useState("");
  const [validityDays, setValidityDays] = useState(15);
  const [deliveryTimeDays, setDeliveryTimeDays] = useState(7);
  const [paymentTerms, setPaymentTerms] = useState("50% Anticipo, 50% Contra entrega");

  // Partidas de madera
  const [items, setItems] = useState<any[]>([
    {
      woodSpeciesId: "",
      speciesName: "Maculis",
      thicknessInches: 2,
      widthInches: 8,
      lengthValue: 10,
      lengthUnit: "PIES",
      pieces: 10,
      unitPricePerPt: 88,
      cuttingService: false,
      planingService: "NINGUNO",
      dryingService: false,
    },
  ]);

  const [freightCost, setFreightCost] = useState(1200);
  const [discount, setDiscount] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [qRes, sRes, cRes] = await Promise.all([
        fetch("/api/quotes"),
        fetch("/api/species"),
        fetch("/api/customers"),
      ]);
      const [qData, sData, cData] = await Promise.all([
        qRes.json(),
        sRes.json(),
        cRes.json(),
      ]);
      setQuotes(qData);
      setSpeciesList(sData);
      setCustomers(cData);

      if (sData.length > 0 && items[0].woodSpeciesId === "") {
        const first = sData.find((s: any) => s.commonName === "Maculis") || sData[0];
        setItems([
          {
            woodSpeciesId: first.id,
            speciesName: first.commonName,
            thicknessInches: 2,
            widthInches: 8,
            lengthValue: 10,
            lengthUnit: "PIES",
            pieces: 10,
            unitPricePerPt: first.basePricePerPt,
            cuttingService: false,
            planingService: "NINGUNO",
            dryingService: false,
          },
        ]);
      }
    } catch (err) {
      console.error("Error loading quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manejo de cliente seleccionado
  const handleCustomerSelect = (custId: string) => {
    setSelectedCustomerId(custId);
    const found = customers.find((c) => c.id === custId);
    if (found) {
      setCustomerName(found.businessName);
      setRfc(found.rfc || "");
      setDeliveryAddress(found.deliveryAddress || "");
      setFreightZone(found.freightZone || "LOCAL_VILLAHERMOSA");
      setFreightCost(estimateFreightCost(found.freightZone, 1500));
    }
  };

  // Manejo de partidas
  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "woodSpeciesId") {
      const sp = speciesList.find((s) => s.id === value);
      if (sp) {
        updated[index].speciesName = sp.commonName;
        updated[index].unitPricePerPt = sp.basePricePerPt;
      }
    }

    setItems(updated);
  };

  const addItemRow = () => {
    const defaultSp = speciesList[0] || { id: "", commonName: "Pino", basePricePerPt: 48 };
    setItems([
      ...items,
      {
        woodSpeciesId: defaultSp.id,
        speciesName: defaultSp.commonName,
        thicknessInches: 1.5,
        widthInches: 6,
        lengthValue: 8,
        lengthUnit: "PIES",
        pieces: 10,
        unitPricePerPt: defaultSp.basePricePerPt,
        cuttingService: false,
        planingService: "NINGUNO",
        dryingService: false,
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Cálculo en vivo de todas las partidas
  const calculatedItems = items.map((item) => {
    const calc = calculateLumber({
      thicknessInches: item.thicknessInches,
      widthInches: item.widthInches,
      lengthValue: item.lengthValue,
      lengthUnit: item.lengthUnit,
      pieces: item.pieces,
      unitPricePerPt: item.unitPricePerPt,
      cuttingService: item.cuttingService,
      planingService: item.planingService,
      dryingService: item.dryingService,
    });

    return {
      ...item,
      ...calc,
    };
  });

  const totalPt = calculatedItems.reduce((acc, it) => acc + it.boardFeetTotal, 0);
  const totalM3 = calculatedItems.reduce((acc, it) => acc + it.cubicMetersTotal, 0);
  const subtotalWood = calculatedItems.reduce((acc, it) => acc + it.woodSubtotal, 0);
  const valueAddedTotal = calculatedItems.reduce((acc, it) => acc + it.valueAddedTotal, 0);
  const subtotalBeforeTax = Math.max(0, subtotalWood + valueAddedTotal + Number(freightCost) - Number(discount));
  const iva = Math.round(subtotalBeforeTax * 0.16 * 100) / 100;
  const grandTotal = Math.round((subtotalBeforeTax + iva) * 100) / 100;

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId || null,
          customerName,
          rfc,
          deliveryAddress,
          freightZone,
          items: calculatedItems,
          freightCost,
          discount,
          notes,
          validityDays,
          deliveryTimeDays,
          paymentTerms,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setIsCreateOpen(false);
        fetchData();
        setSelectedQuoteForView(created);
      }
    } catch (err) {
      console.error("Error creating quote:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    return (
      q.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.rfc && q.rfc.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Generador de mensaje para WhatsApp
  const generateWhatsAppLink = (quote: QuoteType) => {
    const text = `*COTIZACIÓN OFICIAL - MADERAS LA CHOCA*
Folio: *${quote.quoteNumber}*
Cliente: ${quote.customerName}
${quote.rfc ? `RFC: ${quote.rfc}\n` : ""}
*Partidas de Madera:*
${quote.items
  .map(
    (it, idx) =>
      `${idx + 1}. ${it.speciesName} (${it.thicknessInches}"×${it.widthInches}"×${it.lengthValue}${it.lengthUnit === "PIES" ? "ft" : "m"}) - ${it.pieces} pzas | ${formatNumber(it.boardFeetTotal)} PT -> ${formatCurrency(it.itemTotal)}`
  )
  .join("\n")}

*Subtotal:* ${formatCurrency(quote.subtotal)}
*IVA (16%):* ${formatCurrency(quote.iva)}
*TOTAL:* *${formatCurrency(quote.total)} MXN*

_Vigencia: ${quote.validityDays} días | Tiempo de entrega: ${quote.deliveryTimeDays} días hábiles_
_Villahermosa, Tabasco • Carretera Cárdenas Km 8.5_`;

    const phone = quote.customer?.whatsapp || process.env.NEXT_PUBLIC_COMPANY_WHATSAPP || "529931234567";
    return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Cotizaciones & Cubicaje Maderero
          </h1>
          <p className="text-xs text-industrial-500 dark:text-industrial-400">
            Cálculo oficial de Pies Tabla (PT) y metros cúbicos ($m^3$) para maderas tropicales y servicios de habilitado
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-timber-700 to-timber-800 hover:from-timber-800 hover:to-timber-900 text-white text-xs font-bold shadow-md shadow-timber-900/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Cotización con Cubicaje</span>
        </button>
      </div>

      {/* Buscador de Cotizaciones */}
      <div className="bg-white dark:bg-industrial-900 p-3 rounded-2xl border border-industrial-200 dark:border-industrial-800 flex items-center justify-between no-print">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-industrial-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por folio COT-, cliente, RFC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 rounded-xl focus:ring-2 focus:ring-timber-500 outline-hidden"
          />
        </div>
        <span className="text-xs text-industrial-500 hidden sm:block">
          {filteredQuotes.length} cotizaciones registradas
        </span>
      </div>

      {/* Lista de Cotizaciones Existentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
        {filteredQuotes.map((q) => (
          <div
            key={q.id}
            className="bg-white dark:bg-industrial-900 rounded-2xl border border-industrial-200 dark:border-industrial-800 p-5 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-black text-sm text-timber-800 dark:text-amber-400">
                  {q.quoteNumber}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  {q.status}
                </span>
              </div>

              <h3 className="font-bold text-sm text-industrial-900 dark:text-white leading-tight mb-1">
                {q.customerName}
              </h3>
              {q.rfc && (
                <span className="text-[11px] font-mono text-industrial-500 block mb-3">
                  RFC: {q.rfc}
                </span>
              )}

              {/* Partidas resumidas */}
              <div className="bg-industrial-50 dark:bg-industrial-800/60 rounded-xl p-2.5 space-y-1 text-xs mb-3">
                <span className="text-[10px] font-bold text-industrial-400 uppercase tracking-wider block">
                  Partidas ({q.items?.length || 0}):
                </span>
                {q.items?.slice(0, 2).map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-industrial-700 dark:text-industrial-300">
                    <span>
                      {it.pieces} pzas • {it.speciesName} ({it.thicknessInches}"×{it.widthInches}")
                    </span>
                    <span className="font-mono font-semibold">{formatNumber(it.boardFeetTotal)} PT</span>
                  </div>
                ))}
                {(q.items?.length || 0) > 2 && (
                  <span className="text-[10px] text-amber-600 italic block">
                    + {(q.items?.length || 0) - 2} partida(s) adicional(es)
                  </span>
                )}
              </div>

              {/* Importes */}
              <div className="flex items-end justify-between py-2 border-t border-industrial-100 dark:border-industrial-800">
                <div>
                  <span className="text-[10px] text-industrial-400 block">Total con IVA:</span>
                  <span className="text-lg font-black font-mono text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(q.total)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-industrial-400 block">
                    Flete: {formatFreightZone(q.freightZone)}
                  </span>
                  <span className="text-[10px] text-industrial-500">
                    {formatDate(q.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-between pt-3 border-t border-industrial-100 dark:border-industrial-800">
              <button
                onClick={() => setSelectedQuoteForView(q)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-industrial-100 dark:bg-industrial-800 hover:bg-industrial-200 text-industrial-800 dark:text-industrial-200 text-xs font-bold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver / Imprimir</span>
              </button>

              <a
                href={generateWhatsAppLink(q)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL / CREADOR DE COTIZACIÓN */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto no-print">
          <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-700 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden my-6 max-h-[95vh] flex flex-col">
            <div className="p-4 bg-gradient-to-r from-timber-800 via-timber-700 to-forest-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Calculator className="w-5 h-5 text-amber-300" />
                <h3 className="font-display font-bold text-base text-white">
                  Generador de Cotización Técnica con Cubicaje
                </h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuote} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Bloque 1: Datos del Cliente */}
              <div className="bg-industrial-50 dark:bg-industrial-800/50 p-4 rounded-2xl border border-industrial-200 dark:border-industrial-700 space-y-3">
                <span className="text-xs font-bold text-industrial-700 dark:text-industrial-300 uppercase tracking-wider block">
                  1. Datos Comerciales del Cliente
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                      Cargar Cliente Existente
                    </label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => handleCustomerSelect(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 text-industrial-900 dark:text-white"
                    >
                      <option value="">-- O capturar cliente nuevo --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.businessName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                      Razón Social / Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Empresa o Persona Física"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 text-industrial-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                      RFC Fiscal
                    </label>
                    <input
                      type="text"
                      placeholder="XAXX010101000"
                      value={rfc}
                      onChange={(e) => setRfc(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 font-mono text-industrial-900 dark:text-white uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                      Dirección de Entrega
                    </label>
                    <input
                      type="text"
                      placeholder="Calle, Parque Industrial, Municipio, Tabasco"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 text-industrial-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                      Zona de Flete
                    </label>
                    <select
                      value={freightZone}
                      onChange={(e) => {
                        setFreightZone(e.target.value);
                        setFreightCost(estimateFreightCost(e.target.value, 1500));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 text-industrial-900 dark:text-white"
                    >
                      <option value="LOCAL_VILLAHERMOSA">Local Villahermosa (Urbano)</option>
                      <option value="MUNICIPIO_TABASCO">Municipio de Tabasco (Dos Bocas, Cárdenas, etc.)</option>
                      <option value="FORANEO">Foráneo / Peninsular (Campeche, Chiapas, Ver.)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bloque 2: Partidas de Madera con Calculadora de Cubicaje */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-industrial-700 dark:text-industrial-300 uppercase tracking-wider block">
                      2. Partidas de Madera y Cubicaje (PT & m³)
                    </span>
                    <span className="text-[11px] text-industrial-500">
                      Grosor (pulg) × Ancho (pulg) × Largo (pies/metros) con cálculo automático
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 text-xs font-bold transition-all border border-amber-300 dark:border-amber-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Partida</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {calculatedItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-white dark:bg-industrial-850 border border-industrial-200 dark:border-industrial-750 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-industrial-100 dark:border-industrial-750 pb-2">
                        <span className="font-bold text-xs text-timber-800 dark:text-amber-400">
                          Partida #{index + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(index)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Eliminar partida"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Selectores de dimensiones y especie */}
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-industrial-500 mb-0.5">
                            Especie de Madera
                          </label>
                          <select
                            value={item.woodSpeciesId}
                            onChange={(e) => handleItemChange(index, "woodSpeciesId", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded-lg bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 font-semibold"
                          >
                            {speciesList.map((sp) => (
                              <option key={sp.id} value={sp.id}>
                                {sp.commonName} (${sp.basePricePerPt}/PT)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-industrial-500 mb-0.5">
                            Grosor (pulg)
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            value={item.thicknessInches}
                            onChange={(e) =>
                              handleItemChange(index, "thicknessInches", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2 py-1.5 text-xs rounded-lg bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-industrial-500 mb-0.5">
                            Ancho (pulg)
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            value={item.widthInches}
                            onChange={(e) =>
                              handleItemChange(index, "widthInches", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2 py-1.5 text-xs rounded-lg bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 font-bold"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-0.5">
                            <label className="text-[10px] font-bold text-industrial-500">Largo</label>
                            <button
                              type="button"
                              onClick={() =>
                                handleItemChange(
                                  index,
                                  "lengthUnit",
                                  item.lengthUnit === "PIES" ? "METROS" : "PIES"
                                )
                              }
                              className="text-[8px] font-bold text-amber-600 hover:underline"
                            >
                              {item.lengthUnit === "PIES" ? "Pies" : "Metros"}
                            </button>
                          </div>
                          <input
                            type="number"
                            step="0.5"
                            value={item.lengthValue}
                            onChange={(e) =>
                              handleItemChange(index, "lengthValue", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2 py-1.5 text-xs rounded-lg bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-industrial-500 mb-0.5">
                            Piezas
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.pieces}
                            onChange={(e) =>
                              handleItemChange(index, "pieces", parseInt(e.target.value) || 1)
                            }
                            className="w-full px-2 py-1.5 text-xs rounded-lg bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 font-bold"
                          />
                        </div>
                      </div>

                      {/* Servicios de valor agregado para esta partida */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-industrial-100 dark:border-industrial-800">
                        <label className="flex items-center space-x-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.cuttingService}
                            onChange={(e) => handleItemChange(index, "cuttingService", e.target.checked)}
                            className="rounded text-timber-600"
                          />
                          <span>Corte a medida (+$3.00/PT)</span>
                        </label>

                        <div className="flex items-center space-x-2 text-xs">
                          <span>Cepillado:</span>
                          <select
                            value={item.planingService}
                            onChange={(e) => handleItemChange(index, "planingService", e.target.value)}
                            className="text-xs p-1 rounded bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700"
                          >
                            <option value="NINGUNO">Ninguno</option>
                            <option value="DOS_CARAS">2 Caras ($4/PT)</option>
                            <option value="CUATRO_CARAS">4 Caras ($7.50/PT)</option>
                          </select>
                        </div>

                        <label className="flex items-center space-x-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.dryingService}
                            onChange={(e) => handleItemChange(index, "dryingService", e.target.checked)}
                            className="rounded text-timber-600"
                          />
                          <span>Estufado / Secado (+$6.00/PT)</span>
                        </label>
                      </div>

                      {/* Resultados de la partida */}
                      <div className="bg-amber-500/5 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/40 flex flex-wrap items-center justify-between text-xs">
                        <div className="flex items-center space-x-4">
                          <span>
                            PT Unitario: <b>{formatNumber(item.boardFeetPerPiece)}</b>
                          </span>
                          <span>
                            PT Total: <b className="text-timber-800 dark:text-amber-300">{formatNumber(item.boardFeetTotal)} PT</b>
                          </span>
                          <span>
                            Volumen: <b className="text-forest-700 dark:text-forest-400 font-mono">{formatNumber(item.cubicMetersTotal, 4)} m³</b>
                          </span>
                        </div>
                        <div>
                          Subtotal Partida:{" "}
                          <span className="font-mono font-black text-sm text-industrial-900 dark:text-white">
                            {formatCurrency(item.itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloque 3: Resumen Financiero, Flete y Totales */}
              <div className="bg-industrial-50 dark:bg-industrial-800/60 p-4 rounded-2xl border border-industrial-200 dark:border-industrial-700 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                      Costo de Flete / Logística ($ MXN)
                    </label>
                    <input
                      type="number"
                      value={freightCost}
                      onChange={(e) => setFreightCost(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                      Descuento Comercial ($ MXN)
                    </label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                      Condiciones de Pago
                    </label>
                    <input
                      type="text"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-600 dark:text-industrial-400 mb-1">
                    Notas y Observaciones de la Cotización
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Certificaciones incluidas (NOM-144), tolerancias de corte, LAB planta Villahermosa..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-industrial-900 border border-industrial-300 dark:border-industrial-700"
                  />
                </div>

                {/* Gran Total */}
                <div className="border-t border-industrial-200 dark:border-industrial-700 pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-industrial-500 space-y-0.5">
                    <div>
                      Total Volumen Cubicado: <b className="text-timber-800 dark:text-amber-400">{formatNumber(totalPt)} PT</b> ({formatNumber(totalM3, 4)} m³)
                    </div>
                    <div>
                      Madera en Bruto: {formatCurrency(subtotalWood)} • Servicios Agregados: {formatCurrency(valueAddedTotal)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-industrial-500">
                      Subtotal: {formatCurrency(subtotalBeforeTax)} | IVA (16%): {formatCurrency(iva)}
                    </div>
                    <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(grandTotal)} MXN
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-industrial-200 dark:border-industrial-700">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-industrial-600 hover:text-industrial-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-bold bg-timber-700 hover:bg-timber-800 text-white rounded-xl shadow-lg shadow-timber-900/20 transition-all"
                >
                  {saving ? "Generando Folio..." : "Guardar & Generar Cotización"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VISTA MEMBRETADA IMPRIMIBLE (LISTA PARA PDF / WHATSAPP) */}
      {selectedQuoteForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-industrial-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-4 flex flex-col print-card">
            {/* Barra de Acciones Superior (Oculta al imprimir) */}
            <div className="p-3 bg-industrial-900 text-white flex items-center justify-between no-print">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs">
                  Vista Oficial de Cotización: {selectedQuoteForView.quoteNumber}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-timber-700 hover:bg-timber-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
                <a
                  href={generateWhatsAppLink(selectedQuoteForView)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enviar por WhatsApp</span>
                </a>
                <button
                  onClick={() => setSelectedQuoteForView(null)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CUERPO DEL DOCUMENTO MEMBRETADO */}
            <div className="p-8 space-y-6 text-industrial-900 bg-white">
              {/* Membrete Oficial */}
              <div className="flex justify-between items-start border-b-2 border-timber-700 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl font-black font-display text-timber-900 tracking-tight">
                      MADERAS <span className="text-forest-700">LA CHOCA</span>
                    </span>
                  </div>
                  <p className="text-xs font-bold text-industrial-700">
                    Maderas La Choca S.A. de C.V. • RFC: {process.env.NEXT_PUBLIC_COMPANY_RFC || "MLC210815AB3"}
                  </p>
                  <p className="text-[11px] text-industrial-600 max-w-sm">
                    Carretera Villahermosa - Cárdenas Km 8.5, Villahermosa, Tabasco
                  </p>
                  <p className="text-[11px] text-industrial-600">
                    Tel: {process.env.NEXT_PUBLIC_COMPANY_PHONE || "+52 993 123 4567"} • Email: ventas@maderaslachoca.com
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Acreditación SEMARNAT NOM-144-SEMARNAT-2017 (Tratamiento Térmico HT)
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-industrial-400 block uppercase tracking-wider">
                    Cotización Técnica
                  </span>
                  <span className="text-xl font-black font-mono text-timber-800 block">
                    {selectedQuoteForView.quoteNumber}
                  </span>
                  <span className="text-xs text-industrial-600 block mt-1">
                    Fecha: <b>{formatDate(selectedQuoteForView.createdAt)}</b>
                  </span>
                  <span className="text-xs text-industrial-600 block">
                    Vigencia: <b>{selectedQuoteForView.validityDays} días naturales</b>
                  </span>
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="grid grid-cols-2 gap-4 bg-industrial-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] font-bold text-industrial-400 uppercase tracking-wider block">
                    Cliente / Razón Social:
                  </span>
                  <span className="text-sm font-bold text-industrial-900 block">
                    {selectedQuoteForView.customerName}
                  </span>
                  {selectedQuoteForView.rfc && (
                    <span className="font-mono text-industrial-700 block">
                      RFC: {selectedQuoteForView.rfc}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-industrial-400 uppercase tracking-wider block">
                    Destino / Flete:
                  </span>
                  <span className="text-xs font-semibold text-industrial-800 block">
                    {formatFreightZone(selectedQuoteForView.freightZone)}
                  </span>
                  {selectedQuoteForView.deliveryAddress && (
                    <span className="text-[11px] text-industrial-600 block mt-0.5">
                      {selectedQuoteForView.deliveryAddress}
                    </span>
                  )}
                </div>
              </div>

              {/* Tabla Técnica de Partidas */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-timber-800 text-white font-bold">
                      <th className="p-2.5 rounded-tl-lg">Partida / Especie</th>
                      <th className="p-2.5">Medidas (Esp × Ancho × Largo)</th>
                      <th className="p-2.5 text-center">Pzas</th>
                      <th className="p-2.5 text-right">Pies Tabla</th>
                      <th className="p-2.5 text-right">Volumen ($m^3$)</th>
                      <th className="p-2.5">Acabados / Servicios</th>
                      <th className="p-2.5 text-right rounded-tr-lg">Importe MXN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-industrial-200">
                    {selectedQuoteForView.items?.map((it, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-industrial-50/50"}>
                        <td className="p-2.5 font-bold text-industrial-900">
                          {it.speciesName}
                        </td>
                        <td className="p-2.5 font-mono">
                          {it.thicknessInches}" × {it.widthInches}" × {it.lengthValue} {it.lengthUnit.toLowerCase()}
                        </td>
                        <td className="p-2.5 text-center font-bold">{it.pieces}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-timber-800">
                          {formatNumber(it.boardFeetTotal)} PT
                        </td>
                        <td className="p-2.5 text-right font-mono text-forest-700">
                          {formatNumber(it.cubicMetersTotal, 4)}
                        </td>
                        <td className="p-2.5 text-[11px] text-industrial-600">
                          {[
                            it.cuttingService ? "Corte" : null,
                            it.planingService !== "NINGUNO" ? `Cep. ${it.planingService === "DOS_CARAS" ? "2C" : "4C"}` : null,
                            it.dryingService ? "Estufado" : null,
                          ]
                            .filter(Boolean)
                            .join(", ") || "En bruto"}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-industrial-900">
                          {formatCurrency(it.itemTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales y Notas */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-industrial-50 rounded-xl border border-industrial-200">
                    <span className="font-bold block text-industrial-800 mb-1">
                      Condiciones Comerciales:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-industrial-600 space-y-0.5">
                      <li>Condición de pago: {selectedQuoteForView.paymentTerms}</li>
                      <li>Tiempo estimado de entrega: {selectedQuoteForView.deliveryTimeDays} días hábiles.</li>
                      <li>Precios sujetos a cambio sin previo aviso al vencer la vigencia.</li>
                      <li>Madera tratada y cubicada bajo normas oficiales mexicanas.</li>
                    </ul>
                  </div>

                  {selectedQuoteForView.notes && (
                    <div className="text-[11px] text-industrial-600 italic">
                      <b>Observaciones:</b> {selectedQuoteForView.notes}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-right">
                  <div className="flex justify-between py-1 border-b border-industrial-200">
                    <span className="text-industrial-600">Subtotal Madera & Servicios:</span>
                    <span className="font-mono font-semibold">
                      {formatCurrency(selectedQuoteForView.subtotalWood + selectedQuoteForView.valueAddedTotal)}
                    </span>
                  </div>

                  {selectedQuoteForView.freightCost > 0 && (
                    <div className="flex justify-between py-1 border-b border-industrial-200">
                      <span className="text-industrial-600">Flete Logístico:</span>
                      <span className="font-mono font-semibold">
                        {formatCurrency(selectedQuoteForView.freightCost)}
                      </span>
                    </div>
                  )}

                  {selectedQuoteForView.discount > 0 && (
                    <div className="flex justify-between py-1 border-b border-industrial-200 text-rose-600">
                      <span>Descuento:</span>
                      <span className="font-mono font-semibold">
                        -{formatCurrency(selectedQuoteForView.discount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-industrial-200">
                    <span className="text-industrial-600">Subtotal antes de IVA:</span>
                    <span className="font-mono font-semibold">
                      {formatCurrency(selectedQuoteForView.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-industrial-200">
                    <span className="text-industrial-600">I.V.A. (16%):</span>
                    <span className="font-mono font-semibold">
                      {formatCurrency(selectedQuoteForView.iva)}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-t-2 border-timber-800 text-sm">
                    <span className="font-bold text-industrial-900">TOTAL:</span>
                    <span className="font-mono font-black text-lg text-timber-900">
                      {formatCurrency(selectedQuoteForView.total)} MXN
                    </span>
                  </div>
                </div>
              </div>

              {/* Firmas de Conformidad */}
              <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs">
                <div>
                  <div className="border-t border-industrial-400 w-48 mx-auto pt-1 font-bold text-industrial-800">
                    Lic. Sofía Valencia
                  </div>
                  <span className="text-[10px] text-industrial-500">Maderas La Choca S.A. de C.V.</span>
                </div>

                <div>
                  <div className="border-t border-industrial-400 w-48 mx-auto pt-1 font-bold text-industrial-800">
                    Firma de Aceptación del Cliente
                  </div>
                  <span className="text-[10px] text-industrial-500">{selectedQuoteForView.customerName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  History,
  Layers,
  Sparkles,
  Boxes,
  MapPin,
  CheckCircle,
  X,
  RotateCcw,
} from "lucide-react";
import { formatCurrency, formatNumber, formatDate } from "@/lib/formatters";
import { InventoryItemType, StockMovementType } from "@/types";

const CATEGORIES = [
  { id: "TODAS", label: "Todas las Categorías" },
  { id: "MADERA_BRUTO", label: "Madera en Bruto (PT / Tablones)" },
  { id: "MADERA_PROCESADA", label: "Madera Procesada / Habilitada" },
  { id: "INSUMOS_TALLER", label: "Insumos & Ferretería de Taller" },
  { id: "SUBPRODUCTOS", label: "Subproductos (Viruta & Aserrín)" },
];

export default function InventarioPage() {
  const [items, setItems] = useState<InventoryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODAS");

  // Modales
  const [selectedItemForMovement, setSelectedItemForMovement] = useState<InventoryItemType | null>(null);
  const [movementType, setMovementType] = useState("ENTRADA_COMPRA");
  const [quantity, setQuantity] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleRegisterMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForMovement || !quantity) return;

    setSaving(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventoryItemId: selectedItemForMovement.id,
          type: movementType,
          quantity: parseFloat(quantity),
          referenceNumber,
          notes,
          recordedBy: "Ignacio Pérez Chablé",
        }),
      });

      if (res.ok) {
        setSelectedItemForMovement(null);
        setQuantity("");
        setReferenceNumber("");
        setNotes("");
        fetchInventory();
      }
    } catch (err) {
      console.error("Error registering stock movement:", err);
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.locationInYard && item.locationInYard.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "TODAS" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = items.filter((i) => i.currentStock <= i.minimumStock);
  const totalWoodPt = items
    .filter((i) => i.unit === "PT")
    .reduce((acc, i) => acc + i.currentStock, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Control de Inventario & Patio de Trozas
          </h1>
          <p className="text-xs text-industrial-500 dark:text-industrial-400">
            Existencias de madera en bruto, procesada, insumos de taller y subproductos (aserrín/viruta)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {lowStockItems.length > 0 && (
            <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>{lowStockItems.length} artículos en stock crítico</span>
            </span>
          )}
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-industrial-500 uppercase tracking-wider block mb-1">
            Volumen Total en Patio
          </span>
          <span className="text-xl font-black text-timber-800 dark:text-amber-400 font-mono">
            {formatNumber(totalWoodPt)} PT
          </span>
          <span className="text-[10px] text-industrial-400 block mt-1">
            ≈ {formatNumber(totalWoodPt * 0.00235974, 2)} m³ de madera
          </span>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-industrial-500 uppercase tracking-wider block mb-1">
            Catálogo de Artículos
          </span>
          <span className="text-xl font-black text-industrial-900 dark:text-white">
            {items.length} SKUs
          </span>
          <span className="text-[10px] text-industrial-400 block mt-1">
            Clasificados en 4 categorías
          </span>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
            Subproductos en Silo
          </span>
          <span className="text-xl font-black text-amber-700 dark:text-amber-300">
            {items.filter((i) => i.category === "SUBPRODUCTOS").length} Líneas
          </span>
          <span className="text-[10px] text-amber-600/80 block mt-1">
            Viruta para granjas & Aserrín
          </span>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-emerald-200 dark:border-emerald-800/40 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
            Valor Estimado de Patio
          </span>
          <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
            {formatCurrency(
              items.reduce((acc, it) => acc + it.currentStock * it.costPrice, 0)
            )}
          </span>
          <span className="text-[10px] text-emerald-600/80 block mt-1">
            Costo de inventario valorizado
          </span>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-industrial-900 p-3 rounded-2xl border border-industrial-200 dark:border-industrial-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-industrial-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por SKU, madera, nave, patio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 rounded-xl focus:ring-2 focus:ring-timber-500 outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-industrial-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-industrial-200 dark:border-industrial-700 bg-industrial-50 dark:bg-industrial-800 text-industrial-800 dark:text-industrial-200 font-medium"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white dark:bg-industrial-900 rounded-2xl border border-industrial-200 dark:border-industrial-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-industrial-100/70 dark:bg-industrial-800/70 text-industrial-700 dark:text-industrial-300 font-bold border-b border-industrial-200 dark:border-industrial-800">
                <th className="p-3.5">SKU / Identificador</th>
                <th className="p-3.5">Descripción del Material</th>
                <th className="p-3.5">Categoría</th>
                <th className="p-3.5">Ubicación en Patio</th>
                <th className="p-3.5 text-right">Existencia Actual</th>
                <th className="p-3.5 text-right">Mínimo</th>
                <th className="p-3.5 text-right">Precio Costo / Venta</th>
                <th className="p-3.5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-100 dark:divide-industrial-800">
              {filteredItems.map((item) => {
                const isCritical = item.currentStock <= item.minimumStock;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-industrial-50 dark:hover:bg-industrial-850/50 transition-colors"
                  >
                    <td className="p-3.5 font-mono font-bold text-industrial-900 dark:text-white">
                      {item.sku}
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-industrial-900 dark:text-white">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-industrial-500 line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-industrial-100 dark:bg-industrial-800 text-industrial-700 dark:text-industrial-300">
                        {item.category.replace("_", " ")}
                      </span>
                    </td>

                    <td className="p-3.5 text-industrial-600 dark:text-industrial-400">
                      <div className="flex items-center space-x-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-timber-600" />
                        <span>{item.locationInYard || "Patio General"}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-right font-mono">
                      <span
                        className={`font-black text-sm ${
                          isCritical
                            ? "text-rose-600 dark:text-rose-400 font-black"
                            : "text-industrial-900 dark:text-white"
                        }`}
                      >
                        {formatNumber(item.currentStock)} {item.unit}
                      </span>
                      {isCritical && (
                        <span className="block text-[9px] text-rose-500 font-bold uppercase">
                          ¡Bajo Mínimo!
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right font-mono text-industrial-500 text-[11px]">
                      {formatNumber(item.minimumStock)} {item.unit}
                    </td>

                    <td className="p-3.5 text-right font-mono text-[11px]">
                      <div>C: {formatCurrency(item.costPrice)}</div>
                      <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                        V: {formatCurrency(item.salePrice)}
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedItemForMovement(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 text-xs font-bold transition-colors border border-amber-300 dark:border-amber-800"
                      >
                        Movimiento
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRAR MOVIMIENTO (ENTRADAS / SALIDAS / MERMAS) */}
      {selectedItemForMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 bg-timber-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Registrar Movimiento de Inventario</h3>
                <p className="text-xs text-amber-200 font-mono">
                  {selectedItemForMovement.sku} • {selectedItemForMovement.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedItemForMovement(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterMovement} className="p-6 space-y-4">
              <div className="p-3 bg-industrial-50 dark:bg-industrial-800/60 rounded-xl flex justify-between items-center text-xs">
                <span className="text-industrial-600 dark:text-industrial-400 font-medium">
                  Existencia Actual en Patio:
                </span>
                <span className="font-mono font-black text-sm text-industrial-900 dark:text-white">
                  {formatNumber(selectedItemForMovement.currentStock)} {selectedItemForMovement.unit}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Tipo de Movimiento *
                </label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 font-semibold text-industrial-900 dark:text-white"
                >
                  <optgroup label="Entradas (+)">
                    <option value="ENTRADA_RECEPCION_TROZA">Recepción de Trozas / Madera en Patio</option>
                    <option value="ENTRADA_COMPRA">Compra a Proveedor con Factura</option>
                  </optgroup>
                  <optgroup label="Salidas (-)">
                    <option value="SALIDA_VENTA">Salida por Venta Directa</option>
                    <option value="SALIDA_TALLER">Salida a Taller de Fabricación / Reparación</option>
                    <option value="MERMA_ASERRADERO">Merma de Aserradero / Desecho de Corte</option>
                  </optgroup>
                  <optgroup label="Ajustes">
                    <option value="AJUSTE_INVENTARIO">Ajuste Manual por Auditoría Física</option>
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Cantidad ({selectedItemForMovement.unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ej: 500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 font-bold focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Folio / Documento de Referencia
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: FAC-9821 / OT-0102"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Motivo / Observaciones del Movimiento
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles del lote, reporte de merma por nudos o rajaduras..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-industrial-100 dark:border-industrial-800">
                <button
                  type="button"
                  onClick={() => setSelectedItemForMovement(null)}
                  className="px-4 py-2 text-xs font-semibold text-industrial-500 hover:text-industrial-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-timber-700 hover:bg-timber-800 text-white rounded-xl shadow-md transition-all"
                >
                  {saving ? "Procesando..." : "Aplicar Movimiento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

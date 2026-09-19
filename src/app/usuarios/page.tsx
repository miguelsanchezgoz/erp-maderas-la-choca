"use client";

import React, { useState, useEffect } from "react";
import {
  UserCog,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  X,
  Shield,
  Briefcase,
  Users,
  Sparkles,
  UserCheck,
  UserX,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { UserType, UserRole, UserStatus } from "@/types";
import { useRole } from "@/components/navigation/RoleContext";

const ROLES_LIST: { id: UserRole; name: string; description: string; color: string }[] = [
  {
    id: "ADMIN",
    name: "Administrador / Dirección",
    description: "Acceso total al sistema, reportes ejecutivos, catálogo y personal.",
    color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
  },
  {
    id: "VENTAS",
    name: "Asesor de Ventas & CRM",
    description: "Gestión de prospectos, clientes, cotizaciones y calculadora de cubicaje.",
    color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  },
  {
    id: "TALLER",
    name: "Jefe de Taller & OTs",
    description: "Órdenes de trabajo, transportes pesados, habilitado y sello NOM-144 HT.",
    color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  },
  {
    id: "ALMACEN",
    name: "Encargado de Patio & Almacén",
    description: "Control de stock en patio de trozas, insumos, subproductos y movimientos.",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  },
];

export default function UsuariosPage() {
  const { refreshUsers, currentUser } = useRole();
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("TODOS");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");

  // Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  // Formulario Crear Colaborador
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("VENTAS");
  const [status, setStatus] = useState<UserStatus>("ACTIVO");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error("Error al cargar colaboradores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role,
          status,
        }),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        setName("");
        setEmail("");
        setPhone("");
        setRole("VENTAS");
        setStatus("ACTIVO");
        await fetchStaff();
        await refreshUsers();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Error al registrar colaborador");
      }
    } catch (err) {
      setErrorMsg("Error de conexión al servidor");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone,
          role: editingUser.role,
          status: editingUser.status,
        }),
      });

      if (res.ok) {
        setEditingUser(null);
        await fetchStaff();
        await refreshUsers();
      }
    } catch (err) {
      console.error("Error al actualizar colaborador:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user: UserType) => {
    const nextStatus: UserStatus = user.status === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    // Optimistic update
    setUsersList((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );

    try {
      await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      await refreshUsers();
    } catch (err) {
      console.error("Error toggling status:", err);
      fetchStaff();
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchesRole = roleFilter === "TODOS" || u.role === roleFilter;
    const matchesStatus = statusFilter === "TODOS" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = usersList.filter((u) => u.status === "ACTIVO").length;
  const inactiveCount = usersList.filter((u) => u.status === "INACTIVO").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-industrial-900 dark:text-white tracking-tight">
            Personal & Administración de Usuarios
          </h1>
          <p className="text-xs text-industrial-500 dark:text-industrial-400">
            Gestión de colaboradores de Maderas La Choca, asignación de roles operativos y control de acceso
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStaff}
            disabled={loading}
            className="p-2 rounded-xl border border-industrial-300 dark:border-industrial-700 bg-white dark:bg-industrial-800 text-industrial-700 dark:text-industrial-300 hover:bg-industrial-50 transition-all shadow-xs"
            title="Refrescar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-timber-700 to-timber-800 hover:from-timber-800 hover:to-timber-900 text-white text-xs font-bold shadow-md shadow-timber-900/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Colaborador</span>
          </button>
        </div>
      </div>

      {/* Métricas de Equipo */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-800 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-industrial-500 uppercase tracking-wider">
              Total de Colaboradores
            </span>
            <Users className="w-4 h-4 text-timber-600" />
          </div>
          <span className="text-2xl font-black text-industrial-900 dark:text-white">
            {usersList.length}
          </span>
          <span className="text-[10px] text-industrial-400 block mt-1">
            Plantilla registrada en planta
          </span>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-emerald-200 dark:border-emerald-800/40 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Colaboradores Activos
            </span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
            {activeCount}
          </span>
          <span className="text-[10px] text-emerald-600/80 block mt-1">
            Con acceso habilitado al sistema
          </span>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-industrial-500 uppercase tracking-wider">
              Cuentas Inactivas
            </span>
            <UserX className="w-4 h-4 text-industrial-400" />
          </div>
          <span className="text-2xl font-black text-industrial-700 dark:text-industrial-300">
            {inactiveCount}
          </span>
          <span className="text-[10px] text-industrial-400 block mt-1">
            Bajas temporales o suspendidos
          </span>
        </div>

        <div className="bg-white dark:bg-industrial-900 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Roles en Operación
            </span>
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-700 dark:text-amber-300">
            4 Departamentos
          </span>
          <span className="text-[10px] text-amber-600/80 block mt-1">
            Admin, Ventas, Taller, Almacén
          </span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-industrial-900 p-3 rounded-2xl border border-industrial-200 dark:border-industrial-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-industrial-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-industrial-50 dark:bg-industrial-800 border border-industrial-200 dark:border-industrial-700 rounded-xl focus:ring-2 focus:ring-timber-500 outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-industrial-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-industrial-200 dark:border-industrial-700 bg-industrial-50 dark:bg-industrial-800 text-industrial-800 dark:text-industrial-200 font-medium"
          >
            <option value="TODOS">Todos los Roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="VENTAS">Asesor de Ventas</option>
            <option value="TALLER">Jefe de Taller</option>
            <option value="ALMACEN">Encargado de Almacén</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-industrial-200 dark:border-industrial-700 bg-industrial-50 dark:bg-industrial-800 text-industrial-800 dark:text-industrial-200 font-medium"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Tabla Moderna de Personal */}
      <div className="bg-white dark:bg-industrial-900 rounded-2xl border border-industrial-200 dark:border-industrial-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-industrial-100/70 dark:bg-industrial-800/70 text-industrial-700 dark:text-industrial-300 font-bold border-b border-industrial-200 dark:border-industrial-800">
                <th className="p-3.5">Colaborador / Nombre</th>
                <th className="p-3.5">Correo / Usuario</th>
                <th className="p-3.5">Teléfono Directo</th>
                <th className="p-3.5">Rol de Sistema</th>
                <th className="p-3.5 text-center">Estado</th>
                <th className="p-3.5 text-right">Fecha de Alta</th>
                <th className="p-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-100 dark:divide-industrial-800">
              {filteredUsers.map((user) => {
                const isCurrent = currentUser?.id === user.id;
                const roleConfig = ROLES_LIST.find((r) => r.id === user.role);

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-industrial-50 dark:hover:bg-industrial-850/50 transition-colors"
                  >
                    {/* Colaborador */}
                    <td className="p-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-timber-600 to-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-industrial-900 dark:text-white block">
                            {user.name}
                          </span>
                          {isCurrent && (
                            <span className="inline-block text-[9px] font-bold text-timber-700 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/40 px-1.5 rounded">
                              Tú (Sesión actual)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Correo */}
                    <td className="p-3.5 font-mono text-industrial-600 dark:text-industrial-400">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-industrial-400 shrink-0" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Teléfono */}
                    <td className="p-3.5 text-industrial-600 dark:text-industrial-400">
                      {user.phone ? (
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-timber-600 shrink-0" />
                          <span>{user.phone}</span>
                          <a
                            href={`https://wa.me/${user.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100"
                            title="WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-industrial-400 italic">No asignado</span>
                      )}
                    </td>

                    {/* Rol */}
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          roleConfig?.color || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Estado Interactivo */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        type="button"
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center space-x-1 mx-auto ${
                          user.status === "ACTIVO"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}
                        title="Clic para cambiar estatus"
                      >
                        {user.status === "ACTIVO" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Activo</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Inactivo</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Fecha */}
                    <td className="p-3.5 text-right font-mono text-industrial-400 text-[11px]">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Acciones */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-1.5 rounded-lg bg-industrial-100 dark:bg-industrial-800 hover:bg-timber-100 dark:hover:bg-amber-950/40 text-industrial-700 dark:text-industrial-300 hover:text-timber-800 transition-colors"
                        title="Editar colaborador"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xs text-industrial-400 italic">
                    No se encontraron colaboradores con los filtros especificados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRAR NUEVO COLABORADOR */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 bg-timber-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCog className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Registrar Nuevo Colaborador</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ing. Fernando Morales"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Correo Electrónico / Usuario *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="fmorales@maderaslachoca.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Teléfono Directo / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="993 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Rol Operativo en ERP *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 font-bold"
                  >
                    <option value="ADMIN">ADMIN - Dirección General</option>
                    <option value="VENTAS">VENTAS - Asesor Comercial & Cubicaje</option>
                    <option value="TALLER">TALLER - Jefe de Taller & OTs</option>
                    <option value="ALMACEN">ALMACEN - Patio & Inventarios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Estado Inicial
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UserStatus)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 font-bold"
                  >
                    <option value="ACTIVO">Activo (Habilitado)</option>
                    <option value="INACTIVO">Inactivo (Suspendido)</option>
                  </select>
                </div>
              </div>

              {/* Explicación del Rol Seleccionado */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-300/50 dark:border-amber-700/50 text-[11px] text-industrial-700 dark:text-amber-200">
                <span className="font-bold block mb-0.5">
                  Permisos del Rol: {ROLES_LIST.find((r) => r.id === role)?.name}
                </span>
                <p>{ROLES_LIST.find((r) => r.id === role)?.description}</p>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-industrial-100 dark:border-industrial-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-industrial-500 hover:text-industrial-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-timber-700 hover:bg-timber-800 text-white rounded-xl shadow-md transition-all"
                >
                  {saving ? "Registrando..." : "Guardar Colaborador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR COLABORADOR */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-industrial-900 border border-industrial-200 dark:border-industrial-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 bg-timber-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Editar Datos del Colaborador</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Teléfono Directo / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 focus:ring-2 focus:ring-timber-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Rol Operativo
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 font-bold"
                  >
                    <option value="ADMIN">ADMIN - Dirección General</option>
                    <option value="VENTAS">VENTAS - Asesor Comercial & Cubicaje</option>
                    <option value="TALLER">TALLER - Jefe de Taller & OTs</option>
                    <option value="ALMACEN">ALMACEN - Patio & Inventarios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-700 dark:text-industrial-300 mb-1">
                    Estado Laboral
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-industrial-50 dark:bg-industrial-800 border border-industrial-300 dark:border-industrial-700 font-bold"
                  >
                    <option value="ACTIVO">Activo (Habilitado)</option>
                    <option value="INACTIVO">Inactivo (Suspendido)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-industrial-100 dark:border-industrial-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-industrial-500 hover:text-industrial-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-timber-700 hover:bg-timber-800 text-white rounded-xl shadow-md transition-all"
                >
                  {saving ? "Guardando..." : "Actualizar Colaborador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

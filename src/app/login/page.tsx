"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  TreePine,
  CheckCircle2,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    urlError === "unauthorized"
      ? "Acceso no autorizado. Inicia sesión con una cuenta con los permisos necesarios."
      : urlError
      ? "Ocurrió un error al autenticar. Por favor verifica tus credenciales."
      : ""
  );

  const demoAccounts = [
    {
      role: "DUENO",
      label: "Dueño / Dirección",
      email: "dueno@maderaslachoca.com",
      description: "Acceso total sin restricciones",
      color: "border-purple-300 dark:border-purple-700 bg-purple-50/70 dark:bg-purple-950/30 text-purple-900 dark:text-purple-300",
    },
    {
      role: "CXC_CXP",
      label: "CxC / CxP & Facturación",
      email: "cxc_cxp@maderaslachoca.com",
      description: "Finanzas, cobranza, pagos y CRM",
      color: "border-blue-300 dark:border-blue-700 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300",
    },
    {
      role: "ENCARGADO_PISO",
      label: "Encargado de Piso & Patio",
      email: "encargado@maderaslachoca.com",
      description: "Taller, OTs, stock y cubicaje",
      color: "border-amber-300 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300",
    },
    {
      role: "OPERATIVO",
      label: "Operativo de Patio / Taller",
      email: "operativo@maderaslachoca.com",
      description: "Tareas y movimientos físicos",
      color: "border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage(res.error || "Credenciales inválidas. Verifica tu correo y contraseña.");
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage("Error de conexión con el servidor de autenticación.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Choca2026!");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-industrial-950 via-industrial-900 to-timber-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-industrial-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo & Marca */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-timber-600 via-amber-600 to-forest-700 shadow-xl shadow-timber-950/50 mb-4 border border-timber-400/30">
          <TreePine className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight font-display text-white">
          Maderas <span className="text-amber-400">La Choca</span>
        </h2>
        <p className="mt-1 text-sm text-industrial-400 font-medium">
          Sistema Integral ERP / CRM • Villahermosa, Tabasco
        </p>

        {/* Certificación Fitosanitaria */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 mt-3 rounded-full bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Certificación NOM-144-SEMARNAT HT</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-industrial-900/90 backdrop-blur-xl border border-industrial-800 shadow-2xl rounded-3xl p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-5 flex items-start space-x-2.5 p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-industrial-300 mb-1"
              >
                Correo Electrónico
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-industrial-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@maderaslachoca.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-industrial-950/60 border border-industrial-700 rounded-xl text-white placeholder-industrial-500 text-sm focus:outline-none focus:ring-2 focus:ring-timber-500 focus:border-timber-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-industrial-300 mb-1"
              >
                Contraseña
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-industrial-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-industrial-950/60 border border-industrial-700 rounded-xl text-white placeholder-industrial-500 text-sm focus:outline-none focus:ring-2 focus:ring-timber-500 focus:border-timber-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-timber-600 via-amber-600 to-forest-700 hover:from-timber-700 hover:to-forest-800 shadow-lg shadow-timber-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-timber-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Iniciando sesión...</span>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Accesos Rápidos de Prueba (Demo Roles) */}
          <div className="mt-8 pt-6 border-t border-industrial-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-industrial-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cuentas Rápidas por Rol</span>
              </span>
              <span className="text-[10px] text-amber-300 font-mono bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-md">
                Pass: Choca2026!
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleSelectDemo(account.email)}
                  className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between hover:scale-[1.01] ${account.color}`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold">{account.label}</span>
                      <span className="text-[9px] font-mono px-1 rounded bg-black/20 font-semibold">
                        {account.role}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-80 block">{account.email}</span>
                  </div>
                  {email === account.email && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-industrial-500 mt-6">
          Planta de Operaciones Carretera Villahermosa - Cárdenas Km 8.5 • Tabasco, México
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-industrial-950 text-white flex items-center justify-center">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}

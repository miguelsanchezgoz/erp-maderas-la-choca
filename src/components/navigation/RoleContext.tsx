"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { UserRole, UserType } from "@/types";

const FALLBACK_USER: UserType = {
  id: "dueno-principal",
  name: "Dirección General",
  email: "dueno@maderaslachoca.com",
  phone: "993 123 4567",
  role: "DUENO",
  isActive: true,
  status: "ACTIVO",
};

interface RoleContextType {
  currentUser: UserType;
  users: UserType[];
  setCurrentUser: (user: UserType) => void;
  setCurrentUserId: (id: string) => void;
  setCurrentRole: (role: UserRole) => void;
  refreshUsers: () => Promise<void>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  loadingUsers: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType>(FALLBACK_USER);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Sincronizar automáticamente con NextAuth cuando haya sesión activa
  useEffect(() => {
    if (session?.user) {
      setCurrentUser((prev) => ({
        ...prev,
        id: session.user.id || prev.id,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        role: (session.user.role as UserRole) || "OPERATIVO",
        isActive: true,
        status: "ACTIVO",
      }));
    }
  }, [session]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data: UserType[] = await res.json();
        setUsers(data);

        // Si no hay sesión de NextAuth todavía, restaurar por ID previo
        if (!session?.user) {
          const savedUserId = localStorage.getItem("mlc_active_user_id");
          const foundSaved = data.find((u) => u.id === savedUserId && (u.isActive ?? true));

          if (foundSaved) {
            setCurrentUser(foundSaved);
          } else if (data.length > 0) {
            const firstActive = data.find((u) => u.isActive ?? true) || data[0];
            setCurrentUser(firstActive);
          }
        }
      }
    } catch (err) {
      console.error("Error al cargar usuarios desde la base de datos:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [session]);

  useEffect(() => {
    fetchUsers();

    // Restaurar modo oscuro
    const savedTheme = localStorage.getItem("mlc_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, [fetchUsers]);

  const setCurrentUserId = (id: string) => {
    const found = users.find((u) => u.id === id);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem("mlc_active_user_id", found.id);
      localStorage.setItem("mlc_role", found.role);
    }
  };

  const setCurrentRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role && u.status === "ACTIVO");
    if (found) {
      setCurrentUser(found);
      localStorage.setItem("mlc_active_user_id", found.id);
      localStorage.setItem("mlc_role", found.role);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("mlc_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("mlc_theme", "light");
      }
      return next;
    });
  };

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        setCurrentUserId,
        setCurrentRole,
        refreshUsers: fetchUsers,
        isDarkMode,
        toggleDarkMode,
        loadingUsers,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole debe usarse dentro de un RoleProvider");
  }
  return context;
}
